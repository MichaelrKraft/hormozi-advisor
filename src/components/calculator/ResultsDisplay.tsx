'use client';

import Link from 'next/link';
import type { CalculatorResults, RatingTier, Recommendation } from '@/types/calculator';
import { formatCurrency, formatRatio, getRatingTier } from '@/lib/calculator/calculations';
import { RATIO_INTERPRETATIONS, getTierColorClass } from '@/lib/calculator/interpretations';
import { generatePDF } from '@/lib/pdf-export';

interface ResultsDisplayProps {
  results: CalculatorResults;
  recommendations?: Recommendation[];
  onSaveSnapshot: () => void;
}

export default function ResultsDisplay({ results, recommendations, onSaveSnapshot }: ResultsDisplayProps) {
  const tier = getRatingTier(results.ratio);
  const interpretation = RATIO_INTERPRETATIONS[tier];
  const colors = getTierColorClass(tier);

  const handleExportPDF = () => {
    const scoreColor = tier === 'above10' || tier === 'ratio5to10' ? 'emerald'
      : tier === 'below1' || tier === 'ratio1to2' ? 'red'
      : 'sky';

    generatePDF({
      title: 'LTV/CAC Analysis',
      subtitle: 'Your unit economics breakdown',
      mainScore: {
        value: formatRatio(results.ratio),
        label: interpretation.rating,
        color: scoreColor,
      },
      sections: [
        {
          title: 'Key Metrics',
          content: [
            `Lifetime Value (LTV): ${formatCurrency(results.ltv)}`,
            `Customer Acquisition Cost (CAC): ${formatCurrency(results.cac)}`,
            `Payback Period: ${results.paybackPeriod > 0 ? `${results.paybackPeriod} months` : 'N/A'}`,
          ],
        },
        {
          title: "Hormozi's Take",
          content: [interpretation.hormozi],
        },
        {
          title: 'Analysis',
          content: [interpretation.message],
        },
      ],
      recommendations: recommendations?.map((r) => r.action) || [],
      metadata: {
        'LTV': formatCurrency(results.ltv),
        'CAC': formatCurrency(results.cac),
        'Payback': `${results.paybackPeriod} mo`,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <MetricCard label="Lifetime Value (LTV)" value={formatCurrency(results.ltv)} />
        <MetricCard
          label="Acquisition Cost (CAC)"
          value={formatCurrency(results.cac)}
        />
      </div>

      {/* Ratio Display */}
      <div
        className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center`}
      >
        <div className="text-sm text-zinc-400 mb-1">LTV : CAC Ratio</div>
        <div className={`text-5xl font-bold ${colors.text} mb-2`}>
          {formatRatio(results.ratio)}
        </div>
        <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}>
          {interpretation.rating}
        </div>
      </div>

      {/* Payback Period */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <div className="text-sm text-zinc-400 mb-1">Payback Period</div>
        <div className="text-2xl font-bold text-white">
          {results.paybackPeriod > 0 ? `${results.paybackPeriod} months` : 'N/A'}
        </div>
        <div className="text-sm text-zinc-500 mt-1">
          Time to recover customer acquisition cost
        </div>
      </div>

      {/* Hormozi's Take */}
      <div className="bg-zinc-800/50 border-l-4 border-sky-500 rounded-r-xl p-6">
        <div className="text-sky-400 font-semibold mb-2">
          Hormozi&apos;s Take:
        </div>
        <p className="text-zinc-300 italic">&quot;{interpretation.hormozi}&quot;</p>
      </div>

      {/* Status Message */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <p className="text-zinc-400 text-sm">{interpretation.message}</p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSaveSnapshot}
            className="py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white hover:bg-zinc-700 transition-colors"
          >
            Save Snapshot
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
          href={`/chat?context=calculator&ltv=${results.ltv}&cac=${results.cac}&ratio=${results.ratio}`}
          className="block w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg text-center hover:bg-sky-500 transition-colors"
        >
          Discuss My Numbers with Hormozi
        </Link>
      </div>
    </div>
  );
}

interface MetricCardProps {
  label: string;
  value: string;
}

function MetricCard({ label, value }: MetricCardProps) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
      <div className="text-sm text-zinc-400 mb-1">{label}</div>
      <div className="text-2xl font-bold text-white">{value}</div>
    </div>
  );
}
