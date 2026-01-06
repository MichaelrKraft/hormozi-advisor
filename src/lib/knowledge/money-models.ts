/**
 * $100M Money Models Framework
 * Source: acquisition.com/training/money
 *
 * How to build offer stacks that maximize customer lifetime value
 */

export const MONEY_MODELS = {
  overview: `"A Money Model is how you structure your offers to maximize the money you make per customer. Most businesses have ONE offer. The best businesses have an OFFER STACK with Attraction, Upsell, Downsell, and Continuity offers working together."`,

  financialFundamentals: {
    cac: {
      name: "Customer Acquisition Cost (CAC)",
      formula: "Total Marketing & Sales Spend / Number of Customers Acquired",
      insight: "Most people calculate this wrong. Include ALL costs: ads, salaries, tools, commissions - everything to get that customer."
    },
    grossProfit: {
      name: "Gross Profit",
      formula: "Revenue - Cost of Goods Sold (COGS)",
      insight: "This is what matters for LTV, not revenue. A $10,000 sale with $8,000 in costs is worse than a $3,000 sale with $500 in costs."
    },
    paybackPeriod: {
      name: "Payback Period",
      formula: "CAC / Monthly Gross Profit per Customer",
      insight: "How long until you get your acquisition cost back? Under 3 months is great. Under 1 month is a 'license to print money.'"
    },
    cfa: {
      name: "Client-Financed Acquisition (CFA)",
      concept: "Structure your offers so the customer pays for the cost to acquire them upfront.",
      example: "If CAC is $500, create a $500 front-end offer. Now every new customer funds the next customer's acquisition.",
      formula: "Front-end Offer Price >= CAC",
      insight: "This is how you scale without external capital. The customer finances your growth."
    }
  },

  fourProngModel: {
    overview: "Every business should have 4 types of offers working together. Most only have 1-2.",
    prongs: [
      {
        type: "ATTRACTION",
        purpose: "Get people in the door. These are front-end offers designed to acquire customers.",
        margin: "Low or break-even (you're buying customers)",
        examples: ["Free trials", "Loss leaders", "Low-ticket offers", "Lead magnets"],
        key: "Make it irresistible to say yes. You're not trying to profit here - you're trying to acquire."
      },
      {
        type: "UPSELL",
        purpose: "Increase order value at point of sale. Offer more to people who already said yes.",
        margin: "High (delivery cost is low, they're already buying)",
        examples: ["Premium versions", "Add-ons", "Bundles", "Done-for-you upgrades"],
        key: "The easiest person to sell to is someone who just bought. Strike while the iron is hot."
      },
      {
        type: "DOWNSELL",
        purpose: "Capture value from people who say no to your main offer.",
        margin: "Medium (still profitable, lower price point)",
        examples: ["Payment plans", "Lite versions", "DIY options", "Free trials of paid product"],
        key: "A no to your main offer isn't a no to everything. Offer something they CAN say yes to."
      },
      {
        type: "CONTINUITY",
        purpose: "Recurring revenue. Turn one-time buyers into ongoing customers.",
        margin: "Very high over time (acquisition cost already paid)",
        examples: ["Memberships", "Subscriptions", "Retainers", "Maintenance plans"],
        key: "This is where wealth is built. A customer paying $100/month for 3 years is worth $3,600 from one acquisition."
      }
    ]
  },

  attractionOffers: {
    overview: "Offers designed to acquire customers, often at low or no profit.",
    types: [
      {
        name: "Win Your Money Back",
        concept: "Offer a guarantee where they can win back what they paid",
        example: "Pay $500, if you do X, you get your $500 back"
      },
      {
        name: "Free Giveaways",
        concept: "Give something valuable for free to generate leads",
        key: "The value should be obvious and immediate"
      },
      {
        name: "Decoy Offers",
        concept: "An offer that makes your main offer look like a better deal",
        example: "Option A: $97 for basic. Option B: $297 for premium. Option C (decoy): $247 for basic + 1 feature. Makes $297 look like a steal."
      },
      {
        name: "Buy X Get Y",
        concept: "Bundle offers that increase perceived value",
        example: "Buy 2 get 1 free, BOGO offers"
      },
      {
        name: "Pay Less Now",
        concept: "Lower the barrier to entry with deferred payment",
        example: "Start for $1, pay the rest in 30 days"
      },
      {
        name: "Free with Consumption",
        concept: "Free access tied to usage of another product",
        example: "Free software with hardware purchase"
      }
    ]
  },

  upsellOffers: {
    overview: "Offers presented after initial purchase to increase order value.",
    types: [
      {
        name: "Classic Upsell",
        concept: "Offer a more expensive, better version",
        example: "You bought the course, want 1-on-1 coaching too? +$2,000"
      },
      {
        name: "Menu Upsell",
        concept: "Present multiple upgrade options at different price points",
        example: "Good ($X), Better ($XX), Best ($XXX)"
      },
      {
        name: "Anchor Upsell",
        concept: "Show a very expensive option first to make the target option seem reasonable",
        example: "Show $10,000 option first, then $3,000 option looks like a deal"
      },
      {
        name: "Rollover Upsell",
        concept: "Offer to apply what they've paid toward a bigger purchase",
        example: "Apply your $500 course purchase toward the $5,000 coaching program"
      }
    ]
  },

  downsellOffers: {
    overview: "Offers for people who said no to your main offer.",
    types: [
      {
        name: "Payment Plans",
        concept: "Same offer, smaller payments over time",
        example: "Can't do $3,000? How about 6 payments of $597?"
      },
      {
        name: "Free Trials",
        concept: "Let them try before they buy",
        example: "Not ready to commit? Try it free for 14 days"
      },
      {
        name: "Feature Downsells",
        concept: "Offer a stripped-down version at lower price",
        example: "Don't need all features? Here's the basic version for 60% less"
      }
    ]
  },

  continuityOffers: {
    overview: "Recurring offers that create ongoing revenue streams.",
    types: [
      {
        name: "Continuity Bonus Offers",
        concept: "Add bonuses for staying subscribed",
        example: "Stay 3 months, get exclusive bonus content"
      },
      {
        name: "Continuity Discounts",
        concept: "Reward longer commitments with lower rates",
        example: "Annual plan = 2 months free"
      },
      {
        name: "Waived Fee",
        concept: "Waive setup or activation fees for commitment",
        example: "No setup fee if you commit to 6 months"
      }
    ]
  }
};

