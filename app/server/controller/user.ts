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
};

export default userControllers;
