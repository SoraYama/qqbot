import _ from 'lodash';

import User from '../store/user';
import store from '../store';
import { ACTIONS, PREFIX, logger } from '../constants';
import Order, { OrderStatus } from '../store/order';
import moment from 'moment';
import helpText from '../assets/help';

const tradeTypes = ['s2r', 'r2s', 'r2r', 's2s'];
const typesText = [
  ['舰娘', '资源'],
  ['资源', '舰娘'],
  ['资源', '资源'],
  ['舰娘', '舰娘'],
];

const formatOrder = (order: Order) => `ID: ${order.id}
发起用户: ${order.sellerId}
接收用户: ${order.buyerId || '暂无'}
订单状态: ${order.statusText}
交易类型: ${typesText[order.orderType].join(' → ')}
他将给出: [${order.toTrade.join(', ')}]
他将收到: [${order.wanted.join(', ')}]
创建时间: ${moment(order.createdAt).format('YYYY-MM-DD HH-mm-ss')}`;

const order = (params: string[], reply: (content: string) => void, user: User | null) => {
  if (!user) {
    reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
    return;
  }
  try {
    const [action, ...extra] = params;
    const orderType = tradeTypes.indexOf(action);
    if (orderType >= 0) {
      const [tradingStr, targetUserId = null] = extra;
      if (/^\d+([,，]\d+)*-\d+([,，]\d+)*$/.test(tradingStr) === false) {
        reply(
          '交易信息输入错误, 请输入类似于 "1000,1001-10000,10000,10000,10000"【短杠前后分别为交易出和入的资源/舰娘ID（根据你的交易类型）, 数字间逗号分隔不能有空格】',
        );
        return;
      }
      const [outcoming, incoming] = tradingStr
        .split('-')
        .map((str) => str.split(/,|，/))
        .map((item) => item.map((s) => +s));
      const checkInputAccordingToOrderType = [[incoming], [outcoming], [incoming, outcoming], []][
        orderType
      ];
      if (
        !_.isEmpty(checkInputAccordingToOrderType) &&
        _.some(checkInputAccordingToOrderType, (arr) => arr.length !== 4)
      ) {
        reply('交换资源时需要4种资源数量写全');
        return;
      }
      if (_([outcoming, incoming]).every((arr) => _(arr).some((n) => !_.isInteger(n) || n < 0))) {
        reply('资源或舰娘ID输入错误');
        return;
      }
      const newOrder = store.addNewOrder({
        toTrade: outcoming,
        wanted: incoming,
        sellerId: user.id,
        buyerId: targetUserId ? +targetUserId : null,
        orderType,
      });
      reply(`交易订单已创建, ID为 ${newOrder.id}
确认订单内容可以执行 "${PREFIX} ${ACTIONS.order} info ${newOrder.id}"
发布订单可以执行 "${PREFIX} ${ACTIONS.order} pub ${newOrder.id}"`);
      return;
    }
    switch (action) {
      case 'list': {
        const orderList = _(store.orders)
          .filter((order) => order.status === OrderStatus.ACTIVE)
          .map((order) => order.id)
          .value();
        if (_.isEmpty(orderList)) {
          reply(`当前没有在交易中的订单`);
          return;
        }
        reply(`目前在交易中的订单为:\n${orderList.join('\n')}`);
        return;
      }
      case 'me': {
        const myPublished = _(store.orders)
          .filter((order) => order.sellerId === user.id)
          .map((order) => order.id)
          .value();
        const myReceived = _(store.orders)
          .filter((order) => order.buyerId === user.id)
          .map((order) => order.id)
          .value();
        reply(
          `你发布的订单ID们:\n${
            _.isEmpty(myPublished) ? '暂无' : myPublished.join('\n')
          }\n\n你作为接收方的订单ID们:\n${_.isEmpty(myReceived) ? '暂无' : myReceived.join('\n')}`,
        );
        return;
      }
      case 'info': {
        const orderId = +extra[0];
        const order = store.getOrderById(orderId);
        if (!order) {
          reply('没有查询到该ID的订单');
          return;
        }
        reply(formatOrder(order));
        return;
      }
      case 'apply': {
        const orderId = +extra[0];
        const order = store.getOrderById(orderId);
        if (!order) {
          reply('没有查询到该ID的订单');
          return;
        }
        if (order.sellerId === user.id) {
          reply('不能向自己做交易哦');
          return;
        }
        if (order.buyerId && order.buyerId !== user.id) {
          reply('这笔订单是定向交易, 你不是被指定的买家哦');
          return;
        }
        order.setBuyerId(user.id);
        order.excute();
        logger.log(`交易结果 - ${user.id} - ${order.id}`);
        const texts = typesText[order.orderType];
        reply(`交易成功, 你用${texts[1]}[${order.wanted}]换得了${texts[0]}[${order.toTrade}]`);
        return;
      }
      case 'pub': {
        const orderId = +extra[0];
        const order = store.getOrderById(orderId);
        if (!order) {
          reply('没有查询到该ID的订单');
          return;
        }
        if (order.sellerId !== user.id) {
          reply('你不能发布别人的订单哦');
          return;
        }
        order.publish();
        reply(`订单发布成功`);
        return;
      }
      case 'cancel': {
        const orderId = +extra[0];
        const order = store.getOrderById(orderId);
        if (!order) {
          reply('没有查询到该ID的订单');
          return;
        }
        if (order.sellerId !== user.id) {
          reply('你不能取消别人的订单哦');
          return;
        }
        order.cancel();
        reply(`订单取消成功`);
        return;
      }
      default: {
        reply(helpText.order);
        return;
      }
    }
  } catch (e) {
    reply(`交易失败\n${e.message}`);
  }
};

export default order;
