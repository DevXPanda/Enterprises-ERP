// Dashboard aggregates — health check and live factory KPIs.
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { executiveDashboard, factoryDashboardStatic } from './dashboard.data';
import { registry, registryByPath } from '../resources/registry';

@Injectable()
export class DashboardService {
  constructor(private readonly dataSource: DataSource) {}

  async health() {
    let database = 'down';
    try {
      await this.dataSource.query('SELECT 1');
      database = 'up';
    } catch {

    }
    return {
      status: database === 'up' ? 'ok' : 'degraded',
      service: 'nktech-erp-api',
      stack: 'NestJS + TypeORM + PostgreSQL (Neon)',
      database,
      resources: registry.length,
      time: new Date().toISOString(),
    };
  }

  async executive() {
    return executiveDashboard;
  }

  private count(path: string): Promise<number> {
    return this.dataSource.getRepository(path).count();
  }

  async factory() {
    const [
      employees,
      visitorsToday,
      gateEntries,
      materialIn,
      materialOut,
      activeOrders,
      qcPending,
      dispatchReady,
      machines,
    ] = await Promise.all([
      this.count('factory/employee-management/employees'),
      this.count('factory/smart-access/visitor-entry'),
      this.count('factory/smart-access/employee-entry'),
      this.count('factory/material-gate/material-in'),
      this.count('factory/material-gate/material-out'),
      this.dataSource
        .getRepository('factory/production/production-orders')
        .count({ where: [{ status: 'In Progress' }, { status: 'Released' }] }),
      this.dataSource
        .getRepository('factory/quality-control/production-qc')
        .count({ where: { result: 'In Testing' } }),
      this.dataSource
        .getRepository('factory/dispatch/dispatch-orders')
        .count({ where: { status: 'Loading' } }),
      this.dataSource.getRepository('factory/production/machines').find(),
    ]);

    const running = machines.filter((m) => m.status === 'Running').length;

    const kpis = [
      { id: 'employees', label: 'Total Employees', value: String(employees), changeLabel: '', icon: 'Users2', color: 'blue' },
      { id: 'visitors', label: 'Visitors Today', value: String(visitorsToday), changeLabel: '', icon: 'UserCheck', color: 'green' },
      { id: 'gate-entries', label: 'Gate Entries', value: String(gateEntries), changeLabel: '', icon: 'ScanLine', color: 'purple' },
      { id: 'material-in', label: 'Material In', value: String(materialIn), changeLabel: 'trucks today', icon: 'PackagePlus', color: 'blue' },
      { id: 'material-out', label: 'Material Out', value: String(materialOut), changeLabel: 'trucks today', icon: 'PackageMinus', color: 'orange' },
      { id: 'prod-orders', label: 'Active Orders', value: String(activeOrders), changeLabel: '', icon: 'ClipboardList', color: 'purple' },
      { id: 'machines', label: 'Machines Running', value: `${running}/${machines.length}`, changeLabel: `${machines.length ? Math.round((running / machines.length) * 100) : 0}% operational`, icon: 'Cog', color: 'green' },
      { id: 'qc-pending', label: 'QC Pending', value: String(qcPending), changeLabel: '', icon: 'FlaskConical', color: 'orange' },
      { id: 'dispatch-ready', label: 'Dispatch Ready', value: String(dispatchReady), changeLabel: 'awaiting exit', icon: 'Truck', color: 'green' },
    ];

    const gateEntriesByType = [
      { type: 'Employees', count: gateEntries },
      { type: 'Visitors', count: visitorsToday },
      { type: 'Contractors', count: await this.count('factory/smart-access/contractor-entry') },
      { type: 'Vehicles', count: await this.count('factory/smart-access/vehicle-entry') },
      { type: 'Material', count: materialIn + materialOut },
    ];

    return {
      kpis,
      gateEntriesByType,
      machineStatus: machines.map((m) => ({
        id: String(m.id),
        name: m.name,
        line: m.line,
        status: String(m.status ?? '').toLowerCase(),
        uptime: m.uptime,
      })),
      ...factoryDashboardStatic,
    };
  }

  private static readonly SEARCH_TARGETS: {
    path: string;
    module: string;
    title: string;
    subtitle: string[];
  }[] = [
    { path: 'factory/employee-management/employees', module: 'Factory · Employees', title: 'name', subtitle: ['empId', 'department'] },
    { path: 'factory/production/production-orders', module: 'Factory · Production Orders', title: 'poNo', subtitle: ['product', 'status'] },
    { path: 'factory/production/machines', module: 'Factory · Machines', title: 'name', subtitle: ['machineId', 'status'] },
    { path: 'factory/store/current-stock', module: 'Factory · Stock', title: 'name', subtitle: ['materialCode', 'status'] },
    { path: 'factory/dispatch/dispatch-orders', module: 'Factory · Dispatch', title: 'doNo', subtitle: ['customer', 'status'] },
    { path: 'factory/visitor-management/visitors', module: 'Factory · Visitors', title: 'name', subtitle: ['visitorId', 'company'] },
    { path: 'factory/smart-access/gate-pass', module: 'Factory · Gate Pass', title: 'passNo', subtitle: ['issuedTo', 'status'] },
    { path: 'factory/dispatch/invoice-reference', module: 'Factory · Invoices', title: 'invoiceNo', subtitle: ['customer', 'status'] },
    { path: 'manufacturing/production-orders', module: 'Manufacturing · Orders', title: 'poNo', subtitle: ['product', 'status'] },
    { path: 'manufacturing/machines', module: 'Manufacturing · Machines', title: 'name', subtitle: ['machineId', 'status'] },
    { path: 'manufacturing/bom', module: 'Manufacturing · BOM', title: 'bomNo', subtitle: ['product', 'status'] },
    { path: 'manufacturing/job-cards', module: 'Manufacturing · Job Cards', title: 'jobNo', subtitle: ['task', 'operator'] },
  ];

