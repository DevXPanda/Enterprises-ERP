// Manufacturing analytics — page KPIs computed from the database plus chart series.
import { Injectable } from '@nestjs/common';
import { DataSource, ObjectLiteral } from 'typeorm';
import {
  oeeTrend,
  qcAlerts,
  shiftSummary,
  monthlyProdReport,
  oeeByLine,
  downtimeData,
  reportsKpisStatic,
} from './manufacturing.data';

@Injectable()
export class ManufacturingService {
  constructor(private readonly dataSource: DataSource) {}

  private rows(path: string): Promise<ObjectLiteral[]> {
    return this.dataSource.getRepository(path).find();
  }

  async dashboard() {
    const [lines, machines, orders] = await Promise.all([
      this.rows('manufacturing/lines'),
      this.rows('manufacturing/machines'),
      this.rows('manufacturing/production-orders'),
    ]);

    const produced = lines.reduce((sum, l) => sum + Number(l.produced ?? 0), 0);
    const activeLines = lines.filter((l) => l.status === 'running').length;
    const running = machines.filter((m) => m.status === 'running');
    const avgUptime = running.length
      ? running.reduce((sum, m) => sum + Number(m.uptime ?? 0), 0) / running.length
      : 0;
    const pendingOrders = orders.filter((o) => o.status === 'pending').length;

    const kpis = [
      { id: 'total-prod', label: 'Total Production', value: produced.toLocaleString('en-IN'), changeLabel: '', icon: 'Factory', color: 'blue' },
      { id: 'active-lines', label: 'Active Lines', value: `${activeLines}/${lines.length}`, changeLabel: 'running', icon: 'Activity', color: 'green' },
      { id: 'machine-uptime', label: 'Machine Uptime', value: `${avgUptime.toFixed(1)}%`, changeLabel: '', icon: 'Cog', color: 'purple' },
      { id: 'oee', label: 'OEE', value: '—', changeLabel: 'no data yet', icon: 'Gauge', color: 'blue' },
      { id: 'qc-pass', label: 'QC Pass Rate', value: '—', changeLabel: 'no data yet', icon: 'ShieldCheck', color: 'green' },
      { id: 'pending-orders', label: 'Pending Orders', value: String(pendingOrders), changeLabel: '', icon: 'ClipboardList', color: 'orange' },
    ];

    return {
      kpis,
      productionByLine: lines.map((l) => ({
        line: l.name,
        produced: Number(l.produced),
        target: Number(l.target),
      })),
      oeeTrend,
      machines: machines.map((m) => ({
        id: String(m.id),
        name: m.name,
        line: m.line,
        status: m.status,
        uptime: Number(m.uptime),
        temperature: m.temperature,
        lastMaintenance: m.lastMaintenance,
        nextMaintenance: m.nextMaintenance,
        operator: m.operator,
        hoursToday: Number(m.hoursToday),
      })),
      productionLines: lines.map((l) => ({
        id: String(l.id),
        name: l.name,
        product: l.product,
        produced: Number(l.produced),
        target: Number(l.target),
        efficiency: Number(l.efficiency),
        status: l.status,
        operator: l.operator,
      })),
      qcAlerts,
      shiftSummary,
    };
  }

  async productionOrdersAnalytics() {
    const orders = await this.rows('manufacturing/production-orders');
    const byStatus = (s: string) => orders.filter((o) => o.status === s).length;
    return {
      kpis: [
        { id: 'total-orders', label: 'Total Orders', value: String(orders.length), icon: 'ClipboardList', color: 'blue' },
        { id: 'in-progress', label: 'In Progress', value: String(byStatus('in-progress')), change: 12, icon: 'Activity', color: 'purple' },
        { id: 'completed-today', label: 'Completed Today', value: String(byStatus('completed')), change: 8, icon: 'CheckCircle2', color: 'green' },
        { id: 'pending-po', label: 'Pending', value: String(byStatus('pending')), change: -5, icon: 'Clock', color: 'orange' },
        { id: 'avg-time', label: 'Avg Completion', value: '—', icon: 'Timer', color: 'blue' },
        { id: 'ontime', label: 'On-Time Rate', value: '—', icon: 'Target', color: 'green' },
      ],
    };
  }

