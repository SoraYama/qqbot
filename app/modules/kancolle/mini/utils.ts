import _ from 'lodash';
import { RandomItem } from '../../../utils/pickRandom';
import { Ship, User } from './store';
import shipsConfig from './assets/ships';

const resourceStr = ['油', '弹', '钢', '铝'];

export const showResource = (resource: number[] = []) => {
  return _(resource)
    .map((r, i) => `${resourceStr[i]}: ${r}`)
    .join(' ');
};

export const showShip = (ship: Partial<Ship>) => {
  return `[${ship.id}]「${ship.name}」`;
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

export const findUserShipById = (shipId: number, user: User) => {
  return _.find(user.ships, (s) => s.id === shipId);
};

export const findConfigShipById = (shipId: number) => {
  return _.find(shipsConfig, (s) => s.id === shipId);
};
