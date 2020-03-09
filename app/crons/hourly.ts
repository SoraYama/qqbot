import CQWebSocket from 'cq-websocket';
import axios from 'axios';

import { GROUP_ID, getVoiceAPI } from '../configs';
import pickOne from '../utils/pick';

interface StringRecord {
  [key: string]: string;
}

interface VoiceResponse {
  url: StringRecord;
  shipId: number;
  shipName: string;
  jp: StringRecord;
  zh: StringRecord;
  filename: string;
}

const KanMusuList = [
  144, // 夕立
  148, // 武藏
  234, // 晓
];

const hourly = {
  time: '0 * * * *',
  onTime: (bot: CQWebSocket) => () => {
    const now = new Date();
    const h = now.getHours();

    axios
      .get<VoiceResponse>(getVoiceAPI(pickOne(KanMusuList)))
      .then(({ data }) => {
        const { url } = data;
        const voiceUrl = url[`${h + 30}`];
        if (voiceUrl) {
          bot('send_group_msg', {
            group_id: GROUP_ID,
            message: {
              type: 'record',
              data: {
                file: voiceUrl,
              },
            },
          })
            .then((res) => console.log(res))
            .catch((e) => console.error(e));
        }
      })
      .catch((e) => console.error(e));
  },
};

export default hourly;
