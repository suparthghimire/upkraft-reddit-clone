import express, {
  type Router,
  type Express,
  type Request,
  type RequestHandler,
  type Response,
  type NextFunction,
} from 'express';
import { ErrorHandler } from './error/handler.js';
import { sendResponse } from './response/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '../lib/env.schema.js';
export class CustomServer {
  public app: Express;
  private jsonBodyParser: RequestHandler = express.json();

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

  stripeRawBodyVerification() {
    this.jsonBodyParser = express.json({
      verify: (req, res, rawBody) => {
        if (req.url?.split('?')[0] === '/api/v1/stripe/webhook') {
          (res as Response).locals.stripeRawBody = rawBody;
        }
      },
    });

    return this;
  }

  registerRequiredMiddlewares() {
    this.app.use(
      cors({
        origin: env.WHITE_LISTED_FE_ORIGINS,
        credentials: true,
      }),
    );
    this.app.use(cookieParser());

    this.app.use(this.jsonBodyParser);

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
    this.app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
      const handledError = new ErrorHandler(err);
      console.log(err);
      const responsePayload = handledError.handle();
      return sendResponse({
        res,
        ...responsePayload,
      });
    });
    return this;
  }
}
