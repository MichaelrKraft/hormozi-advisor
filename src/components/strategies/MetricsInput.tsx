'use client';

import { useState } from 'react';
import type { BaseMetrics, IndustryType } from '@/types/strategies';
import { industryNames } from '@/lib/calculator/industryDefaults';
import CACPaybackCalculator from './CACPaybackCalculator';

interface MetricsInputProps {
  onSubmit: (metrics: BaseMetrics, industry: IndustryType) => void;
  initialIndustry?: IndustryType;
}

export default function MetricsInput({ onSubmit, initialIndustry = 'saas' }: MetricsInputProps) {
  const [ltv, setLtv] = useState('');
  const [cac, setCac] = useState('');
  const [industry, setIndustry] = useState<IndustryType>(initialIndustry);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [grossMargin, setGrossMargin] = useState('');
  const [frequency, setFrequency] = useState('');
  const [aov, setAov] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const ltvNum = parseFloat(ltv);
    const cacNum = parseFloat(cac);

    if (isNaN(ltvNum) || isNaN(cacNum) || ltvNum <= 0 || cacNum <= 0) {
      return;
    }

    const metrics: BaseMetrics = {
      ltv: ltvNum,
      cac: cacNum,
      ratio: ltvNum / cacNum,
    };

    // Add optional metrics if provided
    if (grossMargin) metrics.grossMarginPercent = parseFloat(grossMargin);
    if (frequency) metrics.purchaseFrequency = parseFloat(frequency);
    if (aov) metrics.averageOrderValue = parseFloat(aov);

    onSubmit(metrics, industry);
  };

  const isValid = ltv && cac && parseFloat(ltv) > 0 && parseFloat(cac) > 0;

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
        <h2 className="text-xl font-bold text-white mb-2">Enter Your Metrics</h2>
        <p className="text-zinc-400 text-sm mb-6">
          Already calculated your LTV and CAC? Enter them here to simulate
          growth strategies.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">
                Lifetime Value (LTV)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                <input
                  type="number"
                  value={ltv}
                  onChange={(e) => setLtv(e.target.value)}
                  placeholder="500"
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
                  value={cac}
                  onChange={(e) => setCac(e.target.value)}
                  placeholder="200"
                  className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Industry
            </label>
            <select
              value={industry}
              onChange={(e) => setIndustry(e.target.value as IndustryType)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              {Object.entries(industryNames).map(([key, name]) => (
                <option key={key} value={key}>
                  {name}
                </option>
              ))}
            </select>
            <p className="text-zinc-500 text-xs mt-1">
              Industry affects default assumptions for each strategy
            </p>
          </div>

          {/* Advanced Options Toggle */}
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sky-400 text-sm hover:text-sky-300 transition-colors"
          >
            {showAdvanced ? '− Hide' : '+ Show'} advanced options
          </button>

          {showAdvanced && (
            <div className="space-y-4 pt-2 border-t border-zinc-700">
              <p className="text-zinc-500 text-sm">
                Optional: Provide more details for smarter recommendations
              </p>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Gross Margin %
                  </label>
                  <input
                    type="number"
                    value={grossMargin}
                    onChange={(e) => setGrossMargin(e.target.value)}
                    placeholder="60"
                    min="0"
                    max="100"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Purchases/Year
                  </label>
                  <input
                    type="number"
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value)}
                    placeholder="2"
                    step="0.1"
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    Avg Order Value
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">$</span>
                    <input
                      type="number"
                      value={aov}
                      onChange={(e) => setAov(e.target.value)}
                      placeholder="100"
                      className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-8 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview */}
          {isValid && (
            <div className="bg-zinc-900 rounded-lg p-4 text-center">
              <span className="text-zinc-400">Your current ratio: </span>
              <span className="text-2xl font-bold text-sky-400">
                {(parseFloat(ltv) / parseFloat(cac)).toFixed(1)}x
              </span>
            </div>
          )}

          <button
            type="submit"
            disabled={!isValid}
            className="w-full bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition-colors"
          >
            Simulate Strategies →
          </button>
        </form>

        {/* Link to calculator */}
        <p className="text-center text-zinc-500 text-sm mt-4">
          Don&apos;t know your LTV/CAC?{' '}
          <a href="/calculator" className="text-sky-400 hover:text-sky-300">
            Use the calculator first →
          </a>
        </p>

        {/* CAC Payback Calculator */}
        <CACPaybackCalculator />
      </div>
    </div>
  );
}
