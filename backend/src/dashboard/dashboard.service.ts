// Dashboard aggregates — health check and live factory KPIs.
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { executiveDashboard, factoryDashboardStatic } from './dashboard.data';
import { registry } from '../resources/registry';

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
      { id: 'employees', label: 'Total Employees', value: String(employees), change: 3, changeLabel: 'vs last month', icon: 'Users2', color: 'blue' },
      { id: 'visitors', label: 'Visitors Today', value: String(visitorsToday), change: 15, changeLabel: 'vs yesterday', icon: 'UserCheck', color: 'green' },
      { id: 'gate-entries', label: 'Gate Entries', value: String(gateEntries), change: 8, changeLabel: 'since 6 AM', icon: 'ScanLine', color: 'purple' },
      { id: 'material-in', label: 'Material In', value: String(materialIn), changeLabel: 'trucks today', icon: 'PackagePlus', color: 'blue' },
      { id: 'material-out', label: 'Material Out', value: String(materialOut), changeLabel: 'trucks today', icon: 'PackageMinus', color: 'orange' },
      { id: 'prod-orders', label: 'Active Orders', value: String(activeOrders), change: 5, changeLabel: 'vs yesterday', icon: 'ClipboardList', color: 'purple' },
      { id: 'machines', label: 'Machines Running', value: `${running}/${machines.length}`, changeLabel: `${machines.length ? Math.round((running / machines.length) * 100) : 0}% operational`, icon: 'Cog', color: 'green' },
      { id: 'qc-pending', label: 'QC Pending', value: String(qcPending), change: -3, changeLabel: 'vs yesterday', icon: 'FlaskConical', color: 'orange' },
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
}
