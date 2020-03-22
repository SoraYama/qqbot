import Router from 'koa-router';
import userControllers from './controller/user';
import Application from 'koa';

const router = new Router();

export default (app: Application) => {
  router.get('/user', userControllers.getUser);
  router.post('/resource', userControllers.addResource);

  app.use(router.routes()).use(router.allowedMethods());
};
