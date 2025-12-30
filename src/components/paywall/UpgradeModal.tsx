'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  feature: 'chat' | 'playbook' | 'score';
  usageCount: number;
  limit: number;
}

const FEATURE_NAMES = {
  chat: 'chat messages',
  playbook: 'playbook generation',
  score: 'business score assessment',
};

export default function UpgradeModal({
  isOpen,
  onClose,
  feature,
  usageCount,
  limit,
}: UpgradeModalProps) {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<'lifetime' | 'monthly'>('lifetime');

  if (!isOpen) return null;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan: selectedPlan }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop - no onClick to prevent dismissal */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-2xl p-8 w-full max-w-lg mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-sky-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            You&apos;ve Hit Your Limit
          </h2>
          <p className="text-zinc-400">
            You&apos;ve used {usageCount} of {limit} free {FEATURE_NAMES[feature]}.
            Upgrade to continue.
          </p>
        </div>

        {/* Plans */}
        <div className="space-y-3 mb-6">
          {/* Lifetime Plan */}
          <button
            onClick={() => setSelectedPlan('lifetime')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedPlan === 'lifetime'
                ? 'border-sky-500 bg-sky-900/20'
                : 'border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-white">$97</span>
                  <span className="text-xs px-2 py-0.5 bg-green-600/20 text-green-400 rounded-full">
                    BETA SPECIAL
                  </span>
                </div>
                <p className="text-sm text-zinc-400">Lifetime access • One-time payment</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPlan === 'lifetime'
                  ? 'border-sky-500 bg-sky-500'
                  : 'border-zinc-600'
              }`}>
                {selectedPlan === 'lifetime' && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>

          {/* Monthly Plan */}
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
              selectedPlan === 'monthly'
                ? 'border-sky-500 bg-sky-900/20'
                : 'border-zinc-700 hover:border-zinc-600'
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-lg font-bold text-white">$9/month</span>
                <p className="text-sm text-zinc-400">Cancel anytime</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 ${
                selectedPlan === 'monthly'
                  ? 'border-sky-500 bg-sky-500'
                  : 'border-zinc-600'
              }`}>
                {selectedPlan === 'monthly' && (
                  <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
            </div>
          </button>
        </div>

        {/* What's included */}
        <div className="bg-zinc-800/50 rounded-lg p-4 mb-6">
          <p className="text-sm font-medium text-zinc-300 mb-2">What you get:</p>
          <ul className="space-y-1 text-sm text-zinc-400">
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited AI chat with Hormozi frameworks
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited playbook generations
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Unlimited business score assessments
            </li>
            <li className="flex items-center gap-2">
              <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              All tools (LTV/CAC, Value Equation, etc.)
            </li>
          </ul>
        </div>

        {/* CTA */}
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full px-6 py-4 bg-sky-600 text-white font-bold rounded-xl hover:bg-sky-500 disabled:bg-zinc-700 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Loading...' : `Upgrade Now - ${selectedPlan === 'lifetime' ? '$97 once' : '$9/mo'}`}
        </button>

        {/* Close option for logged out users */}
        {!session && (
          <button
            onClick={onClose}
            className="w-full mt-3 text-zinc-500 text-sm hover:text-zinc-300"
          >
            Maybe later
          </button>
        )}
      </div>
    </div>
  );
}
