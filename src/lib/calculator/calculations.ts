import type { LTVInputs, CACInputs, CalculatorInputs, CalculatorResults, RatingTier } from '@/types/calculator';

/**
 * Calculate LTV (Lifetime Value) - Hormozi's definition uses GROSS PROFIT, not revenue
 */
export function calculateLTV(inputs: LTVInputs): number {
  const annualRevenue = inputs.averageOrderValue * inputs.purchaseFrequency;
  const grossProfit = annualRevenue * (inputs.grossMarginPercent / 100);
  const ltv = grossProfit * inputs.customerLifespan;
  return Math.round(ltv * 100) / 100;
}

/**
 * Calculate CAC (Customer Acquisition Cost)
 */
export function calculateCAC(inputs: CACInputs): number {
  if (inputs.newCustomersPerMonth === 0) return 0;
  const monthlySpend = inputs.monthlyMarketingSpend + inputs.monthlySalesCosts;
  const cac = monthlySpend / inputs.newCustomersPerMonth;
  return Math.round(cac * 100) / 100;
}

/**
 * Calculate LTV:CAC Ratio
 */
export function calculateRatio(ltv: number, cac: number): number {
  if (cac === 0) return 0;
  return Math.round((ltv / cac) * 100) / 100;
}

/**
 * Calculate Monthly Gross Profit per customer
 */
export function calculateMonthlyGrossProfit(inputs: LTVInputs): number {
  const annualRevenue = inputs.averageOrderValue * inputs.purchaseFrequency;
  const grossProfit = annualRevenue * (inputs.grossMarginPercent / 100);
  return Math.round((grossProfit / 12) * 100) / 100;
}

/**
 * Calculate Payback Period in months
 */
export function calculatePaybackPeriod(cac: number, monthlyGrossProfit: number): number {
  if (monthlyGrossProfit === 0) return 0;
  return Math.round((cac / monthlyGrossProfit) * 10) / 10;
}

/**
 * Perform all calculations
 */
export function calculateAll(inputs: CalculatorInputs): CalculatorResults {
  const ltv = calculateLTV(inputs);
  const cac = calculateCAC(inputs);
  const ratio = calculateRatio(ltv, cac);
  const monthlyGrossProfit = calculateMonthlyGrossProfit(inputs);
  const paybackPeriod = calculatePaybackPeriod(cac, monthlyGrossProfit);

  return {
    ltv,
    cac,
    ratio,
    paybackPeriod,
    monthlyGrossProfit,
  };
}

/**
 * Determine the rating tier based on ratio
 */
export function getRatingTier(ratio: number): RatingTier {
  if (ratio < 1) return 'below1';
  if (ratio < 2) return 'ratio1to2';
  if (ratio < 3) return 'ratio2to3';
  if (ratio < 5) return 'ratio3to5';
  if (ratio < 10) return 'ratio5to10';
  return 'above10';
}

/**
 * Format currency for display
 */
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format ratio for display
 */
export function formatRatio(ratio: number): string {
  if (ratio === 0) return '0:1';
  return `${ratio.toFixed(1)}:1`;
}
