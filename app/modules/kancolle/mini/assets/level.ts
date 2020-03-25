const levelConfig = [
  {
    level: 1,
    limit: 300000,
    accumulateVelocity: [30, 30, 30, 10],
    upgradeRequirement: 5,
    tradeTaxRate: 0,
  },
  {
    level: 2,
    limit: 300000,
    accumulateVelocity: [35, 35, 35, 15],
    upgradeRequirement: 5,
    tradeTaxRate: 0.05,
  },
  {
    level: 3,
    limit: 300000,
    accumulateVelocity: [40, 40, 40, 20],
    upgradeRequirement: 5,
    tradeTaxRate: 0.1,
  },
  {
    level: 4,
    limit: 300000,
    accumulateVelocity: [45, 45, 45, 25],
    upgradeRequirement: 5,
    tradeTaxRate: 0.1,
  },
  {
    level: 5,
    limit: 300000,
    accumulateVelocity: [50, 50, 50, 30],
    upgradeRequirement: 15,
    tradeTaxRate: 0.1,
  },
  {
    level: 6,
    limit: 250000,
    accumulateVelocity: [150, 150, 150, 50],
    upgradeRequirement: 20,
    tradeTaxRate: 0.15,
  },
  {
    level: 7,
    limit: 200000,
    accumulateVelocity: [200, 200, 200, 65],
    upgradeRequirement: 30,
    tradeTaxRate: 0.2,
  },
  {
    level: 8,
    limit: 150000,
    accumulateVelocity: [250, 250, 250, 90],
    upgradeRequirement: 50,
    tradeTaxRate: 0.25,
  },
  {
    level: 9,
    limit: 100000,
    accumulateVelocity: [300, 300, 300, 105],
    upgradeRequirement: 100,
    tradeTaxRate: 0.3,
  },
  {
    level: 10,
    limit: 500000,
    accumulateVelocity: [500, 500, 500, 300],
    upgradeRequirement: null,
    tradeTaxRate: 0.5,
  },
];

export default levelConfig;
