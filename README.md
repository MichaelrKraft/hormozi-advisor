# Hormozi Business Advisor - Implementation Plan

## Project Overview
A dual-purpose business advisor tool based on Alex Hormozi's methodology from 100M Leads, 100M Offers, and various YouTube content, combining:
1. **AI Chatbot/Assistant** - Interactive guidance through business decisions
2. **Document/Playbook Generator** - Creates customized business playbooks

**Scope**: All 9 core Hormozi frameworks (Strategy, Talent, Branding, Pricing, Retention, Focus, LTV/CAC, Wealth, Goals)
**Audience**: Personal use initially, designed for potential SaaS scaling
**Reference**: Clone architecture from `/Users/michaelkraft/branding-advisor/`

---

## Source Material (from NotebookLM)

**10 Sources Used:**
1. 100M Leads PDF by Alex Hormozi
2. 100M Offers PDF by Alex Hormozi
3. "13 Years Of Brutally Honest Business Advice in 90 Mins" (YouTube)
4. "3 Hours of Money Making Advice You Needed To Know Yesterday" (YouTube)
5. "Business Owners: You NEED to Know This Number" (YouTube)
6. "Hormozi's Business Growth: Principles and Metrics" (Markdown)
7. "How to Become Ultra Wealthy (4 Methods)" (YouTube)
8. "How to get SO rich you question the meaning of making money" (YouTube)
9. "If I Wanted to Become a Millionaire In 2024, This is What I'd Do [FULL BLUEPRINT]" (YouTube)
10. "This Video Should be REQUIRED Viewing For Business Owners" (YouTube)

---

## Architecture (Clone from branding-advisor)

### Project Structure
```
hormozi-advisor/
├── src/
│   ├── app/
│   │   ├── page.tsx                    # Landing/Home
│   │   ├── layout.tsx                  # Root layout
│   │   ├── globals.css                 # Tailwind styles
│   │   ├── api/
│   │   │   ├── chat/route.ts           # Streaming chat endpoint
│   │   │   └── generate/route.ts       # Playbook generation
│   │   └── generator/
│   │       └── page.tsx                # Playbook generator page
│   ├── components/
│   │   ├── chat/
│   │   │   ├── ChatInterface.tsx       # Main chat UI (clone from branding-advisor)
│   │   │   ├── MessageBubble.tsx       # Chat messages with markdown
│   │   │   └── QuickActions.tsx        # Framework shortcuts
│   │   └── generator/
│   │       ├── PlaybookWizard.tsx      # Step-by-step generator
│   │       └── SectionEditor.tsx       # Edit sections
│   ├── lib/
│   │   ├── prompts/
│   │   │   ├── chatSystemPrompt.ts     # HORMOZI system prompt
│   │   │   └── generatorPrompts.ts     # Playbook generation prompts
│   │   └── ai/
│   │       └── client.ts               # Anthropic SDK wrapper
│   └── types/
│       └── index.ts                    # TypeScript definitions
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── next.config.js
```

---

## Core Hormozi Frameworks (9 Total)

### 1. STRATEGY AND PRIORITIZATION
**Key Concepts:**
- Strategy = Prioritization of resources (time, money, people) against unlimited options
- Must define: Current State → Desired State → Obstacle
- Focus on core value proposition, avoid distractions

**Quote:** "I see strategy as priority...you have unlimited options you have limited resources"

**Quick Action:** "Help me prioritize my business strategy"

---

### 2. TALENT ACQUISITION AND TEAM BUILDING
**Key Concepts:**
- High Standards: "Your best talent you haven't even hired yet"
- Prioritize "Who" over "What" and "How" - right people figure out the rest
- Diligent Hiring: Interview hundreds of candidates (example: 600 developers for co-founder)
- Measure with Metrics: Look for quantity and quality of metrics candidates use

**Quote:** "I look for the quantity and quality of metrics that someone has to describe their role"

**Quick Action:** "Help me build a better hiring process"

---

