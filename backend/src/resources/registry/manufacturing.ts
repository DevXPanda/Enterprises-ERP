// Manufacturing module resources.
import { defineResource } from '../resource.types';

export const manufacturing = [
  defineResource(
    'manufacturing/production-orders',
    'Mfg Production Orders',
    'poNo product quantity:int line startDate:date dueDate:date status',
    [
      ['MPO-2891', 'OPC 53 Grade', 5000, 'Line A', '2026-07-11', '2026-07-12', 'In Progress'],
      ['MPO-2892', 'PPC Cement', 4000, 'Line B', '2026-07-11', '2026-07-13', 'In Progress'],
      ['MPO-2893', 'White Cement', 3200, 'Line C', '2026-07-12', '2026-07-14', 'Released'],
      ['MPO-2894', 'OPC 43 Grade', 1800, 'Line D', '2026-07-12', '2026-07-15', 'Planned'],
      ['MPO-2885', 'OPC 53 Grade', 5000, 'Line A', '2026-07-10', '2026-07-11', 'Completed'],
    ],
    { code: { field: 'poNo', prefix: 'MPO' } },
  ),
  defineResource(
    'manufacturing/bom',
    'Bill of Materials',
    'bomNo product component quantityPer:num unit revision status',
    [
      ['BOM-101', 'OPC 53 Grade (per MT)', 'Clinker', 0.95, 'MT', 'R4', 'Active'],
      ['BOM-102', 'OPC 53 Grade (per MT)', 'Gypsum', 0.05, 'MT', 'R4', 'Active'],
      ['BOM-103', 'PPC Cement (per MT)', 'Clinker', 0.68, 'MT', 'R2', 'Active'],
      ['BOM-104', 'PPC Cement (per MT)', 'Fly Ash', 0.28, 'MT', 'R2', 'Active'],
      ['BOM-105', 'White Cement (per MT)', 'White Clinker', 0.92, 'MT', 'R1', 'Under Review'],
    ],
    { code: { field: 'bomNo', prefix: 'BOM' } },
  ),
  defineResource(
    'manufacturing/job-cards',
    'Job Cards',
    'jobNo poNo operation machine operator plannedHours:num status',
    [
      ['JC-5501', 'MPO-2891', 'Grinding', 'Cement Mill #1', 'Ramesh Kumar', 8, 'Running'],
      ['JC-5502', 'MPO-2891', 'Packing', 'Packer #1', 'Dinesh Rao', 6, 'Running'],
      ['JC-5503', 'MPO-2892', 'Blending', 'Raw Mill', 'Nilesh Kulkarni', 7, 'Running'],
      ['JC-5498', 'MPO-2885', 'Packing', 'Packer #1', 'Dinesh Rao', 6, 'Completed'],
      ['JC-5504', 'MPO-2893', 'Grinding', 'Cement Mill #2', 'Mahesh Singh', 8, 'Scheduled'],
    ],
    { code: { field: 'jobNo', prefix: 'JC' } },
  ),
  defineResource(
    'manufacturing/machines',
    'Mfg Machines',
    'machineId name type line uptime:num lastMaintenance:date status',
    [
      ['MC-01', 'Crusher #1', 'Crusher', 'Line A', 98.2, '2026-06-20', 'Running'],
      ['MC-02', 'Crusher #2', 'Crusher', 'Line A', 95.7, '2026-06-28', 'Running'],
      ['MC-04', 'Kiln #1', 'Kiln', 'Line A', 99.1, '2026-05-15', 'Running'],
      ['MC-05', 'Kiln #2', 'Kiln', 'Line B', 0, '2026-07-11', 'Maintenance'],
      ['MC-08', 'Packer #1', 'Packer', 'Line A', 97.8, '2026-07-01', 'Running'],
    ],
  ),
  defineResource(
    'manufacturing/lines',
    'Production Lines',
    'name product produced:int target:int efficiency:num operator status',
    [
      ['Line A', 'OPC 53 Grade', 4820, 5000, 96.4, 'Ramesh K.', 'running'],
      ['Line B', 'PPC Cement', 3650, 4000, 91.3, 'Suresh P.', 'running'],
      ['Line C', 'White Cement', 2890, 3200, 90.3, 'Mahesh S.', 'running'],
      ['Line D', 'OPC 43 Grade', 1487, 1800, 82.6, 'Dinesh R.', 'idle'],
    ],
  ),
  defineResource(
    'manufacturing/reports',
    'Mfg Reports',
    'reportId name type period generatedAt:ts format status',
    [
      ['MFR-801', 'Daily Production Summary', 'Daily', '10 Jul 2026', '2026-07-11 06:30', 'PDF', 'Ready'],
      ['MFR-802', 'OEE Trend', 'Weekly', 'W27', '2026-07-06 08:30', 'XLSX', 'Ready'],
      ['MFR-803', 'Machine Downtime Analysis', 'Monthly', 'Jun 2026', '2026-07-01 10:00', 'PDF', 'Ready'],
      ['MFR-804', 'Line Efficiency Comparison', 'Monthly', 'Jun 2026', '2026-07-01 10:15', 'XLSX', 'Ready'],
      ['MFR-805', 'Energy per MT', 'Monthly', 'Jun 2026', '2026-07-01 11:00', 'PDF', 'Generating'],
    ],
    { code: { field: 'reportId', prefix: 'MFR' } },
  ),
];
