// Hormozi Score Dashboard Types
// Aggregates results from all tools into one comprehensive business score

import type { CalculatorResults, CalculatorSnapshot } from './calculator';
import type { ValueEquationResults, ValueEquationSnapshot } from './value-equation';
import type { BottleneckResults, BottleneckSnapshot, BottleneckArea } from './bottleneck';
import type { PricingResults, PricingSnapshot, PricingSignal } from './pricing';
import type { OfferAnalysis, OfferSnapshot } from './offer-stack';

// Health rating for each component
export type HealthRating = 'critical' | 'poor' | 'average' | 'good' | 'excellent';

// Individual tool scores
export interface ToolScore {
  score: number;           // 0-100 normalized score
  rating: HealthRating;    // Qualitative rating
  status: 'complete' | 'incomplete';  // Whether the tool has been used
  lastUpdated?: number;    // Timestamp of last calculation
}

// LTV/CAC Score Details
export interface LTVCACScore extends ToolScore {
  ratio?: number;
  ltv?: number;
  cac?: number;
  paybackMonths?: number;
}

// Value Equation Score Details
export interface ValueScore extends ToolScore {
  valueScore?: number;
  weakestArea?: string;
  strongestArea?: string;
}

// Bottleneck Score Details
export interface BottleneckScore extends ToolScore {
  primaryBottleneck?: BottleneckArea;
  bottleneckSeverity?: number;
}

// Pricing Score Details
export interface PricingScore extends ToolScore {
  signal?: PricingSignal;
  confidencePercent?: number;
  adjustmentDirection?: 'increase' | 'decrease' | 'hold';
}

// Offer Stack Score Details
export interface OfferScore extends ToolScore {
  strengthScore?: number;
  totalValue?: number;
  priceToValueRatio?: number;
}

// Complete aggregated score
export interface HormoziScore {
  // Overall metrics
  overallScore: number;    // 0-100 weighted average
  overallRating: HealthRating;
  completeness: number;    // 0-100 % of tools used

  // Individual tool scores
  ltvCac: LTVCACScore;
  valueEquation: ValueScore;
  bottleneck: BottleneckScore;
  pricing: PricingScore;
  offerStack: OfferScore;

  // Meta
  calculatedAt: number;
  toolsCompleted: number;
  totalTools: number;
}

// Storage keys for each tool's snapshots
export const STORAGE_KEYS = {
  calculator: 'hormozi-calculator-snapshots',
  valueEquation: 'hormozi-value-equation-snapshots',
  bottleneck: 'hormozi-bottleneck-snapshots',
  pricing: 'hormozi-pricing-snapshots',
  offerStack: 'hormozi-offer-stack-snapshots',
} as const;

// Weight for each tool in overall score calculation
export const SCORE_WEIGHTS = {
  ltvCac: 25,        // Unit economics are foundational
  valueEquation: 20, // Offer value is critical
  bottleneck: 15,    // Knowing constraints helps focus
  pricing: 20,       // Pricing directly impacts revenue
  offerStack: 20,    // Complete offer is key to conversion
} as const;

// Rating thresholds
export const RATING_THRESHOLDS: Record<HealthRating, { min: number; max: number }> = {
  critical: { min: 0, max: 20 },
  poor: { min: 20, max: 40 },
  average: { min: 40, max: 60 },
  good: { min: 60, max: 80 },
  excellent: { min: 80, max: 100 },
};

// Rating metadata for display
export const RATING_META: Record<HealthRating, { label: string; color: string; bgColor: string; emoji: string }> = {
  critical: {
    label: 'Critical',
    color: 'text-red-400',
    bgColor: 'bg-red-500/10 border-red-500/20',
    emoji: '🔴',
  },
  poor: {
    label: 'Needs Work',
    color: 'text-orange-400',
    bgColor: 'bg-orange-500/10 border-orange-500/20',
    emoji: '🟠',
  },
  average: {
    label: 'Average',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10 border-yellow-500/20',
    emoji: '🟡',
  },
  good: {
    label: 'Good',
    color: 'text-emerald-400',
    bgColor: 'bg-emerald-500/10 border-emerald-500/20',
    emoji: '🟢',
  },
  excellent: {
    label: 'Excellent',
    color: 'text-amber-400',
    bgColor: 'bg-amber-500/10 border-amber-500/20',
    emoji: '⭐',
  },
};
