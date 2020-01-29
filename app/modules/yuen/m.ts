import path from "path";
import fs from "fs-extra";
import _ from "lodash";
import CQWebSocket from "cq-websocket";
import { MessageEventListener } from "typings/cq-websocket";

import Module from "../module";

export default class XiaoMModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    console.log(ctx.message);
    const imagePath = path.resolve(
      global.APP_PATH,
      "app",
      "modules",
      "assets",
      "pics",
      "xiaom"
    );
    const dirs = fs
      .readdirSync(imagePath)
      .filter(fName => fName.endsWith(".jpg"));
    const selected = dirs[_.random(dirs.length)];
    const repeatRandom = _.random(true);
    console.log("repeatRandom", repeatRandom);

    if (/小m|akiko|xm|秋子/gi.test(ctx.message) && repeatRandom > 0.45) {
      console.log(
        selected,
        imagePath,
        ctx.message,
        path.join(imagePath, selected)
      );
      return [
        {
          type: "image",
          data: {
            file: `${selected}`
          }
        }
      ];
    }
  };
}
