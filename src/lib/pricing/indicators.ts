import type { PricingIndicator, PricingAdvice, PricingSignal } from '@/types/pricing';

/**
 * Pricing indicators - questions that reveal pricing signals
 */
export const PRICING_INDICATORS: PricingIndicator[] = [
  {
    id: 'price-objections',
    category: 'sales-friction',
    question: 'How often do prospects say "it\'s too expensive"?',
    lowLabel: 'Never',
    highLabel: 'Almost always',
    weight: 1.5,
    interpretation: {
      low: {
        signal: 'underpriced',
        insight: 'No price objections often means you\'re leaving money on the table.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Some price objections are healthy - it means you\'re near market rate.',
      },
      high: {
        signal: 'overpriced',
        insight: 'Constant price objections suggest your price exceeds perceived value.',
      },
    },
  },
  {
    id: 'close-rate',
    category: 'sales-friction',
    question: 'What percentage of qualified leads convert to customers?',
    lowLabel: 'Very low (<10%)',
    highLabel: 'Very high (80%+)',
    weight: 1.5,
    interpretation: {
      low: {
        signal: 'slightly-high',
        insight: 'Low close rates may indicate a value gap at your current price point.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Healthy close rate suggests good price-value alignment.',
      },
      high: {
        signal: 'underpriced',
        insight: 'Extremely high close rates often signal you could charge more.',
      },
    },
  },
  {
    id: 'negotiation',
    category: 'sales-friction',
    question: 'How often do customers try to negotiate the price down?',
    lowLabel: 'Never',
    highLabel: 'Always',
    weight: 1.0,
    interpretation: {
      low: {
        signal: 'underpriced',
        insight: 'No negotiation attempts suggests price is well below perceived value.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Some negotiation is normal and expected.',
      },
      high: {
        signal: 'slightly-high',
        insight: 'Constant negotiation may signal you\'re at the upper edge of comfort.',
      },
    },
  },
  {
    id: 'decision-speed',
    category: 'customer-behavior',
    question: 'How quickly do prospects make purchasing decisions?',
    lowLabel: 'Very slow (weeks/months)',
    highLabel: 'Very fast (same day)',
    weight: 1.2,
    interpretation: {
      low: {
        signal: 'slightly-high',
        insight: 'Slow decisions often indicate prospects are weighing cost heavily.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Reasonable decision time suggests comfortable price point.',
      },
      high: {
        signal: 'underpriced',
        insight: 'Instant decisions often mean price isn\'t a factor - you could charge more.',
      },
    },
  },
  {
    id: 'referrals',
    category: 'customer-behavior',
    question: 'How often do customers refer others without being asked?',
    lowLabel: 'Never',
    highLabel: 'Very often',
    weight: 1.0,
    interpretation: {
      low: {
        signal: 'slightly-high',
        insight: 'Low referrals may indicate customers don\'t feel they got exceptional value.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Moderate referrals suggest good value alignment.',
      },
      high: {
        signal: 'underpriced',
        insight: 'High referrals often signal customers feel they got a steal.',
      },
    },
  },
  {
    id: 'upsell-acceptance',
    category: 'customer-behavior',
    question: 'How often do customers accept upsells or premium options?',
    lowLabel: 'Rarely',
    highLabel: 'Almost always',
    weight: 1.0,
    interpretation: {
      low: {
        signal: 'slightly-high',
        insight: 'Low upsell acceptance may indicate customers feel stretched at base price.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Moderate upsell acceptance shows healthy price sensitivity.',
      },
      high: {
        signal: 'underpriced',
        insight: 'High upsell acceptance signals customers have more budget to spend.',
      },
    },
  },
  {
    id: 'competitor-comparison',
    category: 'market-position',
    question: 'How does your price compare to direct competitors?',
    lowLabel: 'Much lower',
    highLabel: 'Much higher',
    weight: 1.2,
    interpretation: {
      low: {
        signal: 'underpriced',
        insight: 'Being significantly cheaper may devalue your offering.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Being in the market range gives you positioning flexibility.',
      },
      high: {
        signal: 'slightly-high',
        insight: 'Premium pricing requires premium positioning and value delivery.',
      },
    },
  },
  {
    id: 'capacity',
    category: 'market-position',
    question: 'How does demand compare to your capacity to deliver?',
    lowLabel: 'Way under capacity',
    highLabel: 'Maxed out / waitlist',
    weight: 1.3,
    interpretation: {
      low: {
        signal: 'overpriced',
        insight: 'Low demand relative to capacity suggests pricing friction.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Balanced demand suggests healthy market positioning.',
      },
      high: {
        signal: 'underpriced',
        insight: 'Being maxed out with a waitlist is a strong signal to raise prices.',
      },
    },
  },
  {
    id: 'value-articulation',
    category: 'value-perception',
    question: 'How easily can customers explain the value they get?',
    lowLabel: 'Very difficult',
    highLabel: 'Crystal clear',
    weight: 1.0,
    interpretation: {
      low: {
        signal: 'slightly-high',
        insight: 'Unclear value makes any price feel too high.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Moderate clarity allows for reasonable pricing.',
      },
      high: {
        signal: 'underpriced',
        insight: 'Clear value articulation supports higher prices.',
      },
    },
  },
  {
    id: 'outcome-certainty',
    category: 'value-perception',
    question: 'How confident are customers in achieving their desired outcome?',
    lowLabel: 'Very uncertain',
    highLabel: 'Very confident',
    weight: 1.2,
    interpretation: {
      low: {
        signal: 'slightly-high',
        insight: 'Low confidence makes customers price-sensitive.',
      },
      mid: {
        signal: 'optimal',
        insight: 'Moderate confidence supports market-rate pricing.',
      },
      high: {
        signal: 'underpriced',
        insight: 'High confidence in outcomes justifies premium pricing.',
      },
    },
  },
];

