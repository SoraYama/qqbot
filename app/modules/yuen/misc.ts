import path from "path";
import fs from "fs-extra";
import _ from "lodash";
import CQWebSocket from "cq-websocket";
import { MessageEventListener } from "typings/cq-websocket";

import Module from "../module";

export default class Misc extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    console.log(ctx.message)
  }
}
