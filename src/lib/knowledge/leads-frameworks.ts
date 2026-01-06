/**
 * $100M Leads Framework
 * Source: acquisition.com/training/leads + $100M Leads Book
 *
 * How to get strangers to want to buy your stuff
 */

export const LEADS_FRAMEWORKS = {
  overview: `"Leads are people who have expressed interest in what you sell. More leads means more opportunities. More opportunities means more money. The goal is to get strangers to want to buy your stuff."`,

  coreFour: {
    name: "The Core Four Lead Generation Methods",
    principle: "There are only 4 ways to get leads. Everything else is a tactic within these 4.",
    methods: [
      {
        name: "Warm Outreach",
        description: "Reach out to people YOU know",
        audience: "Your existing network, contacts, past customers",
        effort: "Low cost, high effort",
        examples: ["Personal DMs", "Phone calls", "Emails to contacts", "Reconnecting with past clients"],
        bestFor: "Getting started, first customers, low budget",
        quote: "The easiest person to sell is someone who already knows and trusts you."
      },
      {
        name: "Cold Outreach",
        description: "Reach out to people THEY know (or strangers)",
        audience: "Targeted strangers who fit your avatar",
        effort: "Low cost, high effort, requires skill",
        examples: ["Cold email", "Cold DM", "Cold calling", "LinkedIn outreach"],
        bestFor: "Predictable lead flow, B2B, high-ticket",
        quote: "Cold outreach is a skill. Once you learn it, you can get customers on demand."
      },
      {
        name: "Content (One-to-Many)",
        description: "Create content that attracts leads to you",
        audience: "People consuming content on platforms",
        effort: "High upfront effort, compounds over time",
        examples: ["Social media posts", "YouTube videos", "Podcasts", "Blog articles", "Lead magnets"],
        bestFor: "Building long-term brand, organic growth, authority positioning",
        quote: "Content is a lead magnet that works while you sleep."
      },
      {
        name: "Paid Advertising",
        description: "Buy attention from platforms",
        audience: "Targeted users on ad platforms",
        effort: "High cost, lower effort, requires capital",
        examples: ["Facebook/Meta Ads", "Google Ads", "YouTube Ads", "LinkedIn Ads"],
        bestFor: "Scaling fast, predictable lead volume, once you have a proven offer",
        quote: "Ads are a multiplier of what already works. Don't run ads until you have a winning offer."
      }
    ]
  },

  warmOutreach: {
    name: "Warm Outreach System (First 5 Clients)",
    steps: [
      {
        step: 1,
        action: "Make a list of everyone you know",
        details: "Phone contacts, social media, email. Aim for 100+ names."
      },
      {
        step: 2,
        action: "Reach out with a personal message",
        details: "No pitch. Just reconnect. Ask how they're doing."
      },
      {
        step: 3,
        action: "Transition to what you're working on",
        details: "'I'm starting something new and thought of you...' or 'I'm helping people with X...'"
      },
      {
        step: 4,
        action: "Ask for referrals, not sales",
        details: "'Do you know anyone who [has this problem]?' Lower pressure than direct pitch."
      },
      {
        step: 5,
        action: "Follow up consistently",
        details: "Most people need 5-12 touches before they buy."
      }
    ],
    script: `Hey [Name], hope you're doing well! Quick question - I'm helping [avatar] achieve [outcome] and looking to work with [X] more people. Do you know anyone who might be interested? I'd love an intro if so. Either way, hope all is well!`
  },

  coldOutreach: {
    name: "Cold Outreach Playbook",
    principles: [
      "Personalize or perish - generic messages get ignored",
      "Lead with value, not a pitch",
      "The goal of cold outreach is to start a conversation, not close a sale",
      "Volume matters - expect 1-5% response rates"
    ],
    framework: {
      name: "PVP Framework (Problem, Value, Proof)",
      components: [
        { p: "Problem", description: "Call out their specific problem or situation" },
        { v: "Value", description: "Show what life looks like with the problem solved" },
        { p: "Proof", description: "Demonstrate you can actually deliver (case study, testimonial)" }
      ]
    },
    followUp: "Follow up 5-7 times. Most responses come after the 3rd touch.",
    channelAdvice: {
      email: "Best for B2B, professional audiences. Personalize subject lines.",
      linkedin: "Best for B2B, decision-makers. Connect first, then message.",
      dm: "Best for B2C, creators, influencers. Lead with compliment or value."
    }
  },

  contentMethod: {
    name: "Mozi Media Content Method",
    principle: "Content is just advertising you don't pay for. Treat it like ads.",
    pillars: [
      {
        name: "Hook",
        description: "The first 1-3 seconds. If you don't hook them, nothing else matters.",
        types: ["Curiosity", "Controversy", "Counter-intuitive", "Call-out", "Challenge"]
      },
      {
        name: "Retain",
        description: "Keep them watching/reading. Every line earns the next line.",
        tactics: ["Open loops", "Pattern interrupts", "Storytelling", "Cliffhangers"]
      },
      {
        name: "Reward",
        description: "Deliver on the promise. Give genuine value.",
        key: "If people feel like they got value, they'll come back."
      }
    ],
    contentTypes: [
      { type: "Give Value", purpose: "Build trust and authority", ratio: "80% of content" },
      { type: "Tell Stories", purpose: "Connect emotionally", ratio: "15% of content" },
      { type: "Make Offers", purpose: "Convert followers to customers", ratio: "5% of content" }
    ]
  },

  leadMagnets: {
    name: "Lead Magnet Mastery",
    definition: "A lead magnet is something valuable you give away for free in exchange for contact information.",
    criteria: [
      "Solves a specific problem",
      "Delivers quick win (consumable in 5-15 minutes)",
      "Positions your paid offer as the next logical step",
      "Filters for qualified leads"
    ],
    types: [
      { type: "Checklists", example: "The 10-Point Website Audit Checklist" },
      { type: "Templates", example: "Copy-Paste Email Templates That Convert" },
      { type: "Cheat Sheets", example: "The Facebook Ads Cheat Sheet" },
      { type: "Free Training", example: "Free 45-Minute Masterclass" },
      { type: "Quizzes", example: "What's Your Business Personality Type?" },
      { type: "Calculators", example: "Calculate Your True CAC" }
    ],
    bestPractice: "The lead magnet should give them a taste of the transformation, but leave them wanting more (which is your paid offer)."
  },

  paidAds: {
    name: "Paid Ads Playbook",
    principle: "Ads multiply what's already working. Get organic traction first.",
    stages: [
      {
        stage: 1,
        name: "Validate Organically",
        action: "Prove your offer works with warm outreach and organic content first"
      },
      {
        stage: 2,
        name: "Start Small",
        action: "Begin with $50-100/day to test audiences and creatives"
      },
      {
        stage: 3,
        name: "Optimize for Conversion",
        action: "Track cost per lead, cost per acquisition, and ROAS"
      },
      {
        stage: 4,
        name: "Scale Winners",
        action: "Double down on what works, kill what doesn't"
      }
    ],
    metrics: [
      { name: "CPL", meaning: "Cost Per Lead", target: "Depends on LTV, but lower is better" },
      { name: "CPA", meaning: "Cost Per Acquisition", target: "Must be < LTV/3 for profitability" },
      { name: "ROAS", meaning: "Return on Ad Spend", target: "3:1 minimum, 5:1+ ideal" }
    ],
    warning: "Don't run ads to a broken funnel. Fix the offer and landing page first."
  },

  referrals: {
    name: "Referral System",
    principle: "The best leads come from happy customers. Systematize referrals.",
    tactics: [
      {
        name: "Ask at Peak Happiness",
        when: "Right after they get a result",
        how: "Who else do you know that would benefit from this?"
      },
      {
        name: "Make it Easy",
        how: "Give them exact words, emails, or assets to share"
      },
      {
        name: "Incentivize",
        how: "Offer both parties something valuable (discounts, bonuses, cash)"
      },
      {
        name: "Follow Up",
        how: "Don't just ask once. Build referral asks into your process."
      }
    ]
  },

  moreBetterNew: {
    name: "More Better New Framework",
    principle: "When leads slow down, diagnose with this framework:",
    options: [
      {
        option: "MORE",
        meaning: "Do more of what's already working",
        when: "You have something working but not at full volume",
        action: "Increase frequency, volume, or investment in winning channels"
      },
      {
        option: "BETTER",
        meaning: "Improve what you're already doing",
        when: "Your current methods are working but not efficiently",
        action: "Optimize copy, targeting, creative, follow-up sequence"
      },
      {
        option: "NEW",
        meaning: "Try new channels or methods",
        when: "Current channels are maxed out or declining",
        action: "Test a new Core Four method you haven't tried yet"
      }
    ],
    priority: "Always try MORE first, then BETTER, then NEW. Most people jump to NEW too quickly."
  }
};