/**
 * Advice for each pricing signal
 */
export const PRICING_ADVICE: Record<PricingSignal, PricingAdvice> = {
  underpriced: {
    signal: 'underpriced',
    title: 'You\'re Leaving Money on the Table',
    description: 'Multiple signals suggest your price is well below what the market would bear. You\'re likely losing significant profit.',
    hormoziQuote: 'Look, pricing is the strongest lever on profit. You\'re not doing anyone a favor by undercharging. Raise your prices. The right customers will stay, the price-sensitive ones you\'ll gladly lose.',
    actions: [
      'Raise prices 20-30% immediately',
      'Test higher price with new customers first',
      'Add premium tiers at 2-3x current price',
      'Stop discounting - it trains customers to expect lower prices',
    ],
    experiments: [
      'Double your price for the next 10 prospects and track close rate',
      'Introduce a premium tier and see who chooses it',
      'Remove your lowest-priced option entirely',
    ],
  },
  'slightly-low': {
    signal: 'slightly-low',
    title: 'Room to Increase',
    description: 'Signals suggest you could safely raise prices without significant friction.',
    hormoziQuote: 'You\'re in the ballpark but probably on the lower end. A 10-15% increase would likely go unnoticed by most customers while adding straight to your profit.',
    actions: [
      'Raise prices 10-15%',
      'Add value-adds to justify price increase',
      'Improve positioning and messaging around value',
      'Consider eliminating discounts',
    ],
    experiments: [
      'Test a 15% price increase with new customers',
      'Add a bonus and raise price by the "value" of the bonus',
      'Survey customers on what additional value would justify higher price',
    ],
  },
  optimal: {
    signal: 'optimal',
    title: 'Pricing Looks Healthy',
    description: 'Your pricing signals are balanced. You\'re likely near market rate for your value proposition.',
    hormoziQuote: 'Solid pricing position. Now the question is: can you increase value to justify higher prices? The goal isn\'t to find the "right" price - it\'s to deliver so much value that price becomes irrelevant.',
    actions: [
      'Focus on increasing value delivered',
      'Test small price increases (5-10%)',
      'Develop higher-value premium offerings',
      'Improve conversion and retention instead',
    ],
    experiments: [
      'Add a premium tier at 2x price and see adoption',
      'Test removing discounts and observe impact',
      'Survey customers on value perception',
    ],
  },
  'slightly-high': {
    signal: 'slightly-high',
    title: 'Some Pricing Friction',
    description: 'Some signals suggest you may be at the upper edge of market tolerance. Not critical, but worth monitoring.',
    hormoziQuote: 'You might be on the edge. But before you cut prices, ask: can you increase the perceived value instead? Cutting price is the lazy solution. Adding value is the entrepreneurial solution.',
    actions: [
      'Improve value articulation and positioning',
      'Add guarantees to reduce perceived risk',
      'Stack bonuses to increase perceived value',
      'Improve sales process and objection handling',
    ],
    experiments: [
      'Add a stronger guarantee and measure close rate impact',
      'Test improved positioning messaging',
      'Add 2-3 high-perceived-value bonuses',
    ],
  },
  overpriced: {
    signal: 'overpriced',
    title: 'Pricing May Be Too High',
    description: 'Multiple signals suggest significant friction at your current price point. Action needed.',
    hormoziQuote: 'High prices aren\'t bad - but high prices without matching value is. Either dramatically increase the value you deliver, or adjust pricing down. The worst spot is high price with mediocre value.',
    actions: [
      'Audit your value delivery vs. competition',
      'Add significant value or bonuses immediately',
      'Consider a lower-priced entry offering',
      'Improve guarantees and risk reversal',
    ],
    experiments: [
      'Test a 20% lower price point',
      'Create an entry-level offer at 50% current price',
      'Survey lost prospects on price sensitivity',
      'Add a money-back guarantee and measure impact',
    ],
  },
};

/**
 * Get color for pricing signal
 */
export function getSignalColor(signal: PricingSignal): string {
  switch (signal) {
    case 'underpriced':
      return 'blue';
    case 'slightly-low':
      return 'cyan';
    case 'optimal':
      return 'green';
    case 'slightly-high':
      return 'yellow';
    case 'overpriced':
      return 'red';
  }
}
