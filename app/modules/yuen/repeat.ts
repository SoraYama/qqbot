import Module from "../module";
import { MessageEventListener } from "typings/cq-websocket";
import CQWebSocket from "cq-websocket";

class RepeatModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    this.messageQueue.push(ctx.message);
    if (ctx.message === this.messageQueue[this.messageQueue.length - 1]) {
      if (this.checkAndResetQueue()) {
        e.setMessage(ctx.message);
      }
    }
  };

  private messageQueue: string[] = [];

  private checkAndResetQueue() {
    if (this.messageQueue.length > 2) {
      this.messageQueue = [];
      return true;
    }
    return false;
  }
}

export default RepeatModule;
