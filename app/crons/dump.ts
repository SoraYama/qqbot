import fs from 'fs-extra';
import path from 'path';
import moment from 'moment';

const dbDirPath = path.resolve(global.APP_PATH, 'db');
const miniPath = path.resolve(dbDirPath, 'mini.json');

const dump = {
  time: '0 2,14 * * *',
  onTime: () => () => {
    const dateStr = moment().format('YYYY_MM_DD_HH_mm_ss');
    fs.copySync(miniPath, path.resolve(dbDirPath, `mini_${dateStr}.json`));
  },
};

export default dump;
