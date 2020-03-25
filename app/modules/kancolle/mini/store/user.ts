import { observable, action, computed, reaction, IReactionDisposer } from 'mobx';
import _ from 'lodash';

import Ship from './ship';
import shipsConfig from '../assets/ships';
import { MiniKancolleStore } from '.';
import levelConfig from '../assets/level';

const INITIAL_RESOURCE = [20000, 20000, 20000, 20000];

interface UserConfig {
  dropExceptIds: number[];
}

interface InputUser {
  level?: number;
  id: number;
  resource?: number[];
  ships?: Ship[];
  secretary?: number | null;
  configs?: UserConfig;
}

const INIT_USER_CONFIG: UserConfig = {
  dropExceptIds: [],
};

class User {
  public id = 0;

  public store: MiniKancolleStore;

  @observable
  public level: number;

  @observable
  public resource: number[];

  @observable
  public secretary: null | number = null;

  @observable
  public ships: Ship[] = [];

  @observable
  public config: UserConfig;

  public disposeReaction: IReactionDisposer;

  constructor(user: InputUser, store: MiniKancolleStore) {
    this.store = store;
    this.level = user.level || 1;
    this.id = user.id;
    this.resource = user.resource || INITIAL_RESOURCE;
    this.ships = _(user.ships || [])
      .map((s) => new Ship({ amount: s.amount, id: s.id }, this))
      .value();
    this.secretary = user.secretary || null;
    this.config = user.configs || INIT_USER_CONFIG;

    this.disposeReaction = reaction(
      () => this.asJson,
      () => {
        this.store.syncData();
      },
      {
        delay: 10,
      },
    );
  }

  @computed
  public get asJson() {
    return {
      id: this.id,
      level: this.level,
      resource: this.resource,
      secretary: this.secretary,
      ships: this.ships.map((s) => s.asJson),
      config: this.config,
    };
  }

  @computed
  public get seceretaryShip() {
    if (!this.secretary) {
      return null;
    }
    return _(shipsConfig).find((s) => s.id === this.secretary)!;
  }

  @computed
  public get userLevelInfo() {
    return _.find(levelConfig, (info) => info.level === this.level)!;
  }

  @action
  public addResource(resource: number[]) {
    if (_(resource).some((r) => !_.isNumber(r) || _.isNaN(r))) {
      throw new Error(`输入资源应该为整数`);
    }
    if (resource.length !== 4) {
      throw new Error('输入资源应该只有4种');
    }
    this.resource = _(resource)
      .map((r, i) => {
        const targetResource = r + this.resource[i];
        if (targetResource < 0) {
          throw new Error('资源不足');
        }
        return targetResource;
      })
      .value();
  }

  @action
  public dropShip(shipId: number, amount = 1) {
    const targetShip = this.getShipById(shipId);
    if (!targetShip) {
      throw new Error(`没有这个舰娘哦${shipId}`);
    }
    if (targetShip.amount - amount < 0) {
      throw new Error(`该舰数量不足哦${shipId}, ${amount}`);
    }
    if (targetShip.amount === amount) {
      if (this.secretary === shipId) {
        throw new Error(`秘书舰不能被交易/解体哦, 请先更换秘书舰`);
      }
      targetShip.dispose();
      this.ships = _(this.ships)
        .without(targetShip)
        .value();
    } else {
      targetShip.addAmount(-amount);
    }
  }

  @action
  public addShip(shipId: number) {
    const userShip = this.getShipById(shipId);
    if (userShip) {
      userShip.addAmount(1);
    } else {
      const ship = new Ship({ id: shipId }, this);
      this.ships = [...this.ships, ship];
    }
  }

  @action
  public setSecretary(shipId: number | null) {
    if (!_.isInteger(shipId)) {
      throw new Error(`输入错误, 参数应该为舰娘ID`);
    }
    if (!shipId) {
      this.secretary = null;
      return;
    }
    const ship = this.getShipById(shipId);
    if (!ship) {
      throw new Error(`你的舰队没有[${shipId}]这个舰娘哦`);
    }
    this.secretary = shipId;
  }

  @action
  public upgrade() {
    this.level++;
  }

  @action
  public setLevel(level: number) {
    if (!_.isInteger(level)) {
      throw new Error('等级输入错误');
    }
    this.level = level;
  }

  @action
  public setResource(resource: number[]) {
    if (resource.some((r) => !_.isInteger(r))) {
      throw new Error('资源输入错误');
    }
    this.resource = resource;
  }

  @action
  public setShipAmount(shipId: number, amount: number) {
    const ship = this.getShipById(shipId);
    if (!ship) {
      const ship = new Ship({ id: shipId, amount }, this);
      this.ships.push(ship);
      return ship;
    }
    ship.setAmount(amount);
  }

  @action
  public setDropShipIds(shipIds: number[]) {
    if (_(shipIds).some((id) => !_.isInteger(id))) {
      throw new Error('舰娘ID输入错误');
    }
    this.config = {
      ...this.config,
      dropExceptIds: shipIds,
    };
  }

  public getShipById(shipId: number) {
    return _(this.ships).find((s) => s.id === shipId);
  }

  public dispose() {
    this.disposeReaction();
  }
}

export default User;
