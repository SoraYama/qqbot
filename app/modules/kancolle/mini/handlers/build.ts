import _ from 'lodash';

import pickRandom from '../../../../utils/pickRandom';
import User from '../store/user';
import { LEAST_RESOURCE, BUILD_RESOURCE_MAX, logger } from '../constants';
import {
  showResource,
  computeExtraWeight,
  showShip,
  weightBalance,
  findConfigShipById,
} from '../utils';
import groupConfig from '../assets/build-group';
import shipsConfig from '../assets/ships';
import { ADMIN_ID } from '../../../../configs';
import nykConfigs from '../assets/nyk';

const build = (resourceString: string[] = [], user: User, isNyk: boolean) => {
  try {
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

    const nyk = pickRandom(nykConfigs)!;
    const balancedGroupConfig = weightBalance(
      groupConfig,
      -(user.level - 1) * 10 + (isNyk ? nyk.value : 0),
    );
    const group = pickRandom(balancedGroupConfig)!;
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
          weight: item.weight + computeExtraWeight(item.resource, inputResource),
        };
      })
      .value();
    const selectedShip = pickRandom(weightMapped) || findConfigShipById(1000)!;
    user.addShip(selectedShip.id);
    if (user.id !== ADMIN_ID) {
      user.addResource(_.map(inputResource, (r) => (isNyk ? Math.round(-r * 1.1) : -r)));
    }
    logger.info(
      `建造结果 - ${user.id} [${inputResource.join(', ')}] ${selectedShip.name} ${isNyk} ${
        nyk.value
      }`,
    );
    const nykText = isNyk ? `奶一口${nyk.text}\n` : '';
    return `${nykText}舰娘${showShip(selectedShip.id)}加入了舰队~`;
  } catch (e) {
    return e.message as string;
  }
};

export default build;
