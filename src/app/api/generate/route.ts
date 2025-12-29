import { NextRequest, NextResponse } from 'next/server';
import { generateDocument } from '@/lib/ai/client';
import {
  STRATEGY_PLAYBOOK_PROMPT,
  LTV_PLAYBOOK_PROMPT,
  OFFER_PLAYBOOK_PROMPT,
  LEADS_PLAYBOOK_PROMPT,
  DOCUMENT_GENERATOR_SYSTEM,
} from '@/lib/prompts/generatorPrompts';

type PlaybookType = 'strategy' | 'ltv' | 'offer' | 'leads';

const PROMPTS: Record<PlaybookType, string> = {
  strategy: STRATEGY_PLAYBOOK_PROMPT,
  ltv: LTV_PLAYBOOK_PROMPT,
  offer: OFFER_PLAYBOOK_PROMPT,
  leads: LEADS_PLAYBOOK_PROMPT,
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Type and data are required' },
        { status: 400 }
      );
    }

    const playBookPrompt = PROMPTS[type as PlaybookType];
    if (!playBookPrompt) {
      return NextResponse.json(
        { error: 'Invalid playbook type. Choose: strategy, ltv, offer, or leads' },
        { status: 400 }
      );
    }

    // Combine document generator system with specific playbook prompt
    const systemPrompt = `${DOCUMENT_GENERATOR_SYSTEM}\n\n${playBookPrompt}`;

    // Format the user data into a prompt
    const userPrompt = formatUserData(type, data);

    const document = await generateDocument(userPrompt, systemPrompt);

    return NextResponse.json({ content: document });
  } catch (error) {
    console.error('Generate API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate playbook' },
      { status: 500 }
    );
  }
}

function formatUserData(type: string, data: Record<string, unknown>): string {
  switch (type) {
    case 'strategy':
      return `Create a Business Strategy Playbook based on these inputs:

Business Name: ${data.businessName || 'Not specified'}
Industry: ${data.industry || 'Not specified'}

CURRENT STATE:
- Monthly Revenue: ${data.monthlyRevenue || 'Not specified'}
- Team Size: ${data.teamSize || 'Not specified'}

DESIRED STATE:
- Revenue Goal: ${data.revenueGoal || 'Not specified'}
- Timeline: ${data.timeline || 'Not specified'}

CHALLENGES & OBSTACLES:
- Current Challenges: ${data.challenges || 'Not specified'}
- Biggest Obstacles: ${data.obstacles || 'Not specified'}
- Current Focus Areas: ${data.currentFocus || 'Not specified'}`;

    case 'ltv':
      return `Create an LTV Optimization Playbook based on these metrics:

Business Name: ${data.businessName || 'Not specified'}
Industry: ${data.industry || 'Not specified'}

UNIT ECONOMICS:
- Average Order Value: ${data.aov || 'Not specified'}
- Purchase Frequency: ${data.purchaseFrequency || 'Not specified'}
- Customer Lifespan: ${data.customerLifespan || 'Not specified'}
- Gross Margin: ${data.grossMargin || 'Not specified'}
- Monthly Churn Rate: ${data.churnRate || 'Not specified'}

ACQUISITION COSTS:
- Monthly Marketing Spend: ${data.marketingSpend || 'Not specified'}
- Monthly Sales Costs: ${data.salesCosts || 'Not specified'}
- New Customers Per Month: ${data.newCustomers || 'Not specified'}

PRODUCTS/SERVICES:
${data.products || 'Not specified'}`;

    case 'offer':
      return `Create a Grand Slam Offer Playbook based on this information:

Business Name: ${data.businessName || 'Not specified'}
Industry: ${data.industry || 'Not specified'}

TARGET CUSTOMER:
${data.targetCustomer || 'Not specified'}

CUSTOMER DREAM OUTCOME:
${data.dreamOutcome || 'Not specified'}

CURRENT OFFER:
${data.currentOffer || 'Not specified'}

PRICING & DELIVERY:
- Current Price: ${data.currentPricing || 'Not specified'}
- Delivery Method: ${data.deliveryMethod || 'Not specified'}
- Time to Results: ${data.timeToResults || 'Not specified'}
- Current Guarantee: ${data.currentGuarantee || 'None'}`;

    case 'leads':
      return `Create a Lead Generation Playbook based on this information:

Business Name: ${data.businessName || 'Not specified'}
Industry: ${data.industry || 'Not specified'}

TARGET CUSTOMER:
${data.targetCustomer || 'Not specified'}

CURRENT LEAD SOURCES:
${data.currentLeadSources || 'Not specified'}

METRICS & GOALS:
- Leads Needed Per Month: ${data.leadsNeeded || 'Not specified'}
- Current Lead-to-Customer Rate: ${data.conversionRate || 'Not specified'}
- Marketing Budget: ${data.marketingBudget || 'Not specified'}

RESOURCES:
- Warm Network Size: ${data.warmNetwork || 'Not specified'}
- Current Content/Social Presence: ${data.socialPresence || 'Not specified'}
- Sales Team Size: ${data.salesTeamSize || 'Not specified'}`;

    default:
      return JSON.stringify(data);
  }
}
