'use client';

import { useState } from 'react';
import Link from 'next/link';
import MobileHeader from '@/components/layout/MobileHeader';

type PlaybookType = 'strategy' | 'ltv' | 'offer' | 'leads' | null;

const PLAYBOOK_ICONS = {
  strategy: (
    <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  ltv: (
    <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V13.5zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25V18zm2.498-6.75h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V13.5zm0 2.25h.007v.008h-.007v-.008zm0 2.25h.007v.008h-.007V18zm2.504-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V18zm2.498-6.75h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008V13.5zM8.25 6h7.5v2.25h-7.5V6zM12 2.25c-1.892 0-3.758.11-5.593.322C5.307 2.7 4.5 3.65 4.5 4.757V19.5a2.25 2.25 0 002.25 2.25h10.5a2.25 2.25 0 002.25-2.25V4.757c0-1.108-.806-2.057-1.907-2.185A48.507 48.507 0 0012 2.25z" />
    </svg>
  ),
  offer: (
    <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  ),
  leads: (
    <svg className="w-8 h-8 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
    </svg>
  ),
};

const PLAYBOOKS = [
  {
    id: 'strategy' as const,
    title: 'Business Strategy',
    description: 'Prioritization and focus plan - figure out what to say YES to and what to say NO to.',
  },
  {
    id: 'ltv' as const,
    title: 'LTV Optimization',
    description: 'Calculate your LTV to CAC ratio and identify levers to improve it.',
  },
  {
    id: 'offer' as const,
    title: 'Grand Slam Offer',
    description: 'Create an offer so good people feel stupid saying no.',
  },
  {
    id: 'leads' as const,
    title: 'Lead Generation',
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
                  className="px-4 py-2 text-sm font-medium text-sky-400 border border-sky-600 rounded-lg hover:bg-sky-900/30 transition-colors"
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
                  className="text-left bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-sky-600/50 transition-colors"
                >
                  <div className="mb-3">{PLAYBOOK_ICONS[playbook.id]}</div>
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
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 min-h-[100px]"
            />
          ) : (
            <input
              type="text"
              value={formData[field.key] || ''}
              onChange={(e) => updateField(field.key, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          )}
        </div>
      ))}
      <button
        onClick={onGenerate}
        disabled={isGenerating}
        className="w-full px-6 py-4 text-lg font-medium bg-sky-600 text-white rounded-xl hover:bg-sky-500 disabled:bg-zinc-700 disabled:text-zinc-500 disabled:cursor-not-allowed transition-colors"
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
