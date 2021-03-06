import _ from 'lodash';

import User from '../store/user';
import { findConfigShipById, weightBalance, showResource, showShip } from '../utils';
import dropConfig from '../assets/drop';
import groupConfig from '../assets/build-group';
import pickRandom from '../../../../utils/pickRandom';
import rewardConfig, { RewardType } from '../assets/reward';
import { logger } from '../constants';
import shipsConfig from '../assets/ships';

const drop = (shipIds: number[], user: User) => {
  if (shipIds.length === 0) {
    return '参数需要舰娘ID';
  }
  const replyMsgArr = _.map(shipIds, (id) => {
    const dropShip = user.getShipById(id);
    if (!dropShip) {
      return `舰队中没有ID为[${id}]的舰娘哦~`;
    }
    if (id === user.secretary && dropShip.amount === 1) {
      return `不能解体秘书舰, 请先更换秘书舰`;
    }

    try {
      user.dropShip(id);
      const dropShipConfig = findConfigShipById(id)!;
      const balancedConfigs = weightBalance(
        dropConfig,
        Math.round(_.sum(dropShipConfig.resource) / 20),
      );
      const dropGroup = pickRandom(balancedConfigs)!;
      const reward = pickRandom(
        _.map(
          dropGroup.reward,
          (rewardId) => _(rewardConfig).find((reward) => reward.id === rewardId)!,
        ),
      )!;

      if (reward.type === RewardType.resource) {
        logger.info(`解体结果 - ${user.id} ${id} ${reward.type} ${reward.reward}`);
        user.addResource(reward.reward as number[]);
        return `解体${showShip(id)}成功!\n获得资源:\n${showResource(reward.reward as number[])}`;
      } else if (reward.type === RewardType.ship) {
        if (typeof reward.reward === 'number') {
          const rewardShip =
            pickRandom(
              _(groupConfig)
                .find((g) => g.group === reward.reward)!
                .ships.map((shipId) => _(shipsConfig).find((s) => s.id === shipId)!)
                .filter((s) => _.every(s.resource, (r, i) => r <= dropShipConfig.resource[i]))
                .filter((s) => s.seceretary === null || s.seceretary.includes(user.secretary!)),
            ) || findConfigShipById(1013)!;
          user.addShip(rewardShip.id);
          logger.info(`解体结果 - ${user.id} ${id} ${reward.type} ${rewardShip.name}`);
          return `解体${showShip(id)}成功!\n妖精们利用拆卸下来的零件重新建造成了${showShip(
            rewardShip.id,
          )}~`;
        } else {
          _.each(reward.reward, (r) => {
            user.addShip(r);
          });
          const shipNames = _(reward.reward)
            .map((id) => findConfigShipById(id)!.name)
            .join('、');
          logger.info(`解体结果 - ${user.id} ${id} ${reward.type} ${shipNames}`);
          return `解体${showShip(id)}成功!\n妖精们利用拆卸下来的零件重新建造成了${shipNames}~`;
        }
      }
    } catch (e) {
      return e.message;
    }
  });

  return replyMsgArr.join('\n\n');
};

export default drop;
