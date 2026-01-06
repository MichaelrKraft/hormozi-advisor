/**
 * $100M Offers Framework
 * Source: acquisition.com/training/offers + $100M Offers Book
 *
 * How to create Grand Slam Offers that people feel stupid saying no to
 */

export const OFFERS_FRAMEWORKS = {
  overview: `"A Grand Slam Offer is an offer so good people feel stupid saying no. Most offers are commodities - same thing, different logo. Grand Slam Offers differentiate on VALUE, not price."`,

  valueEquation: {
    name: "The Value Equation",
    formula: "Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)",
    insight: "To increase value: increase the top (outcomes, likelihood) and decrease the bottom (time, effort).",
    components: [
      {
        name: "Dream Outcome",
        description: "What they REALLY want (the transformation, not the vehicle)",
        maximize: "Paint a vivid picture of their ideal future state. Be specific about the outcome.",
        example: "Not 'lose weight' but 'feel confident in a swimsuit at your high school reunion'"
      },
      {
        name: "Perceived Likelihood of Achievement",
        description: "How likely they believe they'll succeed with your solution",
        maximize: "Social proof, testimonials, guarantees, credentials, case studies",
        example: "Show 500 success stories, not just 'we get results'"
      },
      {
        name: "Time Delay",
        description: "How long until they get the result",
        minimize: "Speed to first result. Quick wins build momentum and belief.",
        example: "First 5 lbs in 7 days, full transformation in 90 days"
      },
      {
        name: "Effort & Sacrifice",
        description: "How hard is it? What do they give up?",
        minimize: "Do it for them. Remove friction. Make it easy.",
        example: "Done-for-you meals vs. here's a recipe book"
      }
    ]
  },

  pickingMarkets: {
    name: "Picking Markets (Starving Crowd)",
    principle: "The single most important decision is WHO you serve. A great offer to a bad market fails. A mediocre offer to a starving crowd succeeds.",
    criteria: [
      {
        name: "Pain",
        question: "Do they have a MASSIVE pain they're desperate to solve?",
        insight: "Pain motivates faster than pleasure. Find people in pain."
      },
      {
        name: "Purchasing Power",
        question: "Can they actually pay for the solution?",
        insight: "Broke people can't buy. Target people with money AND pain."
      },
      {
        name: "Easy to Target",
        question: "Can you find and reach them efficiently?",
        insight: "If you can't find them, you can't sell to them. Pick accessible niches."
      },
      {
        name: "Growing",
        question: "Is the market growing or shrinking?",
        insight: "Swim with the current, not against it. Growing markets forgive mistakes."
      }
    ],
    nicheFormula: "Niche = Problem + Avatar + Unique Mechanism",
    example: "Weight loss for busy moms who want to lose 20 lbs using intermittent fasting"
  },

  pricing: {
    name: "Charge What It's Worth",
    principles: [
      {
        name: "Price-to-Value Disconnect",
        insight: "Most entrepreneurs undercharge. If your offer is truly valuable, charge like it.",
        quote: "If you're not embarrassed by your prices, you're not charging enough."
      },
      {
        name: "Price Signals Value",
        insight: "Higher prices increase perceived value. Low prices signal low value.",
        example: "A $10,000 coaching program gets more commitment than a $100 course"
      },
      {
        name: "Premium Pricing Enables Premium Delivery",
        insight: "Higher prices fund better service, which creates better results, which justifies higher prices.",
        formula: "Higher Price → Better Service → Better Results → More Testimonials → Higher Prices"
      },
      {
        name: "Price on Outcome, Not Inputs",
        insight: "Don't price by time or materials. Price by the value of the transformation.",
        example: "A logo isn't worth $500. A brand that helps you charge 10x more is worth $50,000."
      }
    ]
  },

  offerCreation: {
    name: "Creating the Offer Stack",
    steps: [
      {
        step: 1,
        name: "Identify Dream Outcome",
        action: "What is the ultimate result your customer wants?",
        exercise: "List every outcome they want. Pick the most compelling."
      },
      {
        step: 2,
        name: "List All Problems",
        action: "What obstacles, fears, and challenges stand between them and the dream outcome?",
        exercise: "Brain dump 20-50 problems. Every single thing that could stop them."
      },
      {
        step: 3,
        name: "Create Solutions",
        action: "For each problem, create a solution. Each solution is a potential offer component.",
        exercise: "Turn each problem into a solution statement."
      },
      {
        step: 4,
        name: "Trim & Stack",
        action: "Remove low-value solutions. Stack high-value ones into your offer.",
        insight: "More isn't always better. Keep what moves the needle."
      },
      {
        step: 5,
        name: "Determine Delivery Vehicle",
        action: "How will you deliver each solution? (1-on-1, group, digital, done-for-you)",
        consideration: "Each delivery vehicle has different margins and scalability."
      }
    ]
  },

  bonuses: {
    name: "Bonus Stacking",
    principles: [
      "Bonuses should address specific objections or fears",
      "Each bonus should have a clear value that's stated",
      "Bonuses should be easy to deliver (digital often works best)",
      "The total bonus value should exceed the core offer price",
      "Fast action bonuses create urgency"
    ],
    types: [
      {
        type: "Objection Crusher",
        description: "Addresses 'but what if X happens?'",
        example: "Bonus: Emergency Support Hotline (for 'what if I get stuck?')"
      },
      {
        type: "Speed to Result",
        description: "Helps them get results faster",
        example: "Bonus: Quick Start Guide - See results in 48 hours"
      },
      {
        type: "Complementary",
        description: "Enhances the core offer",
        example: "Bonus: Templates, Swipe Files, Done-For-You Assets"
      }
    ]
  },

  guarantees: {
    name: "Risk Reversal Guarantees",
    principle: "The goal is to make the risk of saying YES less than the risk of saying NO.",
    types: [
      {
        name: "Unconditional",
        description: "Full refund, no questions asked",
        when: "High trust, low fraud audience, strong offer",
        example: "100% money back if you're not satisfied, for any reason"
      },
      {
        name: "Conditional",
        description: "Refund if you do X and don't get Y",
        when: "Need them to take action to get results",
        example: "Do all the homework, attend all calls, and if you don't lose 20 lbs, full refund"
      },
      {
        name: "Anti-Guarantee",
        description: "No refunds. This is for serious people only.",
        when: "Ultra-premium, high-commitment offers",
        example: "No refunds. If you're not 100% committed, don't apply."
      },
      {
        name: "Implied Guarantee",
        description: "Performance-based pricing",
        example: "Pay only when you make money. I eat what I kill."
      }
    ],
    stackingInsight: "You can stack guarantees: 30-day unconditional + 90-day conditional"
  },

  scarcityUrgency: {
    name: "Scarcity & Urgency (Ethical)",
    warning: "Must be REAL. Fake scarcity destroys trust forever.",
    types: [
      {
        type: "Quantity Scarcity",
        examples: ["Only 10 spots available", "Limited to 50 copies", "Only accepting 5 new clients"],
        real: "Based on actual capacity constraints"
      },
      {
        type: "Time Urgency",
        examples: ["Price increases Monday", "Bonuses expire Friday", "Enrollment closes tonight"],
        real: "Based on actual deadlines or cohort starts"
      },
      {
        type: "Qualification Scarcity",
        examples: ["Must apply and be accepted", "Requirements to qualify", "Not for everyone"],
        real: "Based on actual fit criteria"
      }
    ],
    bestPractice: "Use the scarcity that's naturally true for your business model"
  },

  naming: {
    name: "Naming Your Offer",
    framework: "MAGIC Formula",
    components: [
      { letter: "M", meaning: "Make a Claim", example: "Lose 20 lbs" },
      { letter: "A", meaning: "Avatar", example: "For Busy Professionals" },
      { letter: "G", meaning: "Goal/Outcome", example: "Without Giving Up Pasta" },
      { letter: "I", meaning: "Interval", example: "In 90 Days" },
      { letter: "C", meaning: "Container", example: "Bootcamp, System, Blueprint, Method" }
    ],
    examples: [
      "The 90-Day Body Transformation Bootcamp for Busy Moms",
      "The 6-Week Revenue Acceleration System for B2B SaaS",
      "The Weekend Funnel Blueprint for Course Creators"
    ]
  }
};

