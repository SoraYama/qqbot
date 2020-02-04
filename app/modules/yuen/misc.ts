import _ from "lodash";
import CQWebSocket from "cq-websocket";

import Module from "../module";
import { MessageEventListener } from "../../../typings/cq-websocket";

export default class Misc extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    if (ctx.sender?.user_id === 1091879579 && Math.random() > 0.6) {
      e.setMessage("YGNB");
    }
  };

  public onGroupAtMe: MessageEventListener = (e, ctx, cqTag) => {
    e.stopPropagation();
    if (Math.random() > 0.6) {
      e.setMessage([
        "我被🐖",
        { type: "at", data: { qq: ctx.user_id } },
        "艾特了"
      ]);
    }
  };
}
