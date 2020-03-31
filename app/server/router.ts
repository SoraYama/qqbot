import Router from 'koa-router';
import userControllers from './controller/user';
import Application from 'koa';

const router = new Router();

export default (app: Application) => {
  router.get('/api/user', userControllers.getUser);
  router.post('/api/resource', userControllers.addResource);
  router.put('/api/resource', userControllers.setResource);
  router.put('/api/level', userControllers.setLevel);
  router.put('/api/user/ship', userControllers.setShipAmount);
  router.get('/api/order', userControllers.getOrder);
  router.del('/api/order', userControllers.deleteOrder);

  app.use(router.routes()).use(router.allowedMethods());
};
