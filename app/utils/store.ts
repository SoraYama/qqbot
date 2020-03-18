import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Store {
  protected dbDir: string = path.join(global.APP_PATH, 'db');

  protected dbName = '';

  constructor(dbName: string) {
    this.dbName = dbName;
  }

  protected get dbPath() {
    return path.join(this.dbDir, this.dbName);
  }
}

export default Store;
