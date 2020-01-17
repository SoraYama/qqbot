import Koa from "koa";
import path from "path";
import koaStatic from "koa-static";

const app = new Koa();

const staticPath = "./app/statics";

const main = () => {
  app.use(koaStatic(path.join(__dirname, staticPath)));

  app.listen(2020, () => {
    console.log("static-use-middleware is starting at port 2020");
  });
};

export default main;
