import CQWebSocket from 'cq-websocket';

import pickOne from '../utils/pick';
import { GROUP_ID, nameList } from '../configs';

const practice = {
  time: '30 14,2 * * *',
  onTime: (bot: CQWebSocket) => () => {
    bot('send_group_msg', {
      group_id: GROUP_ID,
      // group_id: 956475298, // 小群
      message: `${pickOne(nameList)}提醒您演习将在30分钟后刷新（<ゝω・）☆`,
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  },
};

export default practice;
