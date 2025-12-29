// Pricing Confidence Tool Types

export type PricingSignal =
  | 'underpriced'
  | 'slightly-low'
  | 'optimal'
  | 'slightly-high'
  | 'overpriced';

export interface PricingIndicator {
  id: string;
  category: PricingCategory;
  question: string;
  lowLabel: string;
  highLabel: string;
  weight: number;
  interpretation: {
    low: { signal: PricingSignal; insight: string };
    mid: { signal: PricingSignal; insight: string };
    high: { signal: PricingSignal; insight: string };
  };
}

export type PricingCategory =
  | 'sales-friction'
  | 'customer-behavior'
  | 'market-position'
  | 'value-perception';

export interface PricingInputs {
  currentPrice: number;
  industry: string;
  indicators: Record<string, number>;
}

export interface PricingResults {
  overallSignal: PricingSignal;
  confidenceScore: number;
  signalBreakdown: Record<PricingSignal, number>;
  categoryInsights: CategoryInsight[];
  recommendedAction: string;
  priceAdjustment: {
    direction: 'increase' | 'decrease' | 'hold';
    range: string;
    confidence: number;
  };
}

export interface CategoryInsight {
  category: PricingCategory;
  signal: PricingSignal;
  insight: string;
  score: number;
}

export interface PricingAdvice {
  signal: PricingSignal;
  title: string;
  description: string;
  hormoziQuote: string;
  actions: string[];
  experiments: string[];
}

export interface PricingSnapshot {
  id: string;
  timestamp: number;
  inputs: PricingInputs;
  results: PricingResults;
}

// Category metadata
export const PRICING_CATEGORIES: Record<PricingCategory, { label: string; icon: string }> = {
  'sales-friction': {
    label: 'Sales Friction',
    icon: '🚧',
  },
  'customer-behavior': {
    label: 'Customer Behavior',
    icon: '👥',
  },
  'market-position': {
    label: 'Market Position',
    icon: '📊',
  },
  'value-perception': {
    label: 'Value Perception',
    icon: '💎',
  },
};
