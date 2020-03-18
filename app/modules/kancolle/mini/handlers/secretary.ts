import { PREFIX, ACTIONS } from '../constants';
import User from '../store/user';
import { showShip } from '../utils';

const setSecretary = (params: string[], reply: (content: string) => void, user: User | null) => {
  if (!user) {
    reply(`还未建立角色哦, 请输入 ${PREFIX} ${ACTIONS.start} 来开始`);
    return;
  }
  const [inputSeceretary] = params;
  if (!inputSeceretary) {
    if (!user.secretary) {
      reply(`你现在还没有设置秘书舰`);
      return;
    }
    reply(`你现在的秘书舰为: ${showShip(user.secretary)}`);
    return;
  }
  if (inputSeceretary === 'null') {
    user.setSecretary(null);
    reply(`秘书舰已置空`);
    return;
  }
  try {
    user.setSecretary(+inputSeceretary);
    reply(`设置成功, 你现在的秘书舰为${showShip(+inputSeceretary)}`);
  } catch (e) {
    reply(e.message);
  }
};

export default setSecretary;
