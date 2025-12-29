'use client';

import Link from 'next/link';
import type { BottleneckResults as Results } from '@/types/bottleneck';
import { BOTTLENECK_ADVICE, BOTTLENECK_META } from '@/lib/bottleneck/questions';
import { getSeverity, generateSummary } from '@/lib/bottleneck/calculations';
import { generatePDF } from '@/lib/pdf-export';

interface BottleneckResultsProps {
  results: Results;
  onSaveSnapshot: () => void;
  onStartOver: () => void;
}

export default function BottleneckResults({
  results,
  onSaveSnapshot,
  onStartOver,
}: BottleneckResultsProps) {
  const primaryAdvice = BOTTLENECK_ADVICE[results.primary];
  const primaryMeta = BOTTLENECK_META[results.primary];
  const severity = getSeverity(results.percentages[results.primary]);
  const summary = generateSummary(results);

  const getBarColor = (area: string) => {
    const meta = BOTTLENECK_META[area as keyof typeof BOTTLENECK_META];
    switch (meta.color) {
      case 'blue':
        return 'bg-blue-500';
      case 'purple':
        return 'bg-purple-500';
      case 'sky':
        return 'bg-sky-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-zinc-500';
    }
  };

  const getSeverityColor = () => {
    switch (severity.level) {
      case 'critical':
        return 'text-red-400 bg-red-900/30 border-red-600';
      case 'significant':
        return 'text-orange-400 bg-orange-900/30 border-orange-600';
      case 'moderate':
        return 'text-yellow-400 bg-yellow-900/30 border-yellow-600';
      default:
        return 'text-green-400 bg-green-900/30 border-green-600';
    }
  };

  const handleExportPDF = () => {
    const scoreColor = severity.level === 'critical' || severity.level === 'significant' ? 'red' : 'sky';

    generatePDF({
      title: 'Bottleneck Diagnostic',
      subtitle: 'Business constraint analysis',
      mainScore: {
        value: primaryAdvice.title,
        label: `${severity.label} (${results.percentages[results.primary]}%)`,
        color: scoreColor,
      },
      sections: [
        {
          title: 'Breakdown',
          content: [
            `Leads: ${results.percentages.leads}%`,
            `Conversion: ${results.percentages.conversion}%`,
            `Pricing: ${results.percentages.pricing}%`,
            `Retention: ${results.percentages.retention}%`,
          ],
        },
        {
          title: "Hormozi's Take",
          content: [primaryAdvice.hormoziQuote],
        },
        {
          title: 'Quick Wins',
          content: primaryAdvice.quickWins.map((w) => `• ${w}`),
        },
        {
          title: 'Strategic Moves',
          content: primaryAdvice.deepDive.map((a) => `• ${a}`),
        },
      ],
      recommendations: primaryAdvice.quickWins,
      metadata: {
        'Primary': primaryAdvice.title,
        'Severity': severity.label,
        'Score': `${results.percentages[results.primary]}%`,
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* Primary Result Header */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 text-center">
        <div className="text-sm text-zinc-400 mb-2">Your #1 Bottleneck</div>
        <div className="text-4xl mb-2">{primaryMeta.icon}</div>
        <h2 className="text-3xl font-bold text-white mb-2">{primaryAdvice.title}</h2>
        <div className={`inline-block px-4 py-1 rounded-full text-sm font-semibold border ${getSeverityColor()}`}>
          {severity.label} Issue ({results.percentages[results.primary]}%)
        </div>
        <p className="text-zinc-400 mt-4 max-w-lg mx-auto">{summary}</p>
      </div>

      {/* All Areas Breakdown */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-4">Full Diagnostic Breakdown</h3>
        <div className="space-y-4">
          {(['leads', 'conversion', 'pricing', 'retention'] as const).map((area) => {
            const meta = BOTTLENECK_META[area];
            const percentage = results.percentages[area];
            const isPrimary = area === results.primary;
            const isSecondary = area === results.secondary;

            return (
              <div
                key={area}
                className={`rounded-lg p-3 ${
                  isPrimary
                    ? 'bg-sky-900/20 border border-sky-600/50'
                    : isSecondary
                    ? 'bg-zinc-700/30 border border-zinc-600'
                    : 'bg-zinc-800/30'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span>{meta.icon}</span>
                    <span className="text-white font-medium">{meta.label}</span>
                    {isPrimary && (
                      <span className="text-xs bg-sky-600 text-white px-2 py-0.5 rounded">
                        #1
                      </span>
                    )}
                    {isSecondary && (
                      <span className="text-xs bg-zinc-600 text-zinc-300 px-2 py-0.5 rounded">
                        #2
                      </span>
                    )}
                  </div>
                  <span className="text-zinc-400 font-semibold">{percentage}%</span>
                </div>
                <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${getBarColor(area)} transition-all duration-500`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hormozi's Take */}
      <div className="bg-zinc-800/50 border-l-4 border-sky-500 rounded-r-xl p-5">
        <div className="text-sky-400 font-semibold mb-2">Hormozi&apos;s Take:</div>
        <p className="text-zinc-300 italic">&quot;{primaryAdvice.hormoziQuote}&quot;</p>
      </div>

      {/* Metrics to Track */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-3">📊 Metrics You Should Be Tracking</h3>
        <div className="grid grid-cols-2 gap-2">
          {primaryAdvice.metrics.map((metric, i) => (
            <div key={i} className="bg-zinc-700/30 rounded-lg p-3 text-sm text-zinc-300">
              {metric}
            </div>
          ))}
        </div>
      </div>

      {/* Quick Wins */}
      <div className="bg-zinc-800 border border-emerald-900/50 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-emerald-400 mb-3">⚡ Quick Wins (Do This Week)</h3>
        <div className="space-y-2">
          {primaryAdvice.quickWins.map((win, i) => (
            <div key={i} className="flex items-start gap-2 text-zinc-300">
              <span className="text-emerald-500 mt-1">✓</span>
              <span>{win}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Deep Dive Actions */}
      <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
        <h3 className="text-lg font-semibold text-white mb-3">🎯 Strategic Moves (For Long-Term Fix)</h3>
        <div className="space-y-2">
          {primaryAdvice.deepDive.map((action, i) => (
            <div key={i} className="flex items-start gap-2 text-zinc-400">
              <span className="text-sky-500 mt-1">→</span>
              <span>{action}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onSaveSnapshot}
            className="py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-white hover:bg-zinc-700 transition-colors"
          >
            Save Diagnostic
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
          href={`/chat?context=bottleneck&area=${results.primary}&prompt=${encodeURIComponent(primaryAdvice.chatPrompt)}`}
          className="block w-full py-3 px-4 bg-sky-600 text-white font-semibold rounded-lg text-center hover:bg-sky-500 transition-colors"
        >
          Discuss My {primaryAdvice.title} Problem with Hormozi
        </Link>

        <button
          onClick={onStartOver}
          className="w-full py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
        >
          Retake Diagnostic
        </button>
      </div>
    </div>
  );
}
