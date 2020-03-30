export const enum RewardType {
  ship = 0,
  resource,
}

const rewardConfig = [
  {
    id: 1000,
    type: RewardType.ship,
    reward: [2000],
    weight: 50,
  },
  {
    id: 1001,
    type: RewardType.ship,
    reward: [2001],
    weight: 50,
  },
  {
    id: 1002,
    type: RewardType.ship,
    reward: [2002],
    weight: 10,
  },
  {
    id: 1003,
    type: RewardType.ship,
    reward: [2003],
    weight: 25,
  },
  {
    id: 1004,
    type: RewardType.ship,
    reward: [2004],
    weight: 25,
  },
  {
    id: 1005,
    type: RewardType.ship,
    reward: [2005],
    weight: 25,
  },
  {
    id: 1006,
    type: RewardType.ship,
    reward: [2006],
    weight: 25,
  },
  {
    id: 1007,
    type: RewardType.ship,
    reward: [2007],
    weight: 25,
  },
  {
    id: 1008,
    type: RewardType.ship,
    reward: [2008],
    weight: 25,
  },
  {
    id: 1009,
    type: RewardType.ship,
    reward: [2009],
    weight: 25,
  },
  {
    id: 1010,
    type: RewardType.ship,
    reward: [2010],
    weight: 25,
  },
  {
    id: 1011,
    type: RewardType.ship,
    reward: [2006, 2007, 2008, 2009],
    weight: 1,
  },
  {
    id: 1012,
    type: RewardType.ship,
    reward: [2011],
    weight: 5,
  },
  {
    id: 1013,
    type: RewardType.ship,
    reward: [2012],
    weight: 5,
  },
  {
    id: 1014,
    type: RewardType.ship,
    reward: [2013],
    weight: 30,
  },
  {
    id: 1100,
    type: RewardType.ship,
    reward: 1,
    weight: 1,
  },
  {
    id: 1101,
    type: RewardType.ship,
    reward: 2,
    weight: 400,
  },
  {
    id: 1102,
    type: RewardType.ship,
    reward: 3,
    weight: 499,
  },
  {
    id: 2000,
    type: RewardType.resource,
    reward: [1000, 1000, 2500, 500],
    weight: 40,
  },
  {
    id: 2001,
    type: RewardType.resource,
    reward: [2500, 1000, 1000, 500],
    weight: 40,
  },
  {
    id: 2002,
    type: RewardType.resource,
    reward: [1000, 2500, 1000, 500],
    weight: 40,
  },
  {
    id: 2003,
    type: RewardType.resource,
    reward: [1000, 1000, 1000, 1000],
    weight: 40,
  },
  {
    id: 2004,
    type: RewardType.resource,
    reward: [2000, 2000, 2000, 2000],
    weight: 5,
  },
  {
    id: 2005,
    type: RewardType.resource,
    reward: [7000, 7000, 7000, 7000],
    weight: 2,
  },
];

export default rewardConfig;