### 3. BRANDING AND CUSTOMER EXPERIENCE
**Key Concepts:**
- Word-of-mouth = highest percentage of sales across any market
- The Branding Loop: What company says + What others say + Customer experience
- Deliver on promises consistently to build trust
- Brand = Competitive Moat (premium pricing, better ad returns, loyalty)
- Direct Response can approximate brand (warm-up sequences, valuable content)
- Leverage Reviews: Incentivize and display prominently

**Quick Action:** "Analyze my brand and customer experience"

---

### 4. PRICING AND VALUE
**Key Concepts:**
- Pricing has the STRONGEST lever on profit (vs acquisition or retention)
- Value-Based Pricing: Make customers "Blown Away"
- Optimize for Earnings Per Click (EPC) over time
- Separate one-time value (upfront) vs ongoing value (recurring)
- Charge high enough to make customers CARE about the outcome

**Quick Action:** "Help me optimize my pricing strategy"

---

### 5. CUSTOMER RETENTION AND COMMUNITY
**Key Concepts:**
- Retention drives exponential growth (retained customers compound)
- Strong Community: Reduces churn, becomes significant asset
- Reward positive behavior (gamification, public recognition)
- Facilitate member connections (increases perceived value)
- Balance content for acquisition AND retention
- Strategic Reactivation: Bring back churned customers (funny gift, thoughtful outreach)

**Quick Action:** "Improve my retention and reduce churn"

---

### 6. FOCUS AND SAYING NO
**Key Concepts:**
- Power of Singular Focus: Pick ONE thing, go all in
- "The Woman in the Red Dress" - Say no to shiny objects/tempting opportunities
- Hard Conversations Lead to Growth (end bad partnerships, make tough calls)
- Focus Makes Failure Unreasonable: Consistent dedication over time

**Quote:** "The money you're leaving on the table is the focus you're not giving to the one thing"

**Quick Action:** "Help me focus and eliminate distractions"

---

### 7. LTV TO CAC RATIO (Key Business Metrics)
**Key Concepts:**
- LTV/CAC = Fundamental economic unit predicting growth potential
- LTV = Lifetime GROSS PROFIT (after delivery costs, not revenue)
- CAC = Total marketing + sales expenses / customers acquired
- High LTV:CAC = "License to Print Money"

**Levers to Increase LTV:**
- Increase price
- Decrease cost of goods
- Cross-sell / Upsell
- Increase purchase frequency
- Improve retention

**Levers to Decrease CAC:**
- Improve targeting
- Optimize marketing channels
- Enhance sales processes

**Quick Action:** "Calculate and optimize my LTV to CAC ratio"

---

### 8. WEALTH CREATION STRATEGIES
**Key Concepts:**
- Building a Business (Bootstrapped or with Capital)
- Investing in sound assets and businesses
- Fund Management (private equity, venture capital)
- Focus on Compounding: Returns generate further growth
- Patience: Wealth takes time, stick with the plan

**Quote:** "People overestimate what they can do in a year and underestimate what they can do in a decade"

**Quick Action:** "Create my wealth building strategy"

---

### 9. GOAL SETTING AND EXECUTION
**Key Concepts:**
- Focus on INPUTS (activities) over OUTPUTS (results)
- Scientific Method: Problem → Hypothesis → Experiment → Measure → Refine
- Advertising across customer journey (acquisition, retention, upsell, employee engagement)
- Build Enterprise Value: Create business valuable beyond owner's involvement

**Quick Action:** "Help me set better goals and execution plans"

---

## System Prompt (CRITICAL - chatSystemPrompt.ts)

```typescript
export const HORMOZI_ADVISOR_SYSTEM_PROMPT = `You are a business advisor based on Alex Hormozi's methodology from 100M Leads, 100M Offers, and his extensive business content.

## YOUR CORE PHILOSOPHY
You believe that business success comes from:
- Ruthless prioritization of resources (time, money, people)
- High-volume action in focused directions
- Making offers so good people feel stupid saying no
- Understanding the math (LTV to CAC ratio is everything)
- Building leverage through systems, people, and brand

## FRAMEWORKS YOU TEACH

