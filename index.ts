global.APP_PATH = __dirname;

import { CQWebSocket } from 'cq-websocket';
import dotenv from 'dotenv';

import crons from './app/crons';
import RepeatModule from './app/modules/yuen/repeat';
import ItemImprovementModule from './app/modules/kancolle/item-improvement';
import XiaoMModule from './app/modules/yuen/m';
import Misc from './app/modules/yuen/misc';
import PetModule from './app/modules/pet';
import MiniKancolleModule from './app/modules/kancolle/mini';

const envs = dotenv.config();

if (envs.error) {
  throw envs.error;
}

const bot = new CQWebSocket({
  qq: +process.env.QQ!,
  reconnection: true,
  reconnectionAttempts: 10,
  host: process.env.COOLQ_HOST,
  port: +process.env.COOLQ_PORT!,
});

bot.connect();

bot
  .on('socket.connecting', function(socketType, attempts) {
    console.log('嘗試第 %d 次連線 _(:з」∠)_', attempts);
  })
  .on('socket.connect', function(socketType, sock, attempts) {
    console.log('第 %d 次連線嘗試成功 ヽ(✿ﾟ▽ﾟ)ノ', attempts);
  })
  .on('socket.failed', function(socketType, attempts) {
    console.log('第 %d 次連線嘗試失敗 。･ﾟ･(つд`ﾟ)･ﾟ･', attempts);
  })
  .on('socket.error', function(...args) {
    console.error('[ERROR] ', ...args);
  });

const loadModules = () => {
  new RepeatModule(bot);
  new ItemImprovementModule(bot);
  new XiaoMModule(bot);
  new Misc(bot);
  new PetModule(bot);
  new MiniKancolleModule(bot);
};

const doCrons = () => {
  crons.forEach((getCron) => getCron(bot).start());
};

bot.on('ready', () => {
  loadModules();
  doCrons();
});
