// The 4 dimensions of the Value Equation from $100M Offers
export interface ValueEquationInputs {
  dreamOutcome: number;        // 1-10: How desirable is the end result?
  perceivedLikelihood: number; // 1-10: How likely do they believe they'll achieve it?
  timeDelay: number;           // 1-10: How long until they see results? (inverted)
  effortSacrifice: number;     // 1-10: How much work do they have to do? (inverted)
}

export interface ValueEquationResults {
  score: number;               // The calculated value score
  rating: ValueRating;         // Tier rating
  weakestDimension: keyof ValueEquationInputs;
  strongestDimension: keyof ValueEquationInputs;
}

export type ValueRating =
  | 'terrible'    // < 1
  | 'weak'        // 1-2
  | 'average'     // 2-4
  | 'good'        // 4-6
  | 'strong'      // 6-10
  | 'exceptional'; // 10+

export interface DimensionFeedback {
  dimension: keyof ValueEquationInputs;
  label: string;
  score: number;
  isNumerator: boolean;  // true = higher is better, false = lower is better
  feedback: string;
  hormoziTip: string;
  improvementActions: string[];
}

export interface ValueEquationSnapshot {
  id: string;
  timestamp: number;
  offerName?: string;
  inputs: ValueEquationInputs;
  results: ValueEquationResults;
}
