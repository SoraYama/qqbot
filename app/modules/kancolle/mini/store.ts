import { action, observe } from 'mobx';
import _ from 'lodash';

import Store from '../../../utils/store';

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
}

const INIT_STORE_DATA = {
  users: {},
};

const RESOURCE_MAX_LIMIT = 300000;

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
          (r, i) => (r = Math.min(r + (i === 3 ? 10 : 30), RESOURCE_MAX_LIMIT)),
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
}

export default new MiniKancolleStore();
