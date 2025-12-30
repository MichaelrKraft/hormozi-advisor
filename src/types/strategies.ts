// Strategy Types for LTV:CAC Strategy Simulator
// Based on Alex Hormozi's "5 Ways to Increase LTV:CAC Ratio"

export type StrategyType =
  | 'giveaway'
  | 'membership'
  | 'bnpl'
  | 'subscription'
  | 'pricing';

export type IndustryType =
  | 'saas'
  | 'ecommerce'
  | 'agency'
  | 'coaching'
  | 'local';

// Base metrics passed from calculator
export interface BaseMetrics {
  ltv: number;
  cac: number;
  ratio: number;
  // Optional inputs for smarter recommendations
  grossMarginPercent?: number;
  purchaseFrequency?: number;
  averageOrderValue?: number;
}

// Strategy-specific parameter inputs
export interface GiveawayParams {
  emailCaptureRate: number;    // % of bounced visitors captured
  emailConversionRate: number; // % of emails that become customers
  bounceRate: number;          // % of visitors who bounce (default ~90%)
}

export interface MembershipParams {
  membershipPrice: number;     // $ per year
  membershipConversion: number; // % of customers who join
  frequencyLift: number;       // % increase in purchase frequency
}

export interface BNPLParams {
  cvrLift: number;             // % increase in conversion rate
  aovLift: number;             // % increase in average order value
}

export interface SubscriptionParams {
  subscriptionPrice: number;   // $ per month
  retentionRate: number;       // % monthly retention
  subscriptionConversion: number; // % who convert to subscription
}

export interface PricingParams {
  priceIncrease: number;       // % price increase
  expectedCvrDrop: number;     // % drop in conversion rate
}

export type StrategyParams =
  | GiveawayParams
  | MembershipParams
  | BNPLParams
  | SubscriptionParams
  | PricingParams;

// Simulation result for a single strategy
export interface StrategyResult {
  strategyType: StrategyType;
  strategyName: string;
  newLtv: number;
  newCac: number;
  newRatio: number;
  ltvChange: number;           // % change
  cacChange: number;           // % change
  ratioChange: number;         // % change (improvement)
  explanation: string;
}

// Strategy metadata for UI
export interface StrategyInfo {
  type: StrategyType;
  name: string;
  shortName: string;
  icon: string;                // Emoji for display
  description: string;
  hormoziQuote: string;
}

// Recommendation with reasoning
export interface StrategyRecommendation {
  primaryStrategy: StrategyType;
  reasoning: string;
  projectedImprovement: number; // % improvement in ratio
  secondaryStrategy?: StrategyType;
  secondaryReasoning?: string;
}

// Industry defaults for all strategies
export interface IndustryDefaults {
  giveaway: GiveawayParams;
  membership: MembershipParams;
  bnpl: BNPLParams;
  subscription: SubscriptionParams;
  pricing: PricingParams;
}

// Complete simulation state
export interface SimulationState {
  baseMetrics: BaseMetrics;
  industry: IndustryType;
  activeStrategy: StrategyType | null;
  params: {
    giveaway: GiveawayParams;
    membership: MembershipParams;
    bnpl: BNPLParams;
    subscription: SubscriptionParams;
    pricing: PricingParams;
  };
  results: StrategyResult[];
  recommendation: StrategyRecommendation | null;
}
