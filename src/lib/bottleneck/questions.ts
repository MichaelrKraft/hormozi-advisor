import type { BottleneckQuestion, BottleneckArea, BottleneckAdvice } from '@/types/bottleneck';

/**
 * 8 diagnostic questions to identify business bottleneck
 * Each answer adds points to different bottleneck areas
 */
export const BOTTLENECK_QUESTIONS: BottleneckQuestion[] = [
  {
    id: 'q1',
    question: 'What keeps you up at night about your business?',
    options: [
      {
        text: 'Not enough people know we exist',
        scores: { leads: 3, conversion: 0, pricing: 0, retention: 0 },
      },
      {
        text: 'People visit but don\'t buy',
        scores: { leads: 0, conversion: 3, pricing: 0, retention: 0 },
      },
      {
        text: 'Sales are good but margins are thin',
        scores: { leads: 0, conversion: 0, pricing: 3, retention: 0 },
      },
      {
        text: 'Customers buy once but don\'t come back',
        scores: { leads: 0, conversion: 0, pricing: 0, retention: 3 },
      },
    ],
  },
  {
    id: 'q2',
    question: 'How would you describe your lead flow?',
    options: [
      {
        text: 'Barely trickling - we struggle to get enough eyeballs',
        scores: { leads: 3, conversion: 0, pricing: 0, retention: 0 },
      },
      {
        text: 'Decent volume but quality is inconsistent',
        scores: { leads: 1, conversion: 2, pricing: 0, retention: 0 },
      },
      {
        text: 'Good leads but we\'re spending too much to acquire them',
        scores: { leads: 0, conversion: 0, pricing: 2, retention: 1 },
      },
      {
        text: 'Leads are fine - our problem is downstream',
        scores: { leads: 0, conversion: 1, pricing: 1, retention: 1 },
      },
    ],
  },
  {
    id: 'q3',
    question: 'When prospects see your offer, what usually happens?',
    options: [
      {
        text: 'They seem interested but never take action',
        scores: { leads: 0, conversion: 3, pricing: 0, retention: 0 },
      },
      {
        text: 'They say it\'s too expensive',
        scores: { leads: 0, conversion: 1, pricing: 2, retention: 0 },
      },
      {
        text: 'They buy but we barely make money on the deal',
        scores: { leads: 0, conversion: 0, pricing: 3, retention: 0 },
      },
      {
        text: 'They buy readily when they see it',
        scores: { leads: 2, conversion: 0, pricing: 0, retention: 1 },
      },
    ],
  },
  {
    id: 'q4',
    question: 'What does your customer journey look like after the first purchase?',
    options: [
      {
        text: 'Most never buy again or engage with us',
        scores: { leads: 0, conversion: 0, pricing: 0, retention: 3 },
      },
      {
        text: 'Some repeat but it\'s inconsistent',
        scores: { leads: 0, conversion: 1, pricing: 0, retention: 2 },
      },
      {
        text: 'Good repeat business but we wish we had more customers',
        scores: { leads: 3, conversion: 0, pricing: 0, retention: 0 },
      },
      {
        text: 'Loyal base but margins are tight on repeat orders',
        scores: { leads: 0, conversion: 0, pricing: 2, retention: 1 },
      },
    ],
  },
  {
    id: 'q5',
    question: 'If you 10x\'d your traffic tomorrow, what would happen?',
    options: [
      {
        text: 'We\'d be overwhelmed - current systems couldn\'t handle it',
        scores: { leads: 0, conversion: 1, pricing: 1, retention: 1 },
      },
      {
        text: 'We\'d get more visitors but probably same conversion rate',
        scores: { leads: 0, conversion: 3, pricing: 0, retention: 0 },
      },
      {
        text: 'More sales but we might lose money at scale',
        scores: { leads: 0, conversion: 0, pricing: 3, retention: 0 },
      },
      {
        text: 'We\'d grow but churn would eat into gains',
        scores: { leads: 0, conversion: 0, pricing: 0, retention: 3 },
      },
    ],
  },
  {
    id: 'q6',
    question: 'How do most people find out about your business?',
    options: [
      {
        text: 'Word of mouth only - we don\'t really market',
        scores: { leads: 3, conversion: 0, pricing: 0, retention: 0 },
      },
      {
        text: 'Paid ads but the cost per lead keeps rising',
        scores: { leads: 1, conversion: 0, pricing: 2, retention: 0 },
      },
      {
        text: 'Referrals from happy customers',
        scores: { leads: 1, conversion: 0, pricing: 0, retention: 2 },
      },
      {
        text: 'Mixed channels but conversion varies wildly',
        scores: { leads: 0, conversion: 2, pricing: 1, retention: 0 },
      },
    ],
  },
  {
    id: 'q7',
    question: 'What\'s your biggest pricing challenge?',
    options: [
      {
        text: 'Competitors undercut us constantly',
        scores: { leads: 0, conversion: 1, pricing: 2, retention: 0 },
      },
      {
        text: 'We don\'t know what price the market will bear',
        scores: { leads: 0, conversion: 0, pricing: 3, retention: 0 },
      },
      {
        text: 'Customers pay but expect too much for the price',
        scores: { leads: 0, conversion: 0, pricing: 1, retention: 2 },
      },
      {
        text: 'Pricing is fine - getting enough buyers is the issue',
        scores: { leads: 2, conversion: 1, pricing: 0, retention: 0 },
      },
    ],
  },
  {
    id: 'q8',
    question: 'What would make the biggest impact on your business right now?',
    options: [
      {
        text: 'More people seeing my offer',
        scores: { leads: 3, conversion: 0, pricing: 0, retention: 0 },
      },
      {
        text: 'More people saying yes to my offer',
        scores: { leads: 0, conversion: 3, pricing: 0, retention: 0 },
      },
      {
        text: 'Making more money on each sale',
        scores: { leads: 0, conversion: 0, pricing: 3, retention: 0 },
      },
      {
        text: 'Keeping customers longer and getting repeat business',
        scores: { leads: 0, conversion: 0, pricing: 0, retention: 3 },
      },
    ],
  },
];

