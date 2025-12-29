// Score calculation logic for the Hormozi Score Dashboard
// Aggregates data from all tools into a unified business score

import type { CalculatorSnapshot } from '@/types/calculator';
import type { ValueEquationSnapshot } from '@/types/value-equation';
import type { BottleneckSnapshot } from '@/types/bottleneck';
import type { PricingSnapshot, PricingSignal } from '@/types/pricing';
import type { OfferSnapshot } from '@/types/offer-stack';
import type {
  HormoziScore,
  LTVCACScore,
  ValueScore,
  BottleneckScore,
  PricingScore,
  OfferScore,
  HealthRating,
} from '@/types/score';
import { STORAGE_KEYS, SCORE_WEIGHTS, RATING_THRESHOLDS } from '@/types/score';

// Get most recent snapshot from localStorage
function getLatestSnapshot<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  try {
    const data = localStorage.getItem(key);
    if (!data) return null;
    const snapshots = JSON.parse(data) as T[];
    return snapshots.length > 0 ? snapshots[0] : null;
  } catch {
    return null;
  }
}

// Convert numeric score to health rating
export function scoreToRating(score: number): HealthRating {
  if (score < 20) return 'critical';
  if (score < 40) return 'poor';
  if (score < 60) return 'average';
  if (score < 80) return 'good';
  return 'excellent';
}

// Calculate LTV/CAC score (0-100)
function calculateLTVCACScore(snapshot: CalculatorSnapshot | null): LTVCACScore {
  if (!snapshot) {
    return { score: 0, rating: 'critical', status: 'incomplete' };
  }

  const { ratio, ltv, cac, paybackPeriod } = snapshot.results;

  // Score based on ratio (Hormozi says 3:1 minimum, 5:1 good, 10:1+ excellent)
  let score: number;
  if (ratio < 1) score = 10;
  else if (ratio < 2) score = 25;
  else if (ratio < 3) score = 45;
  else if (ratio < 5) score = 65;
  else if (ratio < 10) score = 85;
  else score = 100;

  // Bonus/penalty for payback period
  if (paybackPeriod <= 3) score = Math.min(100, score + 10);
  else if (paybackPeriod > 12) score = Math.max(0, score - 10);

  return {
    score,
    rating: scoreToRating(score),
    status: 'complete',
    lastUpdated: snapshot.timestamp,
    ratio,
    ltv,
    cac,
    paybackMonths: paybackPeriod,
  };
}

// Calculate Value Equation score (0-100)
function calculateValueScore(snapshot: ValueEquationSnapshot | null): ValueScore {
  if (!snapshot) {
    return { score: 0, rating: 'critical', status: 'incomplete' };
  }

  const { score: valueScore, rating, weakestDimension, strongestDimension } = snapshot.results;

  // Normalize value score (typically 0.5-20 range) to 0-100
  let normalizedScore: number;
  if (valueScore < 1) normalizedScore = 15;
  else if (valueScore < 2) normalizedScore = 30;
  else if (valueScore < 4) normalizedScore = 50;
  else if (valueScore < 6) normalizedScore = 70;
  else if (valueScore < 10) normalizedScore = 85;
  else normalizedScore = 100;

  const dimensionLabels: Record<string, string> = {
    dreamOutcome: 'Dream Outcome',
    perceivedLikelihood: 'Perceived Likelihood',
    timeDelay: 'Time Delay',
    effortSacrifice: 'Effort & Sacrifice',
  };

  return {
    score: normalizedScore,
    rating: scoreToRating(normalizedScore),
    status: 'complete',
    lastUpdated: snapshot.timestamp,
    valueScore,
    weakestArea: dimensionLabels[weakestDimension],
    strongestArea: dimensionLabels[strongestDimension],
  };
}

