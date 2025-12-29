'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import type { ValueEquationInputs, ValueEquationSnapshot } from '@/types/value-equation';
import { calculateAll, DIMENSION_INFO } from '@/lib/value-equation/calculations';
import ValueSlider from '@/components/value-equation/ValueSlider';
import ValueResults from '@/components/value-equation/ValueResults';
import MobileHeader from '@/components/layout/MobileHeader';

const STORAGE_KEY = 'hormozi-value-equation-snapshots';

export default function ValueEquationPage() {
  const [inputs, setInputs] = useState<ValueEquationInputs>({
    dreamOutcome: 5,
    perceivedLikelihood: 5,
    timeDelay: 5,
    effortSacrifice: 5,
  });
  const [showResults, setShowResults] = useState(false);
  const [offerName, setOfferName] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const results = calculateAll(inputs);

  const handleInputChange = (dimension: keyof ValueEquationInputs, value: number) => {
    setInputs((prev) => ({ ...prev, [dimension]: value }));
  };

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleSaveSnapshot = () => {
    const snapshot: ValueEquationSnapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      offerName: offerName || undefined,
      inputs,
      results,
    };

    // Get existing snapshots
    const existing = localStorage.getItem(STORAGE_KEY);
    const snapshots: ValueEquationSnapshot[] = existing ? JSON.parse(existing) : [];

    // Add new snapshot (most recent first)
    snapshots.unshift(snapshot);

    // Keep only last 20 snapshots
    const trimmed = snapshots.slice(0, 20);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));
    setSavedMessage('Analysis saved!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleReset = () => {
    setInputs({
      dreamOutcome: 5,
      perceivedLikelihood: 5,
      timeDelay: 5,
      effortSacrifice: 5,
    });
    setShowResults(false);
    setOfferName('');
  };

  return (
    <main className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="value-equation" />

      {/* Page Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">
            Value Equation Calculator
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto">
            From $100M Offers: Calculate your offer&apos;s perceived value using
            Hormozi&apos;s formula. Higher value = easier sales.
          </p>
        </div>

        {/* Formula Display */}
        <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4 mb-8">
          <div className="text-center">
            <div className="text-sm text-zinc-400 mb-2">The Value Equation</div>
            <div className="text-xl md:text-2xl font-mono text-white">
              <span className="text-emerald-400">Value</span> ={' '}
              <span className="text-emerald-400">(Dream Outcome × Perceived Likelihood)</span>
              <span className="text-zinc-400"> / </span>
              <span className="text-red-400">(Time Delay × Effort & Sacrifice)</span>
            </div>
            <div className="text-xs text-zinc-500 mt-2">
              Maximize the numerator, minimize the denominator
            </div>
          </div>
        </div>

        {/* Offer Name Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-zinc-400 mb-2">
            What offer are you evaluating? (optional)
          </label>
          <input
            type="text"
            value={offerName}
            onChange={(e) => setOfferName(e.target.value)}
            placeholder="e.g., 12-Week Transformation Program"
            className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-sky-600"
          />
        </div>

        {/* Sliders Grid */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          {/* Dream Outcome */}
          <ValueSlider
            label={DIMENSION_INFO.dreamOutcome.label}
            description={DIMENSION_INFO.dreamOutcome.description}
            value={inputs.dreamOutcome}
            onChange={(v) => handleInputChange('dreamOutcome', v)}
            lowLabel="Small improvement"
            highLabel="Life-changing"
          />

          {/* Perceived Likelihood */}
          <ValueSlider
            label={DIMENSION_INFO.perceivedLikelihood.label}
            description={DIMENSION_INFO.perceivedLikelihood.description}
            value={inputs.perceivedLikelihood}
            onChange={(v) => handleInputChange('perceivedLikelihood', v)}
            lowLabel="Doubtful"
            highLabel="Almost certain"
          />

          {/* Time Delay */}
          <ValueSlider
            label={DIMENSION_INFO.timeDelay.label}
            description={DIMENSION_INFO.timeDelay.description}
            value={inputs.timeDelay}
            onChange={(v) => handleInputChange('timeDelay', v)}
            isInverted={true}
            lowLabel="Immediate"
            highLabel="Years away"
          />

          {/* Effort & Sacrifice */}
          <ValueSlider
            label={DIMENSION_INFO.effortSacrifice.label}
            description={DIMENSION_INFO.effortSacrifice.description}
            value={inputs.effortSacrifice}
            onChange={(v) => handleInputChange('effortSacrifice', v)}
            isInverted={true}
            lowLabel="Done for you"
            highLabel="Huge effort"
          />
        </div>

        {/* Action Buttons */}
        {!showResults ? (
          <button
            onClick={handleCalculate}
            className="w-full py-4 px-6 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-500 transition-colors text-lg"
          >
            Calculate My Offer Value
          </button>
        ) : (
          <div className="space-y-6">
            {/* Saved Message */}
            {savedMessage && (
              <div className="bg-emerald-900/30 border border-emerald-600 rounded-lg p-3 text-emerald-400 text-center">
                {savedMessage}
              </div>
            )}

            {/* Results */}
            <ValueResults
              inputs={inputs}
              results={results}
              onSaveSnapshot={handleSaveSnapshot}
            />

            {/* Reset Button */}
            <button
              onClick={handleReset}
              className="w-full py-3 px-4 bg-zinc-800 border border-zinc-600 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition-colors"
            >
              Start Over
            </button>
          </div>
        )}

        {/* Real-time Preview (before calculate) */}
        {!showResults && (
          <div className="mt-6 bg-zinc-800/50 border border-zinc-700 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <span className="text-zinc-400 text-sm">Live Score Preview:</span>
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-sky-400">
                  {results.score.toFixed(1)}
                </span>
                <span
                  className={`text-xs px-2 py-1 rounded ${
                    results.rating === 'exceptional'
                      ? 'bg-sky-900/50 text-sky-400'
                      : results.rating === 'strong'
                      ? 'bg-emerald-900/50 text-emerald-400'
                      : results.rating === 'good'
                      ? 'bg-green-900/50 text-green-400'
                      : results.rating === 'average'
                      ? 'bg-yellow-900/50 text-yellow-400'
                      : results.rating === 'weak'
                      ? 'bg-orange-900/50 text-orange-400'
                      : 'bg-red-900/50 text-red-400'
                  }`}
                >
                  {results.rating.toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Educational Footer */}
        <div className="mt-12 bg-zinc-800/30 border border-zinc-700/50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-3">
            Understanding the Value Equation
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="text-emerald-400 font-medium mb-1">
                Numerator (Maximize These)
              </h4>
              <ul className="text-zinc-400 space-y-1">
                <li>
                  <strong className="text-zinc-300">Dream Outcome:</strong> How
                  big is the transformation you promise?
                </li>
                <li>
                  <strong className="text-zinc-300">Perceived Likelihood:</strong>{' '}
                  Do they believe they&apos;ll actually achieve it?
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-red-400 font-medium mb-1">
                Denominator (Minimize These)
              </h4>
              <ul className="text-zinc-400 space-y-1">
                <li>
                  <strong className="text-zinc-300">Time Delay:</strong> How long
                  until they see results?
                </li>
                <li>
                  <strong className="text-zinc-300">Effort & Sacrifice:</strong>{' '}
                  How much work do they have to put in?
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-zinc-700">
            <p className="text-zinc-500 text-sm italic">
              &quot;The goal is to make an offer so good people feel stupid saying
              no. Maximize the dream and likelihood, minimize the time and
              effort.&quot; — Alex Hormozi
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
