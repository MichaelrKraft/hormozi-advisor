'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { OfferStack, OfferSnapshot } from '@/types/offer-stack';
import { analyzeOffer, createEmptyStack } from '@/lib/offer-stack/analysis';
import OfferStackBuilder from '@/components/offer-stack/OfferStackBuilder';
import OfferAnalysisDisplay from '@/components/offer-stack/OfferAnalysis';
import MobileHeader from '@/components/layout/MobileHeader';

const STORAGE_KEY = 'hormozi-offer-stack-snapshots';

export default function OfferStackPage() {
  const [stack, setStack] = useState<OfferStack>(createEmptyStack());
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const analysis = analyzeOffer(stack);

  const handleSave = () => {
    const snapshot: OfferSnapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      stack,
      analysis,
    };

    const existing = localStorage.getItem(STORAGE_KEY);
    const snapshots: OfferSnapshot[] = existing ? JSON.parse(existing) : [];
    snapshots.unshift(snapshot);
    const trimmed = snapshots.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    setSavedMessage('Offer saved!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleReset = () => {
    setStack(createEmptyStack());
    setShowAnalysis(false);
  };

  // Check if stack has enough content to show analysis
  const canAnalyze =
    stack.coreDeliverable.title && stack.coreDeliverable.value > 0 && stack.targetPrice > 0;

  return (
    <main className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="offer-stack" />

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Grand Slam Offer Builder</h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Build an offer so good people feel stupid saying no. Stack value using the 5
            components from $100M Offers.
          </p>
        </div>

        {/* Saved Message */}
        {savedMessage && (
          <div className="mb-6 bg-emerald-900/30 border border-emerald-600 rounded-lg p-3 text-emerald-400 text-center">
            {savedMessage}
          </div>
        )}

        {/* Two Column Layout */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left: Builder */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-white">Build Your Offer</h2>
              <button
                onClick={handleReset}
                className="text-sm text-zinc-400 hover:text-white"
              >
                Reset
              </button>
            </div>
            <OfferStackBuilder stack={stack} onUpdate={setStack} />
          </div>

          {/* Right: Preview/Analysis */}
          <div>
            <div className="sticky top-8">
              <h2 className="text-xl font-semibold text-white mb-4">
                {showAnalysis ? 'Offer Analysis' : 'Live Preview'}
              </h2>

              {!showAnalysis ? (
                <div className="space-y-4">
                  {/* Quick Stats */}
                  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-sm text-zinc-400 mb-1">Total Value</div>
                        <div className="text-2xl font-bold text-emerald-400">
                          ${analysis.totalValue.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-zinc-400 mb-1">Your Price</div>
                        <div className="text-2xl font-bold text-white">
                          ${stack.targetPrice.toLocaleString()}
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-zinc-400 mb-1">Value Ratio</div>
                        <div
                          className={`text-2xl font-bold ${
                            analysis.priceToValueRatio >= 5
                              ? 'text-emerald-400'
                              : analysis.priceToValueRatio >= 3
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {analysis.priceToValueRatio}:1
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-sm text-zinc-400 mb-1">Strength</div>
                        <div
                          className={`text-2xl font-bold ${
                            analysis.strengthScore >= 75
                              ? 'text-emerald-400'
                              : analysis.strengthScore >= 50
                              ? 'text-yellow-400'
                              : 'text-red-400'
                          }`}
                        >
                          {analysis.strengthScore}/100
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Checklist */}
                  <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-zinc-400 mb-3">
                      Grand Slam Checklist
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Core deliverable defined', done: !!stack.coreDeliverable.title },
                        { label: 'Price set', done: stack.targetPrice > 0 },
                        { label: '2+ bonuses stacked', done: stack.bonuses.length >= 2 },
                        { label: 'Guarantee added', done: stack.guarantee.type !== 'none' },
                        { label: 'Scarcity element', done: stack.scarcity.type !== 'none' },
                        { label: 'Urgency trigger', done: stack.urgency.type !== 'none' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-2">
                          <span
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                              item.done
                                ? 'bg-emerald-900/50 text-emerald-400'
                                : 'bg-zinc-700 text-zinc-500'
                            }`}
                          >
                            {item.done ? '✓' : '○'}
                          </span>
                          <span
                            className={
                              item.done ? 'text-zinc-300' : 'text-zinc-500'
                            }
                          >
                            {item.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Hormozi Tip */}
                  <div className="bg-zinc-800/50 border-l-4 border-sky-500 rounded-r-xl p-4">
                    <p className="text-zinc-400 text-sm italic">
                      &quot;The goal is to make an offer so good people feel stupid saying no.
                      Stack so much value that your price seems like a steal.&quot;
                    </p>
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={() => setShowAnalysis(true)}
                    disabled={!canAnalyze}
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-colors ${
                      canAnalyze
                        ? 'bg-sky-600 text-white hover:bg-sky-500'
                        : 'bg-zinc-700 text-zinc-500 cursor-not-allowed'
                    }`}
                  >
                    {canAnalyze ? 'Analyze My Offer' : 'Add core deliverable and price to analyze'}
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <OfferAnalysisDisplay
                    stack={stack}
                    analysis={analysis}
                    onSave={handleSave}
                  />
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className="w-full py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
                  >
                    ← Back to Builder
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Educational Footer */}
        <div className="mt-12 bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            The 5 Components of a Grand Slam Offer
          </h3>
          <div className="grid md:grid-cols-5 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-2">🎯</div>
              <div className="text-white font-medium">Core</div>
              <div className="text-zinc-500">The main thing they get</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🎁</div>
              <div className="text-white font-medium">Bonuses</div>
              <div className="text-zinc-500">Stack more value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">🛡️</div>
              <div className="text-white font-medium">Guarantee</div>
              <div className="text-zinc-500">Reverse the risk</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⏳</div>
              <div className="text-white font-medium">Scarcity</div>
              <div className="text-zinc-500">Why it&apos;s limited</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-2">⚡</div>
              <div className="text-white font-medium">Urgency</div>
              <div className="text-zinc-500">Why act now</div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