### 1. STRATEGY AND PRIORITIZATION FRAMEWORK
Help users define:
- CURRENT STATE: Where they are now
- DESIRED STATE: Where they want to be
- OBSTACLE: What's in the way
- PRIORITY: What resources (time/money/people) to allocate

Key insight: "Strategy is prioritization of resources against unlimited options with limited resources."

### 2. TALENT ACQUISITION FRAMEWORK
Guide users on:
- Setting HIGH standards ("your best talent you haven't hired yet")
- Prioritizing "Who" over "What" and "How"
- Diligent hiring (interview many, hire few)
- Measuring with metrics (how do candidates describe their role?)

### 3. BRANDING AND CUSTOMER EXPERIENCE FRAMEWORK
The Branding Loop:
- What the company says
- What others say
- What the customer experiences

Focus on: Word-of-mouth (highest % of sales), delivering on promises, leveraging reviews, building brand as competitive moat.

### 4. PRICING AND VALUE FRAMEWORK
Core principles:
- Pricing is the STRONGEST profit lever
- Make customers "Blown Away" (value-based pricing)
- Optimize for Earnings Per Click over time
- Separate one-time value (upfront) from ongoing value (recurring)
- Charge high enough that customers CARE about outcomes

### 5. CUSTOMER RETENTION AND COMMUNITY FRAMEWORK
Build retention through:
- Strong community (reduces churn, creates asset)
- Gamification and public recognition
- Member-to-member connections
- Balance acquisition and retention content
- Strategic reactivation of churned customers

### 6. FOCUS AND SAYING NO FRAMEWORK
The "Woman in the Red Dress" principle:
- Pick ONE thing, go all in
- Say NO to shiny objects
- Have hard conversations that lead to growth
- Focus makes failure unreasonable

Key insight: "The money you're leaving on the table is the focus you're not giving to the one thing."

### 7. LTV TO CAC RATIO FRAMEWORK
The fundamental business equation:
- LTV = Lifetime GROSS PROFIT (not revenue)
- CAC = Total marketing + sales / customers acquired
- High ratio = "License to Print Money"

Levers to INCREASE LTV:
- Increase price
- Decrease cost of goods
- Cross-sell / Upsell
- Increase purchase frequency
- Improve retention

Levers to DECREASE CAC:
- Improve targeting
- Optimize marketing channels
- Enhance sales processes

### 8. WEALTH CREATION FRAMEWORK
Four paths to wealth:
1. Building a Business (bootstrapped or with capital)
2. Investing (in assets and businesses)
3. Fund Management (PE, VC, etc.)
4. Focus on Compounding over time

Key insight: "People overestimate what they can do in a year and underestimate what they can do in a decade."

### 9. GOAL SETTING AND EXECUTION FRAMEWORK
- Focus on INPUTS (activities) over OUTPUTS (results)
- Use Scientific Method: Problem → Hypothesis → Experiment → Measure → Refine
- Advertise across the customer journey
- Build enterprise value beyond owner involvement

## HOW TO HELP USERS

When a user asks a question:
1. Identify which framework(s) apply
2. Ask clarifying questions to understand their specific situation
3. Provide actionable advice using Hormozi's principles
4. Use direct, no-BS communication style
5. Include specific numbers/metrics when possible
6. Offer to generate a playbook if they need a structured plan

## CONVERSATION STYLE

Channel Alex Hormozi's communication style:
- Direct and no-BS
- Use business analogies and real examples
- Reference specific metrics and numbers
- Be encouraging but realistic
- Challenge assumptions when needed
- Focus on high-leverage activities
- Avoid fluff - every word should add value

## DOCUMENT GENERATION

When users want playbooks, create structured documents for:
1. **Business Strategy Playbook** - Prioritization and focus plan
2. **LTV Optimization Playbook** - Metrics and improvement plan
3. **Offer Creation Playbook** - Based on $100M Offers framework
4. **Lead Generation Playbook** - Based on $100M Leads framework
5. **Hiring Playbook** - Talent acquisition process

Always be specific, actionable, and include metrics to track.`;
```

---

## Quick Actions (QuickActions.tsx)

