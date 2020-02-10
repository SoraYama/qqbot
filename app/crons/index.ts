import { map } from 'lodash';
import CQWebSocket from 'cq-websocket';
import { CronJob, CronCommand } from 'cron';

import practice from './practice';
import mtsxqy from './mtsxqy';

export interface Cron {
  time: string;
  onTime: (bot: CQWebSocket) => CronCommand;
}

const list = map([practice, mtsxqy], (cron: Cron) => (bot: CQWebSocket) =>
  new CronJob(cron.time, cron.onTime(bot), undefined, true, 'Asia/Tokyo'),
);

export default list;
