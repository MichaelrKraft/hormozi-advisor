'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { BottleneckAnswer, BottleneckResults, BottleneckSnapshot } from '@/types/bottleneck';
import { calculateBottleneckResults } from '@/lib/bottleneck/calculations';
import BottleneckQuiz from '@/components/bottleneck/BottleneckQuiz';
import BottleneckResultsDisplay from '@/components/bottleneck/BottleneckResults';
import MobileHeader from '@/components/layout/MobileHeader';

const STORAGE_KEY = 'hormozi-bottleneck-snapshots';

export default function BottleneckPage() {
  const [stage, setStage] = useState<'intro' | 'quiz' | 'results'>('intro');
  const [answers, setAnswers] = useState<BottleneckAnswer[]>([]);
  const [results, setResults] = useState<BottleneckResults | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [savedMessage, setSavedMessage] = useState('');

  const handleStartQuiz = () => {
    setStage('quiz');
  };

  const handleQuizComplete = (quizAnswers: BottleneckAnswer[]) => {
    setAnswers(quizAnswers);
    const calculatedResults = calculateBottleneckResults(quizAnswers);
    setResults(calculatedResults);
    setStage('results');
  };

  const handleSaveSnapshot = () => {
    if (!results) return;

    const snapshot: BottleneckSnapshot = {
      id: Date.now().toString(),
      timestamp: Date.now(),
      businessName: businessName || undefined,
      answers,
      results,
    };

    const existing = localStorage.getItem(STORAGE_KEY);
    const snapshots: BottleneckSnapshot[] = existing ? JSON.parse(existing) : [];
    snapshots.unshift(snapshot);
    const trimmed = snapshots.slice(0, 20);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed));

    setSavedMessage('Diagnostic saved!');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const handleStartOver = () => {
    setStage('intro');
    setAnswers([]);
    setResults(null);
    setBusinessName('');
  };

  return (
    <main className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="bottleneck" />

      {/* Page Content */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Intro Stage */}
        {stage === 'intro' && (
          <div className="space-y-8">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-4xl font-bold text-white mb-3">
                Business Bottleneck Diagnostic
              </h1>
              <p className="text-zinc-400 max-w-lg mx-auto">
                Find your #1 constraint in 2 minutes. Every business has a bottleneck -
                the thing holding back all other growth. Let&apos;s find yours.
              </p>
            </div>

            {/* The Four Bottlenecks */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-white mb-4 text-center">
                The Four Growth Bottlenecks
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-blue-900/20 border border-blue-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">👁️</div>
                  <div className="text-blue-400 font-medium">Leads</div>
                  <div className="text-xs text-zinc-500">Not enough people see your offer</div>
                </div>
                <div className="bg-purple-900/20 border border-purple-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">💰</div>
                  <div className="text-purple-400 font-medium">Conversion</div>
                  <div className="text-xs text-zinc-500">People see but don&apos;t buy</div>
                </div>
                <div className="bg-sky-900/20 border border-sky-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">💵</div>
                  <div className="text-sky-400 font-medium">Pricing</div>
                  <div className="text-xs text-zinc-500">Selling but margins are thin</div>
                </div>
                <div className="bg-green-900/20 border border-green-800/50 rounded-lg p-4 text-center">
                  <div className="text-2xl mb-1">🔄</div>
                  <div className="text-green-400 font-medium">Retention</div>
                  <div className="text-xs text-zinc-500">Customers don&apos;t come back</div>
                </div>
              </div>
            </div>

            {/* Hormozi Quote */}
            <div className="bg-zinc-800/50 border-l-4 border-sky-500 rounded-r-xl p-5">
              <p className="text-zinc-300 italic">
                &quot;Every business has a constraint. The question is: do you know what yours is?
                Most entrepreneurs are pushing on the wrong lever. Find the bottleneck,
                fix it, and everything else gets easier.&quot;
              </p>
              <p className="text-sky-400 text-sm mt-2">— Alex Hormozi</p>
            </div>

            {/* Business Name Input */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                What business are you diagnosing? (optional)
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g., My SaaS Company"
                className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-sky-600"
              />
            </div>

            {/* Start Button */}
            <button
              onClick={handleStartQuiz}
              className="w-full py-4 px-6 bg-sky-600 text-white font-semibold rounded-xl hover:bg-sky-500 transition-colors text-lg"
            >
              Start Diagnostic (8 Questions)
            </button>

            {/* Time Estimate */}
            <p className="text-center text-zinc-500 text-sm">
              Takes about 2 minutes • Get personalized recommendations
            </p>
          </div>
        )}

        {/* Quiz Stage */}
        {stage === 'quiz' && <BottleneckQuiz onComplete={handleQuizComplete} />}

        {/* Results Stage */}
        {stage === 'results' && results && (
          <div className="space-y-6">
            {/* Title */}
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white mb-2">
                Your Diagnostic Results
              </h1>
              {businessName && (
                <p className="text-zinc-400">Analysis for: {businessName}</p>
              )}
            </div>

            {/* Saved Message */}
            {savedMessage && (
              <div className="bg-emerald-900/30 border border-emerald-600 rounded-lg p-3 text-emerald-400 text-center">
                {savedMessage}
              </div>
            )}

            {/* Results Display */}
            <BottleneckResultsDisplay
              results={results}
              onSaveSnapshot={handleSaveSnapshot}
              onStartOver={handleStartOver}
            />
          </div>
        )}
      </div>
    </main>
  );
}
