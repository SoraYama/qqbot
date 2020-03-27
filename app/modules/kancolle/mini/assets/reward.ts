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
    weight: 1,
  },
  {
    id: 1003,
    type: RewardType.ship,
    reward: [2003],
    weight: 50,
  },
  {
    id: 1004,
    type: RewardType.ship,
    reward: [2004],
    weight: 50,
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
