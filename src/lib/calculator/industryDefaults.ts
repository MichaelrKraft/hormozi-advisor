import type {
  IndustryType,
  IndustryDefaults,
  StrategyInfo,
  StrategyType,
} from '@/types/strategies';

// Industry-specific default assumptions for each strategy
// Based on Alex Hormozi's frameworks and typical industry benchmarks
export const industryDefaults: Record<IndustryType, IndustryDefaults> = {
  saas: {
    giveaway: {
      bounceRate: 90,
      emailCaptureRate: 35,
      emailConversionRate: 3,
    },
    membership: {
      membershipPrice: 99,
      membershipConversion: 15,
      frequencyLift: 20,
    },
    bnpl: {
      cvrLift: 15,
      aovLift: 20,
    },
    subscription: {
      subscriptionPrice: 49,
      retentionRate: 90,
      subscriptionConversion: 40,
    },
    pricing: {
      priceIncrease: 20,
      expectedCvrDrop: 10,
    },
  },

  ecommerce: {
    giveaway: {
      bounceRate: 90,
      emailCaptureRate: 25,
      emailConversionRate: 2,
    },
    membership: {
      membershipPrice: 49,
      membershipConversion: 8,
      frequencyLift: 30,
    },
    bnpl: {
      cvrLift: 25,
      aovLift: 40,
    },
    subscription: {
      subscriptionPrice: 29,
      retentionRate: 70,
      subscriptionConversion: 25,
    },
    pricing: {
      priceIncrease: 15,
      expectedCvrDrop: 15,
    },
  },

  agency: {
    giveaway: {
      bounceRate: 90,
      emailCaptureRate: 40,
      emailConversionRate: 5,
    },
    membership: {
      membershipPrice: 199,
      membershipConversion: 25,
      frequencyLift: 15,
    },
    bnpl: {
      cvrLift: 10,
      aovLift: 15,
    },
    subscription: {
      subscriptionPrice: 997,
      retentionRate: 85,
      subscriptionConversion: 60,
    },
    pricing: {
      priceIncrease: 25,
      expectedCvrDrop: 8,
    },
  },

  coaching: {
    giveaway: {
      bounceRate: 90,
      emailCaptureRate: 45,
      emailConversionRate: 4,
    },
    membership: {
      membershipPrice: 97,
      membershipConversion: 30,
      frequencyLift: 25,
    },
    bnpl: {
      cvrLift: 20,
      aovLift: 25,
    },
    subscription: {
      subscriptionPrice: 197,
      retentionRate: 75,
      subscriptionConversion: 50,
    },
    pricing: {
      priceIncrease: 30,
      expectedCvrDrop: 12,
    },
  },

  local: {
    giveaway: {
      bounceRate: 90,
      emailCaptureRate: 20,
      emailConversionRate: 3,
    },
    membership: {
      membershipPrice: 29,
      membershipConversion: 10,
      frequencyLift: 40,
    },
    bnpl: {
      cvrLift: 15,
      aovLift: 20,
    },
    subscription: {
      subscriptionPrice: 49,
      retentionRate: 80,
      subscriptionConversion: 30,
    },
    pricing: {
      priceIncrease: 15,
      expectedCvrDrop: 10,
    },
  },
};

// Strategy metadata for UI display
export const strategyInfo: Record<StrategyType, StrategyInfo> = {
  giveaway: {
    type: 'giveaway',
    name: 'Giveaway Lead Gen',
    shortName: 'Giveaway',
    icon: '🎁',
    description: 'Capture emails from non-buyers with a valuable free offer, then convert them later through nurture sequences.',
    hormoziQuote: 'Most businesses let 90% of their traffic walk away. A lead magnet captures value from people who weren\'t ready to buy today.',
  },
  membership: {
    type: 'membership',
    name: 'Costco Membership Model',
    shortName: 'Membership',
    icon: '🏪',
    description: 'Charge a yearly subscription to access your products at cost. Pure profit membership + increased frequency.',
    hormoziQuote: 'Costco makes most of their profit from membership fees. The products are just the reason people pay the membership.',
  },
  bnpl: {
    type: 'bnpl',
    name: 'Buy Now Pay Later',
    shortName: 'BNPL',
    icon: '💳',
    description: 'Offer payment plans to increase conversion (more can afford) and AOV (people buy more on payments).',
    hormoziQuote: 'When you let people pay over time, more people can afford it AND they buy bigger packages. You win twice.',
  },
  subscription: {
    type: 'subscription',
    name: 'Subscription Model',
    shortName: 'Subscription',
    icon: '📅',
    description: 'Convert one-time buyers to recurring subscribers for predictable revenue and higher lifetime value.',
    hormoziQuote: 'Recurring revenue is the most valuable revenue. A customer who pays monthly is worth more than one who buys once.',
  },
  pricing: {
    type: 'pricing',
    name: 'Price Increase',
    shortName: 'Pricing',
    icon: '💰',
    description: 'Raise prices for higher margin. May reduce conversion but often worth it for increased profit per customer.',
    hormoziQuote: 'Most entrepreneurs are undercharging. If no one says your prices are too high, you\'re leaving money on the table.',
  },
};

// Industry display names
export const industryNames: Record<IndustryType, string> = {
  saas: 'SaaS / Software',
  ecommerce: 'E-commerce',
  agency: 'Agency / Services',
  coaching: 'Coaching / Info Products',
  local: 'Local Service Business',
};

// Get defaults for a specific strategy and industry
export function getStrategyDefaults<T extends StrategyType>(
  strategy: T,
  industry: IndustryType
): IndustryDefaults[T] {
  return industryDefaults[industry][strategy];
}

// Get all strategy infos as array for iteration
export function getAllStrategies(): StrategyInfo[] {
  return Object.values(strategyInfo);
}
