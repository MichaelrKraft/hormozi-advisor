import type {
  OfferStack,
  OfferAnalysis,
  GuaranteeType,
  ScarcityType,
  UrgencyType,
} from '@/types/offer-stack';
import { GUARANTEE_TYPES } from '@/types/offer-stack';

/**
 * Analyze an offer stack and provide feedback
 */
export function analyzeOffer(stack: OfferStack): OfferAnalysis {
  const weaknesses: string[] = [];
  const suggestions: string[] = [];

  // Calculate total value
  const bonusValue = stack.bonuses.reduce((sum, b) => sum + b.value, 0);
  const totalValue = stack.coreDeliverable.value + bonusValue;

  // Perceived value multiplier based on guarantee, scarcity, and urgency
  let multiplier = 1;

  // Guarantee impact
  const guaranteeStrength = GUARANTEE_TYPES[stack.guarantee.type].strength;
  multiplier += guaranteeStrength * 0.05;

  if (stack.guarantee.type === 'none') {
    weaknesses.push('No guarantee - this increases perceived risk for buyers');
    suggestions.push('Add at least a conditional guarantee to reduce buyer friction');
  }

  // Scarcity impact
  if (stack.scarcity.type !== 'none' && stack.scarcity.isReal) {
    multiplier += 0.15;
  } else if (stack.scarcity.type !== 'none' && !stack.scarcity.isReal) {
    weaknesses.push('Fake scarcity can damage trust if discovered');
    suggestions.push('Use real, verifiable scarcity based on actual constraints');
  } else {
    weaknesses.push('No scarcity element - buyers may procrastinate');
    suggestions.push('Add legitimate scarcity (capacity limits, cohort sizes, etc.)');
  }

  // Urgency impact
  if (stack.urgency.type !== 'none' && stack.urgency.isReal) {
    multiplier += 0.15;
  } else if (stack.urgency.type !== 'none' && !stack.urgency.isReal) {
    weaknesses.push('Artificial urgency can backfire if customers notice');
    suggestions.push('Create real time-based deadlines tied to actual events');
  } else {
    weaknesses.push('No urgency element - buyers may delay decision');
    suggestions.push('Add deadline-based urgency (price increase, bonus removal, etc.)');
  }

  // Bonus analysis
  if (stack.bonuses.length === 0) {
    weaknesses.push('No bonuses - missing opportunity to stack value');
    suggestions.push('Add 2-4 bonuses that address common objections');
  } else if (stack.bonuses.length < 2) {
    suggestions.push('Consider adding more bonuses to increase perceived value');
  } else if (stack.bonuses.length > 6) {
    weaknesses.push('Too many bonuses can overwhelm and reduce perceived value');
    suggestions.push('Focus on 3-5 high-impact bonuses rather than quantity');
  }

  // Value-to-price ratio analysis
  const perceivedValue = Math.round(totalValue * multiplier);
  const priceToValueRatio = stack.targetPrice > 0 ? perceivedValue / stack.targetPrice : 0;

  if (priceToValueRatio < 3) {
    weaknesses.push('Value-to-price ratio below 3:1 - offer may feel expensive');
    suggestions.push('Increase perceived value or reduce price to achieve at least 3:1 ratio');
  } else if (priceToValueRatio < 5) {
    suggestions.push('Good ratio, but 10:1 makes the offer truly irresistible');
  }

  // Core deliverable analysis
  if (!stack.coreDeliverable.title) {
    weaknesses.push('Core deliverable not clearly defined');
    suggestions.push('Clearly articulate the main thing customers get');
  }

  if (stack.coreDeliverable.value < stack.targetPrice * 2) {
    suggestions.push('Core deliverable value should be at least 2x the price on its own');
  }

  // Calculate strength score (0-100)
  let strengthScore = 50; // Base score

  // Guarantee impact (+0-15)
  strengthScore += guaranteeStrength * 3;

  // Scarcity impact (+0-10)
  if (stack.scarcity.type !== 'none' && stack.scarcity.isReal) {
    strengthScore += 10;
  } else if (stack.scarcity.type !== 'none') {
    strengthScore += 3;
  }

  // Urgency impact (+0-10)
  if (stack.urgency.type !== 'none' && stack.urgency.isReal) {
    strengthScore += 10;
  } else if (stack.urgency.type !== 'none') {
    strengthScore += 3;
  }

  // Bonus count impact (+0-10)
  const bonusScore = Math.min(stack.bonuses.length * 2, 10);
  strengthScore += bonusScore;

  // Value ratio impact (+0-15)
  if (priceToValueRatio >= 10) {
    strengthScore += 15;
  } else if (priceToValueRatio >= 5) {
    strengthScore += 10;
  } else if (priceToValueRatio >= 3) {
    strengthScore += 5;
  }

  // Cap at 100
  strengthScore = Math.min(strengthScore, 100);

  return {
    totalValue,
    perceivedValue,
    priceToValueRatio: Math.round(priceToValueRatio * 10) / 10,
    strengthScore: Math.round(strengthScore),
    weaknesses,
    suggestions,
  };
}

/**
 * Get rating label based on strength score
 */
export function getOfferRating(score: number): {
  label: string;
  color: string;
  hormozi: string;
} {
  if (score >= 90) {
    return {
      label: 'Grand Slam Offer',
      color: 'amber',
      hormozi: "This is what we're looking for. They'd feel stupid saying no.",
    };
  }
  if (score >= 75) {
    return {
      label: 'Strong Offer',
      color: 'emerald',
      hormozi: "Solid offer. A few tweaks and you've got a Grand Slam.",
    };
  }
  if (score >= 60) {
    return {
      label: 'Good Offer',
      color: 'green',
      hormozi: "Getting there. Stack more value and reduce more risk.",
    };
  }
  if (score >= 45) {
    return {
      label: 'Average Offer',
      color: 'yellow',
      hormozi: "This is the 'I need to think about it' zone. We can do better.",
    };
  }
  return {
    label: 'Weak Offer',
    color: 'red',
    hormozi: "They have too many reasons to say no. Time to rebuild.",
  };
}

/**
 * Generate default empty stack
 */
export function createEmptyStack(): OfferStack {
  return {
    id: Date.now().toString(),
    name: '',
    targetPrice: 0,
    coreDeliverable: {
      title: '',
      description: '',
      deliveryMethod: '',
      timeline: '',
      value: 0,
    },
    bonuses: [],
    guarantee: {
      type: 'none',
      duration: '',
      conditions: '',
      customText: '',
    },
    scarcity: {
      type: 'none',
      limit: '',
      reason: '',
      isReal: true,
    },
    urgency: {
      type: 'none',
      deadline: '',
      consequence: '',
      isReal: true,
    },
  };
}

/**
 * Generate a unique ID for bonuses
 */
export function generateBonusId(): string {
  return `bonus_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
