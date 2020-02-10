import CQWebSocket from 'cq-websocket';

import Module from '../module';
import { MessageEventListener } from '../../../typings/cq-websocket';

class RepeatModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    if (this.messageQueue.length <= 0) {
      this.messageQueue.push(ctx.message);
    } else if (ctx.message !== this.messageQueue[this.messageQueue.length - 1]) {
      this.resetQueue();
    } else {
      this.messageQueue.push(ctx.message);
      if (this.messageQueue.length >= 2) {
        e.setMessage(ctx.message);
        this.resetQueue();
      }
    }
  };

  private messageQueue: string[] = [];

  private resetQueue() {
    this.messageQueue = [];
  }
}

export default RepeatModule;
