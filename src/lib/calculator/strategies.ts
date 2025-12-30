import type {
  BaseMetrics,
  StrategyResult,
  GiveawayParams,
  MembershipParams,
  BNPLParams,
  SubscriptionParams,
  PricingParams,
  StrategyType,
} from '@/types/strategies';
import { strategyInfo } from './industryDefaults';

// Calculate the impact of Giveaway Lead Gen strategy
// Reduces effective CAC by converting bounced traffic through email nurture
export function calculateGiveaway(
  metrics: BaseMetrics,
  params: GiveawayParams
): StrategyResult {
  const { ltv, cac } = metrics;
  const { bounceRate, emailCaptureRate, emailConversionRate } = params;

  // Calculate CAC reduction from captured leads
  // Formula: New CAC = Old CAC × (1 - (bounce_rate × capture_rate × email_cvr))
  const captureImpact = (bounceRate / 100) * (emailCaptureRate / 100) * (emailConversionRate / 100);
  const newCac = cac * (1 - captureImpact);
  const newLtv = ltv; // LTV unchanged
  const newRatio = newLtv / newCac;

  return {
    strategyType: 'giveaway',
    strategyName: strategyInfo.giveaway.name,
    newLtv,
    newCac,
    newRatio,
    ltvChange: 0,
    cacChange: ((newCac - cac) / cac) * 100,
    ratioChange: ((newRatio - metrics.ratio) / metrics.ratio) * 100,
    explanation: `Capturing ${emailCaptureRate}% of bounced visitors and converting ${emailConversionRate}% reduces your effective CAC.`,
  };
}

// Calculate the impact of Costco Membership Model
// Adds pure-profit membership revenue + increases purchase frequency
export function calculateMembership(
  metrics: BaseMetrics,
  params: MembershipParams
): StrategyResult {
  const { ltv, cac, ratio } = metrics;
  const { membershipPrice, membershipConversion, frequencyLift } = params;

  // Calculate new LTV with membership profit and frequency lift
  // Membership profit per average customer
  const membershipProfitPerCustomer = membershipPrice * (membershipConversion / 100);
  // Frequency lift increases existing LTV
  const ltvFromFrequencyLift = ltv * (frequencyLift / 100);

  const newLtv = ltv + membershipProfitPerCustomer + ltvFromFrequencyLift;
  const newCac = cac; // CAC unchanged
  const newRatio = newLtv / newCac;

  return {
    strategyType: 'membership',
    strategyName: strategyInfo.membership.name,
    newLtv,
    newCac,
    newRatio,
    ltvChange: ((newLtv - ltv) / ltv) * 100,
    cacChange: 0,
    ratioChange: ((newRatio - ratio) / ratio) * 100,
    explanation: `${membershipConversion}% of customers joining at $${membershipPrice}/year + ${frequencyLift}% more frequent purchases increases LTV.`,
  };
}

// Calculate the impact of BNPL (Buy Now Pay Later)
// Increases CVR (more can afford) + increases AOV (larger purchases)
export function calculateBNPL(
  metrics: BaseMetrics,
  params: BNPLParams
): StrategyResult {
  const { ltv, cac, ratio } = metrics;
  const { cvrLift, aovLift } = params;

  // Higher CVR means more customers from same ad spend = lower effective CAC
  // Formula: New CAC = Old CAC / (1 + cvr_lift)
  const newCac = cac / (1 + cvrLift / 100);

  // Higher AOV directly increases LTV
  // Formula: New LTV = Old LTV × (1 + aov_lift)
  const newLtv = ltv * (1 + aovLift / 100);

  const newRatio = newLtv / newCac;

  return {
    strategyType: 'bnpl',
    strategyName: strategyInfo.bnpl.name,
    newLtv,
    newCac,
    newRatio,
    ltvChange: ((newLtv - ltv) / ltv) * 100,
    cacChange: ((newCac - cac) / cac) * 100,
    ratioChange: ((newRatio - ratio) / ratio) * 100,
    explanation: `${cvrLift}% more people convert (lower CAC) and they spend ${aovLift}% more (higher LTV).`,
  };
}

