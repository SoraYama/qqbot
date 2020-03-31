import { action, observable, reaction, extendObservable } from 'mobx';
import _ from 'lodash';
import fs from 'fs-extra';

import Store from '../../../../utils/store';
import { INIT_STORE_DATA, ResourceType } from '../constants';
import levelConfig from '../assets/level';
import User from './user';
import Order, { InputOrder } from './order';

export interface IdMap<T> {
  [key: number]: T;
}

export interface MiniKancolleData {
  users: IdMap<User>;
  orders: Order[];
}

export interface Ship {
  id: number;
  name: string;
  amount: number;
}

export class MiniKancolleStore extends Store {
  @observable
  public users: IdMap<User>;

  @observable
  public orders: Order[];

  constructor() {
    super('mini.json');
    this.readData(INIT_STORE_DATA);
    this.startResourceAccumulating();
    reaction(
      () => ({
        users: _(this.users)
          .keys()
          .value(),
        orders: this.orders.length,
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
        this.orders = [];
      } else {
        this.users = _(data.users)
          .mapValues((v) => new User(v, this))
          .value();
        this.orders = _(data.orders)
          .map((order) => new Order(order, this))
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

  @action
  public addNewOrder(order: InputOrder) {
    const newOrder = new Order(order, this);
    this.orders.push(newOrder);
    return newOrder;
  }

  @action
  public removeOrderById(id: number) {
    const order = this.getOrderById(id);
    if (!order) {
      throw new Error(`没有找到该ID的订单: ${id}`);
    }
    this.orders.splice(this.orders.indexOf(order), 1);
    order.dispose();
  }

  public getUserById(userId: number) {
    const user = this.users[userId];
    if (!user) {
      return null;
    }
    return user;
  }

  public getOrderById(orderId: number) {
    return _.find(this.orders, (order) => order.id === orderId);
  }

  public getMyPublishedOrdersByUserId(userId: number) {
    return _(this.orders)
      .filter((order) => order.sellerId === userId)
      .value();
  }

  public getMyAcceptedOrdersByUserId(userId: number) {
    return _(this.orders)
      .filter((order) => order.buyerId === userId)
      .value();
  }

  public syncData() {
    const toSyncData = {
      users: _.mapValues(this.users, (user) => user.asJson),
      orders: _.map(this.orders, (order) => order.asJson),
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
