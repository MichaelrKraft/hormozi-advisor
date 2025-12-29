import type { RatingTier, RatioInterpretation, Recommendation, CalculatorInputs, CalculatorResults, IndustryPreset } from '@/types/calculator';

/**
 * Hormozi-style interpretations for each ratio tier
 */
export const RATIO_INTERPRETATIONS: Record<RatingTier, RatioInterpretation> = {
  below1: {
    rating: 'DANGER',
    color: 'red',
    message: "You're paying more to get a customer than they're worth. Every sale loses money. Stop scaling immediately.",
    hormozi: "Look, this is brutal but honest - you don't have a business, you have an expensive hobby. Every customer you acquire is a net loss.",
  },
  ratio1to2: {
    rating: 'STRUGGLING',
    color: 'orange',
    message: "You're barely breaking even. One bad month wipes out your profit. Too risky to scale.",
    hormozi: "This is the 'I'm working 80 hours a week and wondering where all the money went' zone. You need to fix this before anything else.",
  },
  ratio2to3: {
    rating: 'SURVIVING',
    color: 'yellow',
    message: "You're making money, but not enough margin for error. Competitors with better ratios will outspend you.",
    hormozi: "You're surviving, not thriving. This is where most businesses live and die. Time to pull some levers.",
  },
  ratio3to5: {
    rating: 'HEALTHY',
    color: 'green',
    message: 'Solid foundation. You can reinvest in growth with reasonable safety margins.',
    hormozi: "Now we're talking. This is where you can start to breathe. You've got room to experiment and grow.",
  },
  ratio5to10: {
    rating: 'STRONG',
    color: 'emerald',
    message: 'You have a real competitive advantage. Time to scale aggressively.',
    hormozi: "This is 'license to print money' territory. You should be pouring gas on this fire. Why aren't you scaling faster?",
  },
  above10: {
    rating: 'EXCEPTIONAL',
    color: 'gold',
    message: "Unicorn territory. You've built something special. Protect this at all costs.",
    hormozi: "This is what we look for in portfolio companies. Don't mess with the model. Document everything. Build the moat deeper.",
  },
};

/**
 * Get color class for Tailwind based on rating tier
 */
