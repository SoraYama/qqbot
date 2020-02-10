import path from 'path';
import PromiseB from 'bluebird';
import glob from 'glob';
import fs from 'fs-extra';
import _ from 'lodash';

const DB_FILE_PATH = path.resolve(
  global.APP_PATH,
  'node_modules',
  'whocallsthefleet-database',
  'db',
);

const DB_KEY = {
  arsenal_all: 'id',
  arsenal_weekday: 'weekday',
  item_type_collections: 'id',
  item_types: 'id',
  items: 'id',
  ship_classes: 'id',
  ship_type_collections: 'id',
  ship_types: 'id',
  ships: 'id',
  ship_namesuffix: 'id',
};

class WCTF {
  constructor() {
    this.parseData();
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public data: any = {};

  private parseData = async () => {
    try {
      await PromiseB.map(glob.sync(`${DB_FILE_PATH}/*.nedb`), async (dbPath) => {
        const dbName = path.basename(dbPath, '.nedb') as keyof typeof DB_KEY;
        if (!(dbName in DB_KEY)) {
          return;
        }
        const buf = await fs.readFile(dbPath);
        const entries = buf
          .toString()
          .split('\n')
          .filter(Boolean);
        this.data[dbName] = _(entries)
          .map((content) => JSON.parse(content))
          .keyBy(DB_KEY[dbName])
          .value();
      });
    } catch (e) {
      console.error(e.stack);
      return;
    }
  };

  public getShipById = (id: number) => {
    return _.get(this.data, `ships[${id}]`);
  };

  public getItemById = (id: number) => {
    return _.get(this.data, `items[${id}]`);
  };
}

export default new WCTF();
