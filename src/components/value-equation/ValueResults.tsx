'use client';

import Link from 'next/link';
import type { ValueEquationInputs, ValueEquationResults } from '@/types/value-equation';
import {
  getOverallInterpretation,
  getDimensionFeedback,
  DIMENSION_INFO,
} from '@/lib/value-equation/calculations';
import { generatePDF } from '@/lib/pdf-export';

interface ValueResultsProps {
  inputs: ValueEquationInputs;
  results: ValueEquationResults;
  onSaveSnapshot: () => void;
}

export default function ValueResults({
  inputs,
  results,
  onSaveSnapshot,
}: ValueResultsProps) {
  const interpretation = getOverallInterpretation(results.rating);
  const weakestFeedback = getDimensionFeedback(
    results.weakestDimension,
    inputs[results.weakestDimension]
  );

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string; text: string; border: string }> = {
      red: { bg: 'bg-red-900/30', text: 'text-red-400', border: 'border-red-600' },
      orange: { bg: 'bg-orange-900/30', text: 'text-orange-400', border: 'border-orange-600' },
      yellow: { bg: 'bg-yellow-900/30', text: 'text-yellow-400', border: 'border-yellow-600' },
      green: { bg: 'bg-green-900/30', text: 'text-green-400', border: 'border-green-600' },
      emerald: { bg: 'bg-emerald-900/30', text: 'text-emerald-400', border: 'border-emerald-600' },
      amber: { bg: 'bg-amber-900/30', text: 'text-amber-400', border: 'border-amber-600' },
    };
    return colorMap[color] || colorMap.yellow;
  };

  const colors = getColorClasses(interpretation.color);

  const handleExportPDF = () => {
    const scoreColor = results.rating === 'exceptional' || results.rating === 'strong' ? 'emerald'
      : results.rating === 'terrible' || results.rating === 'weak' ? 'red'
      : 'amber';

    generatePDF({
      title: 'Value Equation Analysis',
      subtitle: 'Offer perceived value assessment',
      mainScore: {
        value: results.score.toFixed(1),
        label: interpretation.title,
        color: scoreColor,
      },
      sections: [
        {
          title: 'Your Equation',
          content: [
            `Dream Outcome: ${inputs.dreamOutcome}/10`,
            `Perceived Likelihood: ${inputs.perceivedLikelihood}/10`,
            `Time Delay: ${inputs.timeDelay}/10`,
            `Effort & Sacrifice: ${inputs.effortSacrifice}/10`,
            `Formula: (${inputs.dreamOutcome} × ${inputs.perceivedLikelihood}) / (${inputs.timeDelay} × ${inputs.effortSacrifice}) = ${results.score.toFixed(1)}`,
          ],
        },
        {
          title: "Hormozi's Take",
          content: [interpretation.hormozi],
        },
        {
          title: `Priority Fix: ${weakestFeedback.label}`,
          content: [
            weakestFeedback.feedback,
            ...weakestFeedback.improvementActions.map((a) => `• ${a}`),
          ],
        },
      ],
      recommendations: weakestFeedback.improvementActions,
      metadata: {
        'Strongest': DIMENSION_INFO[results.strongestDimension].label,
        'Weakest': DIMENSION_INFO[results.weakestDimension].label,
        'Score': results.score.toFixed(1),
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Score Display */}
      <div className={`${colors.bg} ${colors.border} border rounded-xl p-6 text-center`}>
        <div className="text-sm text-zinc-400 mb-2">Value Score</div>
        <div className={`text-6xl font-bold ${colors.text} mb-2`}>
          {results.score.toFixed(1)}
        </div>
        <div
          className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${colors.bg} ${colors.text} ${colors.border} border`}
        >
          {interpretation.title}
        </div>
      </div>

      {/* Equation Visualization */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
        <div className="text-sm text-zinc-400 mb-3 text-center">Your Value Equation</div>
        <div className="flex items-center justify-center gap-2 text-lg">
          <div className="bg-zinc-700 rounded-lg px-3 py-2 text-center">
            <div className="text-emerald-400 font-bold">{inputs.dreamOutcome}</div>
            <div className="text-xs text-zinc-500">Dream</div>
          </div>
          <span className="text-zinc-500">×</span>
          <div className="bg-zinc-700 rounded-lg px-3 py-2 text-center">
            <div className="text-emerald-400 font-bold">{inputs.perceivedLikelihood}</div>
            <div className="text-xs text-zinc-500">Likelihood</div>
          </div>
          <span className="text-zinc-400 text-2xl mx-2">/</span>
          <div className="bg-zinc-700 rounded-lg px-3 py-2 text-center">
            <div className="text-red-400 font-bold">{inputs.timeDelay}</div>
            <div className="text-xs text-zinc-500">Time</div>
          </div>
          <span className="text-zinc-500">×</span>
          <div className="bg-zinc-700 rounded-lg px-3 py-2 text-center">
            <div className="text-red-400 font-bold">{inputs.effortSacrifice}</div>
            <div className="text-xs text-zinc-500">Effort</div>
          </div>
        </div>
        <div className="text-center mt-3 text-sm text-zinc-500">
          ({inputs.dreamOutcome} × {inputs.perceivedLikelihood}) / ({inputs.timeDelay} × {inputs.effortSacrifice}) = {results.score.toFixed(1)}
        </div>
      </div>

      {/* Hormozi's Take */}
      <div className="bg-zinc-800/50 border-l-4 border-amber-500 rounded-r-xl p-5">
        <div className="text-amber-400 font-semibold mb-2">Hormozi&apos;s Take:</div>
        <p className="text-zinc-300 italic">&quot;{interpretation.hormozi}&quot;</p>
      </div>

      {/* Weakest Dimension - Priority Fix */}
      <div className="bg-zinc-800 border border-red-900/50 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-red-400 text-xl">!</span>
          <h3 className="text-lg font-semibold text-white">
            Priority: Fix Your {weakestFeedback.label}
          </h3>
        </div>
        <p className="text-zinc-400 mb-4">{weakestFeedback.feedback}</p>
        <div className="bg-zinc-900/50 rounded-lg p-4 mb-4">
          <p className="text-amber-400/90 italic text-sm">
            &quot;{weakestFeedback.hormoziTip}&quot;
          </p>
        </div>
        <div className="space-y-2">
          <div className="text-sm font-medium text-zinc-300 mb-2">Action Items:</div>
          {weakestFeedback.improvementActions.map((action, i) => (
            <div key={i} className="flex items-start gap-2 text-sm text-zinc-400">
              <span className="text-amber-500 mt-1">→</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* All Dimensions Summary */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">All Dimensions</h3>
        <div className="space-y-3">
          {(Object.keys(DIMENSION_INFO) as Array<keyof ValueEquationInputs>).map((dim) => {
            const info = DIMENSION_INFO[dim];
            const score = inputs[dim];
            const isWeak = dim === results.weakestDimension;
            const isStrong = dim === results.strongestDimension;

            // Calculate effective score (how good this dimension is)
            const effectiveScore = info.isNumerator ? score : 11 - score;
            const barColor =
              effectiveScore >= 8
                ? 'bg-emerald-500'
                : effectiveScore >= 5
                ? 'bg-yellow-500'
                : 'bg-red-500';

            return (
              <div
                key={dim}
                className={`rounded-lg p-3 ${
                  isWeak
                    ? 'bg-red-900/20 border border-red-900/50'
                    : isStrong
                    ? 'bg-emerald-900/20 border border-emerald-900/50'
                    : 'bg-zinc-700/30'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{info.label}</span>
                    {isWeak && (
                      <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">
                        Weakest
                      </span>
                    )}
                    {isStrong && (
                      <span className="text-xs bg-emerald-900/50 text-emerald-400 px-2 py-0.5 rounded">
                        Strongest
                      </span>
                    )}
                  </div>
                  <span className="text-sm font-bold text-zinc-300">{score}/10</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} transition-all duration-300`}
                    style={{ width: `${(effectiveScore / 10) * 100}%` }}
                  />
                </div>
                {!info.isNumerator && (
                  <div className="text-xs text-zinc-500 mt-1">
                    {score <= 3 ? 'Low (Good!)' : score <= 6 ? 'Medium' : 'High (Reduce this)'}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSaveSnapshot}
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
          href={`/chat?context=value-equation&score=${results.score}&weakest=${results.weakestDimension}`}
          className="block w-full py-3 px-4 bg-amber-600 text-white font-semibold rounded-lg text-center hover:bg-amber-500 transition-colors"
        >
          Discuss How to Improve with Hormozi
        </Link>
      </div>
    </div>
  );
}