/**
 * Hormozi-style advice for each bottleneck area
 */
export const BOTTLENECK_ADVICE: Record<BottleneckArea, BottleneckAdvice> = {
  leads: {
    area: 'leads',
    title: 'Lead Generation',
    description: 'Your business is starving for attention. The best offer in the world means nothing if nobody sees it.',
    hormoziQuote: "Look, you have a visibility problem, not a product problem. Right now you're the world's best-kept secret. That's not a flex - that's a death sentence. Your first job is to get eyeballs, everything else comes after.",
    metrics: [
      'Website visitors per month',
      'Cost per lead (CPL)',
      'Lead sources breakdown',
      'Content reach/impressions',
    ],
    quickWins: [
      'Start posting content daily on ONE platform you can own',
      'Reach out to 100 ideal customers personally this week',
      'Launch a simple referral program for existing customers',
      'Run a small paid ad test ($500) to learn what messaging works',
    ],
    deepDive: [
      'Build the Core Four: Warm outreach, Cold outreach, Content, and Paid ads',
      'Create lead magnets that solve a specific problem',
      'Develop partnerships with complementary businesses',
      'Invest in SEO for long-term organic traffic',
    ],
    chatPrompt: 'My business has a lead generation problem. I need help building a strategy to get more qualified leads.',
  },
  conversion: {
    area: 'conversion',
    title: 'Sales Conversion',
    description: 'People are seeing your offer but not buying. Your offer, messaging, or sales process needs work.',
    hormoziQuote: "You're getting traffic but not sales? That's an offer problem. Your offer isn't a Grand Slam. People aren't feeling stupid saying no - they're feeling smart. We need to flip that equation.",
    metrics: [
      'Website conversion rate',
      'Sales call close rate',
      'Cart abandonment rate',
      'Time from lead to customer',
    ],
    quickWins: [
      'Add urgency and scarcity to your offer (real, not fake)',
      'Stack more bonuses to increase perceived value',
      'Add a risk-reversal guarantee',
      'Simplify your checkout/buying process',
    ],
    deepDive: [
      'Rebuild your offer using the Value Equation',
      'Create better social proof (case studies, testimonials)',
      'Develop an objection-handling sequence',
      'Test different price points and packaging',
    ],
    chatPrompt: 'My business has a conversion problem. People see my offer but don\'t buy. Help me improve my offer.',
  },
  pricing: {
    area: 'pricing',
    title: 'Pricing & Margins',
    description: 'You\'re making sales but not enough money per sale. Your unit economics need fixing.',
    hormoziQuote: "Pricing is the STRONGEST lever on profit. Not acquisition. Not retention. Pricing. A 10% price increase on most businesses goes straight to the bottom line. You're leaving money on the table because you're scared to charge what you're worth.",
    metrics: [
      'Average order value (AOV)',
      'Gross margin per sale',
      'Customer acquisition cost (CAC)',
      'Lifetime value to CAC ratio',
    ],
    quickWins: [
      'Raise your prices 20% and see what happens',
      'Create a premium tier with higher margins',
      'Add high-margin upsells and cross-sells',
      'Remove unprofitable products/services',
    ],
    deepDive: [
      'Restructure your offer tiers for better margin capture',
      'Reduce cost of goods/delivery without hurting quality',
      'Build value through packaging, not discounting',
      'Implement value-based pricing instead of cost-plus',
    ],
    chatPrompt: 'My business has a pricing/margins problem. We make sales but our margins are too thin. Help me fix my pricing strategy.',
  },
  retention: {
    area: 'retention',
    title: 'Customer Retention',
    description: 'You\'re acquiring customers but losing them too fast. The leaky bucket problem.',
    hormoziQuote: "Retention is where fortunes are made. Every month you keep a customer is pure profit. But you're spending all this money to get people in the front door while they're walking out the back. That's not a business, that's a revolving door.",
    metrics: [
      'Monthly churn rate',
      'Customer lifetime (months)',
      'Net Promoter Score (NPS)',
      'Repeat purchase rate',
    ],
    quickWins: [
      'Implement a 90-day onboarding sequence',
      'Create a community for customers',
      'Add check-ins at critical moments',
      'Survey churned customers to understand why',
    ],
    deepDive: [
      'Build a customer success program',
      'Create loyalty rewards for long-term customers',
      'Develop reactivation campaigns for churned customers',
      'Increase switching costs through integration/community',
    ],
    chatPrompt: 'My business has a retention problem. Customers buy once but don\'t come back. Help me reduce churn and increase lifetime value.',
  },
};

/**
 * Area labels and colors for display
 */
export const BOTTLENECK_META: Record<BottleneckArea, { label: string; color: string; icon: string }> = {
  leads: {
    label: 'Lead Generation',
    color: 'blue',
    icon: '👁️',
  },
  conversion: {
    label: 'Conversion',
    color: 'purple',
    icon: '💰',
  },
  pricing: {
    label: 'Pricing & Margins',
    color: 'sky',
    icon: '💵',
  },
  retention: {
    label: 'Retention',
    color: 'green',
    icon: '🔄',
  },
};
