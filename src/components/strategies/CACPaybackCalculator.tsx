'use client';

import { useState, useMemo } from 'react';
import {
  calculateCACPayback,
  getPaybackHealthColor,
  getPaybackHealthLabel,
  formatPaybackMonth,
  type CACPaybackInputs,
  type CACPaybackResults,
} from '@/lib/calculator/cacPayback';

interface CACPaybackCalculatorProps {
  className?: string;
}

export default function CACPaybackCalculator({ className = '' }: CACPaybackCalculatorProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [inputs, setInputs] = useState<CACPaybackInputs>({
    revenuePerCustomer: 50,
    marginalCosts: 22,
    cac: 90,
    monthlyRetention: 85,
  });

  // Calculate results whenever inputs change
  const results = useMemo(() => {
    if (inputs.revenuePerCustomer <= 0 || inputs.cac <= 0) {
      return null;
    }
    return calculateCACPayback(inputs);
  }, [inputs]);

  const handleInputChange = (field: keyof CACPaybackInputs, value: string) => {
    const numValue = parseFloat(value) || 0;
    setInputs((prev) => ({ ...prev, [field]: numValue }));
  };

  const healthColor = results ? getPaybackHealthColor(results.actualPaybackMonth) : 'sky';
  const healthLabel = results ? getPaybackHealthLabel(results.actualPaybackMonth) : '';

  const colorClasses = {
    green: 'text-green-400 bg-green-900/30 border-green-600',
    sky: 'text-sky-400 bg-sky-900/30 border-sky-600',
    red: 'text-red-400 bg-red-900/30 border-red-600',
  };

  return (
    <div className={`mt-6 ${className}`}>
      {/* Toggle Button */}
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left px-4 py-3 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 rounded-lg transition-colors"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📊</span>
            <span className="font-medium text-white">CAC Payback Calculator</span>
          </div>
          <span className="text-zinc-400">{isExpanded ? '−' : '+'}</span>
        </div>
        <p className="text-zinc-500 text-sm mt-1">
          Calculate how long it takes to recover your customer acquisition cost
        </p>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="mt-4 bg-zinc-800/50 rounded-xl p-6 border border-zinc-700 space-y-6">
          {/* Input Fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Revenue / Customer
                <span className="text-zinc-500 font-normal"> (monthly)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  value={inputs.revenuePerCustomer || ''}
                  onChange={(e) => handleInputChange('revenuePerCustomer', e.target.value)}
                  placeholder="50"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Marginal Costs
                <span className="text-zinc-500 font-normal"> (monthly)</span>
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  value={inputs.marginalCosts || ''}
                  onChange={(e) => handleInputChange('marginalCosts', e.target.value)}
                  placeholder="22"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Customer Acquisition Cost (CAC)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  value={inputs.cac || ''}
                  onChange={(e) => handleInputChange('cac', e.target.value)}
                  placeholder="90"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Monthly Retention Rate
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={inputs.monthlyRetention || ''}
                  onChange={(e) => handleInputChange('monthlyRetention', e.target.value)}
                  placeholder="85"
                  min="0"
                  max="100"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 pr-8 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500">%</span>
              </div>
            </div>
          </div>

          {/* Results */}
          {results && (
            <div className="space-y-4">
              {/* Primary Result - Payback Month */}
              <div className={`rounded-lg p-4 border ${colorClasses[healthColor]}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm opacity-80">CAC Payback Period</p>
                    <p className="text-3xl font-bold">
                      {formatPaybackMonth(results.actualPaybackMonth)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${colorClasses[healthColor]}`}>
                      {healthLabel}
                    </span>
                  </div>
                </div>
                <p className="text-sm opacity-70 mt-2">
                  Accounting for {inputs.monthlyRetention}% monthly retention
                </p>
              </div>

              {/* Secondary Metrics Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs">Gross Profit</p>
                  <p className="text-white font-semibold">${results.grossProfit}</p>
                  <p className="text-zinc-500 text-xs">{results.grossMarginPercent}% margin</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs">Simple Payback</p>
                  <p className="text-white font-semibold">{results.simplePaybackMonths} mo</p>
                  <p className="text-zinc-500 text-xs">Without churn</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs">Customer LTV</p>
                  <p className="text-white font-semibold">${results.ltv.toLocaleString()}</p>
                  <p className="text-zinc-500 text-xs">Lifetime value</p>
                </div>

                <div className="bg-zinc-900 rounded-lg p-3">
                  <p className="text-zinc-500 text-xs">LTV:CAC Ratio</p>
                  <p className="text-sky-400 font-semibold">{results.ltvCacRatio}x</p>
                  <p className="text-zinc-500 text-xs">{results.ltvCacRatio >= 3 ? 'Healthy' : 'Below 3x'}</p>
                </div>
              </div>

              {/* Cohort Breakdown (First 12 months) */}
              <div>
                <button
                  type="button"
                  onClick={() => {}}
                  className="text-sky-400 text-sm hover:text-sky-300 transition-colors mb-2"
                >
                  Monthly Breakdown
                </button>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-zinc-500 text-xs">
                        <th className="text-left py-2 px-2">Month</th>
                        <th className="text-right py-2 px-2">Retention</th>
                        <th className="text-right py-2 px-2">Monthly GP</th>
                        <th className="text-right py-2 px-2">Cumulative GP</th>
                        <th className="text-right py-2 px-2">Payback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {results.cohortData.slice(0, 12).map((row) => (
                        <tr
                          key={row.month}
                          className={`border-t border-zinc-800 ${
                            row.cumulativePayback >= 0 ? 'bg-green-900/10' : ''
                          }`}
                        >
                          <td className="py-2 px-2 text-zinc-300">{row.month}</td>
                          <td className="py-2 px-2 text-right text-zinc-400">
                            {row.retentionPercent.toFixed(0)}%
                          </td>
                          <td className="py-2 px-2 text-right text-zinc-300">
                            ${row.monthlyGrossProfit.toFixed(0)}
                          </td>
                          <td className="py-2 px-2 text-right text-zinc-300">
                            ${row.cumulativeGrossProfit.toFixed(0)}
                          </td>
                          <td
                            className={`py-2 px-2 text-right font-medium ${
                              row.cumulativePayback >= 0 ? 'text-green-400' : 'text-red-400'
                            }`}
                          >
                            ${row.cumulativePayback.toFixed(0)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Hormozi Insight */}
              <div className="bg-zinc-900/50 rounded-lg p-4 border-l-4 border-sky-500">
                <p className="text-zinc-400 text-sm italic">
                  &quot;If you can get your CAC payback under 30 days, you can advertise infinitely
                  because every dollar you spend comes back within the month.&quot;
                </p>
                <p className="text-zinc-500 text-xs mt-2">— Alex Hormozi</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