  async bomAnalytics() {
    const boms = await this.rows('manufacturing/bom');
    const active = boms.filter((b) => b.status === 'active');
    const avgCost = boms.length
      ? boms.reduce((sum, b) => sum + Number(b.costPerUnit ?? 0), 0) / boms.length
      : 0;
    return {
      kpis: [
        { id: 'active-bom', label: 'Active BOMs', value: String(active.length), icon: 'ScrollText', color: 'blue' },
        { id: 'raw-mat', label: 'Raw Materials', value: String(boms.reduce((s, b) => s + Number(b.materials ?? 0), 0)), icon: 'Layers', color: 'purple' },
        { id: 'avg-cost', label: 'Avg Cost/Bag', value: `₹${Math.round(avgCost)}`, change: -2.3, icon: 'IndianRupee', color: 'green' },
        { id: 'latest-rev', label: 'Latest Revision', value: String(active[0]?.version ?? '—'), icon: 'GitBranch', color: 'orange' },
        { id: 'total-recipes', label: 'Total Recipes', value: String(boms.length), icon: 'BookOpen', color: 'blue' },
        { id: 'pending-rev', label: 'Pending Reviews', value: String(boms.filter((b) => b.status === 'draft').length), icon: 'AlertCircle', color: 'red' },
      ],
    };
  }

  async jobCardsAnalytics() {
    const cards = await this.rows('manufacturing/job-cards');
    const byStatus = (s: string) => cards.filter((c) => c.status === s).length;
    const output = cards.reduce((sum, c) => sum + Number(c.output ?? 0), 0);
    return {
      kpis: [
        { id: 'active-cards', label: 'Active Cards', value: String(byStatus('in-progress')), icon: 'CreditCard', color: 'blue' },
        { id: 'completed-jc', label: 'Completed Today', value: String(byStatus('completed')), change: 15, icon: 'CheckCircle2', color: 'green' },
        { id: 'operators-shift', label: 'Operators On-Shift', value: '—', icon: 'Users', color: 'purple' },
        { id: 'avg-duration', label: 'Avg Task Duration', value: '2.4 hrs', change: -6, icon: 'Timer', color: 'orange' },
        { id: 'overdue-cards', label: 'Overdue Cards', value: String(byStatus('overdue')), icon: 'AlertCircle', color: 'red' },
        { id: 'output-today', label: 'Output Today', value: output.toLocaleString('en-IN'), change: 8.2, icon: 'Factory', color: 'blue' },
      ],
    };
  }

  async machinesAnalytics() {
    const machines = await this.rows('manufacturing/machines');
    const byStatus = (s: string) => machines.filter((m) => m.status === s);
    const up = machines.filter((m) => Number(m.uptime) > 0);
    const avgUptime = up.length
      ? up.reduce((sum, m) => sum + Number(m.uptime), 0) / up.length
      : 0;
    const nextMaint = machines
      .map((m) => m.nextMaintenance)
      .filter(Boolean)
      .sort()[0];
    return {
      kpis: [
        { id: 'total-m', label: 'Total Machines', value: String(machines.length), icon: 'Cog', color: 'blue' },
        { id: 'running-m', label: 'Running', value: String(byStatus('running').length), icon: 'Activity', color: 'green' },
        { id: 'maint-m', label: 'Maintenance', value: String(byStatus('maintenance').length), icon: 'Wrench', color: 'orange' },
        { id: 'idle-m', label: 'Idle', value: String(byStatus('idle').length), icon: 'PauseCircle', color: 'purple' },
        { id: 'avg-uptime-m', label: 'Avg Uptime', value: `${avgUptime.toFixed(1)}%`, change: 1.4, icon: 'Gauge', color: 'blue' },
        { id: 'next-maint', label: 'Next Maintenance', value: nextMaint ? new Date(nextMaint).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—', icon: 'Calendar', color: 'red' },
      ],
    };
  }

  async reportsAnalytics() {
    return {
      kpis: reportsKpisStatic,
      monthlyProdReport,
      oeeByLine,
      downtimeData,
    };
  }
}
