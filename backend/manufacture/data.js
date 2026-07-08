// Manufacturing module data.
// In the real project this is your MERN service (Node + Express + MongoDB).
// Here the data is inlined so the demo runs without a database.

const lines = [
  { line: 'Line A', product: 'Cement Bags', bagsProduced: 520, target: 500, machineHours: 7.5, machineUptime: 96.2, workers: 1, status: 'On Track' },
  { line: 'Line B', product: 'Cement Bags', bagsProduced: 390, target: 480, machineHours: 7.0, machineUptime: 88.4, workers: 1, status: 'Below Target' },
  { line: 'Line C', product: 'Cement Bags', bagsProduced: 260, target: 300, machineHours: 6.5, machineUptime: 82.1, workers: 1, status: 'Below Target' },
];

const summary = {
  totalBagsToday: 1170,
  activeLines: 3,
  avgMachineUptime: 88.9,
  openProductionOrders: 4,
  shift: 'Morning + Evening',
};

module.exports = { lines, summary };
