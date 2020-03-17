import levelConfig from './assets/level';

export const AL_RISING_STEP = 10;
export const OTHER_RISING_STEP = 30;
export const INIT_STORE_DATA = {
  users: {},
};
export const RESOURCE_MAX_LIMIT = 300000;
export const PREFIX = '/fleet';
export const BUILD_RESOURCE_MAX = 7000;
export const MAX_HOME_LEVEL = levelConfig.length;
export const LEAST_RESOURCE = [1500, 1500, 2000, 1000];
export const ACTIONS = {
  build: 'build',
  me: 'me',
  help: 'help',
  start: 'start',
  drop: 'drop',
  sec: 'sec',
  upgrade: 'upgrade',
  trade: 'trade',
  tradeRate: 'trade-rate',
};
export const enum ResourceType {
  oil = 1,
  armor,
  steel,
  al,
}
export const RESOURCE_NAMES = ['油', '弹', '钢', '铝'];
