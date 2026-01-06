'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import BlurText from '@/components/ui/BlurText';
import ShinyText from '@/components/ui/ShinyText';

type AdviceMode = 'business' | 'life';

// FAQ Data
const FAQ_ITEMS = [
  {
    question: "Is this actually based on Alex Hormozi's teachings?",
    answer: "Yes! Every framework, calculation, and piece of advice is derived directly from Alex Hormozi's books ($100M Offers and $100M Leads), podcasts, and public teachings. We've codified his methodology into actionable tools."
  },
  {
    question: "How is this different from ChatGPT?",
    answer: "Unlike general AI, Hormozi Advisor is specifically trained on Alex's frameworks and business methodology. It doesn't give generic advice - it applies proven formulas like the Value Equation, LTV/CAC optimization, and Grand Slam Offer creation to YOUR specific business."
  },
  {
    question: "What kind of businesses is this for?",
    answer: "Any business selling products or services: agencies, SaaS, coaches, consultants, e-commerce, local businesses, and more. If you have customers and want to grow revenue, these frameworks apply to you."
  },
  {
    question: "Is my business data private?",
    answer: "Absolutely. Your business information is never shared, sold, or used to train AI models. All conversations are private and encrypted."
  },
  {
    question: "How accurate is the AI advice?",
    answer: "Hormozi Advisor has been trained on thousands of hours of Alex Hormozi content, including his books, podcasts, interviews, and business frameworks. The AI applies his proven methodology mathematically and logically - and it does so in Alex's direct, no-BS tone and style. You'll feel like you're actually talking to him. Be specific about your numbers and situation for the best results."
  },
  {
    question: "Can this replace a business coach?",
    answer: "Yes. You're chatting with an AI trained on Alex Hormozi's exact methodology - the same frameworks that built multiple $100M+ companies. Unlike a typical coach who may or may not know these systems, Hormozi Advisor gives you direct access to proven frameworks 24/7, with instant analysis and zero hourly fees. For most business owners, this is better than a coach."
  },
  {
    question: "What if I haven't read the books?",
    answer: "No problem! The tools explain concepts as they go. That said, reading $100M Offers and $100M Leads will help you get even more value from the advisor."
  },
  {
    question: "Is there a free trial?",
    answer: "Yes! You can use all the core tools for free. Start with the Bottleneck Diagnostic to identify your #1 constraint, then explore the other frameworks."
  }
];

// Pain Points Data
const PAIN_POINTS = [
  { icon: '🌀', text: "Drowning in tactics but no clear strategy" },
  { icon: '📉', text: "Competitors eating your market share" },
  { icon: '🎲', text: "Pricing feels like guesswork" },
  { icon: '🧱', text: "Can't figure out why growth stalled" },
  { icon: '😰', text: "Working harder but not getting ahead" },
  { icon: '🤷', text: "Don't know which lever to pull next" }
];

// Life Pain Points Data
const LIFE_PAIN_POINTS = [
  { icon: '😴', text: "Stuck in a rut and can't break free" },
  { icon: '⏰', text: "Procrastinating on what matters most" },
  { icon: '🎭', text: "Living someone else's version of success" },
  { icon: '😤', text: "Toxic relationships draining your energy" },
  { icon: '😨', text: "Fear holding you back from taking risks" },
  { icon: '🔄', text: "Same patterns, same results, different year" }
];

// How It Works Steps
const STEPS = [
  {
    number: "1",
    title: "Answer 5 Quick Questions",
    description: "Tell us about your business model, pricing, and current challenges. Takes under 3 minutes."
  },
  {
    number: "2",
    title: "Get Your Bottleneck Analysis",
    description: "Our AI identifies your #1 constraint: leads, conversion, pricing, or retention."
  },
  {
    number: "3",
    title: "Receive Your Playbook",
    description: "Get specific, actionable steps based on Hormozi's proven frameworks to fix your bottleneck."
  }
];

