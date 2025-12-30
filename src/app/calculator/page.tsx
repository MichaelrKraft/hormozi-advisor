'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import CalculatorForm from '@/components/calculator/CalculatorForm';
import ResultsDisplay from '@/components/calculator/ResultsDisplay';
import LeverRecommendations from '@/components/calculator/LeverRecommendations';
import BenchmarkComparison from '@/components/calculator/BenchmarkComparison';
import MobileHeader from '@/components/layout/MobileHeader';
import type { CalculatorInputs, CalculatorResults, CalculatorSnapshot, Recommendation } from '@/types/calculator';
import { calculateAll } from '@/lib/calculator/calculations';
import { generateRecommendations } from '@/lib/calculator/interpretations';
import type { Industry } from '@/lib/benchmarks/data';

const STORAGE_KEY = 'hormozi-calculator-snapshots';
const INDUSTRY_KEY = 'hormozi-calculator-industry';

export default function CalculatorPage() {
  const [inputs, setInputs] = useState<CalculatorInputs | null>(null);
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [snapshots, setSnapshots] = useState<CalculatorSnapshot[]>([]);
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [industry, setIndustry] = useState<Industry>('general');

  // Load snapshots and industry from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setSnapshots(JSON.parse(saved));
      } catch {
        // Invalid JSON, ignore
      }
    }
    const savedIndustry = localStorage.getItem(INDUSTRY_KEY);
    if (savedIndustry) {
      setIndustry(savedIndustry as Industry);
    }
  }, []);

  const handleIndustryChange = (newIndustry: Industry) => {
    setIndustry(newIndustry);
    localStorage.setItem(INDUSTRY_KEY, newIndustry);
  };

  const handleCalculate = (newInputs: CalculatorInputs) => {
    setInputs(newInputs);
    const calculatedResults = calculateAll(newInputs);
    setResults(calculatedResults);
    const recs = generateRecommendations(newInputs, calculatedResults);
    setRecommendations(recs);
  };

  const handleSaveSnapshot = () => {
    if (!inputs || !results) return;

    const snapshot: CalculatorSnapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      inputs,
      results,
    };

    const newSnapshots = [snapshot, ...snapshots].slice(0, 10); // Keep last 10
    setSnapshots(newSnapshots);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSnapshots));
    setShowSavedMessage(true);
    setTimeout(() => setShowSavedMessage(false), 2000);
  };

  const handleLoadSnapshot = (snapshot: CalculatorSnapshot) => {
    setInputs(snapshot.inputs);
    setResults(snapshot.results);
    const recs = generateRecommendations(snapshot.inputs, snapshot.results);
    setRecommendations(recs);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <main className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="calculator" />

      {/* Hero */}
      <section className="py-12 px-4 text-center border-b border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            LTV/CAC <span className="text-sky-400">Calculator</span>
          </h1>
          <p className="text-xl text-zinc-400">
            The only metric that matters. Calculate your numbers and get
            Hormozi-style feedback.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Left Column: Form */}
            <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-6">
                Enter Your Numbers
              </h2>
              <CalculatorForm
                onCalculate={handleCalculate}
                initialInputs={inputs || undefined}
              />
            </div>

            {/* Right Column: Results */}
            <div className="space-y-6">
              {results ? (
                <>
                  <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
                    <h2 className="text-xl font-bold text-white mb-6">
                      Your Results
                    </h2>
                    <ResultsDisplay
                      results={results}
                      recommendations={recommendations}
                      onSaveSnapshot={handleSaveSnapshot}
                    />
                    {showSavedMessage && (
                      <div className="mt-4 text-center text-green-400 text-sm">
                        Snapshot saved!
                      </div>
                    )}
                  </div>

                  {/* Industry Benchmarks */}
                  <BenchmarkComparison
                    results={results}
                    industry={industry}
                    onChangeIndustry={handleIndustryChange}
                  />

                  {recommendations.length > 0 && (
                    <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6">
                      <LeverRecommendations recommendations={recommendations} />
                    </div>
                  )}

                  {/* Strategy Simulator CTA */}
                  <Link
                    href={`/strategies?ltv=${results.ltv}&cac=${results.cac}&ratio=${results.ratio.toFixed(2)}&margin=${inputs?.grossMarginPercent || ''}&frequency=${inputs?.purchaseFrequency || ''}&aov=${inputs?.averageOrderValue || ''}`}
                    className="block bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 rounded-2xl p-6 transition-all group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1">
                          📈 Simulate Growth Strategies
                        </h3>
                        <p className="text-sky-100">
                          See how Hormozi&apos;s 5 strategies would improve your ratio
                        </p>
                      </div>
                      <span className="text-3xl group-hover:translate-x-1 transition-transform">
                        →
                      </span>
                    </div>
                  </Link>
                </>
              ) : (
                <div className="bg-zinc-800/50 border border-zinc-700 rounded-2xl p-6 flex items-center justify-center min-h-[400px]">
                  <div className="text-center">
                    <div className="text-6xl mb-4 opacity-30">?</div>
                    <p className="text-zinc-500">
                      Fill in your metrics and hit calculate to see your LTV/CAC
                      ratio
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Snapshots History */}
          {snapshots.length > 0 && (
            <div className="mt-12">
              <h3 className="text-lg font-semibold text-white mb-4">
                Previous Calculations
              </h3>
              <div className="flex gap-3 overflow-x-auto pb-2">
                {snapshots.map((snapshot, index) => {
                  const prevRatio = snapshots[index + 1]?.results.ratio;
                  const trending =
                    prevRatio !== undefined
                      ? snapshot.results.ratio > prevRatio
                        ? 'up'
                        : snapshot.results.ratio < prevRatio
                        ? 'down'
                        : 'same'
                      : null;

                  return (
                    <button
                      key={snapshot.id}
                      onClick={() => handleLoadSnapshot(snapshot)}
                      className="flex-shrink-0 bg-zinc-800 border border-zinc-700 rounded-xl p-4 hover:border-sky-600/50 transition-colors text-left min-w-[120px]"
                    >
                      <div className="text-sm text-zinc-400 mb-1">
                        {formatDate(snapshot.timestamp)}
                      </div>
                      <div className="text-lg font-bold text-white flex items-center gap-1">
                        {snapshot.results.ratio.toFixed(1)}:1
                        {trending === 'up' && (
                          <span className="text-green-400 text-sm">+</span>
                        )}
                        {trending === 'down' && (
                          <span className="text-red-400 text-sm">-</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Educational Section */}
      <section className="py-12 px-4 bg-zinc-800/30 border-t border-zinc-800">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Understanding LTV/CAC
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-sky-400 mb-2">
                LTV (Lifetime Value)
              </h3>
              <p className="text-zinc-400 text-sm mb-3">
                The total <strong>gross profit</strong> you make from a customer
                over their entire relationship with you. Not revenue - profit
                after delivery costs.
              </p>
              <div className="bg-zinc-900 rounded-lg p-3 text-sm font-mono text-zinc-300">
                LTV = (AOV x Frequency x Lifespan) x Margin%
              </div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-sky-400 mb-2">
                CAC (Customer Acquisition Cost)
              </h3>
              <p className="text-zinc-400 text-sm mb-3">
                The total cost to acquire one new customer, including marketing
                spend and sales costs.
              </p>
              <div className="bg-zinc-900 rounded-lg p-3 text-sm font-mono text-zinc-300">
                CAC = (Marketing + Sales Costs) / New Customers
              </div>
            </div>
          </div>

          {/* Ratio Guide */}
          <div className="mt-8 bg-zinc-800 border border-zinc-700 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
              What&apos;s a Good Ratio?
            </h3>
            <div className="space-y-3">
              <RatioGuideRow ratio="< 1:1" label="Losing money on every customer" color="text-red-400" />
              <RatioGuideRow ratio="1-2:1" label="Barely breaking even" color="text-orange-400" />
              <RatioGuideRow ratio="2-3:1" label="Surviving, but risky" color="text-yellow-400" />
              <RatioGuideRow ratio="3-5:1" label="Healthy - can grow confidently" color="text-green-400" />
              <RatioGuideRow ratio="5-10:1" label="Strong - scale aggressively" color="text-emerald-400" />
              <RatioGuideRow ratio="10+:1" label="Exceptional - protect at all costs" color="text-sky-400" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function RatioGuideRow({
  ratio,
  label,
  color,
}: {
  ratio: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-4">
      <div className={`w-20 font-mono font-bold ${color}`}>{ratio}</div>
      <div className="text-zinc-400 text-sm">{label}</div>
    </div>
  );
}
