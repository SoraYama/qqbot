import _ from 'lodash';

import pickRandom from '../../../../utils/pickRandom';
import User from '../store/user';
import { LEAST_RESOURCE, BUILD_RESOURCE_MAX, logger } from '../constants';
import { showResource, computeExtraWeight, showShip } from '../utils';
import groupConfig from '../assets/build-group';
import shipsConfig from '../assets/ships';
import { ADMIN_ID } from '../../../../configs';

const build = (resourceString: string[] = [], user: User) => {
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
      console.log(item.name, item.weight, computeExtraWeight(item.resource, inputResource));
      return {
        ...item,
        weight: item.weight + computeExtraWeight(item.resource, inputResource),
      };
    })
    .value();
  const selectedShip = pickRandom(weightMapped);
  if (!selectedShip) {
    logger.warn(
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
  user.addShip(selectedShip.id);
  if (user.id !== ADMIN_ID) {
    console.log(user.id, ADMIN_ID);
    user.addResource(_.map(inputResource, (r) => -r));
  }
  logger.info(`建造结果 - ${user.id} [${inputResource.join(', ')}] ${selectedShip.name}`);
  return `舰娘${showShip(selectedShip.id)}加入了舰队~`;
};

export default build;
