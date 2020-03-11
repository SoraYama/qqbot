import path from 'path';
import { observable } from 'mobx';
import fs from 'fs-extra';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Store<T = any> {
  @observable
  public data: T | null;

  protected dbDir: string = path.join(global.APP_PATH, 'db');

  protected dbName = '';

  constructor(dbName: string, initData?: T) {
    this.dbName = dbName;
    this.readData(initData);
  }

  public readData(initData?: T) {
    if (fs.existsSync(this.dbPath)) {
      this.data = fs.readJSONSync(this.dbPath);
    } else {
      this.data = initData || null;
      fs.outputJSONSync(this.dbPath, initData || {});
    }
  }

  protected get dbPath() {
    return path.join(this.dbDir, this.dbName);
  }

  public async syncData() {
    await fs.outputJSON(this.dbPath, this.data);
  }
}

export default Store;
