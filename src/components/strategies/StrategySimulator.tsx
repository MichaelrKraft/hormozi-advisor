'use client';

import { useState, useEffect, useMemo } from 'react';
import type {
  BaseMetrics,
  IndustryType,
  StrategyType,
  StrategyResult,
  GiveawayParams,
  MembershipParams,
  BNPLParams,
  SubscriptionParams,
  PricingParams,
} from '@/types/strategies';
import {
  strategyInfo,
  industryDefaults,
  getAllStrategies,
} from '@/lib/calculator/industryDefaults';
import { calculateStrategy } from '@/lib/calculator/strategies';
import { getDetailedRecommendation, getRecommendationBullets } from '@/lib/calculator/recommender';

interface StrategySimulatorProps {
  metrics: BaseMetrics;
  industry: IndustryType;
  activeStrategy: StrategyType;
  onStrategyChange: (strategy: StrategyType) => void;
}

export default function StrategySimulator({
  metrics,
  industry,
  activeStrategy,
  onStrategyChange,
}: StrategySimulatorProps) {
  // Get recommendation
  const recommendation = useMemo(
    () => getDetailedRecommendation(metrics, industry),
    [metrics, industry]
  );

  // Initialize params from industry defaults
  const [params, setParams] = useState(() => ({
    giveaway: { ...industryDefaults[industry].giveaway },
    membership: { ...industryDefaults[industry].membership },
    bnpl: { ...industryDefaults[industry].bnpl },
    subscription: { ...industryDefaults[industry].subscription },
    pricing: { ...industryDefaults[industry].pricing },
  }));

  // Reset params when industry changes
  useEffect(() => {
    setParams({
      giveaway: { ...industryDefaults[industry].giveaway },
      membership: { ...industryDefaults[industry].membership },
      bnpl: { ...industryDefaults[industry].bnpl },
      subscription: { ...industryDefaults[industry].subscription },
      pricing: { ...industryDefaults[industry].pricing },
    });
  }, [industry]);

  // Calculate result for active strategy
  const result: StrategyResult = useMemo(() => {
    return calculateStrategy(activeStrategy, metrics, params[activeStrategy]);
  }, [activeStrategy, metrics, params]);

  const activeInfo = strategyInfo[activeStrategy];
  const bullets = getRecommendationBullets(activeStrategy, metrics);

  // Generic param update handler
  const updateParam = <T extends StrategyType>(
    strategy: T,
    key: keyof typeof params[T],
    value: number
  ) => {
    setParams((prev) => ({
      ...prev,
      [strategy]: {
        ...prev[strategy],
        [key]: value,
      },
    }));
  };

  // Reset to industry defaults
  const resetParams = () => {
    setParams((prev) => ({
      ...prev,
      [activeStrategy]: { ...industryDefaults[industry][activeStrategy] },
    }));
  };

  return (
    <div className="space-y-6">
      {/* Recommendation Banner */}
      {recommendation.primaryStrategy === activeStrategy && (
        <div className="bg-sky-900/30 border border-sky-700 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⭐</span>
            <div>
              <h3 className="font-semibold text-sky-400">Recommended for You</h3>
              <p className="text-zinc-300 text-sm">{recommendation.reasoning}</p>
            </div>
          </div>
        </div>
      )}

      {/* Strategy Tabs */}
      <div className="flex flex-wrap gap-2">
        {getAllStrategies().map((strategy) => (
          <button
            key={strategy.type}
            onClick={() => onStrategyChange(strategy.type)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeStrategy === strategy.type
                ? 'bg-sky-600 text-white'
                : 'bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700'
            }`}
          >
            <span>{strategy.icon}</span>
            <span className="hidden sm:inline">{strategy.shortName}</span>
            {recommendation.primaryStrategy === strategy.type && (
              <span className="text-xs">⭐</span>
            )}
          </button>
        ))}
      </div>

      {/* Strategy Details */}
      <div className="bg-zinc-800/50 rounded-xl border border-zinc-700 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-zinc-700">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                <span>{activeInfo.icon}</span>
                {activeInfo.name}
              </h2>
              <p className="text-zinc-400 mt-1">{activeInfo.description}</p>
            </div>
            <button
              onClick={resetParams}
              className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
            >
              Reset defaults
            </button>
          </div>
        </div>

        {/* Parameter Controls */}
        <div className="p-6 border-b border-zinc-700">
          <h3 className="text-lg font-semibold text-white mb-4">Adjust Parameters</h3>
          {renderParamControls()}
        </div>

        {/* Results */}
        <div className="p-6 bg-zinc-900/50">
          <h3 className="text-lg font-semibold text-white mb-4">Projected Impact</h3>

          <div className="grid grid-cols-2 gap-6">
            {/* Before */}
            <div className="bg-zinc-800 rounded-lg p-4">
              <h4 className="text-zinc-400 text-sm mb-3">BEFORE</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-zinc-400">LTV</span>
                  <span className="text-white font-medium">${metrics.ltv.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-zinc-400">CAC</span>
                  <span className="text-white font-medium">${metrics.cac.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-700 pt-2">
                  <span className="text-zinc-400">Ratio</span>
                  <span className="text-white font-bold">{metrics.ratio.toFixed(1)}x</span>
                </div>
              </div>
            </div>

            {/* After */}
            <div className="bg-sky-900/30 border border-sky-800 rounded-lg p-4">
              <h4 className="text-sky-400 text-sm mb-3">AFTER</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">LTV</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">${Math.round(result.newLtv).toLocaleString()}</span>
                    {result.ltvChange !== 0 && (
                      <span className={`text-sm ${result.ltvChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {result.ltvChange > 0 ? '+' : ''}{result.ltvChange.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">CAC</span>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">${Math.round(result.newCac).toLocaleString()}</span>
                    {result.cacChange !== 0 && (
                      <span className={`text-sm ${result.cacChange < 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {result.cacChange > 0 ? '+' : ''}{result.cacChange.toFixed(0)}%
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center border-t border-sky-800/50 pt-2">
                  <span className="text-zinc-400">Ratio</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sky-400 font-bold">{result.newRatio.toFixed(1)}x</span>
                    <span className={`text-sm font-semibold ${result.ratioChange > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {result.ratioChange > 0 ? '+' : ''}{result.ratioChange.toFixed(0)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Explanation */}
          <p className="text-zinc-400 text-sm mt-4">{result.explanation}</p>

          {/* Why bullets */}
          {bullets.length > 0 && (
            <div className="mt-4 pt-4 border-t border-zinc-700">
              <h4 className="text-sm font-medium text-zinc-300 mb-2">Why this works:</h4>
              <ul className="space-y-1">
                {bullets.map((bullet, i) => (
                  <li key={i} className="text-zinc-400 text-sm flex items-start gap-2">
                    <span className="text-sky-400">•</span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Hormozi Quote */}
        <div className="p-6 border-t border-zinc-700 bg-zinc-800/30">
          <blockquote className="text-zinc-400 italic">
            &quot;{activeInfo.hormoziQuote}&quot;
          </blockquote>
          <p className="text-zinc-500 text-sm mt-2">— Alex Hormozi</p>
        </div>
      </div>
    </div>
  );

  function renderParamControls() {
    switch (activeStrategy) {
      case 'giveaway':
        return renderGiveawayControls();
      case 'membership':
        return renderMembershipControls();
      case 'bnpl':
        return renderBNPLControls();
      case 'subscription':
        return renderSubscriptionControls();
      case 'pricing':
        return renderPricingControls();
    }
  }

  function renderGiveawayControls() {
    const p = params.giveaway;
    return (
      <div className="space-y-6">
        <SliderControl
          label="Email Capture Rate"
          value={p.emailCaptureRate}
          min={5}
          max={60}
          unit="%"
          tooltip="Percentage of bounced visitors who give their email"
          onChange={(v) => updateParam('giveaway', 'emailCaptureRate', v)}
        />
        <SliderControl
          label="Email-to-Customer Rate"
          value={p.emailConversionRate}
          min={0.5}
          max={10}
          step={0.5}
          unit="%"
          tooltip="Percentage of email subscribers who become customers"
          onChange={(v) => updateParam('giveaway', 'emailConversionRate', v)}
        />
        <SliderControl
          label="Bounce Rate"
          value={p.bounceRate}
          min={70}
          max={95}
          unit="%"
          tooltip="Percentage of visitors who leave without buying"
          onChange={(v) => updateParam('giveaway', 'bounceRate', v)}
        />
      </div>
    );
  }

  function renderMembershipControls() {
    const p = params.membership;
    return (
      <div className="space-y-6">
        <SliderControl
          label="Membership Price"
          value={p.membershipPrice}
          min={9}
          max={499}
          unit="$/year"
          tooltip="Annual membership fee"
          onChange={(v) => updateParam('membership', 'membershipPrice', v)}
        />
        <SliderControl
          label="Membership Conversion"
          value={p.membershipConversion}
          min={5}
          max={50}
          unit="%"
          tooltip="Percentage of customers who become members"
          onChange={(v) => updateParam('membership', 'membershipConversion', v)}
        />
        <SliderControl
          label="Frequency Lift"
          value={p.frequencyLift}
          min={5}
          max={60}
          unit="%"
          tooltip="How much more frequently members purchase"
          onChange={(v) => updateParam('membership', 'frequencyLift', v)}
        />
      </div>
    );
  }

  function renderBNPLControls() {
    const p = params.bnpl;
    return (
      <div className="space-y-6">
        <SliderControl
          label="Conversion Rate Lift"
          value={p.cvrLift}
          min={5}
          max={50}
          unit="%"
          tooltip="How much BNPL increases your conversion rate"
          onChange={(v) => updateParam('bnpl', 'cvrLift', v)}
        />
        <SliderControl
          label="Average Order Value Lift"
          value={p.aovLift}
          min={10}
          max={80}
          unit="%"
          tooltip="How much larger orders are with payment plans"
          onChange={(v) => updateParam('bnpl', 'aovLift', v)}
        />
      </div>
    );
  }

  function renderSubscriptionControls() {
    const p = params.subscription;
    return (
      <div className="space-y-6">
        <SliderControl
          label="Subscription Price"
          value={p.subscriptionPrice}
          min={9}
          max={997}
          unit="$/month"
          tooltip="Monthly subscription price"
          onChange={(v) => updateParam('subscription', 'subscriptionPrice', v)}
        />
        <SliderControl
          label="Monthly Retention"
          value={p.retentionRate}
          min={60}
          max={98}
          unit="%"
          tooltip="Percentage who stay each month"
          onChange={(v) => updateParam('subscription', 'retentionRate', v)}
        />
        <SliderControl
          label="Subscription Conversion"
          value={p.subscriptionConversion}
          min={10}
          max={80}
          unit="%"
          tooltip="Percentage of customers who subscribe"
          onChange={(v) => updateParam('subscription', 'subscriptionConversion', v)}
        />
      </div>
    );
  }

  function renderPricingControls() {
    const p = params.pricing;
    return (
      <div className="space-y-6">
        <SliderControl
          label="Price Increase"
          value={p.priceIncrease}
          min={5}
          max={50}
          unit="%"
          tooltip="How much you'll raise prices"
          onChange={(v) => updateParam('pricing', 'priceIncrease', v)}
        />
        <SliderControl
          label="Expected CVR Drop"
          value={p.expectedCvrDrop}
          min={0}
          max={30}
          unit="%"
          tooltip="How much conversion rate might decrease"
          onChange={(v) => updateParam('pricing', 'expectedCvrDrop', v)}
        />
      </div>
    );
  }
}

// Slider component
interface SliderControlProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit: string;
  tooltip?: string;
  onChange: (value: number) => void;
}

function SliderControl({
  label,
  value,
  min,
  max,
  step = 1,
  unit,
  tooltip,
  onChange,
}: SliderControlProps) {
  return (
    <div>
      <div className="flex justify-between items-center mb-2">
        <label className="text-sm font-medium text-zinc-300" title={tooltip}>
          {label}
        </label>
        <span className="text-sky-400 font-medium">
          {unit.startsWith('$') ? `$${value}` : `${value}${unit}`}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-sky-500"
      />
      <div className="flex justify-between text-xs text-zinc-500 mt-1">
        <span>{unit.startsWith('$') ? `$${min}` : `${min}${unit}`}</span>
        <span>{unit.startsWith('$') ? `$${max}` : `${max}${unit}`}</span>
      </div>
    </div>
  );
}
