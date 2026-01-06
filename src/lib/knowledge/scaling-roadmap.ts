/**
 * $100M Scaling Roadmap Framework
 * Source: acquisition.com Scaling Roadmap PDF + Training
 *
 * The 10 Stages of Scaling from $0 to $100M+
 */

export const SCALING_STAGES = {
  overview: `The $100M Scaling Roadmap breaks business growth into 10 distinct stages, each with specific constraints and graduation criteria. "Think of it like levels in a video game - you can't skip ahead, and each stage has its own boss to beat."`,

  stages: [
    {
      stage: 0,
      name: "IMPROVISE",
      headcount: "N/A (just you)",
      role: "Researcher",
      bottomLine: "Nothing is happening",
      graduateBy: "Get people to try your stuff for free",
      constraints: {
        product: "You have nothing to sell → Make something FREE to give away",
        marketing: "No one knows about your stuff → Tell people you have FREE stuff",
        sales: "You don't know how to sell → Get people to try it for free",
        customerService: "No customers to service → Service your free customers",
        it: "You have no tech → Get a Computer, Internet, Microphone, Phone, Email",
        recruiting: "You don't know how to work → Recruit yourself to work",
        hr: "You're unprotected → Create an entity to separate personal from business assets",
        finance: "Your personal money is business money → Get a business bank account, write off startup expenses"
      },
      keyAdvice: "Don't worry about making money yet. Focus on helping people and getting feedback. Keep everything simple. Be patient and learn from every interaction."
    },
    {
      stage: 1,
      name: "MONETIZE",
      headcount: "1",
      role: "Starter",
      bottomLine: "Your business makes no money",
      graduateBy: "Make your first sale",
      companiesAtThisStage: "30,000,000 (only 9% of people own a business)",
      constraints: {
        product: "Not good enough to sell → Fix it until it's good enough to sell. Make V1 product.",
        marketing: "No one knows you have PAID stuff → Tell people you have paid stuff. Sign up for free ad spend credits.",
        sales: "You still don't know how to sell → Use good results from free people to sell paid people. Offer to solve their problems for money.",
        customerService: "Free customers don't like it or use it → Figure out all hidden costs (why they don't like/use it) by talking to them.",
        it: "You have no basic software/tools or social media → Figure out the (free) software you need by joining free groups and reading online forums.",
        recruiting: "You don't know how to do something or have the time → Reach out to people you know to help OR use freelancer platforms.",
        hr: "You pay money to freelancers and don't get what you want → Create basic vendor agreements & expectations",
        finance: "You have no way to collect money → Set up a payment processor. Run a payment. Get a deposit."
      },
      keyAdvice: "Your main goal is simple: make your first sale. Not just one sale, but consistent first sales to different customers. This proves people will actually pay for what you're offering."
    },
    {
      stage: 2,
      name: "ADVERTISE",
      summary: "Start paid marketing to reach beyond your network",
      graduateBy: "Achieve positive ROI on paid advertising"
    },
    {
      stage: 3,
      name: "STABILIZE",
      summary: "Build consistent systems and processes",
      graduateBy: "Predictable monthly revenue and operations"
    },
    {
      stage: 4,
      name: "PRIORITIZE",
      summary: "Focus resources on what drives the most value",
      graduateBy: "Clear priorities and saying NO to distractions"
    },
    {
      stage: 5,
      name: "PRODUCTIZE",
      summary: "Systematize delivery so it doesn't depend on you",
      graduateBy: "Delivery works without founder involvement"
    },
    {
      stage: 6,
      name: "OPTIMIZE",
      summary: "Improve efficiency and margins across the business",
      graduateBy: "Healthy margins and efficient operations"
    },
    {
      stage: 7,
      name: "CATEGORIZE",
      summary: "Organize into departments with clear ownership",
      graduateBy: "Functional departments with leaders"
    },
    {
      stage: 8,
      name: "SPECIALIZE",
      summary: "Focus and dominate your niche",
      graduateBy: "Clear market position and competitive moat"
    },
    {
      stage: 9,
      name: "CAPITALIZE",
      summary: "Scale or exit - turn enterprise value into wealth",
      graduateBy: "Successful exit or self-sustaining scale"
    }
  ],

  functionalAreas: [
    "Product",
    "Marketing",
    "Sales",
    "Customer Service",
    "Information Tech (IT)",
    "Recruiting",
    "Human Resources (HR)",
    "Finance"
  ],

  keyPrinciples: [
    "Each stage has specific constraints to overcome - focus on YOUR stage's constraints",
    "You graduate by solving the constraint, not by time spent",
    "Don't try to skip stages - the foundation matters",
    "Your role evolves: Researcher → Starter → Advertiser → ... → Capitalizer",
    "Headcount grows with stages: 1 → 3-5 → 10-20 → 50-100 → 250-500+",
    "The constraint at each stage is different - what worked before may not work now"
  ],

  stageIdentification: `To identify your stage, ask:
1. Have you gotten anyone to try your stuff for free? (If no → Stage 0)
2. Have you made your first sale? (If no → Stage 1)
3. Are you running profitable paid advertising? (If no → Stage 2)
4. Do you have predictable, stable revenue? (If no → Stage 3)
And so on...

"The biggest mistake is trying to solve Stage 5 problems when you haven't graduated Stage 2."`
};

export const SCALING_PROMPT_SECTION = `
## THE 10 STAGES OF SCALING ($100M Scaling Roadmap)

When helping users, identify their current stage and give stage-appropriate advice:

**STAGE 0: IMPROVISE** (Pre-revenue)
- Role: Researcher | Goal: Get people to try your stuff for FREE
- "Don't worry about making money yet. Focus on helping people and getting feedback."

**STAGE 1: MONETIZE** ($0 → First Sale)
- Role: Starter | Goal: Make your first sale
- "Your product isn't good enough to sell yet? Fix it until people pay."
- Only 9% of people own a business - making your first sale is a big deal.

**STAGE 2: ADVERTISE** (First Sale → Paid Marketing ROI)
- Start paid marketing to reach beyond your network
- "You've proven people will pay. Now pay to reach more of them."

**STAGE 3: STABILIZE** (Chaos → Predictable Operations)
- Build consistent systems and processes
- "If it's not documented, it doesn't exist."

**STAGE 4: PRIORITIZE** (Doing Everything → Focus)
- Say NO to everything except what matters most
- "The Woman in the Red Dress - ignore the shiny objects"

**STAGE 5: PRODUCTIZE** (Founder-Dependent → Systematized)
- Delivery works without you
- "If you can't take a 2-week vacation, you don't have a business, you have a job"

**STAGE 6: OPTIMIZE** (Working → Efficient)
- Improve margins and efficiency
- "The best businesses aren't just big, they're efficient"

**STAGE 7: CATEGORIZE** (Flat → Departmentalized)
- Clear departments with clear ownership
- "Every function needs an owner who wakes up thinking about it"

**STAGE 8: SPECIALIZE** (Generalist → Focused Leader)
- Dominate your niche
- "The riches are in the niches"

**STAGE 9: CAPITALIZE** (Operating → Wealth Creation)
- Scale to exit or self-sustaining enterprise
- "Build to sell, even if you never do"

When a user describes their situation, identify which stage they're at and focus your advice on solving THAT stage's constraints. Don't give Stage 5 advice to a Stage 1 business.
`;
