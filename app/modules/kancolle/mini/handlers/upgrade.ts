import { PREFIX, ACTIONS, MAX_HOME_LEVEL } from '../constants';
import User from '../store/user';

const upgrade = (params: string[], reply: (content: string) => void, user: User | null) => {
  if (!user) {
    reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
    return;
  }
  const { userLevelInfo } = user;
  if (!userLevelInfo) {
    reply(`啊哦你的镇守府出问题了, 请联系空山`);
    return;
  }
  const userMaruyu = user.getShipById(1000);
  if (!userLevelInfo.upgradeRequirement) {
    reply(`镇守府已到达最高等级啦`);
    return;
  }
  if (!userMaruyu || userMaruyu.amount < userLevelInfo.upgradeRequirement) {
    reply(`马路油数量不足哦 (${userMaruyu?.amount || 0}/${userLevelInfo.upgradeRequirement})`);
    return;
  }
  if (userMaruyu.amount === userLevelInfo.upgradeRequirement && user.secretary === 1000) {
    reply(`不能拆除作为秘书舰的まるゆ哦~ 请先将秘书舰换成别人`);
    return;
  }
  if (user.level >= MAX_HOME_LEVEL) {
    reply(`镇守府已到达最高等级啦`);
    return;
  }
  try {
    user.dropShip(1000, userLevelInfo.upgradeRequirement);
    user.upgrade();
  } catch (e) {
    reply(e.message);
    return;
  }
  reply(`镇守府升级啦, 当前等级为 ${user.level}级`);
};

export default upgrade;
