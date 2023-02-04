import { Router } from 'express';
//config
import { config } from './config';
//routers
import { App } from './App';
import { streamRouter } from './modules/stream/stream.router';
import { contentRouter } from './modules/content/content.router';
import { MiddlewareType } from './types/middleware.type';
import { handlerApiErrorMiddleware } from './middlewares/handler-api-error.middleware';

(() => {
  const app = App.createInstance(config);
  const routers: Router[] = [streamRouter, contentRouter];
  const middlewares: MiddlewareType[] = [handlerApiErrorMiddleware];
  app.initRouters(routers);
  app.initMiddlewares(middlewares);
  app.start(() => console.log('Go Go Go'));
})();