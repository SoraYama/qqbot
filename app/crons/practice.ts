import { CronJob } from "cron";
import _ from "lodash";
import CQWebSocket from "cq-websocket";
import pickOne from "../utils/pick";

const names = ["水虹", "小m", "阿远", "Luka", "固拉多", "沛沛"];

const practice = (bot: CQWebSocket) =>
  new CronJob(
    "30 14,2 * * *",
    () => {
      bot("send_group_msg", {
        group_id: 915378511,
        // group_id: 956475298, // 小群
        message: `${pickOne(names)}提醒您演习将在半小时后刷新（<ゝω・）☆`
      })
        .then(res => console.log(res))
        .catch(e => console.error(e));
    },
    undefined,
    true,
    "Asia/Tokyo"
  );

export default practice;
