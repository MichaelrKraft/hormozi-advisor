'use client';

import type { CalculatorResults } from '@/types/calculator';
import type { Industry, BenchmarkComparison as Comparison } from '@/lib/benchmarks/data';
import { INDUSTRY_BENCHMARKS, compareToBenchmark, INDUSTRY_LIST } from '@/lib/benchmarks/data';

interface BenchmarkComparisonProps {
  results: CalculatorResults;
  industry: Industry;
  onChangeIndustry: (industry: Industry) => void;
}

export default function BenchmarkComparison({
  results,
  industry,
  onChangeIndustry,
}: BenchmarkComparisonProps) {
  const benchmark = INDUSTRY_BENCHMARKS[industry];

  // Calculate comparisons
  const ratioComparison = compareToBenchmark(results.ratio, benchmark.ltvCac, true);
  const paybackComparison = compareToBenchmark(results.paybackPeriod, benchmark.paybackMonths, false);

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-5">
      {/* Header with Industry Selector */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <span>📊</span> Industry Benchmarks
        </h3>
        <select
          value={industry}
          onChange={(e) => onChangeIndustry(e.target.value as Industry)}
          className="bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-amber-500"
        >
          {INDUSTRY_LIST.map((ind) => (
            <option key={ind.id} value={ind.id}>
              {ind.icon} {ind.name}
            </option>
          ))}
        </select>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-4">
        {/* LTV/CAC Ratio Comparison */}
        <ComparisonCard
          label="LTV/CAC Ratio"
          yourValue={`${results.ratio.toFixed(1)}:1`}
          comparison={ratioComparison}
          benchmarks={{
            median: `${benchmark.ltvCac.median}:1`,
            good: `${benchmark.ltvCac.good}:1`,
            excellent: `${benchmark.ltvCac.excellent}:1`,
          }}
        />

        {/* Payback Period Comparison */}
        <ComparisonCard
          label="Payback Period"
          yourValue={`${results.paybackPeriod} mo`}
          comparison={paybackComparison}
          benchmarks={{
            median: `${benchmark.paybackMonths.median} mo`,
            good: `${benchmark.paybackMonths.good} mo`,
            excellent: `${benchmark.paybackMonths.excellent} mo`,
          }}
          lowerIsBetter
        />
      </div>

      {/* Percentile Badge */}
      <div className="mt-4 pt-4 border-t border-zinc-700">
        <div className="flex items-center justify-between">
          <span className="text-sm text-zinc-400">Your ranking in {benchmark.name}:</span>
          <span className={`font-semibold ${ratioComparison.color}`}>
            Top {100 - ratioComparison.percentile}%
          </span>
        </div>
      </div>
    </div>
  );
}

interface ComparisonCardProps {
  label: string;
  yourValue: string;
  comparison: Comparison;
  benchmarks: {
    median: string;
    good: string;
    excellent: string;
  };
  lowerIsBetter?: boolean;
}

function ComparisonCard({
  label,
  yourValue,
  comparison,
  benchmarks,
  lowerIsBetter = false,
}: ComparisonCardProps) {
  // Calculate bar widths for visual
  const getBarWidth = (rank: string): number => {
    switch (rank) {
      case 'below-median': return 25;
      case 'median': return 50;
      case 'good': return 75;
      case 'excellent': return 100;
      default: return 50;
    }
  };

  return (
    <div className="bg-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-zinc-400">{label}</span>
        <span className={`text-lg font-bold ${comparison.color}`}>{yourValue}</span>
      </div>

      {/* Progress Bar */}
      <div className="relative h-2 bg-zinc-700 rounded-full overflow-hidden mb-3">
        <div
          className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${getBarColor(comparison.rank)}`}
          style={{ width: `${getBarWidth(comparison.rank)}%` }}
        />
        {/* Markers */}
        <div className="absolute inset-y-0 left-1/4 w-0.5 bg-zinc-600" title="25th percentile" />
        <div className="absolute inset-y-0 left-1/2 w-0.5 bg-zinc-500" title="Median" />
        <div className="absolute inset-y-0 left-3/4 w-0.5 bg-zinc-600" title="75th percentile" />
      </div>

      {/* Labels */}
      <div className="flex items-center justify-between text-xs text-zinc-500">
        <span>Median: {benchmarks.median}</span>
        <span className={comparison.color}>
          {comparison.label}
        </span>
        <span>Top 10%: {benchmarks.excellent}</span>
      </div>
    </div>
  );
}

function getBarColor(rank: string): string {
  switch (rank) {
    case 'below-median': return 'bg-red-500';
    case 'median': return 'bg-yellow-500';
    case 'good': return 'bg-emerald-500';
    case 'excellent': return 'bg-amber-500';
    default: return 'bg-zinc-500';
  }
}
