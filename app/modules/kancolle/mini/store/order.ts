import _ from 'lodash';
import { observable, action, computed, IReactionDisposer, reaction } from 'mobx';
import { MiniKancolleStore } from '.';
import { logger } from '../constants';

const tradeConfigs = [
  {
    toTrade: 'ship',
    wanted: 'resource',
  },
  {
    toTrade: 'resource',
    wanted: 'ship',
  },
  {
    toTrade: 'resource',
    wanted: 'resource',
  },
  {
    toTrade: 'ship',
    wanted: 'ship',
  },
];

export const enum OrderStatus {
  CREATED = 0,
  ACTIVE,
  FINISHED,
  CANCELD,
}

export const enum OrderType {
  SHIP_TO_RESOURCE = 0,
  RESOURCE_TO_SHIP,
  RESOURCE_TO_RESOURCE,
  SHIP_TO_SHIP,
}

export interface InputOrder {
  sellerId: number;
  orderType: OrderType;
  toTrade: number[];
  wanted: number[];
  id?: number;
  status?: OrderStatus;
  buyerId?: number | null;
  createdAt?: number;
}

class Order {
  public store: MiniKancolleStore;

  @observable
  public id: number;

  @observable
  public status: OrderStatus;

  @observable
  public createdAt: number;

  @observable
  public toTrade: number[];

  @observable
  public wanted: number[];

  @observable
  public buyerId: number | null;

  public orderType: OrderType;

  public sellerId: number;

  private disposeReaction: IReactionDisposer;

  constructor(order: InputOrder, store: MiniKancolleStore) {
    this.store = store;
    this.parse(order);
    this.disposeReaction = reaction(
      () => this.asJson,
      () => this.store.syncData(),
      {
        delay: 10,
      },
    );
  }

  @computed
  public get asJson(): InputOrder {
    return {
      id: this.id,
      sellerId: this.sellerId,
      buyerId: this.buyerId,
      createdAt: this.createdAt,
      status: this.status,
      toTrade: this.toTrade,
      wanted: this.wanted,
      orderType: this.orderType,
    };
  }

  @computed
  public get seller() {
    return this.store.getUserById(this.sellerId);
  }

  @computed
  public get statusText() {
    return ['待发布', '待交易', '已结束', '已取消'][this.status];
  }

  @computed
  public get buyer() {
    if (!this.buyerId) {
      return null;
    }
    return this.store.getUserById(this.buyerId);
  }

  @action
  public publish() {
    if ([OrderStatus.CANCELD, OrderStatus.FINISHED].includes(this.status)) {
      throw new Error('订单状态为已取消或已结束, 无法发布');
    }
    this.status = OrderStatus.ACTIVE;
  }

  @action
  public setBuyerId(id: number) {
    this.buyerId = id;
  }

  @action
  public excute() {
    if (!this.buyer || this.status !== OrderStatus.ACTIVE) {
      throw new Error('订单没有买家或不在可交易状态');
    }
    this.checkTradeFormatAndExcute();
    this.status = OrderStatus.FINISHED;
  }

  @action
  public cancel() {
    if (this.status !== OrderStatus.FINISHED) {
      this.status = OrderStatus.CANCELD;
    } else {
      throw new Error('订单已经结束, 无法取消');
    }
  }

  public dispose() {
    this.disposeReaction();
  }

  private checkTradeFormatAndExcute() {
    _([this.toTrade, this.wanted]).each((item) => {
      if (_(item).some((i) => !_.isInteger(i))) {
        logger.error(this.orderType, this.toTrade, this.wanted);
        throw new Error('资源或舰娘ID输入非法, 请重新创建订单');
      }
    });
    this.handleTrading();
  }

  private handleTrading() {
    const config = tradeConfigs[this.orderType];
    const { toTrade, wanted } = config;
    if (toTrade === 'ship') {
      try {
        _.each(this.toTrade, (id) => this.seller?.dropShip(id));
      } catch (e) {
        throw new Error('订单发起者目前没有该舰娘或该舰为秘书舰, 不能交易');
      }
      _.each(this.toTrade, (id) => this.buyer?.addShip(id));
    } else if (toTrade === 'resource') {
      try {
        this.seller?.addResource(this.toTrade.map((r) => -r));
      } catch (e) {
        throw new Error('订单发起者资源不足');
      }
      this.buyer?.addResource(this.toTrade);
    }
    if (wanted === 'ship') {
      _.each(this.wanted, (id) => this.seller?.addShip(id));
      try {
        _.each(this.wanted, (id) => this.buyer?.dropShip(id));
      } catch (e) {
        throw new Error('你目前没有该舰娘或该舰为秘书舰, 不能交易');
      }
    } else if (wanted === 'resource') {
      this.seller?.addResource(this.wanted);
      try {
        this.buyer?.addResource(this.wanted.map((r) => -r));
      } catch (e) {
        throw new Error('你目前资源不足');
      }
    }
  }

  private parse(order: InputOrder) {
    const { id, sellerId, status, createdAt, buyerId, toTrade, wanted, orderType } = order;
    this.sellerId = sellerId;
    this.toTrade = toTrade;
    this.wanted = wanted;
    this.orderType = orderType;
    // create new order
    if (!id) {
      const now = _.now();
      this.id = now;
      this.createdAt = now;
      this.status = OrderStatus.CREATED;
      this.buyerId = null;
    } else {
      // create from exsiting data
      this.id = id;
      this.createdAt = createdAt!;
      this.status = status!;
      this.buyerId = buyerId || null;
    }
  }
}

export default Order;
