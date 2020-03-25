import { observable, action, computed, reaction, IReactionDisposer } from 'mobx';
import shipsConfig from '../assets/ships';
import _ from 'lodash';
import User from './user';

interface InputShipData {
  id: number;
  amount?: number;
}

class Ship {
  @observable
  public amount = 1;

  public id: number;

  public name = '';

  protected user: User;

  private disposeReaction: IReactionDisposer;

  constructor({ id, amount = 1 }: InputShipData, user: User) {
    this.id = id;
    this.amount = amount;
    this.user = user;
    const ship = _(shipsConfig).find((s) => s.id === id);
    if (!ship) {
      throw new Error(`没有该舰娘${id}`);
    }
    this.name = ship.name;

    this.disposeReaction = reaction(
      () => this.asJson,
      () => this.user.store.syncData(),
      {
        delay: 10,
      },
    );
  }

  @computed
  public get asJson() {
    return {
      id: this.id,
      amount: this.amount,
      name: this.name,
    };
  }

  @action
  public addAmount(amount: number) {
    this.amount += amount;
  }

  @action
  public setAmount(amount: number) {
    this.amount = amount;
  }

  public dispose() {
    this.disposeReaction();
  }
}

export default Ship;
