// Chart series and feed items for the executive and factory dashboards.
export const executiveDashboard = {
  kpis: [
    { id: 'production', label: "Today's Production", value: '0', changeLabel: 'vs yesterday', icon: 'Factory', color: 'blue' },
    { id: 'dispatch', label: "Today's Dispatch", value: '0', changeLabel: 'vs yesterday', icon: 'Truck', color: 'green' },
    { id: 'orders', label: 'Current Orders', value: '0', changeLabel: 'vs last week', icon: 'ClipboardList', color: 'orange' },
    { id: 'machines', label: 'Machine Status', value: '0', changeLabel: 'running', icon: 'Cog', color: 'purple' },
    { id: 'qc', label: 'QC Alerts', value: '0', changeLabel: 'vs yesterday', icon: 'ShieldAlert', color: 'red' },
    { id: 'oee', label: 'OEE', value: '0', changeLabel: 'vs target 85%', icon: 'Gauge', color: 'blue' },
  ],
  productionTrend: [],
  revenueTrend: [],
  profitTrend: [],
  monthlyPerformance: [],
  factoryComparison: [],
  dealerOrders: [],
  purchasePending: [],
  cashCollection: [],
  recentAlerts: [],
  qcAlerts: [],
  lowStockItems: [],
  notifications: [],
};

export const factoryDashboardStatic = {
  attendanceTrend: [],
  recentActivity: [],
  announcements: [],
};
