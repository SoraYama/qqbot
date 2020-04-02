import _ from 'lodash';
import { Context } from 'koa';
import store from '../../modules/kancolle/mini/store';
import { RouterContext } from 'koa-router';

const userControllers = {
  getUser: async (ctx: Context & RouterContext) => {
    const { id } = ctx.query;
    if (!id) {
      ctx.body = _(store.users)
        .map((user) => user.asJson)
        .value();
      return;
    }
    ctx.body = store.getUserById(id)?.asJson || {};
  },

  addResource: async (ctx: Context & RouterContext) => {
    const { userId, resource } = ctx.request.body;
    const user = store.getUserById(userId);
    if (!user) {
      ctx.response.body = {
        errMsg: '没有此用户',
      };
      return;
    }
    if (resource.length !== 4) {
      ctx.response.body = {
        errMsg: '资源输入错误',
      };
      return;
    }
    try {
      user.addResource(resource);
      ctx.response.body = {
        status: 0,
      };
    } catch (e) {
      ctx.response.body = {
        errMsg: '资源输入错误',
      };
      return;
    }
  },

  setResource: async (ctx: Context & RouterContext) => {
    const { userId, resource } = ctx.request.body;
    try {
      const user = store.getUserById(userId);
      if (!user) {
        ctx.response.body = {
          errMsg: '没有这个用户',
        };
        return;
      }
      user.setResource(resource);
      ctx.response.body = {
        status: 0,
      };
    } catch (e) {
      ctx.response.body = {
        errMsg: e.message,
      };
    }
  },

  setLevel: async (ctx: Context & RouterContext) => {
    const { userId, level } = ctx.request.body;
    try {
      const user = store.getUserById(userId);
      if (!user) {
        ctx.response.body = {
          errMsg: '没有这个用户',
        };
        return;
      }
      user.setLevel(level);
      ctx.response.body = {
        status: 0,
      };
    } catch (e) {
      ctx.response.body = {
        errMsg: e.message,
      };
    }
  },

  setShipAmount: async (ctx: Context & RouterContext) => {
    const { userId, shipId, amount } = ctx.request.body;
    try {
      const user = store.getUserById(userId);
      if (!user) {
        ctx.response.body = {
          errMsg: '没有这个用户',
        };
        return;
      }
      const ship = user.setShipAmount(shipId, amount);
      ctx.response.body = ship?.asJson;
    } catch (e) {
      ctx.response.body = {
        errMsg: e.message,
      };
    }
  },

  getOrder: async (ctx: Context & RouterContext) => {
    try {
      const orders = _(store.orders)
        .map((order) => ({
          ...order.asJson,
          toTrade: order.toTradeAsText,
          wanted: order.wantedAsText,
        }))
        .value();
      ctx.response.body = orders;
    } catch (e) {
      ctx.response.body = {
        errMsg: e.message,
      };
    }
  },

  deleteOrder: async (ctx: Context & RouterContext) => {
    const { orderId } = ctx.request.body;
    try {
      store.removeOrderById(orderId);
      ctx.response.body = {
        status: 0,
      };
    } catch (e) {
      ctx.response.body = {
        errMsg: e.message,
      };
    }
  },
};

export default userControllers;
