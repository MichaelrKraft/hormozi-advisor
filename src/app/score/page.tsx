'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { HormoziScore, LTVCACScore, ValueScore, BottleneckScore, PricingScore, OfferScore } from '@/types/score';
import { calculateHormoziScore, getRecommendations } from '@/lib/score/calculations';
import OverallScore from '@/components/score/OverallScore';
import ScoreCard, { ScoreDetail } from '@/components/score/ScoreCard';
import Recommendations from '@/components/score/Recommendations';
import MobileHeader from '@/components/layout/MobileHeader';

export default function ScorePage() {
  const [score, setScore] = useState<HormoziScore | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Calculate score on mount
    const calculated = calculateHormoziScore();
    setScore(calculated);
    setRecommendations(getRecommendations(calculated));
    setIsLoading(false);
  }, []);

  if (isLoading || !score) {
    return (
      <div className="min-h-screen bg-zinc-900 flex items-center justify-center">
        <div className="animate-pulse text-zinc-500">Loading your score...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="score" />

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Hero Section */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-2xl sm:text-4xl font-bold text-white mb-3">Your Hormozi Score</h1>
          <p className="text-sm md:text-base text-zinc-400 max-w-2xl mx-auto">
            A comprehensive view of your business health based on the frameworks from $100M Offers and $100M Leads.
          </p>
        </div>

        {/* Overall Score */}
        <div className="flex justify-center mb-12">
          <OverallScore
            score={score.overallScore}
            rating={score.overallRating}
            completeness={score.completeness}
            toolsCompleted={score.toolsCompleted}
            totalTools={score.totalTools}
          />
        </div>

        {/* Recommendations */}
        <div className="mb-12">
          <Recommendations recommendations={recommendations} />
        </div>

        {/* Tool Scores Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Tool Breakdown</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* LTV/CAC Card */}
            <ScoreCard
              title="LTV/CAC Ratio"
              icon="📊"
              href="/calculator"
              toolScore={score.ltvCac}
              details={
                score.ltvCac.status === 'complete' && (
                  <>
                    <ScoreDetail
                      label="Ratio"
                      value={`${(score.ltvCac as LTVCACScore).ratio?.toFixed(1)}:1`}
                      highlight
                    />
                    <ScoreDetail
                      label="LTV"
                      value={`$${(score.ltvCac as LTVCACScore).ltv?.toLocaleString()}`}
                    />
                    <ScoreDetail
                      label="CAC"
                      value={`$${(score.ltvCac as LTVCACScore).cac?.toLocaleString()}`}
                    />
                    <ScoreDetail
                      label="Payback"
                      value={`${(score.ltvCac as LTVCACScore).paybackMonths?.toFixed(1)} months`}
                    />
                  </>
                )
              }
            />

            {/* Value Equation Card */}
            <ScoreCard
              title="Value Equation"
              icon="⚖️"
              href="/value-equation"
              toolScore={score.valueEquation}
              details={
                score.valueEquation.status === 'complete' && (
                  <>
                    <ScoreDetail
                      label="Value Score"
                      value={(score.valueEquation as ValueScore).valueScore?.toFixed(1) || '—'}
                      highlight
                    />
                    <ScoreDetail
                      label="Strongest"
                      value={(score.valueEquation as ValueScore).strongestArea || '—'}
                    />
                    <ScoreDetail
                      label="Weakest"
                      value={(score.valueEquation as ValueScore).weakestArea || '—'}
                    />
                  </>
                )
              }
            />

            {/* Bottleneck Card */}
            <ScoreCard
              title="Bottleneck"
              icon="🎯"
              href="/bottleneck"
              toolScore={score.bottleneck}
              details={
                score.bottleneck.status === 'complete' && (
                  <>
                    <ScoreDetail
                      label="Primary Issue"
                      value={formatBottleneck((score.bottleneck as BottleneckScore).primaryBottleneck)}
                      highlight
                    />
                    <ScoreDetail
                      label="Clarity"
                      value={`${(score.bottleneck as BottleneckScore).bottleneckSeverity?.toFixed(0)}%`}
                    />
                  </>
                )
              }
            />

            {/* Pricing Card */}
            <ScoreCard
              title="Pricing Analysis"
              icon="💵"
              href="/pricing"
              toolScore={score.pricing}
              details={
                score.pricing.status === 'complete' && (
                  <>
                    <ScoreDetail
                      label="Signal"
                      value={formatSignal((score.pricing as PricingScore).signal)}
                      highlight
                    />
                    <ScoreDetail
                      label="Confidence"
                      value={`${(score.pricing as PricingScore).confidencePercent?.toFixed(0)}%`}
                    />
                    <ScoreDetail
                      label="Recommendation"
                      value={formatDirection((score.pricing as PricingScore).adjustmentDirection)}
                    />
                  </>
                )
              }
            />

            {/* Offer Stack Card */}
            <ScoreCard
              title="Offer Stack"
              icon="🏆"
              href="/offer-stack"
              toolScore={score.offerStack}
              details={
                score.offerStack.status === 'complete' && (
                  <>
                    <ScoreDetail
                      label="Strength"
                      value={`${(score.offerStack as OfferScore).strengthScore?.toFixed(0)}/100`}
                      highlight
                    />
                    <ScoreDetail
                      label="Total Value"
                      value={`$${(score.offerStack as OfferScore).totalValue?.toLocaleString()}`}
                    />
                    <ScoreDetail
                      label="Value Ratio"
                      value={`${(score.offerStack as OfferScore).priceToValueRatio?.toFixed(1)}x`}
                    />
                  </>
                )
              }
            />

            {/* Playbook Generator Card - Always shows as a CTA */}
            <div className="bg-gradient-to-br from-amber-600/20 to-amber-800/20 border border-amber-600/30 rounded-xl p-5 flex flex-col">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-2xl">📋</span>
                <h3 className="font-semibold text-white">Playbook Generator</h3>
              </div>
              <p className="text-zinc-400 text-sm mb-4 flex-1">
                Generate custom action plans based on your score analysis.
              </p>
              <Link
                href="/generator"
                className="block text-center px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-500 transition-colors"
              >
                Create Playbook
              </Link>
            </div>
          </div>
        </div>

        {/* Chat CTA */}
        <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-8 text-center">
          <h3 className="text-xl font-bold text-white mb-2">Need Help Improving Your Score?</h3>
          <p className="text-zinc-400 mb-6">
            Chat with your AI advisor trained on Hormozi&apos;s frameworks for personalized guidance.
          </p>
          <Link
            href="/chat"
            className="inline-block px-6 py-3 bg-amber-600 text-white rounded-xl font-medium hover:bg-amber-500 transition-colors"
          >
            💬 Chat with Hormozi AI
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6 text-center text-zinc-500 text-sm">
          Based on frameworks from $100M Offers and $100M Leads by Alex Hormozi
        </div>
      </footer>
    </div>
  );
}

// Helper formatters
function formatBottleneck(area?: string): string {
  const labels: Record<string, string> = {
    leads: 'Lead Generation',
    conversion: 'Conversion',
    pricing: 'Pricing',
    retention: 'Retention',
  };
  return area ? labels[area] || area : '—';
}

function formatSignal(signal?: string): string {
  const labels: Record<string, string> = {
    optimal: 'Optimal',
    'slightly-high': 'Slightly High',
    'slightly-low': 'Slightly Low',
    underpriced: 'Underpriced',
    overpriced: 'Overpriced',
  };
  return signal ? labels[signal] || signal : '—';
}

function formatDirection(direction?: string): string {
  const labels: Record<string, string> = {
    increase: '↑ Raise Price',
    decrease: '↓ Lower Price',
    hold: '→ Hold Steady',
  };
  return direction ? labels[direction] || direction : '—';
}
