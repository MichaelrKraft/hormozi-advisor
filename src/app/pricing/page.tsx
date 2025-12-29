'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { PricingInputs, PricingSnapshot } from '@/types/pricing';
import { PRICING_CATEGORIES } from '@/types/pricing';
import { PRICING_INDICATORS } from '@/lib/pricing/indicators';
import { calculatePricingResults } from '@/lib/pricing/calculations';
import PricingSlider from '@/components/pricing/PricingSlider';
import PricingResults from '@/components/pricing/PricingResults';
import MobileHeader from '@/components/layout/MobileHeader';

const STORAGE_KEY = 'hormozi-pricing-snapshots';

const INDUSTRIES = [
  'SaaS / Software',
  'Coaching / Consulting',
  'Agency / Services',
  'E-commerce',
  'Health / Fitness',
  'Education / Courses',
  'Real Estate',
  'Local Business',
  'B2B Services',
  'Other',
];

export default function PricingPage() {
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [industry, setIndustry] = useState<string>('');
  const [indicators, setIndicators] = useState<Record<string, number>>(() =>
    PRICING_INDICATORS.reduce((acc, ind) => ({ ...acc, [ind.id]: 5 }), {})
  );
  const [showResults, setShowResults] = useState(false);
  const [savedMessage, setSavedMessage] = useState('');

  const inputs: PricingInputs = {
    currentPrice,
    industry,
    indicators,
  };

  const results = calculatePricingResults(inputs);

  const handleIndicatorChange = (id: string, value: number) => {
    setIndicators((prev) => ({ ...prev, [id]: value }));
  };

  const handleAnalyze = () => {
    setShowResults(true);
  };

  const handleSave = () => {
    const snapshot: PricingSnapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs,
      results,
    };

    const existing = localStorage.getItem(STORAGE_KEY);
    const snapshots: PricingSnapshot[] = existing ? JSON.parse(existing) : [];
    snapshots.unshift(snapshot);
    const trimmed = snapshots.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    setSavedMessage('Analysis saved!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleReset = () => {
    setIndicators(
      PRICING_INDICATORS.reduce((acc, ind) => ({ ...acc, [ind.id]: 5 }), {})
    );
    setCurrentPrice(0);
    setIndustry('');
    setShowResults(false);
  };

  // Group indicators by category
  const indicatorsByCategory = PRICING_INDICATORS.reduce((acc, ind) => {
    if (!acc[ind.category]) acc[ind.category] = [];
    acc[ind.category].push(ind);
    return acc;
  }, {} as Record<string, typeof PRICING_INDICATORS>);

  return (
    <main className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="pricing" />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Pricing Confidence Tool
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Are you underpriced, overpriced, or just right? Answer 10 questions
            about your business signals and get Hormozi-style pricing advice.
          </p>
        </div>

        {/* Saved Message */}
        {savedMessage && (
          <div className="mb-6 bg-emerald-900/30 border border-emerald-600 rounded-lg p-3 text-emerald-400 text-center">
            {savedMessage}
          </div>
        )}

        {!showResults ? (
          <div className="space-y-8">
            {/* Basic Info */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
              <h3 className="text-lg font-semibold text-white mb-4">Your Context</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">
                    Current Price Point
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                      $
                    </span>
                    <input
                      type="number"
                      value={currentPrice || ''}
                      onChange={(e) => setCurrentPrice(parseInt(e.target.value) || 0)}
                      placeholder="997"
                      className="w-full pl-7 pr-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-sky-600"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1">Industry</label>
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full px-3 py-2 bg-zinc-700 border border-zinc-600 rounded-lg text-white focus:outline-none focus:border-sky-600"
                  >
                    <option value="">Select industry...</option>
                    {INDUSTRIES.map((ind) => (
                      <option key={ind} value={ind}>
                        {ind}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Hormozi Quote */}
            <div className="bg-zinc-800/50 border-l-4 border-sky-500 rounded-r-xl p-5">
              <p className="text-zinc-300 italic">
                &quot;Pricing has the STRONGEST lever on profit. Not acquisition.
                Not retention. Pricing. A 10% price increase goes straight to
                your bottom line.&quot;
              </p>
              <p className="text-sky-400 text-sm mt-2">— Alex Hormozi</p>
            </div>

            {/* Indicators by Category */}
            {Object.entries(indicatorsByCategory).map(([category, categoryIndicators]) => {
              const meta = PRICING_CATEGORIES[category as keyof typeof PRICING_CATEGORIES];
              return (
                <div key={category} className="space-y-4">
                  <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                    <span>{meta.icon}</span>
                    {meta.label}
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {categoryIndicators.map((indicator) => (
                      <PricingSlider
                        key={indicator.id}
                        id={indicator.id}
                        question={indicator.question}
                        lowLabel={indicator.lowLabel}
                        highLabel={indicator.highLabel}
                        value={indicators[indicator.id]}
                        onChange={handleIndicatorChange}
                        category={meta.label}
                        categoryIcon={meta.icon}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {/* Analyze Button */}
            <button
              onClick={handleAnalyze}
              className="w-full py-4 px-6 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-500 transition-colors text-lg"
            >
              Analyze My Pricing
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <PricingResults
              results={results}
              currentPrice={currentPrice}
              onSave={handleSave}
            />
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Educational Footer */}
        <div className="mt-12 bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            The 4 Pricing Signals
          </h3>
          <div className="grid md:grid-cols-4 gap-4 text-sm">
            {Object.entries(PRICING_CATEGORIES).map(([key, meta]) => (
              <div key={key} className="text-center">
                <div className="text-2xl mb-2">{meta.icon}</div>
                <div className="text-white font-medium">{meta.label}</div>
                <div className="text-zinc-500 text-xs mt-1">
                  {key === 'sales-friction'
                    ? 'How hard is it to close?'
                    : key === 'customer-behavior'
                    ? 'How do they act after buying?'
                    : key === 'market-position'
                    ? 'How do you compare?'
                    : 'Do they see the value?'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
