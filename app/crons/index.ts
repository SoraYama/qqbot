import { map } from 'lodash';
import CQWebSocket from 'cq-websocket';
import { CronJob, CronCommand } from 'cron';

// import practice from './practice';
// import mtsxqy from './mtsxqy';
// import hourly from './hourly';
// import daily from './daily';
// import monthly from './monthly';
// import staffAvatar from './staffAvatar';
import twitter from './twitter';
import dump from './dump';

export interface Cron {
  time: string;
  onTime: (bot: CQWebSocket) => CronCommand;
}

const list = map(
  // [practice, mtsxqy, hourly, daily, monthly, twitter, staffAvatar, dump],
  [twitter, dump],
  (cron: Cron) => (bot: CQWebSocket) =>
    new CronJob(cron.time, cron.onTime(bot), undefined, true, 'Asia/Tokyo'),
);

export default list;
