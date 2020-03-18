import fs from 'fs-extra';
import path from 'path';
import _ from 'lodash';
// import User from '../app/modules/kancolle/mini/store/user';

const dbPath = path.resolve(__dirname, '..', 'db', 'mini.json');

const main = async () => {
  const data = await fs.readJson(dbPath);
  data.users = _.mapValues(data.users, (user) => ({
    ...user,
    ships: _(user.ships)
      .groupBy('id')
      .map((item) =>
        item.reduce((p, c) => ({
          ...p,
          amount: p.amount + c.amount,
        })),
      )
      .flatten()
      .value(),
  }));
  await fs.writeJson(dbPath, data);
};

main();
