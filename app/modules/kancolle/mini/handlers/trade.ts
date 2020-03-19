import _ from 'lodash';

import User from '../store/user';
import { PREFIX, ACTIONS, ResourceType, RESOURCE_NAMES, logger } from '../constants';
import { showShip } from '../utils';
import store from '../store';
import strip from '../../../../utils/strip';

const trade = (params: string[], reply: (content: string) => void, user: User | null) => {
  if (!user) {
    reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
    return;
  }
  if (user.secretary !== 1034) {
    reply(`需要${showShip(1034)}作为旗舰哦`);
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

  const tradeRate = store.getTradeRate(sourceType);
  const { userLevelInfo } = user;
  const targetAmount = Math.round(
    strip(sourceAmount * tradeRate[targetType - 1] * (1 - userLevelInfo.tradeTaxRate), 2),
  );
  const toCalcResource = [0, 0, 0, 0];
  toCalcResource[targetType - 1] = targetAmount;
  toCalcResource[sourceType - 1] = -sourceAmount;
  user.addResource(toCalcResource);
  logger.info(
    `交易结果 - ${user.id} ${sourceType} ${targetType} [${tradeRate.join(
      ', ',
    )}] ${sourceAmount} ${targetAmount}`,
  );
  reply(
    `明老板很开心, 收下了你的${sourceAmount}${
      RESOURCE_NAMES[sourceType - 1]
    } 并给你了 ${targetAmount}${RESOURCE_NAMES[targetType - 1]}${
      userLevelInfo.tradeTaxRate === 0
        ? ''
        : `\n(顺便一提明老板收取了${sourceAmount * userLevelInfo.tradeTaxRate}${
            RESOURCE_NAMES[sourceType - 1]
          } 作为手续费~)`
    }`,
  );
};

export default trade;
