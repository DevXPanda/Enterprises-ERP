// Factory — Smart Factory Access resources.
import { defineResource } from '../resource.types';

export const factoryAccess = [
  defineResource(
    'factory/smart-access/employee-entry',
    'Employee Entry',
    'empId name department shift gate entryTime:ts status',
    [
      ['EMP-1024', 'Ramesh Kumar', 'Production', 'Morning', 'Gate 1', '2026-07-11 06:02', 'Inside'],
      ['EMP-1087', 'Anita Sharma', 'Quality', 'Morning', 'Gate 1', '2026-07-11 06:11', 'Inside'],
      ['EMP-1132', 'Vikram Joshi', 'Store', 'General', 'Gate 2', '2026-07-11 08:58', 'Inside'],
      ['EMP-1056', 'Suresh Patil', 'Maintenance', 'Morning', 'Gate 1', '2026-07-11 05:55', 'Exited'],
      ['EMP-1210', 'Kavita Nair', 'Administration', 'General', 'Gate 2', '2026-07-11 09:04', 'Inside'],
    ],
  ),
  defineResource(
    'factory/smart-access/visitor-entry',
    'Visitor Entry',
    'visitId name company host purpose entryTime:ts status',
    [
      ['VIS-2201', 'Ajay Sharma', 'TATA Projects', 'Rohit Gupta', 'Vendor Meeting', '2026-07-11 10:15', 'Inside'],
      ['VIS-2202', 'Suresh Patel', 'Infra Consultants', 'Kavita Nair', 'Site Survey', '2026-07-11 10:40', 'Inside'],
      ['VIS-2203', 'Meena Iyer', 'Rocky Minerals Ltd', 'Vikram Joshi', 'Material Discussion', '2026-07-11 11:05', 'Exited'],
      ['VIS-2204', 'Rahul Deshmukh', 'PackWell Industries', 'Anita Sharma', 'Quality Audit', '2026-07-11 11:32', 'Inside'],
      ['VIS-2205', 'Farhan Khan', 'Eastern Coal Corp', 'Ramesh Kumar', 'Delivery Coordination', '2026-07-11 12:10', 'Awaiting Host'],
    ],
    { code: { field: 'visitId', prefix: 'VIS' } },
  ),
  defineResource(
    'factory/smart-access/contractor-entry',
    'Contractor Entry',
    'contractorId name company workOrder area entryTime:ts status',
    [
      ['CON-501', 'Baljeet Singh', 'Shivam Electricals', 'WO-2291', 'Packing Plant', '2026-07-11 07:20', 'Inside'],
      ['CON-502', 'Manoj Yadav', 'Sai Scaffolding', 'WO-2288', 'Kiln Area', '2026-07-11 07:45', 'Inside'],
      ['CON-503', 'Irfan Shaikh', 'Precision Welding Co', 'WO-2293', 'Raw Mill', '2026-07-11 08:05', 'Exited'],
      ['CON-504', 'Gopal Reddy', 'GreenClean Services', 'WO-2280', 'Admin Block', '2026-07-11 08:30', 'Inside'],
      ['CON-505', 'Santosh Pawar', 'Shivam Electricals', 'WO-2291', 'Crusher Section', '2026-07-11 09:12', 'Inside'],
    ],
    { code: { field: 'contractorId', prefix: 'CON' } },
  ),
  defineResource(
    'factory/smart-access/vehicle-entry',
    'Vehicle Entry',
    'vehicleNo type driver purpose gate entryTime:ts status',
    [
      ['MH12-AB-3456', 'Truck', 'Prakash More', 'Limestone Delivery', 'Gate 3', '2026-07-11 06:40', 'Inside'],
      ['MH14-CD-7890', 'Truck', 'Sanjay Gaikwad', 'Cement Dispatch', 'Gate 3', '2026-07-11 07:15', 'Exited'],
      ['MH31-EF-2244', 'Tanker', 'Ravi Chavan', 'Diesel Supply', 'Gate 3', '2026-07-11 08:20', 'Inside'],
      ['MH04-GH-9911', 'Car', 'Self — Visitor', 'Vendor Meeting', 'Gate 1', '2026-07-11 10:12', 'Inside'],
      ['MH12-JK-5566', 'Truck', 'Nitin Kadam', 'Gypsum Delivery', 'Gate 3', '2026-07-11 11:25', 'Weighbridge'],
    ],
  ),
  defineResource(
    'factory/smart-access/material-in',
    'Material In (Gate)',
    'challanNo vendor material quantity:num vehicleNo entryTime:ts status',
    [
      ['CH-88121', 'Rocky Minerals Ltd', 'Limestone (Grade A)', 12, 'MH12-AB-3456', '2026-07-11 06:45', 'Verified'],
      ['CH-88134', 'Gypsum India Pvt Ltd', 'Gypsum', 8, 'MH12-JK-5566', '2026-07-11 11:28', 'Pending QC'],
      ['CH-88098', 'Eastern Coal Corp', 'Coal (Thermal)', 22, 'MH43-PQ-1122', '2026-07-10 15:10', 'Verified'],
      ['CH-88102', 'PackWell Industries', 'Packing Bags 50kg', 25000, 'MH09-RS-3344', '2026-07-10 16:42', 'Verified'],
      ['CH-88140', 'Rocky Minerals Ltd', 'Iron Ore', 10, 'MH12-TU-7788', '2026-07-11 12:05', 'At Gate'],
    ],
  ),
  defineResource(
    'factory/smart-access/material-out',
    'Material Out (Gate)',
    'gatePassNo material quantity:num destination vehicleNo exitTime:ts status',
    [
      ['GP-4508', 'OPC 53 Grade (bags)', 2400, 'Sharma Enterprises, Mumbai', 'MH14-CD-7890', '2026-07-11 07:18', 'Exited'],
      ['GP-4509', 'PPC Cement (bags)', 1800, 'Patel Traders, Pune', 'MH20-VX-4455', '2026-07-11 09:02', 'Exited'],
      ['GP-4510', 'Empty Cylinders', 40, 'IndoGas Depot, Nagpur', 'MH31-YZ-8899', '2026-07-11 10:44', 'Exited'],
      ['GP-4511', 'Scrap Metal', 3.5, 'Balaji Scrap Yard', 'MH12-QW-2211', '2026-07-11 11:50', 'At Gate'],
      ['GP-4513', 'White Cement (bags)', 600, 'Gupta Suppliers, Nashik', 'MH15-ER-6677', '2026-07-11 12:35', 'Loading'],
    ],
    { code: { field: 'gatePassNo', prefix: 'GP' } },
  ),
  defineResource(
    'factory/smart-access/gate-pass',
    'Gate Pass',
    'passNo type issuedTo purpose validFrom:date validTo:date status',
    [
      ['GP-4512', 'Visitor', 'Ajay Sharma (TATA Projects)', 'Vendor Meeting', '2026-07-11', '2026-07-11', 'Active'],
      ['GP-4514', 'Contractor', 'Shivam Electricals — 4 workers', 'Electrical Maintenance WO-2291', '2026-07-11', '2026-07-15', 'Active'],
      ['GP-4506', 'Material', 'Store — Returnable Tools', 'Machine repair at vendor', '2026-07-10', '2026-07-20', 'Active'],
      ['GP-4501', 'Vehicle', 'MH31-EF-2244 (Tanker)', 'Weekly diesel supply', '2026-07-08', '2026-08-08', 'Active'],
      ['GP-4489', 'Visitor', 'Meena Iyer (Rocky Minerals)', 'Material Discussion', '2026-07-09', '2026-07-09', 'Expired'],
    ],
    { code: { field: 'passNo', prefix: 'GP' } },
  ),
  defineResource(
    'factory/smart-access/qr-verification',
    'QR Verification',
    'qrCode type issuedTo gate scannedAt:ts officer result',
    [
      ['QR-EMP-1024', 'Employee', 'Ramesh Kumar', 'Gate 1', '2026-07-11 06:02', 'S. Jadhav', 'Valid'],
      ['QR-VIS-2201', 'Visitor', 'Ajay Sharma', 'Gate 1', '2026-07-11 10:15', 'S. Jadhav', 'Valid'],
      ['QR-GP-4508', 'Gate Pass', 'Dispatch — DO-7721', 'Gate 3', '2026-07-11 07:16', 'M. Patil', 'Valid'],
      ['QR-VIS-2188', 'Visitor', 'Unknown / reused pass', 'Gate 2', '2026-07-11 09:48', 'R. Shinde', 'Rejected — Expired'],
      ['QR-CON-502', 'Contractor', 'Manoj Yadav', 'Gate 1', '2026-07-11 07:45', 'S. Jadhav', 'Valid'],
    ],
  ),
];
