import type { UserTable } from '../../db/schemas/index.js';
import type { Buffer } from 'node:buffer';
import type Stripe from 'stripe';

declare global {
  namespace Express {
    interface Request {
      validatedBody?: Record<string, unknown>;
    }

    interface Locals {
      user: Omit<UserTable, 'password'>;
      stripeRawBody?: Buffer;
      stripeEvent?: Stripe.Event;
    }
  }
}

export {};
