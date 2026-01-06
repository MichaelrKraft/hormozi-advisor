/**
 * Hormozi Knowledge Base
 * Central export for all acquisition.com framework content
 */

// Individual Framework Exports
export { MONEY_MODELS, MONEY_MODELS_PROMPT_SECTION } from './money-models';
export { SCALING_STAGES, SCALING_PROMPT_SECTION } from './scaling-roadmap';
export { OFFERS_FRAMEWORKS, OFFERS_PROMPT_SECTION } from './offers-frameworks';
export { LEADS_FRAMEWORKS, LEADS_PROMPT_SECTION } from './leads-frameworks';

// Combined Knowledge Base (for type-safe access)
import { MONEY_MODELS, MONEY_MODELS_PROMPT_SECTION } from './money-models';
import { SCALING_STAGES, SCALING_PROMPT_SECTION } from './scaling-roadmap';
import { OFFERS_FRAMEWORKS, OFFERS_PROMPT_SECTION } from './offers-frameworks';
import { LEADS_FRAMEWORKS, LEADS_PROMPT_SECTION } from './leads-frameworks';

export const HORMOZI_KNOWLEDGE = {
  moneyModels: MONEY_MODELS,
  scalingStages: SCALING_STAGES,
  offersFrameworks: OFFERS_FRAMEWORKS,
  leadsFrameworks: LEADS_FRAMEWORKS,
};

// Combined prompt sections for system prompt injection
export const ALL_FRAMEWORKS_PROMPT = `
${MONEY_MODELS_PROMPT_SECTION}

${SCALING_PROMPT_SECTION}

${OFFERS_PROMPT_SECTION}

${LEADS_PROMPT_SECTION}
`;