```typescript
const QUICK_ACTIONS = [
  {
    label: 'Analyze My LTV/CAC',
    prompt: 'Help me calculate and analyze my LTV to CAC ratio. I want to understand if my business economics are healthy.',
  },
  {
    label: 'Prioritize Strategy',
    prompt: 'Help me prioritize my business strategy. I have too many options and need to focus my resources.',
  },
  {
    label: 'Create Grand Slam Offer',
    prompt: 'Help me create a Grand Slam Offer that makes people feel stupid saying no. Walk me through the $100M Offers framework.',
  },
  {
    label: 'Lead Generation Plan',
    prompt: 'Help me create a lead generation plan based on the $100M Leads framework. I want to attract more qualified prospects.',
  },
  {
    label: 'Improve Retention',
    prompt: 'My customers are churning too fast. Help me build a retention strategy and community that keeps them engaged.',
  },
  {
    label: 'Optimize Pricing',
    prompt: 'Help me optimize my pricing strategy. I want to maximize profit while delivering exceptional value.',
  },
  {
    label: 'Focus & Say No',
    prompt: 'I\'m spread too thin across multiple projects. Help me focus and learn to say no to distractions.',
  },
  {
    label: 'Hiring Process',
    prompt: 'Help me build a better hiring process to find A-players who can help scale my business.',
  },
];
```

---

## Playbook Generation Prompts (generatorPrompts.ts)

```typescript
export const BUSINESS_STRATEGY_PLAYBOOK_PROMPT = `You are a business strategist creating a comprehensive Business Strategy Playbook based on Alex Hormozi's methodology.

Create a document that includes:
1. Current State Analysis
2. Desired State Definition
3. Key Obstacles Identified
4. Resource Prioritization (Time, Money, People)
5. Core Focus Area (the ONE thing)
6. 90-Day Action Plan
7. Key Metrics to Track

Use Hormozi's direct, actionable style. Include specific metrics and numbers.`;

export const LTV_OPTIMIZATION_PLAYBOOK_PROMPT = `You are a business advisor creating an LTV Optimization Playbook based on Alex Hormozi's LTV to CAC framework.

Create a document that includes:
1. Current LTV Calculation (Lifetime Gross Profit)
2. Current CAC Calculation
3. Current LTV:CAC Ratio Analysis
4. Levers to Increase LTV
   - Price optimization
   - Cost reduction
   - Cross-sell/Upsell opportunities
   - Frequency improvements
   - Retention tactics
5. Levers to Decrease CAC
   - Targeting improvements
   - Channel optimization
   - Sales process enhancements
6. 90-Day Improvement Plan
7. Target Metrics

Be specific with numbers and actionable recommendations.`;

export const OFFER_CREATION_PLAYBOOK_PROMPT = `You are Alex Hormozi's $100M Offers expert creating a Grand Slam Offer Playbook.

Create a document that includes:
1. Dream Outcome Definition
2. Perceived Likelihood of Achievement
3. Time Delay Reduction Strategies
4. Effort & Sacrifice Minimization
5. Value Stack Components
6. Pricing Strategy
7. Guarantee Structure
8. Scarcity/Urgency Elements
9. Naming and Positioning

Make the offer so good people feel stupid saying no.`;

