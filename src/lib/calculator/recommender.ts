import type {
  BaseMetrics,
  StrategyType,
  StrategyRecommendation,
  IndustryType,
} from '@/types/strategies';
import { calculateAllStrategies } from './strategies';
import { industryDefaults } from './industryDefaults';

// Rule-based strategy recommendation based on business metrics
// Analyzes weak points and recommends highest-impact lever
export function recommendStrategy(metrics: BaseMetrics): StrategyRecommendation {
  const { ltv, cac, ratio, grossMarginPercent, purchaseFrequency, averageOrderValue } = metrics;

  // Critical ratio (< 3x) - need the biggest impact
  if (ratio < 3) {
    if (grossMarginPercent !== undefined && grossMarginPercent < 50) {
      return {
        primaryStrategy: 'pricing',
        reasoning: 'Your LTV:CAC ratio is critical and your margins are low. Raising prices will have the fastest impact on profitability.',
        projectedImprovement: 25,
        secondaryStrategy: 'bnpl',
        secondaryReasoning: 'BNPL can help offset any conversion drop from price increases.',
      };
    }

    if (purchaseFrequency !== undefined && purchaseFrequency < 2) {
      return {
        primaryStrategy: 'subscription',
        reasoning: 'Your customers only buy once or twice. Converting them to recurring subscribers will dramatically increase LTV.',
        projectedImprovement: 40,
        secondaryStrategy: 'membership',
        secondaryReasoning: 'A membership model can also increase purchase frequency.',
      };
    }

    // Default for critical ratio - BNPL has universal impact
    return {
      primaryStrategy: 'bnpl',
      reasoning: 'Your LTV:CAC ratio needs urgent improvement. BNPL attacks both sides - more conversions AND higher order values.',
      projectedImprovement: 45,
      secondaryStrategy: 'giveaway',
      secondaryReasoning: 'Capturing bounced visitors reduces your effective CAC.',
    };
  }

  // CAC is too high relative to AOV (> 50% of AOV)
  if (averageOrderValue !== undefined && cac > averageOrderValue * 0.5) {
    return {
      primaryStrategy: 'giveaway',
      reasoning: 'Your CAC is high relative to your order value. Capturing leads from bounced traffic will reduce effective acquisition cost.',
      projectedImprovement: 30,
      secondaryStrategy: 'bnpl',
      secondaryReasoning: 'BNPL can increase conversions to further reduce CAC.',
    };
  }

  // Low purchase frequency (< 4x per year)
  if (purchaseFrequency !== undefined && purchaseFrequency < 4) {
    return {
      primaryStrategy: 'membership',
      reasoning: 'Your customers don\'t buy frequently enough. A membership model increases purchase frequency and adds recurring revenue.',
      projectedImprovement: 35,
      secondaryStrategy: 'subscription',
      secondaryReasoning: 'A subscription model also creates predictable recurring revenue.',
    };
  }

  // Good ratio (3x+) - optimize for growth
  if (ratio >= 5) {
    return {
      primaryStrategy: 'pricing',
      reasoning: 'Your unit economics are strong. You can likely increase prices without hurting growth too much.',
      projectedImprovement: 20,
      secondaryStrategy: 'subscription',
      secondaryReasoning: 'Adding subscriptions creates more predictable revenue.',
    };
  }

  // Default recommendation - BNPL is most universally applicable
  return {
    primaryStrategy: 'bnpl',
    reasoning: 'Payment plans are the most universally effective lever - they increase both conversion rate and average order value.',
    projectedImprovement: 35,
    secondaryStrategy: 'membership',
    secondaryReasoning: 'A membership model adds recurring revenue.',
  };
}

// Get recommendation with actual projected numbers based on industry defaults
export function getDetailedRecommendation(
  metrics: BaseMetrics,
  industry: IndustryType
): StrategyRecommendation {
  const baseRecommendation = recommendStrategy(metrics);
  const defaults = industryDefaults[industry];

  // Calculate actual projections using industry defaults
  const allResults = calculateAllStrategies(metrics, defaults);
  const primaryResult = allResults.find(r => r.strategyType === baseRecommendation.primaryStrategy);

  if (primaryResult) {
    return {
      ...baseRecommendation,
      projectedImprovement: Math.round(primaryResult.ratioChange),
    };
  }

  return baseRecommendation;
}

// Get recommendation reasons as bullets for UI
export function getRecommendationBullets(
  strategyType: StrategyType,
  metrics: BaseMetrics
): string[] {
  const { ratio, grossMarginPercent, purchaseFrequency, averageOrderValue, cac } = metrics;

  const bullets: string[] = [];

  switch (strategyType) {
    case 'giveaway':
      bullets.push('Reduces effective CAC without increasing ad spend');
      bullets.push('Builds email list for future campaigns');
      if (cac > 100) bullets.push('Your CAC is high - this helps offset it');
      break;

    case 'membership':
      bullets.push('Adds pure-profit recurring revenue');
      bullets.push('Increases purchase frequency');
      if (purchaseFrequency && purchaseFrequency < 4) {
        bullets.push('Your customers only buy ' + purchaseFrequency + 'x/year - this helps');
      }
      break;

    case 'bnpl':
      bullets.push('Attacks both LTV AND CAC simultaneously');
      bullets.push('More customers can afford your products');
      if (averageOrderValue && averageOrderValue > 100) {
        bullets.push('Higher-ticket items ($' + averageOrderValue + ') benefit most from payment plans');
      }
      break;

    case 'subscription':
      bullets.push('Creates predictable recurring revenue');
      bullets.push('Increases customer lifetime');
      if (purchaseFrequency && purchaseFrequency < 2) {
        bullets.push('Your low purchase frequency makes subscriptions ideal');
      }
      break;

    case 'pricing':
      bullets.push('Direct increase to margins and LTV');
      bullets.push('No additional cost to implement');
      if (grossMarginPercent && grossMarginPercent < 50) {
        bullets.push('Your ' + grossMarginPercent + '% margin has room to grow');
      }
      if (ratio >= 5) {
        bullets.push('Your strong ratio (' + ratio.toFixed(1) + 'x) can absorb some conversion drop');
      }
      break;
  }

  return bullets;
}
