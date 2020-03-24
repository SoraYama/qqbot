import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';
import cors from '@koa/cors';

import router from './router';

const app = new Koa();

const startMiniKancolleServer = () => {
  app.use(koaStatic(path.resolve(global.APP_PATH, 'views', 'build')));
  app.use(bodyParser());
  app.use(cors());

  router(app);

  const PORT = 1551;

  app.listen(PORT, () => {
    console.log(`Mini Kancolle RMS Server is running on ${PORT}`);
  });
};

export default startMiniKancolleServer;
