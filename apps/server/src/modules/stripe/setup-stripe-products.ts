import 'dotenv/config';
import Stripe from 'stripe';
import {
  getStripePriceMetadata,
  getStripeProductMetadata,
  STRIPE_APPLICATION,
  STRIPE_PLANS,
  type StripePlanConfig,
  type StripePlanKey,
  type StripePriceConfig,
} from '../../lib/constants/stripe.constants.js';

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
if (!stripeSecretKey) {
  throw new Error('STRIPE_SECRET_KEY is required. Add it to apps/server/.env first.');
}

const stripe = new Stripe(stripeSecretKey);

const plans = Object.values(STRIPE_PLANS);

async function findProduct(planKey: StripePlanKey) {
  for await (const product of stripe.products.list({ active: true, limit: 100 })) {
    if (
      product.metadata.application === STRIPE_APPLICATION &&
      product.metadata.plan_key === planKey
    ) {
      return product;
    }
  }

  return undefined;
}

async function ensureProduct(plan: StripePlanConfig) {
  const metadata = getStripeProductMetadata(plan.key, plan.monthlyCredits);
  const existingProduct = await findProduct(plan.key);

  if (existingProduct) {
    const product = await stripe.products.update(existingProduct.id, {
      name: plan.name,
      description: plan.description,
      metadata,
    });
    return { product, created: false };
  }

  const product = await stripe.products.create({
    name: plan.name,
    description: plan.description,
    metadata,
  });
  return { product, created: true };
}

async function findPrice(
  productId: string,
  priceKey: StripePriceConfig['key'],
  amount: number,
  interval: StripePriceConfig['interval'],
) {
  for await (const price of stripe.prices.list({ product: productId, active: true, limit: 100 })) {
    if (
      price.metadata.application === STRIPE_APPLICATION &&
      price.metadata.price_key === priceKey &&
      price.currency === 'usd' &&
      price.unit_amount === amount &&
      price.recurring?.interval === interval
    ) {
      return price;
    }
  }

  return undefined;
}

async function ensurePrice(productId: string, plan: StripePlanConfig, price: StripePriceConfig) {
  const existingPrice = await findPrice(productId, price.key, price.amount, price.interval);
  if (existingPrice) return { price: existingPrice, created: false };

  const createdPrice = await stripe.prices.create({
    product: productId,
    currency: 'usd',
    unit_amount: price.amount,
    recurring: { interval: price.interval },
    nickname: price.nickname,
    metadata: getStripePriceMetadata(plan.key, price.key, plan.monthlyCredits),
  });

  return { price: createdPrice, created: true };
}

for (const plan of plans) {
  const { product, created: productCreated } = await ensureProduct(plan);
  console.log(`${productCreated ? 'Created' : 'Reused'} ${plan.name} product: ${product.id}`);

  for (const planPrice of plan.prices) {
    const { price, created } = await ensurePrice(product.id, plan, planPrice);
    const cadence = planPrice.interval === 'month' ? 'month' : 'year';
    const amount = (planPrice.amount / 100).toFixed(2);
    console.log(
      `${created ? 'Created' : 'Reused'} ${planPrice.nickname}: ${price.id} ($${amount}/${cadence})`,
    );
  }
}
