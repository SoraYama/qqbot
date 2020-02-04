import _ from "lodash";
import CQWebSocket from "cq-websocket";

import wctf from "../store/wctf";
import Module from "../../module";
import { MessageEventListener } from "../../../../typings/cq-websocket";

const getJSTDayofWeek = () => {
  const date = new Date();
  let day = date.getUTCDay();
  if (date.getUTCHours() >= 15) {
    day = (day + 1) % 7;
  }
  return day;
};

export default class ItemImprovementModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
    // console.log(this.todayItems);
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {
    if (ctx.message.includes("今日改修")) {
      e.setMessage(_.map(this.todayItems, (v, k) => `${k}:\n${v}\n\n`));
    }
  };

  private get todayItems() {
    const todayItems = this.itemByDay[getJSTDayofWeek()];
    return _(todayItems)
      .groupBy(item => item.type)
      .mapKeys((_, key) => wctf.data.item_types[key].name.ja_jp)
      .mapValues(items =>
        _.map(items, item => {
          const name = item.name.ja_jp;
          const secretarys = _(item.improvement)
            .map(i => i.req)
            .map(req =>
              _(req)
                .filter(([availableDays]) => !!availableDays[getJSTDayofWeek()])
                .map(([a, secIds]) =>
                  _(secIds)
                    .map(id => wctf.getShipById(id).name.ja_jp)
                    .value()
                )
                .value()
            )
            .flattenDeep()
            .uniq()
            .value()
            .join(", ");
          return `${name}【${secretarys}】`;
        }).join("  ")
      )
      .value();
  }

  private get itemByDay() {
    const db = wctf.data;
    return _(_.get(db, "arsenal_weekday"))
      .mapValues(day =>
        _(day.improvements)
          .map(([id]) => id)
          .map(wctf.getItemById)
          .filter(i => !!i)
          .value()
      )
      .value();
  }
}