const TOOLS = [
  { href: '/calculator', label: 'LTV/CAC Calculator', icon: '📊', desc: 'Know your numbers' },
  { href: '/value-equation', label: 'Value Equation', icon: '⚖️', desc: '$100M Offers formula' },
  { href: '/offer-stack', label: 'Grand Slam Offers', icon: '🎯', desc: 'Offers so good people feel stupid saying no' },
  { href: '/pricing', label: 'Pricing Tool', icon: '💵', desc: 'Strongest profit lever' },
  { href: '/bottleneck', label: 'Bottleneck Finder', icon: '🔍', desc: 'Find your #1 constraint' },
];

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);
  const [adviceMode, setAdviceMode] = useState<AdviceMode>('business');

  // Persist mode to localStorage
  useEffect(() => {
    const saved = localStorage.getItem('adviceMode') as AdviceMode;
    if (saved) setAdviceMode(saved);
  }, []);

  const toggleMode = () => {
    const newMode = adviceMode === 'business' ? 'life' : 'business';
    setAdviceMode(newMode);
    localStorage.setItem('adviceMode', newMode);
  };

  const isLifeMode = adviceMode === 'life';

  return (
    <main className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Mode Toggle */}
            <button
              onClick={toggleMode}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 border border-sky-600/50 rounded-lg hover:border-sky-500 transition-colors"
            >
              {/* Briefcase Icon */}
              <svg
                className={`w-4 h-4 transition-opacity ${isLifeMode ? 'opacity-40' : 'opacity-100'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="opacity-50">/</span>
              {/* Brain/Mind Icon */}
              <svg
                className={`w-4 h-4 transition-opacity ${isLifeMode ? 'opacity-100' : 'opacity-40'}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </button>

            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/hormozi-logo.png"
                alt="Hormozi Advisor Logo"
                width={50}
                height={50}
                className="rounded"
              />
              <span className="text-xl font-bold text-white">Hormozi Advisor</span>
            </Link>
          </div>
          <div className="hidden md:flex gap-2 items-center">
            <Link
              href="/score"
              className="px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 border border-sky-600/50 rounded-lg hover:border-sky-500 transition-colors"
            >
              My Score
            </Link>

            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setToolsDropdownOpen(!toolsDropdownOpen)}
                className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors flex items-center gap-1"
              >
                Tools
                <svg className={`w-4 h-4 transition-transform ${toolsDropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {toolsDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setToolsDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-zinc-800 border border-zinc-700 rounded-xl shadow-xl z-20 py-2">
                    {TOOLS.map((tool) => (
                      <Link
                        key={tool.href}
                        href={tool.href}
                        className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
                        onClick={() => setToolsDropdownOpen(false)}
                      >
                        <span className="text-lg">{tool.icon}</span>
                        <div>
                          <div className="font-medium">{tool.label}</div>
                          <div className="text-xs text-zinc-500">{tool.desc}</div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </>
              )}
            </div>

            <Link
              href="/generator"
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            >
              Playbooks
            </Link>

            <Link
              href="/chat"
              className="px-3 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-500 transition-colors"
            >
              Chat
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
            {isLifeMode ? (
              <>
                <BlurText
                  text="Life Advice from"
                  delay={0.12}
                  animateBy="words"
                  direction="top"
                  className="text-white"
                />{' '}
                <ShinyText
                  text="Alex Hormozi"
                  speed={3}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold"
                />
              </>
            ) : (
              <>
                <BlurText
                  text="Business Advice from"
                  delay={0.12}
                  animateBy="words"
                  direction="top"
                  className="text-white"
                />{' '}
                <ShinyText
                  text="Alex Hormozi"
                  speed={3}
                  className="text-4xl sm:text-5xl md:text-6xl font-bold"
                />
              </>
            )}
          </h1>
          <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl mx-auto">
            {isLifeMode ? (
              <>
                137 Brutally Honest Truths to help you win at anything.{' '}
                <span className="bg-gradient-to-r from-purple-400 to-violet-500 bg-clip-text text-transparent font-semibold">No excuses. No BS.</span>{' '}
                Take ownership. Transform your life.
              </>
            ) : (
              <>
                Get direct, no-BS guidance using the frameworks from{' '}
                <span className="text-sky-400">$100M Offers</span> and{' '}
                <span className="text-sky-400">$100M Leads</span>.
                Find your bottleneck. Fix your offer. Scale your business.
              </>
            )}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            {isLifeMode ? (
              <Link
                href="/life-chat"
                className="px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
              >
                Chat with Life Coach
              </Link>
            ) : (
              <>
                <Link
                  href="/chat"
                  className="px-8 py-4 text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-all hover:scale-105 shadow-lg shadow-sky-600/25"
                >
                  Chat with Hormozi AI
                </Link>
                <Link
                  href="/bottleneck"
                  className="px-8 py-4 text-lg font-semibold text-sky-400 border-2 border-sky-600 rounded-xl hover:bg-sky-900/30 transition-colors"
                >
                  Find Your Bottleneck
                </Link>
              </>
            )}
          </div>
          <p className="text-zinc-500 text-sm">No credit card required. Start in 30 seconds.</p>
        </div>
      </section>

      {/* Social Proof Bar */}
      <section className="py-6 px-4 border-y border-zinc-800 bg-zinc-800/30">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-8 text-center">
          {isLifeMode ? (
            <>
              <div>
                <div className="text-2xl font-bold text-white">137</div>
                <div className="text-zinc-500 text-sm">Brutally Honest Truths</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">10</div>
                <div className="text-zinc-500 text-sm">Life Frameworks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">6hrs</div>
                <div className="text-zinc-500 text-sm">Of Wisdom Distilled</div>
              </div>
            </>
          ) : (
            <>
              <div>
                <div className="text-2xl font-bold text-white">1,260+</div>
                <div className="text-zinc-500 text-sm">Businesses Analyzed</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">6</div>
                <div className="text-zinc-500 text-sm">Proven Frameworks</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-white">$100M+</div>
                <div className="text-zinc-500 text-sm">In Applied Methodology</div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Problem/Agitation Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isLifeMode ? "Are You Stuck In Your Life?" : "Are You Stuck In Your Business?"}
          </h2>
          <p className="text-zinc-400 text-lg mb-12 max-w-2xl mx-auto">
            {isLifeMode
              ? "Most people hit the same walls year after year. Sound familiar?"
              : "Most entrepreneurs hit the same walls. Sound familiar?"}
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(isLifeMode ? LIFE_PAIN_POINTS : PAIN_POINTS).map((point, index) => (
              <div
                key={index}
                className={`bg-zinc-800/50 border border-zinc-700 rounded-xl p-6 text-left transition-colors ${
                  isLifeMode ? 'hover:border-purple-500/50' : 'hover:border-red-500/50'
                }`}
              >
                <span className="text-2xl mb-3 block">{point.icon}</span>
                <p className="text-zinc-300">{point.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {isLifeMode
              ? "What If You Had a Life Coach In Your Pocket?"
              : "What If You Had Alex Hormozi In Your Pocket?"}
          </h2>
          <p className="text-zinc-400 text-lg mb-8 max-w-2xl mx-auto">
            {isLifeMode
              ? "Get brutally honest advice from Alex's 137 life truths. No coddling. No excuses. Just the hard truths that transform lives."
              : "Hormozi Advisor gives you instant access to the exact frameworks that built multiple $100M+ companies. No guessing. No generic advice. Just proven systems and advice in Alex's tone applied to YOUR business."}
          </p>

          {isLifeMode ? (
            <>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto mb-6">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <div>
                    <p className="text-zinc-300 mb-4">
                      "If you're not where you want to be, it's your fault. Not because that's fair -
                      but because that gives you POWER. When you blame others, you give them the power to fix it.
                      Take it back."
                    </p>
                    <p className="text-zinc-500 text-sm">- The Ownership Framework</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <div>
                    <p className="text-zinc-300 mb-4">
                      "Your friends either increase or decrease the likelihood of your goals. There's no neutral.
                      If they're not helping you grow, they're holding you back."
                    </p>
                    <p className="text-purple-400 font-medium">
                      Audit your relationships ruthlessly. Your future self will thank you.
                    </p>
                    <p className="text-zinc-500 text-sm mt-3">- The Relationship Framework</p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto mb-6">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <div>
                    <p className="text-zinc-300 mb-4">
                      "Your LTV/CAC ratio is 2.1x - you're leaving money on the table. Here's the issue:
                      your average customer only buys once. Let me show you 3 ways to increase purchase
                      frequency using the Value Ladder framework..."
                    </p>
                    <p className="text-zinc-500 text-sm">- Hormozi Advisor analyzing a real business</p>
                  </div>
                </div>
              </div>

              <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8 max-w-2xl mx-auto">
                <div className="flex items-start gap-4 text-left">
                  <div className="w-10 h-10 bg-sky-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">H</span>
                  </div>
                  <div>
                    <p className="text-zinc-300 mb-4">
                      "If you can't get 10 people to pay $48 for something that claims to solve a $5K problem,
                      the market is telling you one of three things:"
                    </p>
                    <ol className="text-zinc-300 mb-4 space-y-2 list-decimal list-inside">
                      <li><span className="font-semibold text-white">The problem isn't big enough</span> - People don't actually hate it as much as you think</li>
                      <li><span className="font-semibold text-white">Your solution isn't valuable enough</span> - The market is commoditized</li>
                      <li><span className="font-semibold text-white">Your positioning sucks</span> - You're not communicating the value clearly</li>
                    </ol>
                    <p className="text-sky-400 font-medium">
                      But here's the thing: Finding out fast is GOOD news, not bad news.
                    </p>
                    <p className="text-zinc-500 text-sm mt-3">- Hormozi Advisor Authentic Advice</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Features Grid - Only show for business mode */}
      {!isLifeMode && (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            6 Frameworks to Scale Your Business
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Every tool is based on Alex Hormozi's proven methodology.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '📊', title: 'LTV/CAC Calculator', desc: 'The fundamental equation. Know your numbers or lose your business.', link: '/calculator' },
              { icon: '⚖️', title: 'Value Equation', desc: 'Calculate your offer\'s perceived value using the $100M formula.', link: '/value-equation' },
              { icon: '🎯', title: 'Grand Slam Offers', desc: 'Build offers so good people feel stupid saying no.', link: '/offer-stack' },
              { icon: '🔍', title: 'Bottleneck Finder', desc: 'Identify your #1 constraint: leads, conversion, pricing, or retention.', link: '/bottleneck' },
              { icon: '💵', title: 'Pricing Strategy', desc: 'Pricing is the STRONGEST profit lever. Period.', link: '/pricing' },
              { icon: '💬', title: 'AI Business Chat', desc: 'Ask anything. Get Hormozi-style advice instantly.', link: '/chat' },
            ].map((feature) => (
              <Link
                key={feature.title}
                href={feature.link}
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover:border-sky-600/50 hover:bg-zinc-800/80 transition-all group"
              >
                <span className="text-3xl mb-4 block">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-sky-400 transition-colors">
                  {feature.title}
                </h3>
                <p className="text-zinc-400 text-sm">{feature.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* How It Works - Only show for business mode */}
      {!isLifeMode && (
      <section className="py-20 px-4 bg-zinc-800/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            How It Works
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Get actionable insights in under 5 minutes
          </p>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {STEPS.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-sky-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-white">{step.number}</span>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-zinc-400">{step.description}</p>
              </div>
            ))}
          </div>

          {/* Or Just Chat */}
          <div className="text-center border-t border-zinc-700 pt-10">
            <p className="text-zinc-500 text-sm uppercase tracking-wide mb-3">Or</p>
            <h3 className="text-2xl font-bold text-white mb-3">
              Just Chat with Hormozi
            </h3>
            <p className="text-zinc-400 max-w-xl mx-auto mb-6">
              Skip the structure and have an off-the-cuff conversation about anything -
              your offer, your pricing, your bottleneck, or whatever's on your mind.
              Alex is ready to talk.
            </p>
            <Link
              href="/chat"
              className="inline-block px-6 py-3 text-lg font-semibold text-sky-400 border-2 border-sky-600 rounded-xl hover:bg-sky-900/30 transition-colors"
            >
              Start a Conversation
            </Link>
          </div>
        </div>
      </section>
      )}

      {/* Testimonials - Only show for business mode */}
      {!isLifeMode && (
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            What Business Owners Are Saying
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Real results from real entrepreneurs using Hormozi Advisor.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                quote: "Finally, a tool that actually applies Hormozi's frameworks to MY specific business. The LTV/CAC calculator alone saved me from a bad acquisition.",
                name: "Sarah K.",
                role: "SaaS Founder",
                result: "Identified $240K/year in hidden revenue"
              },
              {
                quote: "The bottleneck diagnostic pinpointed exactly where I was stuck. Turns out it wasn't leads - it was my offer. Game changer.",
                name: "Marcus T.",
                role: "Agency Owner",
                result: "3x'd close rate in 30 days"
              },
              {
                quote: "I've read both books twice. This tool makes it 10x easier to actually implement the frameworks instead of just reading about them.",
                name: "Jennifer L.",
                role: "Course Creator",
                result: "Raised prices 40%, kept conversion"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map((star) => (
                    <span key={star} className="text-sky-400">★</span>
                  ))}
                </div>
                <p className="text-zinc-300 text-sm mb-4 italic">"{testimonial.quote}"</p>
                <div className="border-t border-zinc-700 pt-4 mt-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <div className="text-white font-medium text-sm">{testimonial.name}</div>
                      <div className="text-zinc-500 text-xs">{testimonial.role}</div>
                    </div>
                  </div>
                  <div className="mt-3 text-sky-400 text-xs font-medium">
                    {testimonial.result}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* FAQ Section - Only show for business mode */}
      {!isLifeMode && (
      <section className="py-20 px-4 bg-zinc-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-zinc-400 text-center mb-12">
            Everything you need to know about Hormozi Advisor
          </p>
          <div className="space-y-4">
            {FAQ_ITEMS.map((faq, index) => (
              <div
                key={index}
                className="bg-zinc-800 border border-zinc-700 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-zinc-700/50 transition-colors"
                >
                  <span className="text-white font-medium pr-4">{faq.question}</span>
                  <span className="text-zinc-400 text-xl flex-shrink-0">
                    {openFaq === index ? '−' : '+'}
                  </span>
                </button>
                {openFaq === index && (
                  <div className="px-6 pb-4">
                    <p className="text-zinc-400">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* Pricing Section - Only show for business mode */}
      {!isLifeMode && (
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-white text-center mb-4">
            Simple, No-BS Pricing
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Get access to all Hormozi frameworks and AI-powered business advice.
          </p>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Beta Lifetime Deal */}
            <div className="relative bg-gradient-to-b from-sky-900/30 to-zinc-800 border-2 border-sky-500 rounded-2xl p-8">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-sky-600 text-white text-sm font-bold px-4 py-1 rounded-full">
                BETA SPECIAL
              </div>
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Lifetime Access</h3>
                <p className="text-zinc-400 text-sm">First 50 beta users only</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-white">$97</span>
                <span className="text-zinc-400 ml-2">one-time</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  All 6 business frameworks
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Unlimited AI chat sessions
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Playbook generator
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Lifetime updates
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Lock in forever - never pay again
                </li>
              </ul>
              <Link
                href="/chat"
                className="block w-full py-4 text-center text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-colors"
              >
                Get Lifetime Access
              </Link>
              <p className="text-zinc-500 text-xs text-center mt-3">
                Limited spots remaining
              </p>
            </div>

            {/* Monthly Plan */}
            <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-8">
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
                <p className="text-zinc-400 text-sm">Cancel anytime</p>
              </div>
              <div className="text-center mb-6">
                <span className="text-5xl font-bold text-white">$9</span>
                <span className="text-zinc-400 ml-2">/month</span>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  All 6 business frameworks
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Unlimited AI chat sessions
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Playbook generator
                </li>
                <li className="flex items-center gap-3 text-zinc-300">
                  <span className="text-sky-400">✓</span>
                  Regular updates
                </li>
                <li className="flex items-center gap-3 text-zinc-400">
                  <span className="text-zinc-600">✓</span>
                  Flexible - cancel anytime
                </li>
              </ul>
              <Link
                href="/chat"
                className="block w-full py-4 text-center text-lg font-semibold text-white border-2 border-zinc-600 rounded-xl hover:border-zinc-500 hover:bg-zinc-700/50 transition-colors"
              >
                Start Monthly
              </Link>
              <p className="text-zinc-500 text-xs text-center mt-3">
                No commitment required
              </p>
            </div>
          </div>

          {/* Value Comparison */}
          <div className="mt-12 text-center">
            <p className="text-zinc-400 text-sm">
              <span className="text-sky-400 font-semibold">Lifetime deal math:</span> If you stay for 11+ months, lifetime pays for itself.
              <br />
              Most business coaches charge $500-2000/month for similar frameworks.
            </p>
          </div>
        </div>
      </section>
      )}

      {/* Final CTA */}
      <section className="py-24 px-4 bg-gradient-to-b from-zinc-900 to-zinc-800">
        <div className="max-w-4xl mx-auto text-center">
          {isLifeMode ? (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Life?
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                Stop making excuses. Start taking ownership. 137 brutally honest truths
                are waiting for you.
              </p>
              <Link
                href="/life-chat"
                className="inline-block px-10 py-5 text-xl font-semibold bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-xl hover:from-purple-400 hover:to-violet-500 transition-all hover:scale-105 shadow-lg shadow-purple-600/25"
              >
                Start Your Transformation
              </Link>
              <p className="text-zinc-500 text-sm mt-4">No BS. No excuses. Just truth.</p>
            </>
          ) : (
            <>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
                Stop guessing. Start executing with proven frameworks that have generated
                over $100M in value.
              </p>
              <Link
                href="/chat"
                className="inline-block px-10 py-5 text-xl font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-all hover:scale-105 shadow-lg shadow-sky-600/25"
              >
                Get Started Free
              </Link>
              <p className="text-zinc-500 text-sm mt-4">No credit card required</p>
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/hormozi-logo.png"
                alt="Hormozi Advisor Logo"
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-lg font-bold text-white">Hormozi Advisor</span>
            </div>
            <div className="flex gap-6 text-zinc-500 text-sm">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-zinc-800 text-center">
            <p className="text-zinc-500 text-sm">
              Powered by AI trained on Alex Hormozi's methodology.
              Not affiliated with Alex Hormozi or Acquisition.com.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
