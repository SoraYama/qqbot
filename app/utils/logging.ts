import log4js from 'log4js';
import path from 'path';

const Logging = log4js.configure({
  appenders: {
    mini: {
      type: 'dateFile',
      filename: path.resolve(global.APP_PATH, 'logs', 'mini.log'),
      pattern: 'yyyy_MM_dd',
      keepFileExt: true,
    },
    console: { type: 'stdout' },
    error: { type: 'file', filename: path.resolve(global.APP_PATH, 'logs', 'mini_error.log') },
  },
  categories: {
    default: {
      appenders: ['mini', 'error'],
      level: 'info',
    },
    mini: {
      appenders: ['mini'],
      level: 'info',
    },
    error: {
      appenders: ['error'],
      level: 'error',
    },
  },
});

export default Logging;
