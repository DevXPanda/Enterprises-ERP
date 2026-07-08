export interface KpiData {
  id: string;
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: "blue" | "green" | "orange" | "purple" | "red";
}

export interface ProductionLine {
  id: string;
  name: string;
  product: string;
  produced: number;
  target: number;
  efficiency: number;
  status: "running" | "idle" | "maintenance";
  operator: string;
}

export interface MachineStatus {
  id: string;
  name: string;
  status: "running" | "idle" | "maintenance" | "offline";
  uptime: number;
  line: string;
}

export interface QcAlert {
  id: string;
  line: string;
  issue: string;
  severity: "critical" | "warning" | "info";
  time: string;
}

export interface DealerOrder {
  id: string;
  dealer: string;
  product: string;
  qty: number;
  status: "pending" | "processing" | "dispatched" | "delivered";
  date: string;
}

export interface FactoryComparison {
  factory: string;
  production: number;
  target: number;
  efficiency: number;
  oee: number;
}

export interface AlertItem {
  id: string;
  title: string;
  description: string;
  type: "critical" | "warning" | "info" | "success";
  time: string;
  read: boolean;
}

export interface LowStockItem {
  id: string;
  material: string;
  current: number;
  minimum: number;
  unit: string;
  daysLeft: number;
}

export interface TrendDataPoint {
  name: string;
  value: number;
  value2?: number;
}

export interface MonthlyPerformance {
  month: string;
  production: number;
  target: number;
  revenue: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: "order" | "machine" | "alert" | "system";
  time: string;
  read: boolean;
}

export interface PurchasePending {
  id: string;
  item: string;
  vendor: string;
  amount: number;
  status: "approval" | "ordered" | "in-transit";
  expectedDate: string;
}

export interface CashCollection {
  id: string;
  dealer: string;
  amount: number;
  dueDate: string;
  status: "overdue" | "due-today" | "upcoming";
}

export interface SidebarMenuItem {
  label: string;
  icon: string;
  href?: string;
  children?: {
    label: string;
    href: string;
  }[];
}
