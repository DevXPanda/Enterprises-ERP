// Wages module data.
// In the real project this is served by Sachin's Laravel (PHP) + MySQL service.
// Here it is a lightweight Node stand-in so the demo runs with only Node installed.
// Numbers are taken from the "Manufacturing Wages Management" showcase deck.

const workers = [
  { id: 'W-001', name: 'Worker A', shift: 'Morning', line: 'Line A', attendance: 'Present', bagsPerDay: 520, wagePerDay: 850, costPerBag: 1.63, machineHours: 7.5, rating: 'High' },
  { id: 'W-002', name: 'Worker B', shift: 'Morning', line: 'Line B', attendance: 'Present', bagsPerDay: 390, wagePerDay: 820, costPerBag: 2.10, machineHours: 7.0, rating: 'Average' },
  { id: 'W-003', name: 'Worker C', shift: 'Evening', line: 'Line C', attendance: 'Present', bagsPerDay: 260, wagePerDay: 800, costPerBag: 3.08, machineHours: 6.5, rating: 'Low' },
];

const summary = {
  attendanceRate: 97.4,
  otHours: 312,
  otAboveTargetPct: 8,
  productivity: 91.6,
  productivityTarget: 88,
  avgCostPerBag: 2.18,
  monthlySavingsMin: 240000,
  monthlySavingsMax: 380000,
  aiRecommendation: 'Reassign 3 workers to Line B to save Rs.48,000 this month.',
};

module.exports = { workers, summary };
