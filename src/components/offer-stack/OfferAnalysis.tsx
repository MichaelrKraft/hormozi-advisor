'use client';

import Link from 'next/link';
import type { OfferStack, OfferAnalysis as Analysis } from '@/types/offer-stack';
import { BONUS_TYPES, GUARANTEE_TYPES } from '@/types/offer-stack';
import { getOfferRating } from '@/lib/offer-stack/analysis';
import { generatePDF } from '@/lib/pdf-export';

interface OfferAnalysisProps {
  stack: OfferStack;
  analysis: Analysis;
  onSave: () => void;
}

export default function OfferAnalysis({ stack, analysis, onSave }: OfferAnalysisProps) {
  const rating = getOfferRating(analysis.strengthScore);

  const handleExportPDF = () => {
    const scoreColor = analysis.strengthScore >= 80 ? 'emerald'
      : analysis.strengthScore < 50 ? 'red'
      : 'sky';

    generatePDF({
      title: 'Offer Stack Analysis',
      subtitle: stack.name || 'Grand Slam Offer breakdown',
      mainScore: {
        value: analysis.strengthScore.toString(),
        label: rating.label,
        color: scoreColor,
      },
      sections: [
        {
          title: 'Value Breakdown',
          content: [
            `Core Deliverable: $${stack.coreDeliverable.value.toLocaleString()}`,
            `Bonuses: ${stack.bonuses.length} stacked`,
            `Total Value: $${analysis.totalValue.toLocaleString()}`,
            `Perceived Value: $${analysis.perceivedValue.toLocaleString()}`,
            `Your Price: $${stack.targetPrice.toLocaleString()}`,
            `Value-to-Price Ratio: ${analysis.priceToValueRatio}:1`,
          ],
        },
        {
          title: "Hormozi's Take",
          content: [rating.hormozi],
        },
        {
          title: 'Offer Components',
          content: [
            `Guarantee: ${GUARANTEE_TYPES[stack.guarantee.type].label}`,
            `Scarcity: ${stack.scarcity.type !== 'none' ? stack.scarcity.limit || 'Configured' : 'None'}`,
            `Urgency: ${stack.urgency.type !== 'none' ? stack.urgency.deadline || 'Configured' : 'None'}`,
          ],
        },
        ...(analysis.weaknesses.length > 0 ? [{
          title: 'Weaknesses to Address',
          content: analysis.weaknesses.map((w) => `• ${w}`),
        }] : []),
        ...(analysis.suggestions.length > 0 ? [{
          title: 'Suggestions',
          content: analysis.suggestions.map((s) => `• ${s}`),
        }] : []),
      ],
      recommendations: analysis.suggestions,
      metadata: {
        'Score': `${analysis.strengthScore}/100`,
        'Rating': rating.label,
        'Ratio': `${analysis.priceToValueRatio}:1`,
      },
    });
  };

  const getRatingColor = (color: string) => {
    switch (color) {
      case 'sky':
        return 'text-sky-400 bg-sky-900/30 border-sky-600';
      case 'emerald':
        return 'text-emerald-400 bg-emerald-900/30 border-emerald-600';
      case 'green':
        return 'text-green-400 bg-green-900/30 border-green-600';
      case 'yellow':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-600';
      default:
        return 'text-red-400 bg-red-900/30 border-red-600';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center">
        <div className="text-sm text-zinc-400 mb-2">Offer Strength Score</div>
        <div className="text-6xl font-bold text-white mb-2">{analysis.strengthScore}</div>
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getRatingColor(rating.color)}`}
        >
          {rating.label}
        </div>
      </div>

      {/* Hormozi's Take */}
      <div className="bg-zinc-800/50 border-l-4 border-sky-500 rounded-r-xl p-5">
        <div className="text-sky-400 font-semibold mb-2">Hormozi&apos;s Take:</div>
        <p className="text-zinc-300 italic">&quot;{rating.hormozi}&quot;</p>
      </div>

      {/* Value Breakdown */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Value Breakdown</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center py-2 border-b border-zinc-700">
            <span className="text-zinc-400">Core Deliverable</span>
            <span className="text-white font-semibold">
              {formatCurrency(stack.coreDeliverable.value)}
            </span>
          </div>
          {stack.bonuses.map((bonus, i) => (
            <div
              key={bonus.id}
              className="flex justify-between items-center py-2 border-b border-zinc-700"
            >
              <span className="text-zinc-400 flex items-center gap-2">
                <span>{BONUS_TYPES[bonus.type].icon}</span>
                {bonus.title || `Bonus #${i + 1}`}
              </span>
              <span className="text-white font-semibold">
                {formatCurrency(bonus.value)}
              </span>
            </div>
          ))}
          <div className="flex justify-between items-center py-2 border-b border-zinc-700">
            <span className="text-zinc-300 font-medium">Total Stacked Value</span>
            <span className="text-emerald-400 font-bold">
              {formatCurrency(analysis.totalValue)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2 border-b border-zinc-700">
            <span className="text-zinc-400">
              Perceived Value (with guarantee/scarcity/urgency)
            </span>
            <span className="text-sky-400 font-bold">
              {formatCurrency(analysis.perceivedValue)}
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-zinc-400">Your Price</span>
            <span className="text-white font-semibold">
              {formatCurrency(stack.targetPrice)}
            </span>
          </div>
        </div>

        {/* Value-to-Price Ratio */}
        <div
          className={`mt-4 p-4 rounded-lg border ${
            analysis.priceToValueRatio >= 10
              ? 'bg-sky-900/20 border-sky-600'
              : analysis.priceToValueRatio >= 5
              ? 'bg-emerald-900/20 border-emerald-600'
              : analysis.priceToValueRatio >= 3
              ? 'bg-green-900/20 border-green-600'
              : 'bg-red-900/20 border-red-600'
          }`}
        >
          <div className="text-center">
            <div className="text-sm text-zinc-400 mb-1">Value-to-Price Ratio</div>
            <div className="text-3xl font-bold text-white">
              {analysis.priceToValueRatio}:1
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {analysis.priceToValueRatio >= 10
                ? 'Exceptional! They\'d feel stupid saying no.'
                : analysis.priceToValueRatio >= 5
                ? 'Strong ratio. Very compelling offer.'
                : analysis.priceToValueRatio >= 3
                ? 'Good ratio. Room to improve.'
                : 'Low ratio. Need more value or lower price.'}
            </div>
          </div>
        </div>
      </div>

      {/* Offer Components Summary */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Your Offer Stack</h3>
        <div className="space-y-3">
          {/* Core */}
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stack.coreDeliverable.title ? 'bg-emerald-900/50' : 'bg-zinc-700'
              }`}
            >
              {stack.coreDeliverable.title ? '✓' : '○'}
            </span>
            <div>
              <div className="text-white font-medium">Core Deliverable</div>
              <div className="text-sm text-zinc-400">
                {stack.coreDeliverable.title || 'Not defined'}
              </div>
            </div>
          </div>

          {/* Bonuses */}
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stack.bonuses.length >= 2 ? 'bg-emerald-900/50' : 'bg-zinc-700'
              }`}
            >
              {stack.bonuses.length >= 2 ? '✓' : stack.bonuses.length}
            </span>
            <div>
              <div className="text-white font-medium">Bonuses</div>
              <div className="text-sm text-zinc-400">
                {stack.bonuses.length === 0
                  ? 'No bonuses added'
                  : `${stack.bonuses.length} bonus${stack.bonuses.length === 1 ? '' : 'es'} stacked`}
              </div>
            </div>
          </div>

          {/* Guarantee */}
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stack.guarantee.type !== 'none' ? 'bg-emerald-900/50' : 'bg-zinc-700'
              }`}
            >
              {stack.guarantee.type !== 'none' ? '✓' : '○'}
            </span>
            <div>
              <div className="text-white font-medium">Guarantee</div>
              <div className="text-sm text-zinc-400">
                {GUARANTEE_TYPES[stack.guarantee.type].label}
              </div>
            </div>
          </div>

          {/* Scarcity */}
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stack.scarcity.type !== 'none' && stack.scarcity.isReal
                  ? 'bg-emerald-900/50'
                  : stack.scarcity.type !== 'none'
                  ? 'bg-yellow-900/50'
                  : 'bg-zinc-700'
              }`}
            >
              {stack.scarcity.type !== 'none' ? '✓' : '○'}
            </span>
            <div>
              <div className="text-white font-medium">Scarcity</div>
              <div className="text-sm text-zinc-400">
                {stack.scarcity.type === 'none'
                  ? 'No scarcity'
                  : stack.scarcity.limit || 'Configured'}
                {stack.scarcity.type !== 'none' && !stack.scarcity.isReal && (
                  <span className="text-yellow-400"> (not real)</span>
                )}
              </div>
            </div>
          </div>

          {/* Urgency */}
          <div className="flex items-center gap-3">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stack.urgency.type !== 'none' && stack.urgency.isReal
                  ? 'bg-emerald-900/50'
                  : stack.urgency.type !== 'none'
                  ? 'bg-yellow-900/50'
                  : 'bg-zinc-700'
              }`}
            >
              {stack.urgency.type !== 'none' ? '✓' : '○'}
            </span>
            <div>
              <div className="text-white font-medium">Urgency</div>
              <div className="text-sm text-zinc-400">
                {stack.urgency.type === 'none'
                  ? 'No urgency'
                  : stack.urgency.deadline || 'Configured'}
                {stack.urgency.type !== 'none' && !stack.urgency.isReal && (
                  <span className="text-yellow-400"> (not real)</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Weaknesses */}
      {analysis.weaknesses.length > 0 && (
        <div className="bg-zinc-800 border border-red-900/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-red-400 mb-3">⚠️ Weaknesses</h3>
          <ul className="space-y-2">
            {analysis.weaknesses.map((weakness, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-300">
                <span className="text-red-500 mt-1">•</span>
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions.length > 0 && (
        <div className="bg-zinc-800 border border-sky-900/50 rounded-xl p-5">
          <h3 className="text-lg font-semibold text-sky-400 mb-3">💡 Suggestions</h3>
          <ul className="space-y-2">
            {analysis.suggestions.map((suggestion, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-300">
                <span className="text-sky-500 mt-1">→</span>
                <span>{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSave}
            className="py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white hover:bg-zinc-700 transition-colors"
          >
            Save Offer
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
          href={`/chat?context=offer-stack&score=${analysis.strengthScore}&name=${encodeURIComponent(stack.name || 'My Offer')}`}
          className="block w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg text-center hover:bg-sky-500 transition-colors"
        >
          Discuss This Offer with Hormozi
        </Link>
      </div>
    </div>
  );
}
