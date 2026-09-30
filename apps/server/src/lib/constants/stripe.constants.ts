export const STRIPE_APPLICATION = 'reddit-clone';
export const STRIPE_CREDIT_RESET_INTERVAL = 'month';

export const STRIPE_PLANS = {
  solo: {
    key: 'solo',
    name: 'Solo',
    description: 'Solo plan with 250,000 AI credits per month.',
    monthlyCredits: 250_000,
    prices: [
      { key: 'solo_monthly', nickname: 'Solo monthly', amount: 900, interval: 'month' },
      { key: 'solo_yearly', nickname: 'Solo yearly', amount: 9_000, interval: 'year' },
    ],
  },
  pro: {
    key: 'pro',
    name: 'Pro',
    description: 'Pro plan with 600,000 AI credits per month.',
    monthlyCredits: 600_000,
    prices: [
      { key: 'pro_monthly', nickname: 'Pro monthly', amount: 1_900, interval: 'month' },
      { key: 'pro_yearly', nickname: 'Pro yearly', amount: 19_000, interval: 'year' },
    ],
  },
} as const;

export type StripePlanKey = keyof typeof STRIPE_PLANS;
export type StripePlanConfig = (typeof STRIPE_PLANS)[StripePlanKey];
export type StripePriceConfig = StripePlanConfig['prices'][number];
export type StripePriceKey = StripePriceConfig['key'];

export type StripeProductMetadata = Record<string, string> & {
  application: typeof STRIPE_APPLICATION;
  plan_key: StripePlanKey;
  monthly_credits: string;
};

export type StripePriceMetadata = StripeProductMetadata & {
  price_key: StripePriceKey;
  credit_reset_interval: typeof STRIPE_CREDIT_RESET_INTERVAL;
};

export type StripeCustomerMetadata = Record<string, string> & {
  application: typeof STRIPE_APPLICATION;
  user_id: string;
};

export type StripeCheckoutSessionMetadata = Record<string, string> & {
  application: typeof STRIPE_APPLICATION;
  user_id: string;
  plan_key: StripePlanKey;
};

export type StripeSubscriptionMetadata = StripeCheckoutSessionMetadata;

export function getStripeProductMetadata(
  planKey: StripePlanKey,
  monthlyCredits: number,
): StripeProductMetadata {
  return {
    application: STRIPE_APPLICATION,
    plan_key: planKey,
    monthly_credits: String(monthlyCredits),
  };
}

export function getStripePriceMetadata(
  planKey: StripePlanKey,
  priceKey: StripePriceKey,
  monthlyCredits: number,
): StripePriceMetadata {
  return {
    ...getStripeProductMetadata(planKey, monthlyCredits),
    price_key: priceKey,
    credit_reset_interval: STRIPE_CREDIT_RESET_INTERVAL,
  };
}
