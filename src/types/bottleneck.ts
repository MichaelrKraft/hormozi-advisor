// Business Bottleneck Diagnostic Types

export type BottleneckArea = 'leads' | 'conversion' | 'pricing' | 'retention';

export interface BottleneckQuestion {
  id: string;
  question: string;
  options: BottleneckOption[];
}

export interface BottleneckOption {
  text: string;
  scores: Record<BottleneckArea, number>;
}

export interface BottleneckResults {
  primary: BottleneckArea;
  secondary: BottleneckArea;
  scores: Record<BottleneckArea, number>;
  percentages: Record<BottleneckArea, number>;
}

export interface BottleneckAnswer {
  questionId: string;
  selectedIndex: number;
}

export interface BottleneckAdvice {
  area: BottleneckArea;
  title: string;
  description: string;
  hormoziQuote: string;
  metrics: string[];
  quickWins: string[];
  deepDive: string[];
  chatPrompt: string;
}

export interface BottleneckSnapshot {
  id: string;
  timestamp: number;
  businessName?: string;
  answers: BottleneckAnswer[];
  results: BottleneckResults;
}