export const MONEY_MODELS_PROMPT_SECTION = `
## $100M MONEY MODELS FRAMEWORK

### Financial Fundamentals
- **CAC** (Customer Acquisition Cost) = Total Marketing & Sales / Customers Acquired
- **Gross Profit** = Revenue - COGS (this is what matters for LTV, not revenue)
- **Payback Period** = CAC / Monthly Gross Profit (under 3 months is great, under 1 month is a "license to print money")
- **CFA** (Client-Financed Acquisition) = Front-end offer price >= CAC. "The customer finances your growth."

### The 4-Prong Money Model (Every Business Needs All 4)
1. **ATTRACTION OFFERS** - Get people in the door (low/no margin, you're buying customers)
   - Free trials, loss leaders, low-ticket offers
   - "Make it irresistible to say yes"

2. **UPSELL OFFERS** - Increase order value at point of sale (high margin)
   - Premium versions, add-ons, bundles
   - "The easiest person to sell to is someone who just bought"

3. **DOWNSELL OFFERS** - Capture value from people who say no (medium margin)
   - Payment plans, lite versions, DIY options
   - "A no to your main offer isn't a no to everything"

4. **CONTINUITY OFFERS** - Recurring revenue (very high margin over time)
   - Memberships, subscriptions, retainers
   - "This is where wealth is built"

### Specific Offer Types to Recommend
**Attraction**: Win Your Money Back, Free Giveaways, Decoy Offers, Buy X Get Y, Pay Less Now
**Upsell**: Classic Upsell, Menu Upsell, Anchor Upsell, Rollover Upsell
**Downsell**: Payment Plans, Free Trials, Feature Downsells
**Continuity**: Bonus Offers, Continuity Discounts, Waived Fee

When advising on offers: "Most businesses have ONE offer. The best businesses have an OFFER STACK with all 4 types working together."
`;
