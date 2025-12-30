'use client';

import { useMemo } from 'react';
import type { BaseMetrics, IndustryType, StrategyType, StrategyResult } from '@/types/strategies';
import { strategyInfo, industryDefaults } from '@/lib/calculator/industryDefaults';
import { calculateAllStrategies } from '@/lib/calculator/strategies';
import { getDetailedRecommendation } from '@/lib/calculator/recommender';

interface StrategyComparisonProps {
  metrics: BaseMetrics;
  industry: IndustryType;
  onSelectStrategy: (strategy: StrategyType) => void;
}

export default function StrategyComparison({
  metrics,
  industry,
  onSelectStrategy,
}: StrategyComparisonProps) {
  // Calculate all strategies with industry defaults
  const results = useMemo(() => {
    const defaults = industryDefaults[industry];
    return calculateAllStrategies(metrics, defaults);
  }, [metrics, industry]);

  // Get recommendation
  const recommendation = useMemo(
    () => getDetailedRecommendation(metrics, industry),
    [metrics, industry]
  );

  const bestResult = results[0];

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <div className="bg-sky-900/30 border border-sky-700 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <span className="text-3xl">⭐</span>
          <div>
            <h3 className="text-xl font-bold text-sky-400">
              Best Strategy: {strategyInfo[bestResult.strategyType].name}
            </h3>
            <p className="text-zinc-300 mt-1">
              {recommendation.reasoning}
            </p>
            <p className="text-sky-400 font-semibold mt-2">
              +{Math.round(bestResult.ratioChange)}% improvement in your LTV:CAC ratio
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
        <div className="p-6 border-b border-zinc-700">
          <h2 className="text-xl font-bold text-white">Compare All Strategies</h2>
          <p className="text-zinc-400 text-sm mt-1">
            See how each of Hormozi&apos;s 5 strategies would impact your numbers
            (using {industry} industry defaults)
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/50">
              <tr>
                <th className="text-left p-4 text-zinc-400 font-medium">Strategy</th>
                <th className="text-right p-4 text-zinc-400 font-medium">New LTV</th>
                <th className="text-right p-4 text-zinc-400 font-medium">New CAC</th>
                <th className="text-right p-4 text-zinc-400 font-medium">New Ratio</th>
                <th className="text-right p-4 text-zinc-400 font-medium">Improvement</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, index) => {
                const info = strategyInfo[result.strategyType];
                const isRecommended = recommendation.primaryStrategy === result.strategyType;

                return (
                  <tr
                    key={result.strategyType}
                    className={`border-t border-zinc-700 ${
                      isRecommended ? 'bg-sky-900/20' : ''
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{info.icon}</span>
                        <div>
                          <span className="font-medium text-white">
                            {info.name}
                          </span>
                          {isRecommended && (
                            <span className="ml-2 text-xs bg-sky-600 text-white px-2 py-0.5 rounded">
                              ⭐ RECOMMENDED
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-white font-medium">
                        ${Math.round(result.newLtv).toLocaleString()}
                      </span>
                      {result.ltvChange !== 0 && (
                        <span className={`ml-2 text-sm ${result.ltvChange > 0 ? 'text-green-400' : 'text-zinc-500'}`}>
                          {result.ltvChange > 0 ? '+' : ''}{result.ltvChange.toFixed(0)}%
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-white font-medium">
                        ${Math.round(result.newCac).toLocaleString()}
                      </span>
                      {result.cacChange !== 0 && (
                        <span className={`ml-2 text-sm ${result.cacChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                          {result.cacChange > 0 ? '+' : ''}{result.cacChange.toFixed(0)}%
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <span className="text-sky-400 font-bold">
                        {result.newRatio.toFixed(1)}x
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <span className={`font-bold ${
                        index === 0 ? 'text-green-400' :
                        result.ratioChange > 0 ? 'text-green-400' : 'text-red-400'
                      }`}>
                        {result.ratioChange > 0 ? '+' : ''}{result.ratioChange.toFixed(0)}%
                        {index === 0 && ' 🏆'}
                      </span>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => onSelectStrategy(result.strategyType)}
                        className="text-sky-400 hover:text-sky-300 text-sm font-medium transition-colors"
                      >
                        Simulate →
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-zinc-700">
          {results.map((result, index) => {
            const info = strategyInfo[result.strategyType];
            const isRecommended = recommendation.primaryStrategy === result.strategyType;

            return (
              <div
                key={result.strategyType}
                className={`p-4 ${isRecommended ? 'bg-sky-900/20' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{info.icon}</span>
                    <span className="font-medium text-white">{info.shortName}</span>
                    {isRecommended && (
                      <span className="text-xs bg-sky-600 text-white px-2 py-0.5 rounded">⭐</span>
                    )}
                  </div>
                  <span className={`font-bold ${
                    result.ratioChange > 0 ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {result.ratioChange > 0 ? '+' : ''}{result.ratioChange.toFixed(0)}%
                    {index === 0 && ' 🏆'}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <span className="text-zinc-500 block">LTV</span>
                    <span className="text-white">${Math.round(result.newLtv).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">CAC</span>
                    <span className="text-white">${Math.round(result.newCac).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-500 block">Ratio</span>
                    <span className="text-sky-400 font-bold">{result.newRatio.toFixed(1)}x</span>
                  </div>
                </div>
                <button
                  onClick={() => onSelectStrategy(result.strategyType)}
                  className="w-full text-center text-sky-400 hover:text-sky-300 text-sm font-medium py-2 border border-zinc-700 rounded-lg transition-colors"
                >
                  Simulate this strategy →
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Explanation */}
      <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
        <h3 className="font-semibold text-white mb-2">How to read this</h3>
        <ul className="space-y-2 text-sm text-zinc-400">
          <li className="flex gap-2">
            <span className="text-green-400">+%</span>
            <span>Green percentages mean improvement (higher LTV, lower CAC, higher ratio)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-red-400">-%</span>
            <span>Red percentages mean a tradeoff (usually acceptable for net gain)</span>
          </li>
          <li className="flex gap-2">
            <span>🏆</span>
            <span>Best strategy based on overall ratio improvement</span>
          </li>
          <li className="flex gap-2">
            <span>⭐</span>
            <span>Recommended for your specific situation based on multiple factors</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
