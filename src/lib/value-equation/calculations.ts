import type {
  ValueEquationInputs,
  ValueEquationResults,
  ValueRating,
  DimensionFeedback,
} from '@/types/value-equation';

/**
 * Calculate the Value Equation score
 * Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)
 */
export function calculateValueScore(inputs: ValueEquationInputs): number {
  const numerator = inputs.dreamOutcome * inputs.perceivedLikelihood;
  const denominator = inputs.timeDelay * inputs.effortSacrifice;

  // Avoid division by zero
  if (denominator === 0) return numerator > 0 ? 100 : 0;

  const score = numerator / denominator;
  return Math.round(score * 100) / 100;
}

/**
 * Get the rating tier based on score
 */
export function getValueRating(score: number): ValueRating {
  if (score < 1) return 'terrible';
  if (score < 2) return 'weak';
  if (score < 4) return 'average';
  if (score < 6) return 'good';
  if (score < 10) return 'strong';
  return 'exceptional';
}

/**
 * Find the weakest dimension (most room for improvement)
 */
export function findWeakestDimension(
  inputs: ValueEquationInputs
): keyof ValueEquationInputs {
  // For numerator dimensions (higher is better): low score = weak
  // For denominator dimensions (lower is better): high score = weak
  const dimensionScores: Record<keyof ValueEquationInputs, number> = {
    dreamOutcome: inputs.dreamOutcome, // Higher is better
    perceivedLikelihood: inputs.perceivedLikelihood, // Higher is better
    timeDelay: 11 - inputs.timeDelay, // Inverted: higher input = worse
    effortSacrifice: 11 - inputs.effortSacrifice, // Inverted: higher input = worse
  };

  let weakest: keyof ValueEquationInputs = 'dreamOutcome';
  let lowestScore = dimensionScores.dreamOutcome;

  for (const [dim, score] of Object.entries(dimensionScores)) {
    if (score < lowestScore) {
      lowestScore = score;
      weakest = dim as keyof ValueEquationInputs;
    }
  }

  return weakest;
}

/**
 * Find the strongest dimension
 */
export function findStrongestDimension(
  inputs: ValueEquationInputs
): keyof ValueEquationInputs {
  const dimensionScores: Record<keyof ValueEquationInputs, number> = {
    dreamOutcome: inputs.dreamOutcome,
    perceivedLikelihood: inputs.perceivedLikelihood,
    timeDelay: 11 - inputs.timeDelay,
    effortSacrifice: 11 - inputs.effortSacrifice,
  };

  let strongest: keyof ValueEquationInputs = 'dreamOutcome';
  let highestScore = dimensionScores.dreamOutcome;

  for (const [dim, score] of Object.entries(dimensionScores)) {
    if (score > highestScore) {
      highestScore = score;
      strongest = dim as keyof ValueEquationInputs;
    }
  }

  return strongest;
}

/**
 * Calculate all results
 */
export function calculateAll(inputs: ValueEquationInputs): ValueEquationResults {
  const score = calculateValueScore(inputs);
  const rating = getValueRating(score);
  const weakestDimension = findWeakestDimension(inputs);
  const strongestDimension = findStrongestDimension(inputs);

  return {
    score,
    rating,
    weakestDimension,
    strongestDimension,
  };
}

/**
 * Dimension labels and descriptions
 */
export const DIMENSION_INFO: Record<
  keyof ValueEquationInputs,
  { label: string; description: string; isNumerator: boolean }
> = {
  dreamOutcome: {
    label: 'Dream Outcome',
    description: 'How desirable is the end result you promise?',
    isNumerator: true,
  },
  perceivedLikelihood: {
    label: 'Perceived Likelihood',
    description: 'How likely do they believe they will achieve it?',
    isNumerator: true,
  },
  timeDelay: {
    label: 'Time Delay',
    description: 'How long until they see results?',
    isNumerator: false,
  },
  effortSacrifice: {
    label: 'Effort & Sacrifice',
    description: 'How much work do they have to do?',
    isNumerator: false,
  },
};

/**
 * Get feedback for a specific dimension
 */
