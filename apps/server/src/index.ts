import { CustomServer } from './http/server.js';
import { postRouter } from './modules/post/routes.js';

const server = new CustomServer();

server
  .startServer()
  .regsiterRequiredMiddlewares()
  .registerHealthCheckRoute()
  .registerModuleRouter('v1', 'post', postRouter)
  .registerRequestErrorHandler();