// Calculate the impact of Subscription Model
// Increases customer lifespan + adds recurring revenue
export function calculateSubscription(
  metrics: BaseMetrics,
  params: SubscriptionParams
): StrategyResult {
  const { ltv, cac, ratio } = metrics;
  const { subscriptionPrice, retentionRate, subscriptionConversion } = params;

  // Calculate average months retained based on retention rate
  // Formula: Average months = 1 / (1 - retention_rate)
  const avgMonthsRetained = 1 / (1 - retentionRate / 100);

  // Subscription LTV for converting customers
  const subscriptionLtv = subscriptionPrice * avgMonthsRetained;

  // Blended LTV based on % who convert to subscription
  const conversionRate = subscriptionConversion / 100;
  const newLtv = (ltv * (1 - conversionRate)) + (subscriptionLtv * conversionRate);

  const newCac = cac; // CAC unchanged
  const newRatio = newLtv / newCac;

  return {
    strategyType: 'subscription',
    strategyName: strategyInfo.subscription.name,
    newLtv,
    newCac,
    newRatio,
    ltvChange: ((newLtv - ltv) / ltv) * 100,
    cacChange: 0,
    ratioChange: ((newRatio - ratio) / ratio) * 100,
    explanation: `${subscriptionConversion}% converting to $${subscriptionPrice}/mo with ${retentionRate}% retention (~${Math.round(avgMonthsRetained)} months avg).`,
  };
}

// Calculate the impact of Price Increase
// Higher margin, but may reduce conversion
export function calculatePricing(
  metrics: BaseMetrics,
  params: PricingParams
): StrategyResult {
  const { ltv, cac, ratio } = metrics;
  const { priceIncrease, expectedCvrDrop } = params;

  // Higher prices directly increase LTV
  const newLtv = ltv * (1 + priceIncrease / 100);

  // Lower conversion rate means fewer customers from same spend = higher effective CAC
  // Formula: New CAC = Old CAC / (1 - cvr_drop)
  const newCac = cac / (1 - expectedCvrDrop / 100);

  const newRatio = newLtv / newCac;

  return {
    strategyType: 'pricing',
    strategyName: strategyInfo.pricing.name,
    newLtv,
    newCac,
    newRatio,
    ltvChange: ((newLtv - ltv) / ltv) * 100,
    cacChange: ((newCac - cac) / cac) * 100,
    ratioChange: ((newRatio - ratio) / ratio) * 100,
    explanation: `${priceIncrease}% price increase with ${expectedCvrDrop}% conversion drop trades volume for margin.`,
  };
}

// Main function to calculate any strategy
export function calculateStrategy(
  strategyType: StrategyType,
  metrics: BaseMetrics,
  params: GiveawayParams | MembershipParams | BNPLParams | SubscriptionParams | PricingParams
): StrategyResult {
  switch (strategyType) {
    case 'giveaway':
      return calculateGiveaway(metrics, params as GiveawayParams);
    case 'membership':
      return calculateMembership(metrics, params as MembershipParams);
    case 'bnpl':
      return calculateBNPL(metrics, params as BNPLParams);
    case 'subscription':
      return calculateSubscription(metrics, params as SubscriptionParams);
    case 'pricing':
      return calculatePricing(metrics, params as PricingParams);
    default:
      throw new Error(`Unknown strategy type: ${strategyType}`);
  }
}

// Calculate all strategies and return sorted by improvement
export function calculateAllStrategies(
  metrics: BaseMetrics,
  params: {
    giveaway: GiveawayParams;
    membership: MembershipParams;
    bnpl: BNPLParams;
    subscription: SubscriptionParams;
    pricing: PricingParams;
  }
): StrategyResult[] {
  const results: StrategyResult[] = [
    calculateGiveaway(metrics, params.giveaway),
    calculateMembership(metrics, params.membership),
    calculateBNPL(metrics, params.bnpl),
    calculateSubscription(metrics, params.subscription),
    calculatePricing(metrics, params.pricing),
  ];

  // Sort by ratio improvement (highest first)
  return results.sort((a, b) => b.ratioChange - a.ratioChange);
}
