import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';

const dbPath = path.resolve(__dirname, '..', 'db', 'mini.json');

const main = async () => {
  const data = await fs.readJson(dbPath);
  data.users = _.mapValues(data.users, (user) => ({
    ...user,
    level: 1,
  }));
  await fs.writeJson(dbPath, data);
};

main();