// Calculate Bottleneck score (0-100)
function calculateBottleneckScore(snapshot: BottleneckSnapshot | null): BottleneckScore {
  if (!snapshot) {
    return { score: 0, rating: 'critical', status: 'incomplete' };
  }

  const { primary, percentages } = snapshot.results;

  // Score based on how concentrated the bottleneck is
  // Higher concentration = clearer problem = better score
  const maxPercentage = Math.max(...Object.values(percentages));
  const clarity = maxPercentage; // 25-100 range typically

  // If no clear bottleneck (all roughly equal), that's actually helpful info
  let score: number;
  if (clarity > 40) score = 80; // Clear bottleneck identified
  else if (clarity > 35) score = 70;
  else if (clarity > 30) score = 60;
  else score = 50; // Multiple issues to address

  return {
    score,
    rating: scoreToRating(score),
    status: 'complete',
    lastUpdated: snapshot.timestamp,
    primaryBottleneck: primary,
    bottleneckSeverity: clarity,
  };
}

// Calculate Pricing score (0-100)
function calculatePricingScore(snapshot: PricingSnapshot | null): PricingScore {
  if (!snapshot) {
    return { score: 0, rating: 'critical', status: 'incomplete' };
  }

  const { overallSignal, confidenceScore, priceAdjustment } = snapshot.results;

  // Score based on pricing signal
  const signalScores: Record<PricingSignal, number> = {
    optimal: 95,
    'slightly-high': 70,
    'slightly-low': 65,
    underpriced: 40,
    overpriced: 35,
  };

  let score = signalScores[overallSignal] || 50;

  // Adjust based on confidence
  if (confidenceScore > 75) score = Math.min(100, score + 5);
  else if (confidenceScore < 50) score = Math.max(0, score - 5);

  return {
    score,
    rating: scoreToRating(score),
    status: 'complete',
    lastUpdated: snapshot.timestamp,
    signal: overallSignal,
    confidencePercent: confidenceScore,
    adjustmentDirection: priceAdjustment.direction,
  };
}

// Calculate Offer Stack score (0-100)
function calculateOfferScore(snapshot: OfferSnapshot | null): OfferScore {
  if (!snapshot) {
    return { score: 0, rating: 'critical', status: 'incomplete' };
  }

  const { strengthScore, totalValue, priceToValueRatio } = snapshot.analysis;

  // Strength score is 0-100, use it directly with minor adjustments
  let score = strengthScore;

  // Bonus for high price-to-value ratio
  if (priceToValueRatio > 10) score = Math.min(100, score + 10);
  else if (priceToValueRatio > 5) score = Math.min(100, score + 5);

  return {
    score,
    rating: scoreToRating(score),
    status: 'complete',
    lastUpdated: snapshot.timestamp,
    strengthScore,
    totalValue,
    priceToValueRatio,
  };
}

