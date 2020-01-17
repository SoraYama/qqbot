import _ from "lodash";
import fp from "lodash/fp";
import CQWebSocket from "cq-websocket";

import wctf from "../store/wctf";
import Module from "../../module";
import { MessageEventListener } from "typings/cq-websocket";

export default class ItemImprovementModule extends Module {
  constructor(bot: CQWebSocket) {
    super(bot);
    this.init();
    // console.log(this.idByDay);
  }

  public onGroupMessage: MessageEventListener = (e, ctx) => {};

  private get idByDay() {
    const db = wctf.data;
    return _(_.get(db, "arsenal_weekday"))
      .mapValues(day =>
        _(day.improvements)
          .map(([id]) => id)
          .map(wctf.getItemById)
          .filter(i => !!i)
          .map(ship => ship?.name.zh_cn)
          .value()
      )
      .value();
  }
}
