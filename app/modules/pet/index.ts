import CQWebSocket from 'cq-websocket';
import moment from 'moment';
import _ from 'lodash';

import Module from '../module';
import { MessageEventListener } from '../../../typings/cq-websocket';
import writer from './writer';
import strip from '../../utils/strip';

const triggerMap = {
  feed: 'feed',
  info: 'info',
  me: 'me',
  help: 'help',
};

type ActionTypes = keyof typeof triggerMap;

const TRIGGER_PREFIX = '/pet';
const FEED_STEP = 0.01;
const FEED_DAILY_MAX = 10;
const FEED_INTERVAL_MIN = 1;

export default class PetModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  onGroupMessage: MessageEventListener = async (e, ctx) => {
    const feedTrigger = this.getTrigger('feed');
    const infoTrigger = this.getTrigger('info');
    const helpTrigger = this.getTrigger('help');
    const myFeedingTrigger = this.getTrigger('me');

    const data = await writer.readFile();
    const curUser = data.user[ctx.sender?.user_id];
    const today = moment().format('YYYY-MM-DD');
    const now = new Date().getTime();
    const atSender = { type: 'at', data: { qq: ctx.user_id } };

    const reply = (content: string) => {
      e.setMessage([atSender, '\n', content]);
    };

    const feed = async () => {
      data.pet.weight = strip(FEED_STEP + data.pet.weight);
      await writer.syncFile(data);
      reply(`已投喂, 🐇很开心\n当前体重为${data.pet.weight}kg`);
    };

    switch (ctx.message) {
      case feedTrigger: {
        const user = data.user[ctx.sender?.user_id];
        if (!user) {
          data.user[ctx.sender?.user_id] = {
            feedRecord: {
              [today]: [new Date().getTime()],
            },
            feedTotal: FEED_STEP,
          };
          await feed();
        } else {
          const { feedRecord } = user;
          const todayFed = feedRecord[today];
          if (todayFed.length >= FEED_DAILY_MAX) {
            reply('今天投喂次数达到上限了哦');
            return;
          } else if (moment().hour() - moment(_.last(todayFed)).hour() < FEED_INTERVAL_MIN) {
            reply('投喂冷却中...');
            return;
          }
          if (!todayFed) {
            feedRecord[today] = [now];
          } else {
            todayFed.push(now);
          }
          user.feedTotal = strip(FEED_STEP + user.feedTotal);
          await feed();
        }
        return;
      }
      case infoTrigger: {
        reply(`🐇现在有${data.pet.weight}kg重`);
        return;
      }
      case TRIGGER_PREFIX:
      case helpTrigger: {
        reply(`宠物: 🐇\n用法: ${TRIGGER_PREFIX} ${_.keys(triggerMap).join('|')}`);
        return;
      }
      case myFeedingTrigger: {
        if (!curUser) {
          reply(`你还没有投喂过哦`);
          return;
        }
        const todayFedAmount = curUser.feedRecord[today].length;
        const totalFed = curUser.feedTotal;
        reply(`你今天投喂了${todayFedAmount}次\n总共投喂了${totalFed}kg`);
        return;
      }
      default: {
        if ((ctx.message as string).startsWith(TRIGGER_PREFIX)) {
          reply('不能识别的指令');
        }
        return;
      }
    }
  };

  getTrigger(action: ActionTypes) {
    return `${TRIGGER_PREFIX} ${triggerMap[action]}`.trim();
  }
}
