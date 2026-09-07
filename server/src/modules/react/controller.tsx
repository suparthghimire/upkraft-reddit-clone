import type { Request, Response } from 'express';
import { renderToString } from 'react-dom/server';
import HomePage from './pages/home.js';

export function reactHomePageHandler(_req: Request, res: Response) {
  const appHtml = renderToString(<HomePage />);
  res.send(appHtml);
}
