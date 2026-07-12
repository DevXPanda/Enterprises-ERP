// Wages module — report catalog resource.
import { defineResource } from '../resource.types';

export const wages = [
  defineResource(
    'wages/reports',
    'Wage Reports',
    'reportId name period department generatedAt:ts format status',
    [
      ['WGR-901', 'Monthly Wage Register', 'Jun 2026', 'All', '2026-07-01 09:45', 'XLSX', 'Ready'],
      ['WGR-902', 'OT Analysis', 'Jun 2026', 'Production', '2026-07-01 10:05', 'PDF', 'Ready'],
      ['WGR-903', 'Cost per Bag by Line', 'Jun 2026', 'Production', '2026-07-01 10:20', 'PDF', 'Ready'],
      ['WGR-904', 'PF & ESIC Summary', 'Jun 2026', 'All', '2026-07-02 09:00', 'XLSX', 'Ready'],
      ['WGR-905', 'Weekly Wage Accrual', 'W28 (06–12 Jul)', 'All', '2026-07-11 12:30', 'PDF', 'Generating'],
    ],
    { code: { field: 'reportId', prefix: 'WGR' } },
  ),
];
