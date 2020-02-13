import CQWebSocket from 'cq-websocket';

import { GROUP_ID, nameList } from '../configs';
import pickOne from '../utils/pick';

const daily = {
  time: '0 4 * * *',
  onTime: (bot: CQWebSocket) => () => {
    bot('send_group_msg', {
      group_id: GROUP_ID,
      message: `${pickOne(nameList)}提醒您日常${
        new Date().getDay() === 0 ? '(和周常)' : ''
      }将在1小时后刷新（<ゝω・）☆`,
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  },
};

export default daily;
