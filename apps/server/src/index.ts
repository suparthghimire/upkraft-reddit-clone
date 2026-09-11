import { CustomServer } from './http/server.js';
import { env } from './lib/env.schema.js';
import { postRouter } from './modules/post/routes.js';
const server = new CustomServer();

console.log(env.DATABASE_URL);

server
  .startServer()
  .regsiterRequiredMiddlewares()
  .registerHealthCheckRoute()
  .registerModuleRouter('v1', 'post', postRouter)
  .registerRequestErrorHandler();
