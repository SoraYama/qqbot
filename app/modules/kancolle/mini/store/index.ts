import { action, observable, reaction, extendObservable } from 'mobx';
import _ from 'lodash';
import fs from 'fs-extra';

import Store from '../../../../utils/store';
import { INIT_STORE_DATA, ResourceType } from '../constants';
import levelConfig from '../assets/level';
import User from './user';

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

export class MiniKancolleStore extends Store {
  @observable
  public users: IdMap<User>;

  constructor() {
    super('mini.json');
    this.readData(INIT_STORE_DATA);
    this.startResourceAccumulating();
    reaction(
      () => ({
        users: _(this.users)
          .keys()
          .value(),
      }),
      () => {
        this.syncData();
      },
    );
  }

  protected readData(initData: MiniKancolleData) {
    if (fs.existsSync(this.dbPath)) {
      const data = fs.readJsonSync(this.dbPath) as MiniKancolleData;
      if (_.isEmpty(data)) {
        this.users = {};
      } else {
        this.users = _(data.users)
          .mapValues((v) => new User(v, this))
          .value();
      }
    } else {
      this.users = initData.users;
      fs.outputJSONSync(this.dbPath, initData);
    }
  }

  private startResourceAccumulating() {
    setInterval(() => {
      _.each(this.users, (user) => {
        const levelInfo = _(levelConfig).find((info) => info.level === user.level)!;
        user.resource = _.map(
          user.resource,
          (r, i) => (r = Math.min(r + levelInfo.accumulateVelocity[i], levelInfo.limit)),
        );
      });
      this.syncData();
    }, 3 * 60 * 1000);
  }

  @action
  public addNewUser(userId: number) {
    extendObservable(this.users, {
      [userId]: new User(
        {
          id: userId,
        },
        this,
      ),
    });
  }

  public getUserById(userId: number) {
    const user = this.users[userId];
    if (!user) {
      return null;
    }
    return user;
  }

  public syncData() {
    const toSyncData = {
      users: _.mapValues(this.users, (user) => user.asJson),
    };
    fs.outputJsonSync(this.dbPath, toSyncData);
  }

  public getTradeRate(type: ResourceType) {
    const resourceTotalAmount = _(this.users)
      .map((user) => user.resource)
      .reduce((prev, curr) => _.map(prev, (pr, i) => pr + curr[i]), [0, 0, 0, 0]);
    const resourceTradeRate = _(resourceTotalAmount).map((r) =>
      Number((r / resourceTotalAmount[type - 1]).toFixed(3)),
    );
    return resourceTradeRate.value();
  }
}

export default new MiniKancolleStore();
