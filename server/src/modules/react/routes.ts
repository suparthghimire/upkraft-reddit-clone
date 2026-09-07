import { Router } from 'express';
import { reactHomePageHandler } from './controller.js';

export const reactRouter = Router().get('/', reactHomePageHandler);
