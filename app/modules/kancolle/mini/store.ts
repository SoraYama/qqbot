import { action, observe } from 'mobx';
import _ from 'lodash';

import Store from '../../../utils/store';
import {
  AL_RISING_STEP,
  OTHER_RISING_STEP,
  INIT_STORE_DATA,
  RESOURCE_MAX_LIMIT,
} from './constants';

export interface IdMap<T> {
  [key: number]: T;
}

export interface MiniKancolleData {
  users: IdMap<User>;
}

export interface Ship {
  id: number;
  name: string;
  amount: number;
}

export interface User {
  id: number;
  limit: number;
  resource: number[];
  secretary: number | null;
  ships: Ship[];
  level: number;
}

class MiniKancolleStore extends Store<MiniKancolleData> {
  constructor() {
    super('mini.json', INIT_STORE_DATA);
    _.each(_.keys(this.data!), (key: keyof MiniKancolleData) => {
      observe(this.data!, key, () => {
        this.syncData();
      });
    });
    this.startResourceAccumulating();
  }

  private startResourceAccumulating() {
    setInterval(() => {
      _.each(this.data?.users, (user) => {
        user.resource = _.map(
          user.resource,
          (r, i) =>
            (r = Math.min(
              r + (i === 3 ? AL_RISING_STEP : OTHER_RISING_STEP) * user.level,
              RESOURCE_MAX_LIMIT,
            )),
        );
      });
      this.syncData();
    }, 3 * 60 * 1000);
  }

  @action
  setUser(userId: number, user: User) {
    if (!this.data) {
      this.data = {
        users: {},
      };
    }
    this.data.users[userId] = user;
  }

  getUserById(userId: number) {
    const user = this.data?.users[userId];
    if (!user) {
      throw new Error(`没有此用户: ${userId}`);
    }
    return user;
  }

  @action
  setUserDataById<T extends keyof User>(userId: number, key: T, data: User[T]) {
    const user = this.getUserById(userId);
    user[key] = data;
  }

  @action
  dropUserShip(userId: number, shipId: number) {
    const user = this.getUserById(userId);
    const ship = _.find(user.ships, (s) => s.id === shipId);
    if (!ship) {
      return;
    }
    if (ship.amount > 1) {
      ship.amount--;
    } else {
      user.ships = _(user.ships)
        .without(ship)
        .value();
    }
    this.syncData();
  }
}

export default new MiniKancolleStore();