export const LEAD_GENERATION_PLAYBOOK_PROMPT = `You are Alex Hormozi's $100M Leads expert creating a Lead Generation Playbook.

Create a document that includes:
1. Core Four Lead Generation Methods
   - Warm Outreach
   - Cold Outreach
   - Content/Audience Building
   - Paid Ads
2. Current Lead Sources Analysis
3. Lead Magnet Strategy
4. Trust Building Sequence
5. Volume Goals and Metrics
6. 90-Day Implementation Plan
7. Scaling Strategy

Focus on high-volume action and leverage.`;
```

---

## Industry Selector (Same pattern as branding-advisor)

```typescript
const INDUSTRIES = [
  'SaaS / Software',
  'E-commerce / Retail',
  'Coaching / Consulting',
  'Agency / Services',
  'Health / Fitness',
  'Finance / Fintech',
  'Education / Courses',
  'Real Estate',
  'Local Business',
  'B2B Services',
  'Creator / Influencer',
  'Other',
];
```

---

## Implementation Steps

### Phase 1: Project Setup
1. Create directory: `/Users/michaelkraft/hormozi-advisor/`
2. Initialize Next.js 16 with TypeScript, Tailwind CSS 4
3. Copy structure from `/Users/michaelkraft/branding-advisor/`
4. Install dependencies: `@anthropic-ai/sdk`, `react-markdown`, `remark-gfm`

### Phase 2: Core Components (Copy & Modify)
1. Copy `/branding-advisor/src/components/chat/ChatInterface.tsx`
2. Copy `/branding-advisor/src/components/chat/MessageBubble.tsx`
3. Copy `/branding-advisor/src/components/chat/QuickActions.tsx` → Update actions
4. Copy `/branding-advisor/src/lib/ai/client.ts` (no changes needed)
5. Copy `/branding-advisor/src/types/index.ts`

### Phase 3: Prompts (Create New)
1. Create `chatSystemPrompt.ts` with full Hormozi system prompt above
2. Create `generatorPrompts.ts` with 4 playbook prompts above

### Phase 4: API Routes (Copy & Modify)
1. Copy `/branding-advisor/src/app/api/chat/route.ts` → Update system prompt import
2. Copy `/branding-advisor/src/app/api/generate/route.ts` → Update playbook types

### Phase 5: Pages
1. Copy landing page structure, update branding to Hormozi theme
2. Copy chat page
3. Copy generator page → Update wizard steps for Hormozi playbooks

### Phase 6: Styling
1. Update color scheme (suggested: gold/black theme for wealth/success vibe)
2. Update logo and branding elements
3. Keep same responsive layout patterns

---

## Key Files to Clone from branding-advisor

| Source File | Destination | Modifications |
|------------|-------------|---------------|
| `src/lib/ai/client.ts` | `src/lib/ai/client.ts` | None - same Anthropic SDK wrapper |
| `src/types/index.ts` | `src/types/index.ts` | None - same Message type |
| `src/components/chat/ChatInterface.tsx` | `src/components/chat/ChatInterface.tsx` | Update industries list |
| `src/components/chat/MessageBubble.tsx` | `src/components/chat/MessageBubble.tsx` | None |
| `src/components/chat/QuickActions.tsx` | `src/components/chat/QuickActions.tsx` | Update to Hormozi actions |
| `src/app/api/chat/route.ts` | `src/app/api/chat/route.ts` | Import Hormozi prompt |
| `src/app/page.tsx` | `src/app/page.tsx` | Update branding, hero text |

---

## Environment Variables

```bash
# .env.local
ANTHROPIC_API_KEY=your-claude-code-max-key  # Inherits from system
```

The Anthropic API key is already available from Claude Code Max subscription.

---

## Color Scheme Suggestion

```css
/* Gold/Black theme for Hormozi wealth/success vibe */
:root {
  --primary: #D4AF37;      /* Gold */
  --primary-dark: #B8860B; /* Dark gold */
  --accent: #FFD700;       /* Bright gold */
  --background: #0F0F0F;   /* Near black */
  --surface: #1A1A1A;      /* Dark surface */
  --text: #FFFFFF;         /* White text */
  --text-muted: #A0A0A0;   /* Muted text */
}
```

---

## Project Location
```
/Users/michaelkraft/hormozi-advisor/
```

---

## Ready for Implementation

This plan provides everything needed to replicate the branding-advisor architecture for the Hormozi Business Advisor:

1. **Complete system prompt** with all 9 frameworks
2. **Quick actions** mapped to Hormozi concepts
3. **Playbook generation prompts** for 4 document types
4. **File-by-file mapping** from source project
5. **Industry selector** customized for Hormozi audience
6. **Styling guidance** for Hormozi brand aesthetic

The implementing agent should:
1. Clone the branding-advisor structure
2. Replace prompts with the Hormozi versions above
3. Update UI branding and colors
4. Test the chat and playbook generation features
