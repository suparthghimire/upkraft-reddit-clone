import express, {
  type Router,
  type Express,
  type Request,
  type Response,
  type NextFunction,
} from 'express';
import { ErrorHandler } from './error/handler.js';
import { sendResponse } from './response/index.js';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from '../lib/env.schema.js';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import { dbInstance } from '../db/connection.js';
import path from 'node:path';
export class CustomServer {
  public app: Express;

  constructor() {
    this.app = express();
    return this;
  }

  async performMigration() {
    const migrationFolderDirectory = path.join(process.cwd(), 'drizzle');
    try {
      console.log('Starting migration...');
      await migrate(dbInstance, {
        migrationsFolder: migrationFolderDirectory,
      });
      console.log('Migration completed successfully.');
      return this;
    } catch (error) {
      console.error('Migration failed:', error);
      throw error;
    }
  }

  startServer() {
    this.app.listen(5005, () => {
      console.log(`Server is running on port ${5005}`);
    });
    return this;
  }

  regsiterRequiredMiddlewares() {
    this.app.use(
      cors({
        origin: env.WHITE_LISTED_FE_ORIGINS,
        credentials: true,
      }),
    );
    this.app.use(cookieParser());

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
