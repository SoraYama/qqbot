import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import koaStatic from 'koa-static';
import path from 'path';
import cors from '@koa/cors';

import router from './router';

const app = new Koa();

const startMiniKancolleServer = () => {
  app.use(bodyParser());
  app.use(cors());
  app.use(
    koaStatic(path.resolve(global.APP_PATH, 'views', 'build'), {
      setHeaders(res) {
        res.setHeader('Cache-Control', 'private');
      },
      gzip: true,
    }),
  );

  router(app);

  const PORT = 1551;

  app.listen(PORT, () => {
    console.log(`Mini Kancolle RMS Server is running on ${PORT}`);
  });
};

export default startMiniKancolleServer;