// Calculate complete Hormozi Score
export function calculateHormoziScore(): HormoziScore {
  // Fetch latest snapshots
  const calcSnapshot = getLatestSnapshot<CalculatorSnapshot>(STORAGE_KEYS.calculator);
  const valueSnapshot = getLatestSnapshot<ValueEquationSnapshot>(STORAGE_KEYS.valueEquation);
  const bottleneckSnapshot = getLatestSnapshot<BottleneckSnapshot>(STORAGE_KEYS.bottleneck);
  const pricingSnapshot = getLatestSnapshot<PricingSnapshot>(STORAGE_KEYS.pricing);
  const offerSnapshot = getLatestSnapshot<OfferSnapshot>(STORAGE_KEYS.offerStack);

  // Calculate individual scores
  const ltvCac = calculateLTVCACScore(calcSnapshot);
  const valueEquation = calculateValueScore(valueSnapshot);
  const bottleneck = calculateBottleneckScore(bottleneckSnapshot);
  const pricing = calculatePricingScore(pricingSnapshot);
  const offerStack = calculateOfferScore(offerSnapshot);

  // Count completed tools
  const tools = [ltvCac, valueEquation, bottleneck, pricing, offerStack];
  const toolsCompleted = tools.filter((t) => t.status === 'complete').length;
  const totalTools = 5;
  const completeness = Math.round((toolsCompleted / totalTools) * 100);

  // Calculate weighted overall score (only from completed tools)
  let weightedSum = 0;
  let totalWeight = 0;

  if (ltvCac.status === 'complete') {
    weightedSum += ltvCac.score * SCORE_WEIGHTS.ltvCac;
    totalWeight += SCORE_WEIGHTS.ltvCac;
  }
  if (valueEquation.status === 'complete') {
    weightedSum += valueEquation.score * SCORE_WEIGHTS.valueEquation;
    totalWeight += SCORE_WEIGHTS.valueEquation;
  }
  if (bottleneck.status === 'complete') {
    weightedSum += bottleneck.score * SCORE_WEIGHTS.bottleneck;
    totalWeight += SCORE_WEIGHTS.bottleneck;
  }
  if (pricing.status === 'complete') {
    weightedSum += pricing.score * SCORE_WEIGHTS.pricing;
    totalWeight += SCORE_WEIGHTS.pricing;
  }
  if (offerStack.status === 'complete') {
    weightedSum += offerStack.score * SCORE_WEIGHTS.offerStack;
    totalWeight += SCORE_WEIGHTS.offerStack;
  }

  const overallScore = totalWeight > 0 ? Math.round(weightedSum / totalWeight) : 0;

  return {
    overallScore,
    overallRating: scoreToRating(overallScore),
    completeness,
    ltvCac,
    valueEquation,
    bottleneck,
    pricing,
    offerStack,
    calculatedAt: Date.now(),
    toolsCompleted,
    totalTools,
  };
}

// Get improvement recommendations based on score
export function getRecommendations(score: HormoziScore): string[] {
  const recommendations: string[] = [];

  // Check completeness first
  if (score.completeness < 100) {
    const incomplete: string[] = [];
    if (score.ltvCac.status === 'incomplete') incomplete.push('LTV/CAC Calculator');
    if (score.valueEquation.status === 'incomplete') incomplete.push('Value Equation');
    if (score.bottleneck.status === 'incomplete') incomplete.push('Bottleneck Diagnostic');
    if (score.pricing.status === 'incomplete') incomplete.push('Pricing Analysis');
    if (score.offerStack.status === 'incomplete') incomplete.push('Offer Stack Builder');

    recommendations.push(`Complete ${incomplete.join(', ')} for a full business analysis.`);
  }

  // Specific tool recommendations
  if (score.ltvCac.status === 'complete' && score.ltvCac.score < 60) {
    if (score.ltvCac.ratio && score.ltvCac.ratio < 3) {
      recommendations.push('Focus on improving LTV or reducing CAC to achieve a 3:1 ratio minimum.');
    }
  }

  if (score.valueEquation.status === 'complete' && score.valueEquation.score < 60) {
    recommendations.push(`Improve your offer's ${score.valueEquation.weakestArea} to increase perceived value.`);
  }

  if (score.bottleneck.status === 'complete') {
    const areaLabels = {
      leads: 'lead generation',
      conversion: 'conversion rate',
      pricing: 'pricing strategy',
      retention: 'customer retention',
    };
    recommendations.push(`Your primary bottleneck is ${areaLabels[score.bottleneck.primaryBottleneck!]}. Focus here first.`);
  }

  if (score.pricing.status === 'complete' && score.pricing.score < 70) {
    if (score.pricing.adjustmentDirection === 'increase') {
      recommendations.push('Market signals suggest you can raise prices. Test a 10-20% increase.');
    } else if (score.pricing.adjustmentDirection === 'decrease') {
      recommendations.push('Pricing may be too high. Consider testing lower price points or adding more value.');
    }
  }

  if (score.offerStack.status === 'complete' && score.offerStack.score < 70) {
    recommendations.push('Strengthen your offer stack with bonuses, guarantees, or scarcity elements.');
  }

  return recommendations.slice(0, 4); // Return top 4 recommendations
}
