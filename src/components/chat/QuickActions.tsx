'use client';

interface QuickActionsProps {
  onSelect: (prompt: string) => void;
  disabled?: boolean;
}

const quickActions = [
  {
    label: 'Just Chat',
    prompt: "Hey, I want to have a conversation about my business. Let me tell you what's going on...",
  },
  {
    label: 'Analyze LTV/CAC',
    prompt: "Help me calculate and analyze my LTV to CAC ratio. I want to understand if my business economics are healthy and what my 'License to Print Money' situation looks like.",
  },
  {
    label: 'Grand Slam Offer',
    prompt: "Help me create a Grand Slam Offer that makes people feel stupid saying no. Walk me through the $100M Offers framework.",
  },
  {
    label: 'Lead Generation',
    prompt: "Help me create a lead generation plan based on the $100M Leads framework and the Core Four. I want to attract more qualified prospects.",
  },
  {
    label: 'Prioritize Strategy',
    prompt: "I need help prioritizing. I have too many options and limited resources. Help me figure out what to say YES to and what to say NO to.",
  },
  {
    label: 'Improve Retention',
    prompt: "My customers are churning too fast. Help me build a retention strategy and community that keeps them engaged longer.",
  },
  {
    label: 'Optimize Pricing',
    prompt: "Help me optimize my pricing strategy. I want to maximize profit while delivering exceptional value. Is pricing really the strongest lever?",
  },
  {
    label: 'Focus & Say No',
    prompt: "I'm spread too thin across multiple projects. Help me understand the 'Woman in the Red Dress' principle and learn to say no.",
  },
  {
    label: 'Hiring Process',
    prompt: "Help me build a better hiring process to find A-players. I want to learn how to interview hundreds and hire few.",
  },
];

export default function QuickActions({ onSelect, disabled }: QuickActionsProps) {
  return (
    <div className="mb-4">
      <p className="text-sm text-zinc-500 mb-2">Quick Start:</p>
      <div className="flex flex-wrap gap-2">
        {quickActions.map((action) => (
          <button
            key={action.label}
            onClick={() => onSelect(action.prompt)}
            disabled={disabled}
            className="inline-flex items-center px-3 py-1.5 bg-zinc-800 border border-zinc-700 rounded-full text-sm text-zinc-200 hover:bg-zinc-700 hover:border-amber-600/50 hover:text-amber-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}
