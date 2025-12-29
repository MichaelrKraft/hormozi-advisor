// LTV Input Fields
export interface LTVInputs {
  averageOrderValue: number;      // $ per transaction
  purchaseFrequency: number;      // purchases per year
  customerLifespan: number;       // years
  grossMarginPercent: number;     // % (0-100)
}

// CAC Input Fields
export interface CACInputs {
  monthlyMarketingSpend: number;  // $ per month
  monthlySalesCosts: number;      // $ per month (salaries, commissions)
  newCustomersPerMonth: number;   // count
}

// Combined Inputs
export interface CalculatorInputs extends LTVInputs, CACInputs {}

// Calculation Results
export interface CalculatorResults {
  ltv: number;
  cac: number;
  ratio: number;
  paybackPeriod: number;
  monthlyGrossProfit: number;
}

// Rating Tiers
export type RatingTier =
  | 'below1'
  | 'ratio1to2'
  | 'ratio2to3'
  | 'ratio3to5'
  | 'ratio5to10'
  | 'above10';

// Interpretation for each tier
export interface RatioInterpretation {
  rating: string;
  color: string;
  message: string;
  hormozi: string;
}

// Lever Recommendation
export interface Recommendation {
  lever: string;
  impact: 'high' | 'medium' | 'low';
  action: string;
  hormoziQuote: string;
}

// Saved Snapshot
export interface CalculatorSnapshot {
  id: string;
  timestamp: number;
  inputs: CalculatorInputs;
  results: CalculatorResults;
  notes?: string;
}

// Industry Presets
export interface IndustryPreset {
  name: string;
  defaults: Partial<CalculatorInputs>;
}
