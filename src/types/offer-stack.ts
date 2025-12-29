// Offer Stack Builder Types - Based on $100M Offers Grand Slam Framework

export interface OfferStack {
  id: string;
  name: string;
  targetPrice: number;
  coreDeliverable: CoreDeliverable;
  bonuses: Bonus[];
  guarantee: Guarantee;
  scarcity: Scarcity;
  urgency: Urgency;
}

export interface CoreDeliverable {
  title: string;
  description: string;
  deliveryMethod: string;
  timeline: string;
  value: number;
}

export interface Bonus {
  id: string;
  title: string;
  description: string;
  value: number;
  type: BonusType;
}

export type BonusType =
  | 'template'
  | 'training'
  | 'access'
  | 'community'
  | 'tool'
  | 'support'
  | 'other';

export interface Guarantee {
  type: GuaranteeType;
  duration: string;
  conditions: string;
  customText: string;
}

export type GuaranteeType =
  | 'unconditional'
  | 'conditional'
  | 'performance'
  | 'anti-guarantee'
  | 'none';

export interface Scarcity {
  type: ScarcityType;
  limit: string;
  reason: string;
  isReal: boolean;
}

export type ScarcityType =
  | 'spots'
  | 'inventory'
  | 'time-investment'
  | 'capacity'
  | 'none';

export interface Urgency {
  type: UrgencyType;
  deadline: string;
  consequence: string;
  isReal: boolean;
}

export type UrgencyType =
  | 'price-increase'
  | 'bonus-removal'
  | 'enrollment-close'
  | 'event-based'
  | 'none';

export interface OfferAnalysis {
  totalValue: number;
  perceivedValue: number;
  priceToValueRatio: number;
  strengthScore: number;
  weaknesses: string[];
  suggestions: string[];
}

export interface OfferSnapshot {
  id: string;
  timestamp: number;
  stack: OfferStack;
  analysis: OfferAnalysis;
}

// Bonus type metadata
export const BONUS_TYPES: Record<BonusType, { label: string; icon: string; examples: string }> = {
  template: {
    label: 'Templates & Swipes',
    icon: '📋',
    examples: 'Scripts, checklists, SOPs, email templates',
  },
  training: {
    label: 'Training & Education',
    icon: '🎓',
    examples: 'Video courses, workshops, masterclasses',
  },
  access: {
    label: 'Access & Exclusivity',
    icon: '🔑',
    examples: 'Private calls, events, insider content',
  },
  community: {
    label: 'Community & Network',
    icon: '👥',
    examples: 'Mastermind groups, forums, networking',
  },
  tool: {
    label: 'Tools & Software',
    icon: '🛠️',
    examples: 'Software access, calculators, apps',
  },
  support: {
    label: 'Support & Coaching',
    icon: '🤝',
    examples: '1:1 calls, office hours, priority support',
  },
  other: {
    label: 'Other Bonus',
    icon: '🎁',
    examples: 'Physical products, gift cards, etc.',
  },
};

// Guarantee type metadata
export const GUARANTEE_TYPES: Record<GuaranteeType, { label: string; description: string; strength: number }> = {
  unconditional: {
    label: 'Unconditional (No Questions Asked)',
    description: "Full refund anytime, no questions asked. Maximum risk reversal.",
    strength: 5,
  },
  conditional: {
    label: 'Conditional (With Requirements)',
    description: "Refund if you complete X and don't get Y result.",
    strength: 4,
  },
  performance: {
    label: 'Performance (Results-Based)',
    description: "We guarantee specific outcome or you get X.",
    strength: 5,
  },
  'anti-guarantee': {
    label: 'Anti-Guarantee (Bold Stance)',
    description: "All sales final - we're so confident we don't offer refunds.",
    strength: 2,
  },
  none: {
    label: 'No Guarantee',
    description: "Standard purchase terms.",
    strength: 0,
  },
};
