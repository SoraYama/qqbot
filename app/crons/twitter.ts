import axios from 'axios';
import CQWebSocket from 'cq-websocket';

import { GROUP_ID } from '../configs';

let lastTimestamp = new Date().getTime();

interface KcwikiTwitter {
  jp: string;
  zh: string;
  img: string;
  id: number;
  date: string;
}

const fetchTwitter = (bot: CQWebSocket) => async () => {
  const { data } = await axios.get<Array<KcwikiTwitter>>('http://api.kcwiki.moe/tweet/1');
  const lastTweet = data[0];
  if (new Date(lastTweet.date).getTime() > lastTimestamp) {
    const tweet = lastTweet.jp.replace(/<.*?>/g, '');
    bot('send_group_msg', {
      group_id: GROUP_ID,
      // group_id: TEST_GROUP_ID, // 小群
      message: `「Twitter」\n${tweet}\n${lastTweet.date} #艦これ`,
    })
      .then((res) => console.log(res))
      .catch((e) => console.error(e));
    lastTimestamp = new Date(lastTweet.date).getTime();
  }
};

const twitter = {
  time: '* * * * *',
  onTime: fetchTwitter,
};

export default twitter;
