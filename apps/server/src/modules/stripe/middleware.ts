import type { RequestHandler } from 'express';
import { env } from '../../lib/env.schema.js';
import { stripe } from './client.js';

export const verifyStripeWebhook: RequestHandler = (req, res, next) => {
  const rawBody = res.locals.stripeRawBody;
  if (!Buffer.isBuffer(rawBody)) {
    return res.status(400).json({ error: 'Expected a raw JSON request body' });
  }

  const signature = req.get('stripe-signature');
  if (!signature) {
    return res.status(400).json({ error: 'Missing Stripe-Signature header' });
  }

  try {
    res.locals.stripeEvent = stripe.webhooks.constructEvent(
      rawBody,
      signature,
      env.STRIPE_WEBHOOK_SECRET,
    );
    return next();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown signature verification error';
    console.warn(`Stripe webhook signature verification failed: ${message}`);
    return res.status(400).json({ error: 'Invalid webhook signature' });
  }
};
