import axios from 'axios';
import CQWebSocket from 'cq-websocket';
import { GROUP_ID } from '../configs';

let lastAvatar = '';

interface AvatarResponse {
  latest: string;
}

const fetchAvatar = (bot: CQWebSocket) => async () => {
  try {
    const { data } = await axios.get<AvatarResponse>('http://api.kcwiki.moe/avatar/latest');
    if (lastAvatar !== data.latest) {
      lastAvatar = data.latest;
      bot('send_group_msg', {
        group_id: GROUP_ID,
        message: [
          {
            type: 'text',
            data: {
              text: '#最新官推头像\n',
            },
          },
          {
            type: 'image',
            data: {
              file: data.latest,
            },
          },
        ],
      })
        .then((res) => console.log(res))
        .catch((err) => console.log('图片发送失败', err));
    }
  } catch (e) {
    console.error(e);
  }
};

const staffAvatar = {
  time: '* * * * *',
  onTime: fetchAvatar,
};

export default staffAvatar;
