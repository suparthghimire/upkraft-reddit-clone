import Stripe from 'stripe';
import { env } from '../../lib/env.schema.js';

export const stripe = new Stripe(env.STRIPE_SECRET_KEY);