export function getTierColorClass(tier: RatingTier): {
  bg: string;
  text: string;
  border: string;
} {
  switch (tier) {
    case 'below1':
      return { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-600' };
    case 'ratio1to2':
      return { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-600' };
    case 'ratio2to3':
      return { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-600' };
    case 'ratio3to5':
      return { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-600' };
    case 'ratio5to10':
      return { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-600' };
    case 'above10':
      return { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-600' };
  }
}

/**
 * Generate personalized lever recommendations based on inputs and results
 */
export function generateRecommendations(
  inputs: CalculatorInputs,
  results: CalculatorResults
): Recommendation[] {
  const recommendations: Recommendation[] = [];

  // If gross margin is low (< 50%)
  if (inputs.grossMarginPercent < 50) {
    recommendations.push({
      lever: 'Increase Price',
      impact: 'high',
      action: 'Raise prices by 20%. Most businesses underprice by at least this much.',
      hormoziQuote: 'Pricing is the strongest profit lever. Period. A 10% price increase goes straight to profit.',
    });
  }

  // If customer lifespan is short (< 2 years)
  if (inputs.customerLifespan < 2) {
    recommendations.push({
      lever: 'Improve Retention',
      impact: 'high',
      action: 'Implement a 90-day onboarding sequence to reduce early churn.',
      hormoziQuote: 'Retention drives exponential growth. Every month you keep a customer is pure profit.',
    });
  }

  // If CAC is high relative to AOV
  if (results.cac > inputs.averageOrderValue * 2) {
    recommendations.push({
      lever: 'Optimize Lead Sources',
      impact: 'medium',
      action: 'Focus 80% of budget on your top-performing channel. Cut the rest.',
      hormoziQuote: 'Most businesses spread too thin. Find what works and go all in.',
    });
  }

  // If purchase frequency is low (< 2/year)
  if (inputs.purchaseFrequency < 2) {
    recommendations.push({
      lever: 'Add Upsells/Cross-sells',
      impact: 'high',
      action: 'Create a complementary product or service bundle.',
      hormoziQuote: 'The cheapest customer to acquire is one you already have.',
    });
  }

  // If payback period is too long (> 6 months)
  if (results.paybackPeriod > 6) {
    recommendations.push({
      lever: 'Improve Cash Flow',
      impact: 'medium',
      action: 'Add an upfront payment or deposit to reduce payback period.',
      hormoziQuote: 'Cash flow kills more businesses than lack of profit. Get paid faster.',
    });
  }

  // If sales costs are high relative to marketing
  if (inputs.monthlySalesCosts > inputs.monthlyMarketingSpend * 0.5) {
    recommendations.push({
      lever: 'Automate Sales',
      impact: 'medium',
      action: 'Build a self-serve funnel or use video sales letters to reduce sales labor.',
      hormoziQuote: 'The best sales process is one that sells without you.',
    });
  }

  // If AOV is low
  if (inputs.averageOrderValue < 100) {
    recommendations.push({
      lever: 'Bundle Products',
      impact: 'high',
      action: 'Create premium bundles or packages to increase average order value.',
      hormoziQuote: 'The easiest way to make more money is to charge more money.',
    });
  }

  // Return top 3 most impactful
  return recommendations.slice(0, 3);
}

/**
 * Industry presets for quick setup
 */
export const INDUSTRY_PRESETS: IndustryPreset[] = [
  {
    name: 'SaaS / Software',
    defaults: {
      averageOrderValue: 99,
      purchaseFrequency: 12,
      customerLifespan: 2.5,
      grossMarginPercent: 80,
      monthlyMarketingSpend: 5000,
      monthlySalesCosts: 3000,
      newCustomersPerMonth: 50,
    },
  },
  {
    name: 'E-commerce',
    defaults: {
      averageOrderValue: 75,
      purchaseFrequency: 4,
      customerLifespan: 2,
      grossMarginPercent: 40,
      monthlyMarketingSpend: 8000,
      monthlySalesCosts: 0,
      newCustomersPerMonth: 200,
    },
  },
  {
    name: 'Agency / Services',
    defaults: {
      averageOrderValue: 3000,
      purchaseFrequency: 12,
      customerLifespan: 1.5,
      grossMarginPercent: 60,
      monthlyMarketingSpend: 2000,
      monthlySalesCosts: 5000,
      newCustomersPerMonth: 5,
    },
  },
  {
    name: 'Coaching / Consulting',
    defaults: {
      averageOrderValue: 5000,
      purchaseFrequency: 2,
      customerLifespan: 1,
      grossMarginPercent: 85,
      monthlyMarketingSpend: 3000,
      monthlySalesCosts: 2000,
      newCustomersPerMonth: 8,
    },
  },
  {
    name: 'Local Business',
    defaults: {
      averageOrderValue: 50,
      purchaseFrequency: 6,
      customerLifespan: 3,
      grossMarginPercent: 50,
      monthlyMarketingSpend: 1500,
      monthlySalesCosts: 500,
      newCustomersPerMonth: 30,
    },
  },
  {
    name: 'Custom',
    defaults: {},
  },
];

/**
 * Input field tooltips with Hormozi context
 */
export const INPUT_TOOLTIPS: Record<keyof CalculatorInputs, string> = {
  averageOrderValue: 'How much does a customer spend per transaction? This is your AOV.',
  purchaseFrequency: 'How many times per year does a customer buy from you?',
  customerLifespan: 'How many years does a customer stay with you on average?',
  grossMarginPercent: 'What percentage of revenue is left after cost of goods? Not revenue - PROFIT.',
  monthlyMarketingSpend: 'Total monthly spend on ads, content, marketing tools, etc.',
  monthlySalesCosts: 'Monthly cost of sales team - salaries, commissions, tools.',
  newCustomersPerMonth: 'How many new customers do you acquire each month?',
};
