import _ from 'lodash';
import CQWebSocket from 'cq-websocket';

import Module from '../../module';
import { MessageEventListener } from '../../../../typings/cq-websocket';
import pickRandom from '../../../utils/pickRandom';
import shipsConfig from './assets/ships';
import groupConfig from './assets/group';
import store, { User } from './store';
import { showResource } from './utils';
import { ADMIN_ID } from '../../../configs';

const PREFIX = '/ship';
const BUILD_RESOURCE_MAX = 7000;
const LEAST_RESOURCE = [1500, 1500, 2000, 1000];
const ACTIONS = {
  build: 'build',
  me: 'me',
  help: 'help',
  start: 'start',
};

const getUserInitData = (id: number): User => ({
  id,
  limit: 20000,
  resource: [2000, 2000, 2000, 2000],
  secretary: null,
  ships: [],
});

class MiniKancolleModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = async (e, ctx) => {
    const [prefix, action, ...params] = ctx.message.trim().split(' ');
    if (prefix !== PREFIX) {
      return;
    }
    const atSender = { type: 'at', data: { qq: ctx.user_id } };
    const reply = (content: string) => {
      e.setMessage([atSender, '\n', content]);
    };
    const user = store.data?.users[ctx.sender?.user_id];
    switch (action) {
      case ACTIONS.build: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        const msg = await this.build(params, user!);
        reply(msg);
        return;
      }
      case ACTIONS.start: {
        if (user) {
          reply('角色已存在');
          return;
        }
        store.setUser(ctx.sender.user_id, getUserInitData(ctx.sender.user_id));
        reply('已经建立角色, 开始建造吧~');
        return;
      }
      case ACTIONS.me: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        const ships = _(user.ships)
          .map((s) => `${s.name} × ${s.amount}`)
          .join('\n');
        reply(`舰队详情:\n${ships}\n\n资源详情:\n${showResource(user.resource)}`);
        return;
      }
      case ACTIONS.help:
      default: {
        const actions = _.map(ACTIONS, (v) => v).join(' | ');
        reply(`迷你砍口垒建造 可用指令有: /pet ${actions}`);
        return;
      }
    }
  };

  private async build(resourceString: string[] = [], user: User) {
    if (resourceString.length !== 4) {
      return '投入资源输入错误, 请按照油, 弹, 钢, 铝的顺序输入并用空格分开';
    }
    const inputResource = _.map(resourceString, (r) => parseInt(r, 10));
    if (inputResource.some((r, index) => r < LEAST_RESOURCE[index])) {
      return '投入资源最少要 [1500, 1500, 2000, 1000]';
    }
    if (inputResource.some((r) => r > BUILD_RESOURCE_MAX)) {
      return '投入资源最多不能超过7000';
    }
    if (user.resource.some((r, i) => r < inputResource[i])) {
      return `资源不足, 目前资源为:\n${showResource(user.resource)}`;
    }

    if (user.id !== ADMIN_ID) {
      user.resource = _.map(user.resource, (r, i) => r - inputResource[i]);
    }

    const group = pickRandom(groupConfig);
    const filteredByGroup = _(shipsConfig).filter((ship) => group.ships.includes(ship.id));
    const filteredByResource = filteredByGroup.filter((item) =>
      _.every(item.resource, (r, i) => r <= inputResource[i]),
    );
    const filteredBySeceretary = filteredByResource.filter(
      (item) => item.seceretary === null || _.indexOf(item.seceretary, user.secretary) > -1,
    );
    const weightMapped = filteredBySeceretary
      .map((item) => {
        return {
          ...item,
          weight: item.weight + this.computeExtraWeight(item.resource, inputResource),
        };
      })
      .value();
    const selectedShip = pickRandom(weightMapped);
    this.addShip(user, selectedShip.id);
    return `舰娘「${selectedShip.name}」加入了舰队~`;
  }

  private addShip(user: User, shipId: number) {
    const userShip = _.find(user.ships, (_ship) => _ship.id === shipId);
    const shipInfo = _.find(shipsConfig, (s) => s.id === shipId)!;
    if (userShip) {
      userShip.amount += 1;
    } else {
      const ship = {
        amount: 1,
        name: shipInfo.name,
        id: shipInfo.id,
      };
      user.ships = [...user.ships, ship];
    }
    store.syncData();
  }

  private computeExtraWeight(requiredResource: number[], inputResource: number[]) {
    let extraWeight = 0;
    for (let i = 0; i < 4; i++) {
      extraWeight +=
        Math.round((BUILD_RESOURCE_MAX - (inputResource[i] - requiredResource[i])) / 1000) *
        (i === 3 ? 1 : 5);
    }
    return extraWeight;
  }
}

export default MiniKancolleModule;
