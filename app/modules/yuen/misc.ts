import _ from "lodash";
import CQWebSocket from "cq-websocket";
import { MessageEventListener } from "typings/cq-websocket";

import Module from "../module";

export default class Misc extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupAtMe: MessageEventListener = (e, ctx, cqTag) => {
    e.stopPropagation();
    e.setMessage([
      "我被🐖",
      { type: "at", data: { qq: ctx.user_id } },
      "艾特了"
    ]);
  };
}