export function getDimensionFeedback(
  dimension: keyof ValueEquationInputs,
  score: number
): DimensionFeedback {
  const info = DIMENSION_INFO[dimension];

  const feedbackMap: Record<keyof ValueEquationInputs, Record<string, DimensionFeedback>> = {
    dreamOutcome: {
      low: {
        dimension: 'dreamOutcome',
        label: info.label,
        score,
        isNumerator: true,
        feedback: "Your dream outcome isn't compelling enough. People don't get excited about small changes.",
        hormoziTip: "Make the outcome so big they can't ignore it. Don't sell a 10% improvement - sell a transformation.",
        improvementActions: [
          'Reframe from incremental to transformational',
          'Add status/identity elements to the outcome',
          'Make the before/after contrast more dramatic',
          'Focus on what they REALLY want, not what they say they want',
        ],
      },
      medium: {
        dimension: 'dreamOutcome',
        label: info.label,
        score,
        isNumerator: true,
        feedback: "Your outcome is decent but not irresistible. There's room to make it more compelling.",
        hormoziTip: "Good, but can you make them feel stupid for NOT wanting this?",
        improvementActions: [
          'Add unexpected bonuses to the outcome',
          'Include lifestyle elements beyond the core promise',
          'Make it more specific and measurable',
        ],
      },
      high: {
        dimension: 'dreamOutcome',
        label: info.label,
        score,
        isNumerator: true,
        feedback: "You're promising something people really want. This is a strength.",
        hormoziTip: "Strong dream outcome. Now make sure they believe they can actually get it.",
        improvementActions: [
          'Maintain this strength',
          'Use testimonials that reinforce this outcome',
        ],
      },
    },
    perceivedLikelihood: {
      low: {
        dimension: 'perceivedLikelihood',
        label: info.label,
        score,
        isNumerator: true,
        feedback: "They don't believe they'll actually get the result. This is killing your conversions.",
        hormoziTip: "Add a guarantee. Show proof. Make it so risk-free they'd feel stupid saying no.",
        improvementActions: [
          'Add a strong, specific guarantee',
          'Show case studies with specific numbers',
          'Reduce the number of steps to success',
          'Make the path clearer and simpler',
          'Address their specific objections directly',
        ],
      },
      medium: {
        dimension: 'perceivedLikelihood',
        label: info.label,
        score,
        isNumerator: true,
        feedback: "They somewhat believe in your promise, but doubt is still costing you sales.",
        hormoziTip: "Every bit of doubt you remove is money in the bank. Stack proof until they can't deny it.",
        improvementActions: [
          'Add more social proof',
          'Make your guarantee more specific',
          'Show the exact process/system they follow',
        ],
      },
      high: {
        dimension: 'perceivedLikelihood',
        label: info.label,
        score,
        isNumerator: true,
        feedback: "High perceived likelihood. They believe your offer will work for them.",
        hormoziTip: "Great credibility. This is your competitive moat.",
        improvementActions: [
          'Continue collecting testimonials',
          'Document your success stories',
        ],
      },
    },
    timeDelay: {
      low: {
        dimension: 'timeDelay',
        label: info.label,
        score,
        isNumerator: false,
        feedback: "Fast results! Quick time-to-value is a major strength.",
        hormoziTip: "Speed sells. Make sure you're advertising this aggressively.",
        improvementActions: [
          'Highlight speed in your marketing',
          'Create quick-win bonuses for immediate gratification',
        ],
      },
      medium: {
        dimension: 'timeDelay',
        label: info.label,
        score,
        isNumerator: false,
        feedback: "Results take a while. Can you create intermediate wins?",
        hormoziTip: "Add quick wins along the way. People need progress to stay motivated.",
        improvementActions: [
          'Create milestone celebrations',
          'Add early-result bonuses',
          'Show daily/weekly progress indicators',
        ],
      },
      high: {
        dimension: 'timeDelay',
        label: info.label,
        score,
        isNumerator: false,
        feedback: "Results take too long. This is hurting your offer's value perception significantly.",
        hormoziTip: "Long delays kill perceived value. Either speed up results or add immediate benefits.",
        improvementActions: [
          'Create a fast-start component',
          'Add immediate bonuses they get today',
          'Break into phases with quicker first wins',
          'Reframe the timeline with milestones',
          'Add done-for-you elements to speed things up',
        ],
      },
    },
    effortSacrifice: {
      low: {
        dimension: 'effortSacrifice',
        label: info.label,
        score,
        isNumerator: false,
        feedback: "Low effort required. This is a major selling point.",
        hormoziTip: "Easy is attractive. Make sure people know how simple this is.",
        improvementActions: [
          'Emphasize the ease in marketing',
          'Show the simple process visually',
        ],
      },
      medium: {
        dimension: 'effortSacrifice',
        label: info.label,
        score,
        isNumerator: false,
        feedback: "Moderate effort required. Some people will drop off because of this.",
        hormoziTip: "Every step you remove is a customer you keep. Simplify ruthlessly.",
        improvementActions: [
          'Remove unnecessary steps',
          'Add templates and shortcuts',
          'Provide more done-for-you elements',
        ],
      },
      high: {
        dimension: 'effortSacrifice',
        label: info.label,
        score,
        isNumerator: false,
        feedback: "Too much effort required. This is a major barrier to purchase and completion.",
        hormoziTip: "If it feels like work, they won't buy. Or they'll buy and not finish. Either way, you lose.",
        improvementActions: [
          'Add done-for-you components',
          'Create templates, scripts, and shortcuts',
          "Remove steps that aren't essential",
          'Automate what can be automated',
          'Provide accountability and support',
        ],
      },
    },
  };

  // Determine low/medium/high based on effective score
  const effectiveScore = info.isNumerator ? score : 11 - score;
  const level = effectiveScore <= 4 ? 'low' : effectiveScore <= 7 ? 'medium' : 'high';

  return feedbackMap[dimension][level];
}

