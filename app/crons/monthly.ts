import CQWebSocket from 'cq-websocket';

import { GROUP_ID, nameList } from '../configs';
import pickOne from '../utils/pick';

const monthly = {
  time: '0 11,19 28-31 * *',
  onTime: (bot: CQWebSocket) => () => {
    const now = new Date();
    const lastDateOfThisMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const isLastDayOfMonth = now.getDate() === lastDateOfThisMonth.getDate();
    if (isLastDayOfMonth) {
      bot('send_group_msg', {
        group_id: GROUP_ID,
        message: `${pickOne(nameList)}提醒您EO图将在${23 - now.getHours()}小时后刷新（<ゝω・）☆`,
      })
        .then((res) => console.log(res))
        .catch((e) => console.error(e));
    }
  },
};

export default monthly;
