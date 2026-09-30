import type { Request, Response } from 'express';
import Stripe from 'stripe';

export async function handleStripeWebhook(req: Request, res: Response) {
  const event = res.locals.stripeEvent;
  if (!event) {
    return res.status(400).json({ error: 'Stripe event has not been verified' });
  }

  try {
    await processStripeEvent(event);
  } catch (error) {
    console.error(`Stripe webhook processing failed for ${event.id}`, error);
    // A 5xx asks Stripe to retry the event.
    return res.status(500).json({ error: 'Webhook processing failed' });
  }

  return res.status(200).json({ received: true });
}

async function processStripeEvent(event: Stripe.Event) {
  switch (event.type) {
    case 'checkout.session.completed':
    case 'customer.subscription.created':
    case 'customer.subscription.updated':
    case 'customer.subscription.deleted':
    case 'invoice.paid':
    case 'invoice.payment_failed':
    case 'payment_intent.succeeded':
    case 'payment_intent.payment_failed':
      // Billing state should be updated here once the app has a persisted
      // customer/subscription model. Do not log the event payload: it can hold
      // customer and payment details.
      console.info('Received Stripe billing event', { id: event.id, type: event.type });
      return;
    default:
      // Stripe can send event types this endpoint does not use. Acknowledge
      // them so they are not retried forever.
      console.info('Ignored Stripe event', { id: event.id, type: event.type });
  }
}
