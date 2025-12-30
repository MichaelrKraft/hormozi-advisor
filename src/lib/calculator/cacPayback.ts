/**
 * CAC Payback Calculator with Churn Modeling
 *
 * Calculates payback period accounting for customer churn,
 * based on Alex Hormozi's unit economics framework.
 */

export interface CACPaybackInputs {
  revenuePerCustomer: number;    // Monthly revenue per customer ($)
  marginalCosts: number;         // Monthly cost to serve per customer ($)
  cac: number;                   // Customer acquisition cost ($)
  monthlyRetention: number;      // Monthly retention rate (0-100)
}

export interface CACPaybackResults {
  grossProfit: number;           // Revenue - Marginal Costs
  grossMarginPercent: number;    // Gross Profit / Revenue * 100
  simplePaybackMonths: number;   // CAC / Gross Profit (ignores churn)
  actualPaybackMonth: number;    // Month when cumulative GP >= CAC (with churn)
  ltv: number;                   // Lifetime value per customer
  ltvCacRatio: number;           // LTV / CAC
  isHealthy: boolean;            // Payback <= 12 months
  cohortData: CohortMonth[];     // Monthly breakdown for visualization
}

export interface CohortMonth {
  month: number;
  retentionPercent: number;      // % of original customers remaining
  monthlyGrossProfit: number;    // GP earned this month
  cumulativeGrossProfit: number; // Total GP earned so far
  cumulativePayback: number;     // Cumulative GP - CAC (negative until payback)
}

/**
 * Calculate CAC Payback Period with churn modeling
 */
export function calculateCACPayback(inputs: CACPaybackInputs): CACPaybackResults {
  const { revenuePerCustomer, marginalCosts, cac, monthlyRetention } = inputs;

  // Basic unit economics
  const grossProfit = revenuePerCustomer - marginalCosts;
  const grossMarginPercent = revenuePerCustomer > 0
    ? (grossProfit / revenuePerCustomer) * 100
    : 0;

  // Simple payback (ignores churn)
  const simplePaybackMonths = grossProfit > 0
    ? cac / grossProfit
    : Infinity;

  // Convert retention to decimal (e.g., 85% -> 0.85)
  const retentionRate = monthlyRetention / 100;

  // LTV calculation using geometric series
  // LTV = GP * (retention / (1 - retention)) for infinite horizon
  // Capped at practical limit where retention^n < 1%
  const ltv = retentionRate < 1 && retentionRate > 0
    ? grossProfit * (retentionRate / (1 - retentionRate))
    : grossProfit * 24; // Fallback: 24 months if 100% retention

  const ltvCacRatio = cac > 0 ? ltv / cac : 0;

  // Calculate cohort data month by month
  const cohortData: CohortMonth[] = [];
  let cumulativeGrossProfit = 0;
  let actualPaybackMonth = 0;
  const maxMonths = 36; // Cap at 3 years

  for (let month = 1; month <= maxMonths; month++) {
    // Retention at month N = retentionRate ^ (N - 1)
    // Month 1: 100%, Month 2: retention%, Month 3: retention^2%, etc.
    const retentionPercent = Math.pow(retentionRate, month - 1) * 100;

    // Stop if retention drops below 1%
    if (retentionPercent < 1 && month > 1) break;

    // Monthly GP = retention fraction * gross profit per customer
    const monthlyGP = (retentionPercent / 100) * grossProfit;
    cumulativeGrossProfit += monthlyGP;

    // Payback = cumulative GP - CAC
    const cumulativePayback = cumulativeGrossProfit - cac;

    cohortData.push({
      month,
      retentionPercent: Math.round(retentionPercent * 10) / 10,
      monthlyGrossProfit: Math.round(monthlyGP * 100) / 100,
      cumulativeGrossProfit: Math.round(cumulativeGrossProfit * 100) / 100,
      cumulativePayback: Math.round(cumulativePayback * 100) / 100,
    });

    // Record payback month (first time cumulative GP >= CAC)
    if (actualPaybackMonth === 0 && cumulativeGrossProfit >= cac) {
      actualPaybackMonth = month;
    }
  }

  // If never paid back within maxMonths
  if (actualPaybackMonth === 0) {
    actualPaybackMonth = maxMonths + 1; // Indicates "never" or "> 36 months"
  }

  return {
    grossProfit: Math.round(grossProfit * 100) / 100,
    grossMarginPercent: Math.round(grossMarginPercent * 10) / 10,
    simplePaybackMonths: Math.round(simplePaybackMonths * 10) / 10,
    actualPaybackMonth,
    ltv: Math.round(ltv * 100) / 100,
    ltvCacRatio: Math.round(ltvCacRatio * 100) / 100,
    isHealthy: actualPaybackMonth <= 12,
    cohortData,
  };
}

/**
 * Get health status color based on payback month
 */
export function getPaybackHealthColor(paybackMonth: number): 'green' | 'sky' | 'red' {
  if (paybackMonth <= 3) return 'green';
  if (paybackMonth <= 12) return 'sky';
  return 'red';
}

/**
 * Get health status label
 */
export function getPaybackHealthLabel(paybackMonth: number): string {
  if (paybackMonth <= 3) return 'Excellent';
  if (paybackMonth <= 6) return 'Good';
  if (paybackMonth <= 12) return 'Acceptable';
  if (paybackMonth <= 24) return 'Slow';
  return 'Needs Improvement';
}

/**
 * Format payback month for display
 */
export function formatPaybackMonth(month: number): string {
  if (month > 36) return '> 36 months';
  if (month === 1) return '1 month';
  return `${month} months`;
}
