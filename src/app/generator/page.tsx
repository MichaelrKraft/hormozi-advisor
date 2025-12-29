'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';

type PlaybookType = 'strategy' | 'ltv' | 'offer' | 'leads' | null;

const PLAYBOOKS = [
  {
    id: 'strategy' as const,
    title: 'Business Strategy',
    icon: '🎯',
    description: 'Prioritization and focus plan - figure out what to say YES to and what to say NO to.',
  },
  {
    id: 'ltv' as const,
    title: 'LTV Optimization',
    icon: '📊',
    description: 'Calculate your LTV to CAC ratio and identify levers to improve it.',
  },
  {
    id: 'offer' as const,
    title: 'Grand Slam Offer',
    icon: '💰',
    description: 'Create an offer so good people feel stupid saying no.',
  },
  {
    id: 'leads' as const,
    title: 'Lead Generation',
    icon: '📈',
    description: 'Build a lead generation engine using the Core Four methods.',
  },
];

export default function GeneratorPage() {
  const [selectedType, setSelectedType] = useState<PlaybookType>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!selectedType) return;

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: selectedType, data: formData }),
      });

      const result = await response.json();
      if (result.error) {
        throw new Error(result.error);
      }
      setGeneratedContent(result.content);
    } catch (error) {
      console.error('Generation error:', error);
      setGeneratedContent('Failed to generate playbook. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
    }
  };

  const resetGenerator = () => {
    setSelectedType(null);
    setFormData({});
    setGeneratedContent(null);
  };

  return (
    <div className="min-h-screen bg-zinc-900">
      <MobileHeader currentPage="generator" />

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Generated Content View */}
        {generatedContent ? (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">Your Playbook</h1>
              <div className="flex gap-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 text-sm font-medium text-amber-400 border border-amber-600 rounded-lg hover:bg-amber-900/30 transition-colors"
                >
                  Copy to Clipboard
                </button>
                <button
                  onClick={resetGenerator}
                  className="px-4 py-2 text-sm font-medium text-zinc-400 border border-zinc-600 rounded-lg hover:bg-zinc-800 transition-colors"
                >
                  Generate Another
                </button>
              </div>
            </div>
            <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
              <div className="prose prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-sm text-zinc-200 font-sans leading-relaxed">
                  {generatedContent}
                </pre>
              </div>
            </div>
          </div>
        ) : selectedType ? (
          /* Form View */
          <div>
            <button
              onClick={() => setSelectedType(null)}
              className="text-sm text-zinc-400 hover:text-white mb-4"
            >
              ← Back to playbooks
            </button>
            <h1 className="text-2xl font-bold text-white mb-6">
              {PLAYBOOKS.find((p) => p.id === selectedType)?.title} Playbook
            </h1>
            <PlaybookForm
              type={selectedType}
              formData={formData}
              setFormData={setFormData}
              onGenerate={handleGenerate}
              isGenerating={isGenerating}
            />
          </div>
        ) : (
          /* Selection View */
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Generate a Playbook</h1>
            <p className="text-zinc-400 mb-8">
              Choose a playbook type and answer a few questions to get a customized action plan.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {PLAYBOOKS.map((playbook) => (
                <button
                  key={playbook.id}
                  onClick={() => setSelectedType(playbook.id)}
                  className="text-left bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-amber-600/50 transition-colors"
                >
                  <div className="text-4xl mb-3">{playbook.icon}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{playbook.title}</h3>
                  <p className="text-zinc-400 text-sm">{playbook.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function PlaybookForm({
  type,
  formData,
  setFormData,
  onGenerate,
  isGenerating,
}: {
  type: PlaybookType;
  formData: Record<string, string>;
  setFormData: (data: Record<string, string>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
}) {
  const updateField = (key: string, value: string) => {
    setFormData({ ...formData, [key]: value });
  };

  const fields = getFieldsForType(type);

  return (
    <div className="space-y-6">
      {fields.map((field) => (
        <div key={field.key}>
          <label className="block text-sm font-medium text-zinc-200 mb-2">
            {field.label}
          </label>
          {field.type === 'textarea' ? (
            <textarea
              value={formData[field.key] || ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={formData[field.key] || ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          )}
        </div>
      ))}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full px-6 py-4 text-lg font-medium bg-amber-600 text-white rounded-xl hover:bg-amber-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
      >
        {isGenerating ? 'Generating...' : 'Generate Playbook'}
      </button>
    </div>
  );
}

function getFieldsForType(type: PlaybookType) {
  const common = [
    { key: 'businessName', label: 'Business Name', type: 'text', placeholder: 'Your business name' },
    { key: 'industry', label: 'Industry', type: 'text', placeholder: 'e.g., SaaS, E-commerce, Coaching' },
  ];

  switch (type) {
    case 'strategy':
      return [
        ...common,
        { key: 'monthlyRevenue', label: 'Current Monthly Revenue', type: 'text', placeholder: 'e.g., $50,000' },
        { key: 'teamSize', label: 'Team Size', type: 'text', placeholder: 'e.g., 5 people' },
        { key: 'revenueGoal', label: 'Revenue Goal', type: 'text', placeholder: 'e.g., $200,000/month' },
        { key: 'timeline', label: 'Timeline', type: 'text', placeholder: 'e.g., 12 months' },
        { key: 'challenges', label: 'Current Challenges', type: 'textarea', placeholder: 'What are the biggest problems you are facing?' },
        { key: 'obstacles', label: 'Biggest Obstacles', type: 'textarea', placeholder: 'What is standing between you and your goals?' },
        { key: 'currentFocus', label: 'What are you currently focusing on?', type: 'textarea', placeholder: 'List your current priorities and projects' },
      ];
    case 'ltv':
      return [
        ...common,
        { key: 'aov', label: 'Average Order Value', type: 'text', placeholder: 'e.g., $500' },
        { key: 'purchaseFrequency', label: 'Purchase Frequency', type: 'text', placeholder: 'e.g., 2x per year' },
        { key: 'customerLifespan', label: 'Average Customer Lifespan', type: 'text', placeholder: 'e.g., 3 years' },
        { key: 'grossMargin', label: 'Gross Margin %', type: 'text', placeholder: 'e.g., 60%' },
        { key: 'churnRate', label: 'Monthly Churn Rate', type: 'text', placeholder: 'e.g., 5%' },
        { key: 'marketingSpend', label: 'Monthly Marketing Spend', type: 'text', placeholder: 'e.g., $10,000' },
        { key: 'salesCosts', label: 'Monthly Sales Costs', type: 'text', placeholder: 'e.g., $5,000' },
        { key: 'newCustomers', label: 'New Customers Per Month', type: 'text', placeholder: 'e.g., 20' },
        { key: 'products', label: 'Products/Services Offered', type: 'textarea', placeholder: 'List your main offerings' },
      ];
    case 'offer':
      return [
        ...common,
        { key: 'targetCustomer', label: 'Target Customer', type: 'textarea', placeholder: 'Describe your ideal customer in detail' },
        { key: 'dreamOutcome', label: 'Customer Dream Outcome', type: 'textarea', placeholder: 'What result does your customer REALLY want?' },
        { key: 'currentOffer', label: 'Current Offer', type: 'textarea', placeholder: 'What are you selling now?' },
        { key: 'currentPricing', label: 'Current Pricing', type: 'text', placeholder: 'e.g., $2,000' },
        { key: 'deliveryMethod', label: 'How do you deliver?', type: 'textarea', placeholder: 'Online course, 1:1 coaching, done-for-you, etc.' },
        { key: 'timeToResults', label: 'Time to Deliver Results', type: 'text', placeholder: 'e.g., 90 days' },
        { key: 'currentGuarantee', label: 'Current Guarantee (if any)', type: 'text', placeholder: 'e.g., 30-day money back' },
      ];
    case 'leads':
      return [
        ...common,
        { key: 'targetCustomer', label: 'Target Customer', type: 'textarea', placeholder: 'Describe your ideal customer in detail' },
        { key: 'currentLeadSources', label: 'Current Lead Sources', type: 'textarea', placeholder: 'Where do your leads come from now?' },
        { key: 'leadsNeeded', label: 'Leads Needed Per Month', type: 'text', placeholder: 'e.g., 100' },
        { key: 'conversionRate', label: 'Current Lead-to-Customer Rate', type: 'text', placeholder: 'e.g., 5%' },
        { key: 'marketingBudget', label: 'Marketing Budget', type: 'text', placeholder: 'e.g., $5,000/month' },
        { key: 'warmNetwork', label: 'Warm Network Size', type: 'text', placeholder: 'e.g., 500 contacts' },
        { key: 'socialPresence', label: 'Current Content/Social Presence', type: 'textarea', placeholder: 'Which platforms? How often do you post?' },
        { key: 'salesTeamSize', label: 'Sales Team Size', type: 'text', placeholder: 'e.g., 2 people' },
      ];
    default:
      return common;
  }
}
