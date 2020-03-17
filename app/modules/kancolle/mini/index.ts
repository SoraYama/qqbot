import _ from 'lodash';
import CQWebSocket from 'cq-websocket';

import Module from '../../module';
import { MessageEventListener } from '../../../../typings/cq-websocket';
import pickRandom from '../../../utils/pickRandom';
import shipsConfig from './assets/ships';
import groupConfig from './assets/build-group';
import store, { User } from './store';
import { showResource, showShip, weightBalance, findUserShipById } from './utils';
import { ADMIN_ID, isDev, TEST_GROUP_ID } from '../../../configs';
import dropConfig from './assets/drop';
import rewardConfig, { RewardType } from './assets/reward';
import helpText from './assets/help';
import {
  PREFIX,
  ACTIONS,
  MAX_HOME_LEVEL,
  LEAST_RESOURCE,
  BUILD_RESOURCE_MAX,
  ResourceType,
  RESOURCE_NAMES,
} from './constants';
import levelConfig from './assets/level';

const getUserInitData = (id: number): User => ({
  id,
  limit: 20000,
  resource: [20000, 20000, 20000, 20000],
  secretary: null,
  ships: [],
  level: 1,
});

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
    }
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

      case 'add-s': {
        try {
          if (ctx.user_id === ADMIN_ID) {
            const [id, toAddShipId] = params.map((r: string) => +r);
            const targetUser = store.data?.users[id];
            if (!targetUser) {
              reply('没有这个用户');
              return;
            }
            this.addShip(targetUser, toAddShipId);
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
          const msg = this.build(resource, user);
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
        store.setUser(ctx.sender.user_id, getUserInitData(ctx.sender.user_id));
        reply('已经建立角色, 开始建造吧~');
        return;
      }

      case ACTIONS.drop: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
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

        const userLevelInfo = _.find(levelConfig, (info) => user.level === info.level)!;

        const infoMap = {
          镇守府等级: `${new Array(user.level)
            .fill('')
            .map(() => '★')
            .join('')}`,
          资源详情: showResource(user.resource),
          秘书舰: userSeceretaryStr,
          资源上限: userLevelInfo.limit,
          资源增长速度: `[${userLevelInfo.accumulateVelocity.join(', ')}]`,
          升级所需まるゆ数量: `${userLevelInfo.upgradeRequirement}个`,
          资源兑换手续费率: `${userLevelInfo.tradeTaxRate * 100}%`,
          舰队详情: ships,
        };
        reply(_.map(infoMap, (v, k) => `${k}:\n${v}`).join('\n\n'));
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
          const actions = _.map(ACTIONS, (v) => v).join(' | ');
          reply(`请加上指令名${actions}, 比如说 "${PREFIX} ${ACTIONS.help} ${ACTIONS.build}"`);
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

      case ACTIONS.upgrade: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        const levelInfo = _(levelConfig).find((info) => info.level === user.level);
        if (!levelInfo) {
          reply(`啊哦你的镇守府出问题了, 请联系空山`);
          return;
        }
        const userMaruyu = findUserShipById(1000, user);
        if (!userMaruyu || userMaruyu.amount < levelInfo.upgradeRequirement) {
          reply(`马路油数量不足哦 (${userMaruyu?.amount || 0}/${levelInfo.upgradeRequirement})`);
          return;
        }
        if (user.level >= MAX_HOME_LEVEL) {
          reply(`镇守府已到达最高等级啦`);
          return;
        }
        if (this.decShip(user, 1000, levelInfo.upgradeRequirement) === false) {
          return;
        }
        user.level = Math.min(user.level + 1, MAX_HOME_LEVEL);
        store.syncData();
        reply(`镇守府升级啦, 当前等级为 ${user.level}`);
        return;
      }

      case ACTIONS.trade: {
        if (!user) {
          reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
          return;
        }
        if (user.secretary !== 1034) {
          reply(`需要${showShip(_.find(shipsConfig, (s) => s.name === '明石')!)}作为旗舰哦`);
          return;
        }
        if (params.length < 3) {
          reply(
            `参数输入错误, 应该为 "${PREFIX} ${ACTIONS.trade} <要交换的资源类型> <目标资源类型> <要交换的数量>"`,
          );
          return;
        }
        const [sourceType, targetType, sourceAmount] = params.map((p: string) => +p);
        if (
          _.some(
            [sourceType, targetType],
            (t) => !_.inRange(t, ResourceType.oil - 1, ResourceType.al + 1),
          )
        ) {
          reply(`资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝`);
          return;
        }
        if (!_.isInteger(sourceAmount)) {
          reply(`请输入整数作为要交换的资源量`);
          return;
        }
        const userSourceAmount = user.resource[sourceType - 1];
        if (sourceAmount > userSourceAmount) {
          reply(`抱歉你没有那么多的${RESOURCE_NAMES[sourceType - 1]}(${userSourceAmount})`);
          return;
        }

        const tradeRate = this.getTradeRate(sourceType);
        const levelInfo = _.find(levelConfig, (info) => info.level === user.level)!;
        const targetAmount = Math.round(
          sourceAmount * tradeRate[targetType - 1] * (1 - levelInfo.tradeTaxRate),
        );
        const toCalcResource = [0, 0, 0, 0];
        toCalcResource[targetType - 1] = targetAmount;
        toCalcResource[sourceType - 1] = -sourceAmount;
        this.addResource(user, toCalcResource);
        reply(
          `明老板很开心, 收下了你的 ${sourceAmount}${
            RESOURCE_NAMES[sourceType - 1]
          } 并给你了 ${targetAmount}${RESOURCE_NAMES[targetType - 1]}${
            levelInfo.tradeTaxRate === 0
              ? ''
              : `\n(顺便一提明老板收取了 ${sourceAmount * levelInfo.tradeTaxRate}${
                  RESOURCE_NAMES[sourceType - 1]
                } 作为手续费~)`
          }`,
        );
        return;
      }

      case ACTIONS.tradeRate: {
        const [sourceType] = params.map((r: string) => +r);
        if (!_.inRange(sourceType, 0, 5)) {
          reply(`资源类型输入错误: 1, 2, 3, 4 分别对应 油, 弹, 钢, 铝`);
          return;
        }
        const rate = this.getTradeRate(sourceType);
        reply(`目前${RESOURCE_NAMES[sourceType - 1]}对其他资源的的交换比率为[${rate.join(', ')}]`);
        return;
      }

      default: {
        const actions = _.map(ACTIONS, (v) => v).join(' | ');
        reply(`欢迎来玩迷你砍口垒模拟大建\n 可用的指令为:\n${PREFIX} ${actions}`);
        return;
      }
    }
  };

  private getTradeRate(type: ResourceType) {
    const resourceTotalAmount = _(store.data?.users)
      .map((user) => user.resource)
      .reduce((prev, curr) => _.map(prev, (pr, i) => pr + curr[i]), [0, 0, 0, 0]);
    const resourceTradeRate = _(resourceTotalAmount).map((r) =>
      Number((r / resourceTotalAmount[type - 1]).toFixed(3)),
    );
    return resourceTradeRate.value();
  }

  private drop(shipIds: number[], user: User) {
    if (shipIds.length === 0) {
      return '参数需要舰娘ID';
    }
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

  private build(resourceString: string[] = [], user: User) {
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
    if (!selectedShip) {
      console.warn(
        'group:',
        group,
        'filteredByResource',
        filteredByResource.value(),
        'selectedShip:',
        selectedShip,
        'weightMapped:',
        weightMapped,
        'filteredBySecretary:',
        filteredBySeceretary.value(),
      );
      return `妖精们不知道什么原因罢工了, 资源还给你> <`;
    }
    this.addShip(user, selectedShip.id);
    if (user.id !== ADMIN_ID) {
      user.resource = _.map(user.resource, (r, i) => r - inputResource[i]);
    }
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

  private decShip(user: User, shipId: number, amount = 1) {
    const targetShip = findUserShipById(shipId, user);
    if (!targetShip) {
      return false;
    }
    if (targetShip.amount - amount < 0) {
      return false;
    }
    if (targetShip.amount === amount) {
      user.ships = _(user.ships)
        .without(targetShip)
        .value();
    } else {
      targetShip.amount -= amount;
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
