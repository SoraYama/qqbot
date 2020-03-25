import _ from 'lodash';

import { showShip, showResource } from '../utils';
import User from '../store/user';
import { PREFIX, ACTIONS } from '../constants';

const me = (reply: (content: string) => void, user: User | null) => {
  if (!user) {
    reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
    return;
  }
  const ships = _.isEmpty(user.ships)
    ? '[暂无舰娘]'
    : _(user.ships)
        .sortBy('id')
        .map((s) => `${showShip(s.id)} × ${s.amount}`)
        .join('\n');
  const userSeceretaryStr = user.secretary ? showShip(user.secretary) : '空';

  const { userLevelInfo } = user;

  const infoMap = {
    镇守府等级: `${new Array(user.level)
      .fill('')
      .map(() => '★')
      .join('')}`,
    资源详情: showResource(user.resource),
    秘书舰: userSeceretaryStr,
    资源上限: userLevelInfo.limit,
    资源增长速度: `[${userLevelInfo.accumulateVelocity.join(', ')}]`,
    升级所需まるゆ数量:
      userLevelInfo.upgradeRequirement === null
        ? '已满级'
        : `${userLevelInfo.upgradeRequirement}个`,
    资源兑换手续费率: `${userLevelInfo.tradeTaxRate * 100}%`,
    舰队详情: ships,
  };
  reply(_.map(infoMap, (v, k) => `${k}:\n${v}`).join('\n\n'));
};

export default me;
