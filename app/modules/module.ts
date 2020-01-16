import CQWebSocket, {
  InvalidContextError,
  UnexpectedContextError
} from "cq-websocket";
import path from "path";
import fs from "fs-extra";
import { MessageEventListener } from "typings/cq-websocket";

class Module {
  public bot: CQWebSocket;

  public messageJson: { [key: string]: string };

  protected assetsPath = path.resolve(__dirname, "./assets");

  constructor(bot: CQWebSocket) {
    this.bot = bot;
    const messagePath = path.resolve(this.assetsPath, "message.json");
    this.messageJson = fs.readJSONSync(messagePath);
  }

  init() {
    this.bot.on("message", this.onMessage);
    this.bot.on("message.group", this.onGroupMessage);
    this.bot.on("error", this.onError);
  }

  public onMessage: MessageEventListener = (_, ctx) => {
    console.log("on message", ctx.message, ctx.user_id);
  };

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    e.stopPropagation();
    console.log("on group message", ctx.message, ctx.user_id);
  };

  public onError = (err: InvalidContextError | UnexpectedContextError) => {
    console.error(err);
  };
}

export default Module;