export const LEADS_PROMPT_SECTION = `
## $100M LEADS FRAMEWORK

### The Core Four (Only 4 Ways to Get Leads)
1. **Warm Outreach** - Reach out to people YOU know (low cost, first customers)
2. **Cold Outreach** - Reach out to strangers who fit your avatar (B2B, high-ticket)
3. **Content** - Create content that attracts leads (compounds over time)
4. **Paid Ads** - Buy attention from platforms (scales fast, requires capital)

"Start with warm outreach, graduate to cold outreach, build content for compounding, add ads to scale."

### Warm Outreach Script
"Hey [Name], I'm helping [avatar] achieve [outcome] and looking for [X] more people. Know anyone who might be interested?"

### Cold Outreach (PVP Framework)
- **P**roblem: Call out their specific pain
- **V**alue: Show life with problem solved
- **P**roof: Case study or testimonial

Follow up 5-7 times. Most responses come after touch 3+.

### Content Method (Hook → Retain → Reward)
- **Hook** (1-3 seconds): Curiosity, controversy, call-out
- **Retain**: Open loops, storytelling, pattern interrupts
- **Reward**: Deliver genuine value

Content ratio: 80% value, 15% stories, 5% offers

### Lead Magnet Criteria
- Solves a specific problem
- Quick win (5-15 minutes to consume)
- Positions paid offer as next step
- Filters for qualified leads

Types: Checklists, Templates, Cheat Sheets, Free Training, Quizzes, Calculators

### Paid Ads Sequence
1. Validate organically first
2. Start small ($50-100/day)
3. Track CPL, CPA, ROAS (target 3:1+)
4. Scale winners, kill losers

"Ads multiply what works. Don't run ads to a broken funnel."

### MORE → BETTER → NEW Framework
When leads slow: try MORE of what works → BETTER optimization → NEW channels
Most people jump to NEW too quickly. Double down on winners first.
`;
