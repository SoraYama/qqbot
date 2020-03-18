import _ from 'lodash';
import { RandomItem } from '../../../utils/pickRandom';
import shipsConfig from './assets/ships';
import { BUILD_RESOURCE_MAX } from './constants';

const resourceStr = ['油', '弹', '钢', '铝'];

export const showResource = (resource: number[] = []) => {
  return _(resource)
    .map((r, i) => `${resourceStr[i]}: ${r}`)
    .join(' ');
};

export const weightBalance = <T extends RandomItem>(list: T[], figure: number) => {
  const d = (-2 * figure) / (list.length - 1);
  const res = _(list)
    .sortBy('weight')
    .map((item, index) => ({
      ...item,
      weight: Math.max(item.weight + Math.round(figure + index * d), 0),
    }))
    .value();
  return res;
};

export const findConfigShipById = (shipId: number) => {
  return _.find(shipsConfig, (s) => s.id === shipId);
};

export const computeExtraWeight = (requiredResource: number[], inputResource: number[]) => {
  let extraWeight = 0;
  for (let i = 0; i < 4; i++) {
    extraWeight +=
      Math.round((BUILD_RESOURCE_MAX - (inputResource[i] - requiredResource[i])) / 1000) *
      (i === 3 ? 1 : 5);
  }
  return extraWeight;
};

export const showShip = (shipId: number) => {
  const ship = findConfigShipById(shipId);
  return `[${ship?.id || NaN}]「${ship?.name || null}」`;
};
