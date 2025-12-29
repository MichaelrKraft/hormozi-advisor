// Industry Benchmarks Data
// Based on industry research and Hormozi's frameworks
// These are starting benchmarks - can be expanded with real user data later

export type Industry =
  | 'saas'
  | 'ecommerce'
  | 'coaching'
  | 'agency'
  | 'info-products'
  | 'local-service'
  | 'healthcare'
  | 'fitness'
  | 'real-estate'
  | 'general';

export interface IndustryBenchmark {
  id: Industry;
  name: string;
  icon: string;
  ltvCac: {
    median: number;
    good: number;      // 75th percentile
    excellent: number; // 90th percentile
  };
  paybackMonths: {
    median: number;
    good: number;
    excellent: number;
  };
  grossMargin: {
    median: number;
    good: number;
    excellent: number;
  };
  churnRate: {
    median: number;     // Monthly
    good: number;
    excellent: number;
  };
  aov: {
    median: number;
    good: number;
    excellent: number;
  };
}

export const INDUSTRY_BENCHMARKS: Record<Industry, IndustryBenchmark> = {
  saas: {
    id: 'saas',
    name: 'SaaS / Software',
    icon: '💻',
    ltvCac: { median: 3.0, good: 5.0, excellent: 8.0 },
    paybackMonths: { median: 12, good: 8, excellent: 4 },
    grossMargin: { median: 70, good: 80, excellent: 85 },
    churnRate: { median: 5, good: 3, excellent: 1.5 },
    aov: { median: 100, good: 250, excellent: 500 },
  },
  ecommerce: {
    id: 'ecommerce',
    name: 'E-commerce',
    icon: '🛒',
    ltvCac: { median: 2.5, good: 4.0, excellent: 6.0 },
    paybackMonths: { median: 6, good: 3, excellent: 1 },
    grossMargin: { median: 40, good: 55, excellent: 70 },
    churnRate: { median: 8, good: 5, excellent: 3 },
    aov: { median: 75, good: 150, excellent: 300 },
  },
  coaching: {
    id: 'coaching',
    name: 'Coaching / Consulting',
    icon: '🎯',
    ltvCac: { median: 4.0, good: 7.0, excellent: 12.0 },
    paybackMonths: { median: 3, good: 1.5, excellent: 0.5 },
    grossMargin: { median: 75, good: 85, excellent: 90 },
    churnRate: { median: 10, good: 6, excellent: 3 },
    aov: { median: 2000, good: 5000, excellent: 10000 },
  },
  agency: {
    id: 'agency',
    name: 'Agency / Services',
    icon: '🏢',
    ltvCac: { median: 3.5, good: 5.5, excellent: 9.0 },
    paybackMonths: { median: 4, good: 2, excellent: 1 },
    grossMargin: { median: 50, good: 65, excellent: 75 },
    churnRate: { median: 6, good: 4, excellent: 2 },
    aov: { median: 3000, good: 7500, excellent: 15000 },
  },
  'info-products': {
    id: 'info-products',
    name: 'Info Products / Courses',
    icon: '📚',
    ltvCac: { median: 5.0, good: 8.0, excellent: 15.0 },
    paybackMonths: { median: 1, good: 0.5, excellent: 0.25 },
    grossMargin: { median: 85, good: 90, excellent: 95 },
    churnRate: { median: 12, good: 8, excellent: 4 },
    aov: { median: 500, good: 1500, excellent: 3000 },
  },
  'local-service': {
    id: 'local-service',
    name: 'Local Services',
    icon: '🏠',
    ltvCac: { median: 3.0, good: 5.0, excellent: 8.0 },
    paybackMonths: { median: 4, good: 2, excellent: 1 },
    grossMargin: { median: 45, good: 60, excellent: 70 },
    churnRate: { median: 7, good: 4, excellent: 2 },
    aov: { median: 250, good: 500, excellent: 1000 },
  },
  healthcare: {
    id: 'healthcare',
    name: 'Healthcare / Wellness',
    icon: '🏥',
    ltvCac: { median: 4.0, good: 6.0, excellent: 10.0 },
    paybackMonths: { median: 6, good: 3, excellent: 1.5 },
    grossMargin: { median: 55, good: 70, excellent: 80 },
    churnRate: { median: 5, good: 3, excellent: 1.5 },
    aov: { median: 200, good: 500, excellent: 1500 },
  },
  fitness: {
    id: 'fitness',
    name: 'Fitness / Gym',
    icon: '💪',
    ltvCac: { median: 3.5, good: 5.5, excellent: 8.0 },
    paybackMonths: { median: 5, good: 3, excellent: 1.5 },
    grossMargin: { median: 60, good: 75, excellent: 85 },
    churnRate: { median: 8, good: 5, excellent: 3 },
    aov: { median: 150, good: 300, excellent: 500 },
  },
  'real-estate': {
    id: 'real-estate',
    name: 'Real Estate',
    icon: '🏘️',
    ltvCac: { median: 5.0, good: 8.0, excellent: 15.0 },
    paybackMonths: { median: 6, good: 3, excellent: 1 },
    grossMargin: { median: 30, good: 45, excellent: 60 },
    churnRate: { median: 3, good: 2, excellent: 1 },
    aov: { median: 10000, good: 25000, excellent: 50000 },
  },
  general: {
    id: 'general',
    name: 'General / Other',
    icon: '📊',
    ltvCac: { median: 3.0, good: 5.0, excellent: 8.0 },
    paybackMonths: { median: 6, good: 3, excellent: 1.5 },
    grossMargin: { median: 50, good: 65, excellent: 80 },
    churnRate: { median: 6, good: 4, excellent: 2 },
    aov: { median: 500, good: 1500, excellent: 3000 },
  },
};

