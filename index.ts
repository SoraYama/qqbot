global.APP_PATH = __dirname;

import { CQWebSocket } from "cq-websocket";
import { CronJob } from "cron";

import RepeatModule from "./app/modules/yuen/repeat";
import ItemImprovementModule from "./app/modules/kancolle/item-improvement";
import XiaoMModule from "./app/modules/yuen/m";
import Misc from "./app/modules/yuen/misc";

const bot = new CQWebSocket({
  qq: 2464375668,
  reconnection: true,
  reconnectionAttempts: 10,
  host: "62.234.116.168",
  port: 6700
});

bot.connect();

bot
  .on("socket.connecting", function(socketType, attempts) {
    console.log("嘗試第 %d 次連線 _(:з」∠)_", attempts);
  })
  .on("socket.connect", function(socketType, sock, attempts) {
    console.log("第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ", attempts);
  })
  .on("socket.failed", function(socketType, attempts) {
    console.log("第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･", attempts);
  });

const loadModules = () => {
  new RepeatModule(bot);
  new ItemImprovementModule(bot);
  new XiaoMModule(bot);
  new Misc(bot);
};

const doCrons = () => {
  const jobs = [
    new CronJob(
      "30 14,2 * * *",
      () => {
        bot("send_group_msg", {
          group_id: 915378511,
          message: "水虹提醒您演习将在半小时后刷新（<ゝω・）☆"
        });
      },
      undefined,
      true,
      "Asia/Tokyo"
    )
  ];
  jobs.forEach(job => job.start());
};

bot.on("ready", () => {
  loadModules();
  doCrons();
});
