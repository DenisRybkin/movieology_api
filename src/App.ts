import express, { Application, Router } from 'express';
import cors from 'cors';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
//config
import { config, IConfig } from './config';
import { MiddlewareType } from './types/middleware.type';
import * as path from 'path';

export class App {
  private static _instance: App;
  private _app: Application;

  private constructor(private readonly _config: IConfig = config) {
    this.initApplication();
  }

  public static createInstance(config: IConfig): App {
    return (this._instance = new this(config));
  }

  private initApplication(): void {
    this._app = express();
    this._app.use(cors());
    this._app.use(express.json());
    this._app.use(logger());
    this._app.use(cookieParser());
    this._app.use((req, res, next) => {
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
      // @ts-ignore
      res.setHeader('Access-Control-Allow-Credentials', true);
      next();
    });
    this._app.set('views', path.join(__dirname, 'views'));
  }

  public start(cb?: Function): void {
    this._app.listen(this._config.PORT, async () => {
      console.log(`server started at http://localhost:${this._config.PORT}`);
      cb && cb();
    });
  }

  public initRouters(routers: Router[]): void {
    routers.forEach(router => this._app.use(this._config.API_PREFIX, router));
  }

  public initMiddlewares(middlewares: MiddlewareType[]): void {
    middlewares.forEach(middleware => this._app.use(middleware));
  }
}