// Get benchmark comparison for a value
export type PercentileRank = 'below-median' | 'median' | 'good' | 'excellent';

export interface BenchmarkComparison {
  rank: PercentileRank;
  percentile: number;       // Estimated percentile (0-100)
  vsMedian: number;         // Percentage vs median (e.g., 150 = 50% above)
  label: string;
  color: string;
}

export function compareToBenchmark(
  value: number,
  benchmark: { median: number; good: number; excellent: number },
  higherIsBetter: boolean = true
): BenchmarkComparison {
  const { median, good, excellent } = benchmark;

  let rank: PercentileRank;
  let percentile: number;

  if (higherIsBetter) {
    if (value >= excellent) {
      rank = 'excellent';
      percentile = 90 + Math.min(10, ((value - excellent) / excellent) * 10);
    } else if (value >= good) {
      rank = 'good';
      percentile = 75 + ((value - good) / (excellent - good)) * 15;
    } else if (value >= median) {
      rank = 'median';
      percentile = 50 + ((value - median) / (good - median)) * 25;
    } else {
      rank = 'below-median';
      percentile = Math.max(5, (value / median) * 50);
    }
  } else {
    // For metrics where lower is better (churn, payback)
    if (value <= excellent) {
      rank = 'excellent';
      percentile = 90 + Math.min(10, ((excellent - value) / excellent) * 10);
    } else if (value <= good) {
      rank = 'good';
      percentile = 75 + ((good - value) / (good - excellent)) * 15;
    } else if (value <= median) {
      rank = 'median';
      percentile = 50 + ((median - value) / (median - good)) * 25;
    } else {
      rank = 'below-median';
      percentile = Math.max(5, 50 - ((value - median) / median) * 50);
    }
  }

  const vsMedian = Math.round((value / median) * 100);

  const labels: Record<PercentileRank, string> = {
    'below-median': 'Below Average',
    median: 'Average',
    good: 'Above Average',
    excellent: 'Top 10%',
  };

  const colors: Record<PercentileRank, string> = {
    'below-median': 'text-red-400',
    median: 'text-yellow-400',
    good: 'text-emerald-400',
    excellent: 'text-amber-400',
  };

  return {
    rank,
    percentile: Math.round(percentile),
    vsMedian,
    label: labels[rank],
    color: colors[rank],
  };
}

// Industry name lookup
export function getIndustryName(industry: string): string {
  const benchmark = INDUSTRY_BENCHMARKS[industry as Industry];
  return benchmark?.name || 'General';
}

// List of industries for dropdowns
export const INDUSTRY_LIST = Object.values(INDUSTRY_BENCHMARKS).map((b) => ({
  id: b.id,
  name: b.name,
  icon: b.icon,
}));
