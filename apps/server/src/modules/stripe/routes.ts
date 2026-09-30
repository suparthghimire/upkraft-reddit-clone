import { Router } from 'express';
import { handleStripeWebhook } from './controller.js';
import { verifyStripeWebhook } from './middleware.js';

export const stripeRouter = Router().post('/webhook', verifyStripeWebhook, handleStripeWebhook);
