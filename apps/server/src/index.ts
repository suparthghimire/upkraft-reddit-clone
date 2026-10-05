import { CustomServer } from './http/server.js';
import { authRouter } from './modules/auth/routes.js';
import { chatRouter } from './modules/chat/routes.js';
import { commentRouter } from './modules/comment/routes.js';
import { postRouter } from './modules/post/routes.js';
import { s3Router } from './modules/s3/routes.js';
import { userRouter } from './modules/user/routes.js';
const server = new CustomServer();

server
  .startServer()
  .regsiterRequiredMiddlewares()
  .registerHealthCheckRoute()
  .registerModuleRouter('v1', 'post', postRouter)
  .registerModuleRouter('v1', 'auth', authRouter)
  .registerModuleRouter('v1', 'user', userRouter)
  .registerModuleRouter('v1', 'comment', commentRouter)
  .registerModuleRouter('v1', 'chat', chatRouter)
  .registerModuleRouter('v1', 's3', s3Router)
  .registerRequestErrorHandler();