/**
 * Get the Hormozi interpretation for the overall score
 */
export function getOverallInterpretation(rating: ValueRating): {
  title: string;
  message: string;
  hormozi: string;
  color: string;
} {
  const interpretations: Record<ValueRating, ReturnType<typeof getOverallInterpretation>> = {
    terrible: {
      title: 'WEAK OFFER',
      message: "Your offer's perceived value is very low. Major improvements needed across multiple dimensions.",
      hormozi: "Look, I'm going to be honest - this isn't an offer, it's a liability. You're asking people to do a lot, wait a long time, and they don't even believe it'll work. Time to rebuild from scratch.",
      color: 'red',
    },
    weak: {
      title: 'BELOW AVERAGE',
      message: "Your offer has significant weaknesses that are costing you sales.",
      hormozi: "You've got an uphill battle. The value equation isn't in your favor. Focus on the weakest dimension first - that's your biggest lever.",
      color: 'orange',
    },
    average: {
      title: 'AVERAGE OFFER',
      message: "Your offer is okay but not compelling. You'll win some but lose many to inaction.",
      hormozi: "This is the 'I need to think about it' zone. Average offers get average results. Let's find which lever moves the needle most.",
      color: 'yellow',
    },
    good: {
      title: 'SOLID OFFER',
      message: "Your offer has good perceived value. There's still room to make it irresistible.",
      hormozi: "Now we're talking. You've got something here. A few tweaks and this becomes a Grand Slam Offer.",
      color: 'green',
    },
    strong: {
      title: 'STRONG OFFER',
      message: "Your offer has high perceived value. People should feel compelled to buy.",
      hormozi: "This is a strong offer. You've done the work to make it valuable. Focus on traffic and conversion now - the offer itself is solid.",
      color: 'emerald',
    },
    exceptional: {
      title: 'GRAND SLAM OFFER',
      message: "Your offer is exceptional. People would feel stupid saying no to this.",
      hormozi: "This is what we're looking for. When the value equation is this lopsided in the customer's favor, sales become easy. Protect this offer. Scale it.",
      color: 'sky',
    },
  };

  return interpretations[rating];
}
