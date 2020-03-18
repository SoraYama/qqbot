import _ from 'lodash';

import { ACTIONS, PREFIX } from '../constants';
import helpText from '../assets/help';

const help = (params: string[], reply: (content: string) => void) => {
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
};

export default help;
