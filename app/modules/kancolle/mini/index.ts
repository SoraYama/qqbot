import _ from 'lodash';
import CQWebSocket from 'cq-websocket';

import Module from '../../module';
import { MessageEventListener } from '../../../../typings/cq-websocket';
import store from './store';
import { ADMIN_ID, isDev, TEST_GROUP_ID, MINI_KANCOLLE_GROUPS } from '../../../configs';

import { PREFIX, ACTIONS, RESOURCE_NAMES } from './constants';
import build from './handlers/build';
import drop from './handlers/drop';
import trade from './handlers/trade';
import upgrade from './handlers/upgrade';
import setSecretary from './handlers/secretary';
import help from './handlers/help';
import me from './handlers/me';
import order from './handlers/order';

class MiniKancolleModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = async (e, ctx) => {
    if (isDev) {
      if (ctx.group_id !== TEST_GROUP_ID) {
        return;
      }
    } else {
      if (!MINI_KANCOLLE_GROUPS.includes(ctx.group_id)) {
        return;
      }
    }
    const [prefix, action, ...params] = (ctx.message as string).trim().split(/\s+/g);
    if (prefix !== PREFIX) {
      return;
    }
    const atSender = { type: 'at', data: { qq: ctx.user_id } };
    const reply = (content: string) => {
      e.setMessage([atSender, '\n', content]);
    };
    const user = store.getUserById(ctx.sender?.user_id);
    switch (action) {
      case 'add-r':
      case 'add-s': {
        try {
          if (ctx.user_id === ADMIN_ID) {
            if (action === 'add-r') {
              const [id, ...toAddResource] = params.map((r: string) => +r);
              if (id === 1551) {
                _(store.users).forIn((v) => v.addResource(toAddResource));
                reply(`资源已全部添加`);
                return;
              }
              const user = store.getUserById(id);
              if (!user) {
                reply(`没有这个用户: ${id}`);
                return;
              }
              user.addResource(toAddResource);
              reply('资源添加成功');
              return;
            }
            const [id, toAddShipId] = params.map((r: string) => +r);
            const targetUser = store.getUserById(id);
            if (!targetUser) {
              reply('没有这个用户');
              return;
            }
            targetUser.addShip(toAddShipId);
            reply('舰船添加成功');
          } else {
            reply('只有空山才能做到');
          }
        } catch (e) {
          reply(e.message);
        }
        return;
      }

      case ACTIONS.build: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        if (params.length < 4) {
          reply('投入资源输入错误, 请按照 "油, 弹, 钢, 铝, 次数" 的顺序输入并用空格分开');
          return;
        }
        const resource = params.slice(0, 4);
        const repeatTimes = +params[4] || 1;
        const msgs: string[] = [];
        for (let i = 0; i < repeatTimes; i++) {
          const msg = build(resource, user);
          msgs.push(msg);
        }
        reply(msgs.join('\n'));
        return;
      }

      case ACTIONS.start: {
        if (user) {
          reply('角色已存在');
          return;
        }
        store.addNewUser(ctx.sender?.user_id);
        reply('已经建立角色, 开始建造吧~');
        return;
      }

      case ACTIONS.drop: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        const [...shipIds] = params;

        if (shipIds[0] === 'all') {
          const exceptIds = _(shipIds)
            .tail()
            .map((id) => +id)
            .concat(user.config.dropExceptIds)
            .push(1000);
          const ids = _(user.ships)
            .filter((s) => !exceptIds.includes(s.id) && s.amount > 1)
            .map((s) => new Array(s.amount - 1).fill('').map(() => s.id))
            .flatten()
            .value();
          user.setDropShipIds(_.tail(shipIds).map((id) => +id));
          if (_.isEmpty(ids)) {
            reply('没有可以拆除的舰娘了哦');
            return;
          }
          const msg = drop(ids, user!);
          reply(msg);
          return;
        }

        if (_(shipIds).some((id) => !_.isInteger(+id))) {
          reply('输入错误, 需要输入舰娘ID用空格分开哦');
          return;
        }

        const msg = drop(
          _.map(shipIds, (id) => +id),
          user!,
        );
        reply(msg);
        return;
      }

      case ACTIONS.me: {
        me(reply, user);
        return;
      }

      case ACTIONS.sec: {
        setSecretary(params, reply, user);
        return;
      }

      case ACTIONS.help: {
        help(params, reply);
        return;
      }

      case ACTIONS.upgrade: {
        upgrade(params, reply, user);
        return;
      }

      case ACTIONS.trade: {
        trade(params, reply, user);
        return;
      }

      case ACTIONS.tradeRate: {
        const [sourceType] = params.map((r: string) => +r);
        if (!_.inRange(sourceType, 0, 5)) {
          reply(`资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝`);
          return;
        }
        const rate = store.getTradeRate(sourceType);
        reply(`目前${RESOURCE_NAMES[sourceType - 1]}对其他资源的交换比率为[${rate.join(', ')}]`);
        return;
      }

      case ACTIONS.order: {
        order(params, reply, user);
        return;
      }

      default: {
        const actions = _.map(ACTIONS, (v) => v).join(' | ');
        reply(`欢迎来玩迷你砍口垒模拟大建\n可用的指令为:\n${PREFIX} ${actions}`);
        return;
      }
    }
  };
}

export default MiniKancolleModule;
