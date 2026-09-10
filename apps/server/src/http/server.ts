import express, { type Router, type Express, type Request, type Response } from 'express';
import { ErrorHandler } from './error/handler.js';
import { sendResponse } from './response/index.js';

export class CustomServer {
  public app: Express;

  constructor() {
    this.app = express();
    return this;
  }

  startServer() {
    this.app.listen(5005, () => {
      console.log(`Server is running on port ${5005}`);
    });
    return this;
  }

  regsiterRequiredMiddlewares() {
    this.app.use(express.json());
    return this;
  }

  registerHealthCheckRoute() {
    this.app.get('/', (req, res) => {
      res.redirect('/health');
    });

    this.app.get('/health', (req, res) => {
      res.send('OK');
    });
    return this;
  }

  registerModuleRouter(version: string, prefix: string, router: Router) {
    this.app.use(`/api/${version}/${prefix}`, router);
    return this;
  }

  registerRequestErrorHandler() {
    this.app.use((err: unknown, req: Request, res: Response) => {
      const handledError = new ErrorHandler(err);
      const responsePayload = handledError.handle();
      return sendResponse({
        res,
        ...responsePayload,
      });
    });
    return this;
  }
}
