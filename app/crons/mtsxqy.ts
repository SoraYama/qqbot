import CQWebSocket from 'cq-websocket';
import { GROUP_ID } from '../configs';

const mtsxqy = {
  time: '0 0,18,20 * * 0',
  onTime: (bot: CQWebSocket) => () => {
    bot('send_group_msg', {
      group_id: GROUP_ID,
      // group_id: 956475298, // 小群
      message: `mtsxqy`,
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
  },
};

export default mtsxqy;
