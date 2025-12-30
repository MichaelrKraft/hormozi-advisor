'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import MobileHeader from '@/components/layout/MobileHeader';
import MetricsInput from '@/components/strategies/MetricsInput';
import StrategySimulator from '@/components/strategies/StrategySimulator';
import StrategyComparison from '@/components/strategies/StrategyComparison';
import type { BaseMetrics, IndustryType, StrategyType, SimulationState } from '@/types/strategies';
import { industryDefaults, industryNames } from '@/lib/calculator/industryDefaults';
import { getDetailedRecommendation } from '@/lib/calculator/recommender';

type ViewMode = 'simulator' | 'compare';

export default function StrategiesPage() {
  const searchParams = useSearchParams();

  // Initialize state from URL params or defaults
  const [metrics, setMetrics] = useState<BaseMetrics>({
    ltv: 0,
    cac: 0,
    ratio: 0,
  });
  const [industry, setIndustry] = useState<IndustryType>('saas');
  const [hasMetrics, setHasMetrics] = useState(false);
  const [viewMode, setViewMode] = useState<ViewMode>('simulator');
  const [activeStrategy, setActiveStrategy] = useState<StrategyType>('bnpl');

  // Parse URL params on mount
  useEffect(() => {
    const ltvParam = searchParams.get('ltv');
    const cacParam = searchParams.get('cac');
    const ratioParam = searchParams.get('ratio');
    const industryParam = searchParams.get('industry');
    const marginParam = searchParams.get('margin');
    const frequencyParam = searchParams.get('frequency');
    const aovParam = searchParams.get('aov');

    if (ltvParam && cacParam) {
      const ltv = parseFloat(ltvParam);
      const cac = parseFloat(cacParam);
      const ratio = ratioParam ? parseFloat(ratioParam) : ltv / cac;

      setMetrics({
        ltv,
        cac,
        ratio,
        grossMarginPercent: marginParam ? parseFloat(marginParam) : undefined,
        purchaseFrequency: frequencyParam ? parseFloat(frequencyParam) : undefined,
        averageOrderValue: aovParam ? parseFloat(aovParam) : undefined,
      });
      setHasMetrics(true);

      // Get recommendation to set initial strategy
      const recommendation = getDetailedRecommendation({ ltv, cac, ratio }, industry);
      setActiveStrategy(recommendation.primaryStrategy);
    }

    if (industryParam && Object.keys(industryDefaults).includes(industryParam)) {
      setIndustry(industryParam as IndustryType);
    }
  }, [searchParams]);

  const handleMetricsSubmit = (newMetrics: BaseMetrics, newIndustry: IndustryType) => {
    setMetrics(newMetrics);
    setIndustry(newIndustry);
    setHasMetrics(true);

    // Get recommendation to set initial strategy
    const recommendation = getDetailedRecommendation(newMetrics, newIndustry);
    setActiveStrategy(recommendation.primaryStrategy);
  };

  const handleReset = () => {
    setHasMetrics(false);
    setMetrics({ ltv: 0, cac: 0, ratio: 0 });
    setViewMode('simulator');
  };

  return (
    <main className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="tools" />

      {/* Hero */}
      <section className="py-12 px-4 text-center border-b border-zinc-800">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Strategy <span className="text-sky-400">Simulator</span>
          </h1>
          <p className="text-xl text-zinc-400">
            Hormozi&apos;s 5 ways to increase your LTV:CAC ratio. See how each
            strategy would impact your numbers.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {!hasMetrics ? (
          // Metrics Input Form
          <MetricsInput
            onSubmit={handleMetricsSubmit}
            initialIndustry={industry}
          />
        ) : (
          // Strategy Simulator
          <div className="space-y-8">
            {/* Current Metrics Display */}
            <div className="bg-zinc-800/50 rounded-xl p-6 border border-zinc-700">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex flex-wrap gap-6">
                  <div>
                    <span className="text-zinc-400 text-sm">LTV</span>
                    <p className="text-2xl font-bold text-white">${metrics.ltv.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-sm">CAC</span>
                    <p className="text-2xl font-bold text-white">${metrics.cac.toLocaleString()}</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-sm">Ratio</span>
                    <p className="text-2xl font-bold text-sky-400">{metrics.ratio.toFixed(1)}x</p>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-sm">Industry</span>
                    <p className="text-lg font-medium text-white">{industryNames[industry]}</p>
                  </div>
                </div>
                <button
                  onClick={handleReset}
                  className="text-zinc-400 hover:text-white transition-colors text-sm"
                >
                  Change metrics →
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('simulator')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'simulator'
                    ? 'bg-sky-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                📈 Simulate Strategy
              </button>
              <button
                onClick={() => setViewMode('compare')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  viewMode === 'compare'
                    ? 'bg-sky-600 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                📊 Compare All
              </button>
            </div>

            {/* Content based on view mode */}
            {viewMode === 'simulator' ? (
              <StrategySimulator
                metrics={metrics}
                industry={industry}
                activeStrategy={activeStrategy}
                onStrategyChange={setActiveStrategy}
              />
            ) : (
              <StrategyComparison
                metrics={metrics}
                industry={industry}
                onSelectStrategy={(strategy) => {
                  setActiveStrategy(strategy);
                  setViewMode('simulator');
                }}
              />
            )}
          </div>
        )}
      </div>
    </main>
  );
}
