import CQWebSocket from 'cq-websocket';

import Module from '../module';
import { MessageEventListener } from '../../../typings/cq-websocket';

export default class Misc extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    // YUEN
    if (ctx.sender?.user_id === 1091879579 && Math.random() > 0.95) {
      e.setMessage('YGNB');
    }
  };

  public onGroupAtMe: MessageEventListener = (e, ctx, cqTags) => {
    e.stopPropagation();
    if (ctx.sender?.user_id === 694692391) {
      const [atMeTag, commandTag, targetTag, paramsTag] = cqTags;
      console.log(atMeTag, commandTag, targetTag, paramsTag);
      if (
        targetTag?.tagName !== 'at' ||
        atMeTag?.tagName !== 'at' ||
        atMeTag?.data?.qq !== ctx.self_id
      ) {
        return;
      }
      const command = (commandTag.data.text as string).trim();
      const target = targetTag.data.qq;
      const param = (paramsTag.data.text as string).trim();
      // console.log(command, target, param);
      switch (command) {
        case 'ban':
          this.bot('set_group_ban', {
            group_id: ctx.group_id,
            user_id: target,
            duration: param,
          })
            .then((res) => console.log('禁言结果', res))
            .catch((err) => console.error('禁言出错', err));
          break;
        default:
          e.setMessage('mua');
          return;
      }
    }
    const rolled = Math.random();
    if (rolled > 0.5) {
      e.setMessage(['我被🐖', { type: 'at', data: { qq: ctx.user_id } }, '艾特了']);
    } else if (rolled < 0.15) {
      e.setMessage('mua');
    }
    if (/sb|口我|弱智/gi.test(ctx.message) || Math.random() < 0.1) {
      this.bot('set_group_ban', {
        group_id: ctx.group_id,
        user_id: ctx.sender?.user_id,
        duration: 60,
      })
        .then((res) => console.log('禁言结果', res))
        .catch((err) => console.error('禁言出错', err));
    }
  };
}
