import _ from 'lodash';
import CQWebSocket from 'cq-websocket';

import Module from '../../module';
import { MessageEventListener } from '../../../../typings/cq-websocket';
import pickRandom from '../../../utils/pickRandom';
import shipsConfig from './assets/ships';
import groupConfig from './assets/group';
import store, { User } from './store';
import { showResource, showShip, weightBalance, findUserShipById } from './utils';
import { ADMIN_ID } from '../../../configs';
import dropConfig from './assets/drop';
import rewardConfig, { RewardType } from './assets/reward';
import helpText from './assets/help';

const PREFIX = '/fleet';
const BUILD_RESOURCE_MAX = 7000;
const LEAST_RESOURCE = [1500, 1500, 2000, 1000];
const ACTIONS = {
  build: 'build',
  me: 'me',
  help: 'help',
  start: 'start',
  drop: 'drop',
  sec: 'sec',
};

const getUserInitData = (id: number): User => ({
  id,
  limit: 20000,
  resource: [20000, 20000, 20000, 20000],
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
      case 'add-r': {
        try {
          if (ctx.user_id === ADMIN_ID) {
            const [id, ...toAddResource] = params.map((r: string) => +r);
            const user = store.getUserById(id);
            this.addResource(user, toAddResource);
            reply('资源添加成功');
          } else {
            reply('只有空山才能做到');
          }
        } catch (e) {
          reply(e.message);
        }
        return;
      }

      case 'set-r': {
        try {
          if (ctx.user_id === ADMIN_ID) {
            const [id, ...toAddResource] = params.map((r: string) => +r);
            store.setUserDataById(id, 'resource', toAddResource);
            store.syncData();
            reply('资源设置成功');
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

      case ACTIONS.drop: {
        const [...shipIds] = params;
        if (_(shipIds).some((id) => !_.isInteger(+id))) {
          reply('输入错误, 需要输入舰娘ID用空格分开哦');
        }
        const msg = this.drop(
          _.map(shipIds, (id) => +id),
          user!,
        );
        reply(msg);
        return;
      }

      case ACTIONS.me: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        const ships = _.isEmpty(user.ships)
          ? '[暂无舰娘]'
          : _(user.ships)
              .map((s) => `${showShip(s)} × ${s.amount}`)
              .join('\n');
        const userSeceretaryStr = user.secretary
          ? showShip(findUserShipById(user.secretary, user)!)
          : '空';
        reply(
          `舰队详情:\n${ships}\n\n资源详情:\n${showResource(
            user.resource,
          )}\n\n秘书舰:\n${userSeceretaryStr}`,
        );
        return;
      }

      case ACTIONS.sec: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        const [inputSeceretary] = params;
        if (!inputSeceretary) {
          const userSeceretary = _.find(shipsConfig, (s) => s.id === user.secretary);
          if (!userSeceretary) {
            reply(`你现在还没有设置秘书舰`);
            return;
          }
          reply(`你现在的秘书舰为: ${showShip(userSeceretary)}`);
          return;
        }
        if (inputSeceretary === 'null') {
          user.secretary = null;
          store.syncData();
          reply(`秘书舰已置空`);
          return;
        }
        const inputSeceretaryShip = findUserShipById(+inputSeceretary, user);
        if (!inputSeceretaryShip) {
          reply(`输入错误, 你没有这个舰娘`);
          return;
        }
        user.secretary = +inputSeceretary;
        store.syncData();
        reply(`设置成功, 你现在的秘书舰为${showShip(inputSeceretaryShip)}`);
        return;
      }

      case ACTIONS.help: {
        const [command] = params;
        if (!command) {
          reply('请加上指令名');
          return;
        }
        if (
          _(ACTIONS)
            .map((v) => v)
            .includes(command)
        ) {
          reply(helpText[command as keyof typeof helpText]);
          return;
        }
        reply('暂时没有这个指令');
        return;
      }

      default: {
        const actions = _.map(ACTIONS, (v) => v).join(' | ');
        reply(`欢迎来玩迷你砍口垒模拟大建\n 可用的指令为:\n${PREFIX} ${actions}`);
        return;
      }
    }
  };

  private drop(shipIds: number[], user: User) {
    const replyMsgArr = _.map(shipIds, (id) => {
      const dropShip = _.find(user.ships, (s) => s.id === id);
      if (!dropShip) {
        return `舰队中没有ID为[${id}]的舰娘哦~`;
      }
      if (id === user.secretary && dropShip.amount === 1) {
        return `不能解体秘书舰, 请先更换秘书舰`;
      }
      store.dropUserShip(user.id, id);
      const dropShipConfig = _.find(shipsConfig, (s) => s.id === id)!;
      const dropGroup = pickRandom(
        weightBalance(dropConfig, Math.round(_.sum(dropShipConfig.resource) / 1000)),
      );
      const reward = pickRandom(
        _.map(
          dropGroup.reward,
          (rewardId) => _(rewardConfig).find((reward) => reward.id === rewardId)!,
        ),
      );

      if (reward.type === RewardType.resource) {
        this.addResource(user, reward.reward as number[]);
        return `解体${showShip(dropShip)}成功!\n获得资源:\n${showResource(
          reward.reward as number[],
        )}`;
      } else if (reward.type === RewardType.ship) {
        if (typeof reward.reward === 'number') {
          const rewardShip = pickRandom(
            _(groupConfig)
              .find((g) => g.group === reward.reward)!
              .ships.map((shipId) => _(shipsConfig).find((s) => s.id === shipId)!),
          );
          this.addShip(user, rewardShip.id);
          return `解体${showShip(dropShip)}成功!\n妖精们利用拆卸下来的零件重新建造成了${showShip(
            rewardShip,
          )}~`;
        } else {
          _.each(reward.reward, (r) => {
            this.addShip(user, r);
          });
          const shipNames = _(reward.reward)
            .map((id) => _.find(shipsConfig, (s) => s.id === id)!.name)
            .join('、');
          return `解体${showShip(
            dropShip,
          )}成功!\n妖精们利用拆卸下来的零件重新建造成了${shipNames}~`;
        }
      }
    });

    return replyMsgArr.join('\n\n');
  }

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

  private addResource(user: User, inputResource: number[]) {
    store.setUserDataById(
      user.id,
      'resource',
      user.resource.map((r, i) => r + (+inputResource[i] || 0)),
    );
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
