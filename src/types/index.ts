// Chat message types
export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// Framework types
export interface Framework {
  id: string;
  name: string;
  category: 'branding' | 'content';
  description: string;
  questions?: string[];
  steps?: string[];
}

// Brand Journey answers
export interface BrandJourney {
  desiredOutcome: string;
  knownFor: string;
  needToDo: string[];
  needToLearn: string[];
}

// Brand Story
export interface BrandStory {
  catalyst: string;
  coreTruth: string;
  proof: string;
}

// Brand Associations
export interface BrandAssociations {
  positive: string[];
  negative: string[];
}

// Content Strategy
export interface ContentStrategy {
  primaryMedium: 'written' | 'video' | 'audio' | 'visual';
  platforms: string[];
  cadence: Record<string, string>;
  contentMix: {
    core: string[];      // 70%
    iterations: string[]; // 20%
    experiments: string[]; // 10%
  };
}

// Full Brand Playbook
export interface BrandPlaybook {
  brandName: string;
  createdAt: Date;
  journey: BrandJourney;
  story: BrandStory;
  associations: BrandAssociations;
  contentStrategy?: ContentStrategy;
}

// Chat API request/response
export interface ChatRequest {
  messages: { role: 'user' | 'assistant'; content: string }[];
}

export interface ChatResponse {
  content: string;
  error?: string;
}
