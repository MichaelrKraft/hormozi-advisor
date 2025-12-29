import type {
  PricingInputs,
  PricingResults,
  PricingSignal,
  CategoryInsight,
  PricingCategory,
} from '@/types/pricing';
import { PRICING_INDICATORS } from './indicators';
import { PRICING_CATEGORIES } from '@/types/pricing';

/**
 * Map score (1-10) to interpretation level
 */
function getInterpretationLevel(score: number): 'low' | 'mid' | 'high' {
  if (score <= 3) return 'low';
  if (score <= 7) return 'mid';
  return 'high';
}

/**
 * Calculate pricing results from inputs
 */
export function calculatePricingResults(inputs: PricingInputs): PricingResults {
  // Initialize signal counts
  const signalBreakdown: Record<PricingSignal, number> = {
    underpriced: 0,
    'slightly-low': 0,
    optimal: 0,
    'slightly-high': 0,
    overpriced: 0,
  };

  // Category insights
  const categorySignals: Record<PricingCategory, { signals: PricingSignal[]; insights: string[] }> = {
    'sales-friction': { signals: [], insights: [] },
    'customer-behavior': { signals: [], insights: [] },
    'market-position': { signals: [], insights: [] },
    'value-perception': { signals: [], insights: [] },
  };

  let totalWeight = 0;

  // Process each indicator
  for (const indicator of PRICING_INDICATORS) {
    const score = inputs.indicators[indicator.id];
    if (score === undefined) continue;

    const level = getInterpretationLevel(score);
    const interpretation = indicator.interpretation[level];

    // Add to signal breakdown (weighted)
    signalBreakdown[interpretation.signal] += indicator.weight;
    totalWeight += indicator.weight;

    // Add to category insights
    categorySignals[indicator.category].signals.push(interpretation.signal);
    categorySignals[indicator.category].insights.push(interpretation.insight);
  }

  // Normalize signal breakdown to percentages
  if (totalWeight > 0) {
    for (const signal of Object.keys(signalBreakdown) as PricingSignal[]) {
      signalBreakdown[signal] = Math.round((signalBreakdown[signal] / totalWeight) * 100);
    }
  }

  // Determine overall signal
  const overallSignal = determineOverallSignal(signalBreakdown);

  // Calculate category insights
  const categoryInsights: CategoryInsight[] = Object.entries(categorySignals).map(
    ([category, data]) => {
      const dominantSignal = getMostCommonSignal(data.signals);
      return {
        category: category as PricingCategory,
        signal: dominantSignal,
        insight: data.insights[0] || '',
        score: signalToScore(dominantSignal),
      };
    }
  );

  // Calculate confidence score
  const confidenceScore = calculateConfidenceScore(signalBreakdown, overallSignal);

  // Determine recommended action and price adjustment
  const priceAdjustment = getPriceAdjustment(overallSignal, signalBreakdown);
  const recommendedAction = getRecommendedAction(overallSignal);

  return {
    overallSignal,
    confidenceScore,
    signalBreakdown,
    categoryInsights,
    recommendedAction,
    priceAdjustment,
  };
}

/**
 * Determine the overall pricing signal from breakdown
 */
function determineOverallSignal(breakdown: Record<PricingSignal, number>): PricingSignal {
  // Weight the signals on a scale (-2 to +2)
  const weights: Record<PricingSignal, number> = {
    underpriced: -2,
    'slightly-low': -1,
    optimal: 0,
    'slightly-high': 1,
    overpriced: 2,
  };

  let weightedSum = 0;
  let totalPercent = 0;

  for (const [signal, percent] of Object.entries(breakdown) as [PricingSignal, number][]) {
    weightedSum += weights[signal] * percent;
    totalPercent += percent;
  }

  const average = totalPercent > 0 ? weightedSum / totalPercent : 0;

  // Map average back to signal
  if (average <= -1.5) return 'underpriced';
  if (average <= -0.5) return 'slightly-low';
  if (average <= 0.5) return 'optimal';
  if (average <= 1.5) return 'slightly-high';
  return 'overpriced';
}

/**
 * Get most common signal from array
 */
function getMostCommonSignal(signals: PricingSignal[]): PricingSignal {
  const counts: Record<PricingSignal, number> = {
    underpriced: 0,
    'slightly-low': 0,
    optimal: 0,
    'slightly-high': 0,
    overpriced: 0,
  };

  for (const signal of signals) {
    counts[signal]++;
  }

  let maxSignal: PricingSignal = 'optimal';
  let maxCount = 0;

  for (const [signal, count] of Object.entries(counts) as [PricingSignal, number][]) {
    if (count > maxCount) {
      maxCount = count;
      maxSignal = signal;
    }
  }

  return maxSignal;
}

/**
 * Convert signal to numeric score for display
 */
function signalToScore(signal: PricingSignal): number {
  switch (signal) {
    case 'underpriced':
      return 20;
    case 'slightly-low':
      return 40;
    case 'optimal':
      return 60;
    case 'slightly-high':
      return 80;
    case 'overpriced':
      return 100;
  }
}

/**
 * Calculate confidence score (how clear the signals are)
 */
function calculateConfidenceScore(
  breakdown: Record<PricingSignal, number>,
  overallSignal: PricingSignal
): number {
  // Higher confidence when signals are more concentrated
  const overallPercent = breakdown[overallSignal];

  // Also consider adjacent signals
  const adjacentSignals: Record<PricingSignal, PricingSignal[]> = {
    underpriced: ['slightly-low'],
    'slightly-low': ['underpriced', 'optimal'],
    optimal: ['slightly-low', 'slightly-high'],
    'slightly-high': ['optimal', 'overpriced'],
    overpriced: ['slightly-high'],
  };

  const adjacentPercent = adjacentSignals[overallSignal].reduce(
    (sum, signal) => sum + breakdown[signal],
    0
  );

  // Base confidence on concentration
  const baseConfidence = overallPercent + adjacentPercent * 0.5;

  // Scale to 0-100
  return Math.min(Math.round(baseConfidence), 100);
}

/**
 * Get price adjustment recommendation
 */
function getPriceAdjustment(
  signal: PricingSignal,
  breakdown: Record<PricingSignal, number>
): {
  direction: 'increase' | 'decrease' | 'hold';
  range: string;
  confidence: number;
} {
  const confidence = breakdown[signal];

  switch (signal) {
    case 'underpriced':
      return { direction: 'increase', range: '20-30%', confidence };
    case 'slightly-low':
      return { direction: 'increase', range: '10-15%', confidence };
    case 'optimal':
      return { direction: 'hold', range: '0-5% test', confidence };
    case 'slightly-high':
      return { direction: 'hold', range: 'Add value instead', confidence };
    case 'overpriced':
      return { direction: 'decrease', range: '15-20% or add significant value', confidence };
  }
}

/**
 * Get recommended action text
 */
function getRecommendedAction(signal: PricingSignal): string {
  switch (signal) {
    case 'underpriced':
      return 'Raise prices significantly. You\'re leaving substantial profit on the table.';
    case 'slightly-low':
      return 'Consider a 10-15% price increase. The market likely supports it.';
    case 'optimal':
      return 'Pricing looks healthy. Focus on value delivery and test small increases.';
    case 'slightly-high':
      return 'Focus on increasing perceived value rather than cutting price.';
    case 'overpriced':
      return 'Either significantly increase value delivered or consider price adjustment.';
  }
}