  async search(q: string) {
    const query = q.trim();
    if (query.length < 2) return { query, results: [] };
    const like = `%${query}%`;

    const registrySearches = DashboardService.SEARCH_TARGETS.map(async (t) => {
      const def = registryByPath.get(t.path);
      if (!def) return [];
      const clauses = def.search.map((key, i) => `r."${key}" ILIKE :s${i}`);
      const params = Object.fromEntries(def.search.map((_, i) => [`s${i}`, like]));
      const rows = await this.dataSource
        .getRepository(t.path)
        .createQueryBuilder('r')
        .where(clauses.join(' OR '), params)
        .take(3)
        .getMany();
      return rows.map((r) => ({
        module: t.module,
        title: String(r[t.title] ?? '—'),
        subtitle: t.subtitle.map((k) => r[k]).filter(Boolean).join(' · '),
        href: `/${t.path}`,
      }));
    });

    const workerSearch = this.dataSource
      .query(
        `SELECT employee_code, full_name FROM wages.employees
         WHERE deleted_at IS NULL AND (full_name ILIKE $1 OR employee_code ILIKE $1) LIMIT 3`,
        [like],
      )
      .then((rows: { employee_code: string; full_name: string }[]) =>
        rows.map((r) => ({
          module: 'Wages · Workers',
          title: r.full_name,
          subtitle: r.employee_code,
          href: '/wages/workers',
        })),
      );

    const settled = await Promise.allSettled([...registrySearches, workerSearch]);
    const results = settled
      .flatMap((s) => (s.status === 'fulfilled' ? s.value : []))
      .slice(0, 15);
    return { query, results };
  }

  async notifications() {
    const items: {
      id: string;
      title: string;
      message: string;
      type: 'critical' | 'warning' | 'info' | 'success';
      href: string;
      time: string;
    }[] = [];

    const push = (
      id: string,
      title: string,
      message: string,
      type: 'critical' | 'warning' | 'info' | 'success',
      href: string,
      time?: Date | string,
    ) => items.push({ id, title, message, type, href, time: new Date(time ?? Date.now()).toISOString() });

    const [lowStock, overdueCards, maintMachines, pendingOt, pendingVisits, recentEvents] =
      await Promise.allSettled([
        this.dataSource.query(
          `SELECT name, "currentQty", "minStock", unit, "updatedAt" FROM public.factory_store_current_stock
           WHERE "currentQty" IS NOT NULL AND "minStock" IS NOT NULL AND "currentQty" <= "minStock" LIMIT 5`,
        ),
        this.dataSource.query(
          `SELECT "jobNo", task, "updatedAt" FROM public.manufacturing_job_cards WHERE status = 'overdue' LIMIT 5`,
        ),
        this.dataSource.query(
          `SELECT name, "nextMaintenance", "updatedAt" FROM public.manufacturing_machines WHERE status = 'maintenance' LIMIT 5`,
        ),
        this.dataSource.query(
          `SELECT count(*)::int AS n FROM wages.overtime_requests WHERE status = 'pending'`,
        ),
        this.dataSource.query(
          `SELECT "requestId", "visitorName", "updatedAt" FROM public.factory_visitor_management_requests
           WHERE status ILIKE 'pending%' LIMIT 5`,
        ),
        this.dataSource.query(
          `SELECT event_type, occurred_at FROM wages.outbox_events ORDER BY occurred_at DESC LIMIT 3`,
        ),
      ]);

    if (lowStock.status === 'fulfilled') {
      for (const r of lowStock.value) {
        push(`stock-${r.name}`, 'Low Stock', `${r.name}: ${r.currentQty} ${r.unit ?? ''} left (min ${r.minStock})`, 'critical', '/factory/store/current-stock', r.updatedAt);
      }
    }
    if (overdueCards.status === 'fulfilled') {
      for (const r of overdueCards.value) {
        push(`jc-${r.jobNo}`, 'Job Card Overdue', `${r.jobNo} — ${r.task}`, 'warning', '/manufacturing/job-cards', r.updatedAt);
      }
    }
    if (maintMachines.status === 'fulfilled') {
      for (const r of maintMachines.value) {
        push(`mc-${r.name}`, 'Machine Under Maintenance', `${r.name}${r.nextMaintenance ? ` — due back ${new Date(r.nextMaintenance).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}` : ''}`, 'info', '/manufacturing/machines', r.updatedAt);
      }
    }
    if (pendingOt.status === 'fulfilled' && Number(pendingOt.value[0]?.n) > 0) {
      push('ot-pending', 'Overtime Approvals Pending', `${pendingOt.value[0].n} timesheet(s) awaiting approval`, 'warning', '/wages/attendance');
    }
    if (pendingVisits.status === 'fulfilled') {
      for (const r of pendingVisits.value) {
        push(`vr-${r.requestId}`, 'Visit Request Pending', `${r.visitorName} (${r.requestId})`, 'info', '/factory/visitor-management/requests', r.updatedAt);
      }
    }
    if (recentEvents.status === 'fulfilled') {
      for (const r of recentEvents.value) {
        push(`ev-${r.occurred_at}`, String(r.event_type).replace(/([A-Z])/g, ' $1').trim(), 'System event recorded', 'success', '/wages/payroll', r.occurred_at);
      }
    }

    items.sort((a, b) => b.time.localeCompare(a.time));
    return { total: items.length, notifications: items.slice(0, 12) };
  }
}
