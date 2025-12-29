'use client';

import Link from 'next/link';
import type { PricingResults as Results } from '@/types/pricing';
import { PRICING_CATEGORIES } from '@/types/pricing';
import { PRICING_ADVICE, getSignalColor } from '@/lib/pricing/indicators';
import { generatePDF } from '@/lib/pdf-export';

interface PricingResultsProps {
  results: Results;
  currentPrice: number;
  onSave: () => void;
}

export default function PricingResults({ results, currentPrice, onSave }: PricingResultsProps) {
  const advice = PRICING_ADVICE[results.overallSignal];
  const color = getSignalColor(results.overallSignal);

  const handleExportPDF = () => {
    const scoreColor = results.overallSignal === 'optimal' ? 'emerald'
      : results.overallSignal === 'overpriced' || results.overallSignal === 'slightly-high' ? 'red'
      : 'amber';

    generatePDF({
      title: 'Pricing Analysis',
      subtitle: 'Market position assessment',
      mainScore: {
        value: advice.title,
        label: `${results.confidenceScore}% confidence`,
        color: scoreColor,
      },
      sections: [
        {
          title: 'Pricing Position',
          content: [
            `Overall Signal: ${results.overallSignal.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`,
            `Current Price: $${currentPrice.toLocaleString()}`,
            `Recommended Action: ${results.recommendedAction}`,
            `Suggested Adjustment: ${results.priceAdjustment.range}`,
          ],
        },
        {
          title: "Hormozi's Take",
          content: [advice.hormoziQuote],
        },
        {
          title: 'Actions to Take',
          content: advice.actions.map((a) => `• ${a}`),
        },
        {
          title: 'Experiments to Run',
          content: advice.experiments.map((e) => `• ${e}`),
        },
      ],
      recommendations: advice.actions,
      metadata: {
        'Signal': advice.title,
        'Confidence': `${results.confidenceScore}%`,
        'Direction': results.priceAdjustment.direction,
      },
    });
  };

  const getColorClasses = (c: string) => {
    switch (c) {
      case 'blue':
        return 'text-blue-400 bg-blue-900/30 border-blue-600';
      case 'cyan':
        return 'text-cyan-400 bg-cyan-900/30 border-cyan-600';
      case 'green':
        return 'text-green-400 bg-green-900/30 border-green-600';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-600';
      case 'red':
        return 'text-red-400 bg-red-900/30 border-red-600';
      default:
        return 'text-zinc-400 bg-zinc-900/30 border-zinc-600';
    }
  };

  const getDirectionIcon = () => {
    switch (results.priceAdjustment.direction) {
      case 'increase':
        return '↑';
      case 'decrease':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Result */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center">
        <div className="text-sm text-zinc-400 mb-2">Your Pricing Position</div>
        <h2 className="text-3xl font-bold text-white mb-3">{advice.title}</h2>
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getColorClasses(color)}`}
        >
          {results.confidenceScore}% confidence in this assessment
        </div>
      </div>

      {/* Hormozi's Take */}
      <div className="bg-zinc-800/50 border-l-4 border-amber-500 rounded-r-xl p-5">
        <div className="text-amber-400 font-semibold mb-2">Hormozi&apos;s Take:</div>
        <p className="text-zinc-300 italic">&quot;{advice.hormoziQuote}&quot;</p>
      </div>

      {/* Price Adjustment Recommendation */}
      <div
        className={`bg-zinc-800 border rounded-xl p-5 ${
          results.priceAdjustment.direction === 'increase'
            ? 'border-emerald-600'
            : results.priceAdjustment.direction === 'decrease'
            ? 'border-red-600'
            : 'border-zinc-600'
        }`}
      >
        <h3 className="text-lg font-semibold text-white mb-3">Recommended Action</h3>
        <div className="flex items-center gap-4">
          <div
            className={`text-4xl font-bold ${
              results.priceAdjustment.direction === 'increase'
                ? 'text-emerald-400'
                : results.priceAdjustment.direction === 'decrease'
                ? 'text-red-400'
                : 'text-yellow-400'
            }`}
          >
            {getDirectionIcon()}
          </div>
          <div>
            <div className="text-white font-medium">{results.recommendedAction}</div>
            <div className="text-zinc-400 text-sm mt-1">
              Suggested adjustment: <span className="text-amber-400">{results.priceAdjustment.range}</span>
            </div>
            {currentPrice > 0 && results.priceAdjustment.direction === 'increase' && (
              <div className="text-zinc-500 text-sm mt-1">
                Current ${currentPrice.toLocaleString()} → Test ${Math.round(currentPrice * 1.2).toLocaleString()} - ${Math.round(currentPrice * 1.3).toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signal Breakdown */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Signal Breakdown</h3>
        <div className="space-y-3">
          {[
            { signal: 'underpriced', label: 'Underpriced', color: 'blue' },
            { signal: 'slightly-low', label: 'Slightly Low', color: 'cyan' },
            { signal: 'optimal', label: 'Optimal', color: 'green' },
            { signal: 'slightly-high', label: 'Slightly High', color: 'yellow' },
            { signal: 'overpriced', label: 'Overpriced', color: 'red' },
          ].map((item) => {
            const percent = results.signalBreakdown[item.signal as keyof typeof results.signalBreakdown];
            const isActive = item.signal === results.overallSignal;

            return (
              <div
                key={item.signal}
                className={`rounded-lg p-3 ${isActive ? 'bg-zinc-700/50 border border-zinc-600' : ''}`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className={`font-medium ${isActive ? 'text-white' : 'text-zinc-400'}`}>
                    {item.label}
                    {isActive && <span className="text-amber-400 ml-2">← You are here</span>}
                  </span>
                  <span className="text-zinc-400">{percent}%</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      item.color === 'blue'
                        ? 'bg-blue-500'
                        : item.color === 'cyan'
                        ? 'bg-cyan-500'
                        : item.color === 'green'
                        ? 'bg-green-500'
                        : item.color === 'yellow'
                        ? 'bg-yellow-500'
                        : 'bg-red-500'
                    }`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Category Insights */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Category Analysis</h3>
        <div className="grid grid-cols-2 gap-4">
          {results.categoryInsights.map((insight) => {
            const meta = PRICING_CATEGORIES[insight.category];
            const signalColor = getSignalColor(insight.signal);

            return (
              <div
                key={insight.category}
                className="bg-zinc-700/30 rounded-lg p-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <span>{meta.icon}</span>
                  <span className="text-sm text-zinc-400">{meta.label}</span>
                </div>
                <div className={`text-sm ${getColorClasses(signalColor).split(' ')[0]}`}>
                  {insight.signal.replace('-', ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommended Actions */}
      <div className="bg-zinc-800 border border-emerald-900/50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">⚡ Actions to Take</h3>
        <ul className="space-y-2">
          {advice.actions.map((action, i) => (
            <li key={i} className="flex items-start gap-2 text-zinc-300">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>{action}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Experiments to Run */}
      <div className="bg-zinc-800 border border-amber-900/50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-amber-400 mb-3">🧪 Experiments to Run</h3>
        <ul className="space-y-2">
          {advice.experiments.map((experiment, i) => (
            <li key={i} className="flex items-start gap-2 text-zinc-300">
              <span className="text-amber-500 mt-1">→</span>
              <span>{experiment}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSave}
            className="py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white hover:bg-zinc-700 transition-colors"
          >
            Save Analysis
          </button>
          <button
            onClick={handleExportPDF}
            className="py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white hover:bg-zinc-700 transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Export PDF
          </button>
        </div>

        <Link
          href={`/chat?context=pricing&signal=${results.overallSignal}&price=${currentPrice}`}
          className="block w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-lg text-center hover:bg-amber-500 transition-colors"
        >
          Discuss My Pricing with Hormozi
        </Link>
      </div>
    </div>
  );
}