export const OFFERS_PROMPT_SECTION = `
## $100M OFFERS FRAMEWORK (Grand Slam Offers)

### The Value Equation (Memorize This)
Value = (Dream Outcome × Perceived Likelihood) / (Time Delay × Effort & Sacrifice)

To increase value:
- INCREASE: Dream Outcome (paint vivid picture), Perceived Likelihood (proof, guarantees)
- DECREASE: Time Delay (speed to result), Effort & Sacrifice (do it for them)

### Picking Markets (Starving Crowd Criteria)
1. **Pain** - Do they have MASSIVE pain they're desperate to solve?
2. **Purchasing Power** - Can they actually pay?
3. **Easy to Target** - Can you find and reach them?
4. **Growing** - Is the market expanding?

"A mediocre offer to a starving crowd beats a great offer to a bad market."

### Pricing Philosophy
- "If you're not embarrassed by your prices, you're not charging enough"
- Price on OUTCOME, not inputs (not time, not materials)
- Higher prices → Better service → Better results → More testimonials

### Offer Stack Creation Process
1. Identify Dream Outcome (what they REALLY want)
2. List ALL Problems (20-50 obstacles between them and the outcome)
3. Create Solutions (each problem becomes a potential offer component)
4. Trim & Stack (keep high-value, remove low-value)
5. Determine Delivery (1-on-1, group, digital, done-for-you)

### Bonus Principles
- Each bonus crushes a specific objection
- State clear value for each bonus
- Total bonus value should exceed offer price
- Use fast-action bonuses for urgency

### Guarantee Types
- **Unconditional**: Full refund, no questions (high trust needed)
- **Conditional**: Refund if you do X and don't get Y (ensures action)
- **Anti-Guarantee**: No refunds, serious people only (ultra-premium)

### MAGIC Naming Formula
M = Make a Claim | A = Avatar | G = Goal | I = Interval | C = Container
Example: "The 90-Day Revenue Acceleration System for B2B SaaS Founders"

When creating offers: "An offer so good people feel stupid saying no."
`;
