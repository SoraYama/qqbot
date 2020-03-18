import log4js from 'log4js';
import path from 'path';

const logger = log4js.configure({
  appenders: {
    mini: { type: 'file', filename: path.resolve(global.APP_PATH, 'logs', 'mini.log') },
    console: { type: 'stdout' },
    error: { type: 'file', filename: path.resolve(global.APP_PATH, 'logs', 'mini.log') },
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

export default logger;
