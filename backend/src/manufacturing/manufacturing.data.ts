// Chart series and feed items for the manufacturing analytics endpoints.

export const oeeTrend = [];

export const qcAlerts = [];

export const shiftSummary = [];

export const monthlyProdReport = [];

export const oeeByLine = [];

export const downtimeData = [];

export const reportsKpisStatic = [
  { id: 'reports-gen', label: 'Reports Generated', value: '—', icon: 'FileBarChart', color: 'blue' },
  { id: 'avg-oee-r', label: 'Avg OEE (Month)', value: '—', icon: 'Gauge', color: 'green' },
  { id: 'total-prod-r', label: 'Total Production', value: '—', icon: 'Factory', color: 'purple' },
  { id: 'downtime-r', label: 'Downtime Hours', value: '—', icon: 'Clock', color: 'orange' },
  { id: 'quality-r', label: 'Quality Score', value: '—', icon: 'ShieldCheck', color: 'green' },
  { id: 'fuel-cost-r', label: 'Fuel Cost', value: '—', icon: 'Flame', color: 'red' },
];
