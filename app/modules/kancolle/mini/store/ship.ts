import { observable, action } from 'mobx';
import shipsConfig from '../assets/ships';
import _ from 'lodash';

interface InputShipData {
  id: number;
  amount?: number;
}

class Ship {
  @observable
  public amount = 1;

  public id: number;

  public name = '';

  constructor({ id, amount = 1 }: InputShipData) {
    this.id = id;
    this.amount = amount;
    const ship = _(shipsConfig).find((s) => s.id === id);
    if (!ship) {
      throw new Error(`没有该舰娘${id}`);
    }
    this.name = ship.name;
  }

  @action
  public changeAmount(amount: number) {
    this.amount += amount;
  }
}

export default Ship;
