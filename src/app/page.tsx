'use client';

import { useState } from 'react';
import Link from 'next/link';
import BlurText from '@/components/ui/BlurText';
import ShinyText from '@/components/ui/ShinyText';

const FRAMEWORKS = [
  { title: 'LTV to CAC Ratio', description: 'The fundamental business equation. High ratio = "License to Print Money"', link: '/calculator', icon: '📊' },
  { title: 'Value Equation', description: 'Calculate your offer\'s perceived value using the $100M Offers formula', link: '/value-equation', icon: '⚖️' },
  { title: 'Grand Slam Offers', description: 'Build offers so good people feel stupid saying no', link: '/offer-stack', icon: '🎯' },
  { title: 'Pricing Strategy', description: 'Pricing is the STRONGEST profit lever. Period.', link: '/pricing', icon: '💵' },
  { title: 'Business Bottleneck', description: 'Find your #1 constraint: leads, conversion, pricing, or retention', link: '/bottleneck', icon: '🔍' },
  { title: 'Customer Retention', description: 'Retention drives exponential growth through compounding', icon: '🔄' },
];

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <main className="min-h-screen bg-zinc-900">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">💰</span>
            <span className="text-xl font-bold text-white">Hormozi Advisor</span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex gap-2">
            <Link
              href="/score"
              className="px-3 py-2 text-sm font-medium text-sky-400 hover:text-sky-300 border border-sky-600/50 rounded-lg hover:border-sky-500 transition-colors"
            >
              My Score
            </Link>
            <Link
              href="/calculator"
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            >
              LTV/CAC
            </Link>
            <Link
              href="/value-equation"
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            >
              Value Eq
            </Link>
            <Link
              href="/offer-stack"
              className="px-3 py-2 text-sm font-medium text-zinc-300 hover:text-white border border-zinc-700 rounded-lg hover:border-zinc-500 transition-colors"
            >
              Offer Stack
            </Link>
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

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-zinc-800 px-4 py-4 space-y-2">
            <Link
              href="/score"
              className="block px-4 py-3 text-sky-400 bg-sky-600/10 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 My Score
            </Link>
            <Link
              href="/chat"
              className="block px-4 py-3 text-white bg-sky-600 rounded-lg font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              💬 Chat with Hormozi
            </Link>
            <Link
              href="/calculator"
              className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              📊 LTV/CAC Calculator
            </Link>
            <Link
              href="/value-equation"
              className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              ⚖️ Value Equation
            </Link>
            <Link
              href="/offer-stack"
              className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              🎯 Offer Stack Builder
            </Link>
            <Link
              href="/bottleneck"
              className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              🔍 Bottleneck Finder
            </Link>
            <Link
              href="/pricing"
              className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              💵 Pricing Tool
            </Link>
            <Link
              href="/generator"
              className="block px-4 py-3 text-zinc-300 hover:bg-zinc-800 rounded-lg"
              onClick={() => setMobileMenuOpen(false)}
            >
              📋 Playbook Generator
            </Link>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-4 md:mb-6">
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
              className="text-3xl sm:text-5xl md:text-6xl font-bold"
            />
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 mb-6 md:mb-8 max-w-2xl mx-auto">
            Get direct, no-BS guidance using the frameworks from $100M Offers
            and $100M Leads. Analyze your LTV/CAC, create Grand Slam Offers,
            and build your lead generation machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Link
              href="/chat"
              className="px-8 py-4 text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-colors"
            >
              Chat with Hormozi
            </Link>
            <Link
              href="/bottleneck"
              className="px-8 py-4 text-lg font-semibold text-sky-400 border-2 border-sky-600 rounded-xl hover:bg-sky-900/30 transition-colors"
            >
              Find Your Bottleneck
            </Link>
          </div>
          {/* Quick Tools */}
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/calculator"
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover-glow text-sm"
            >
              📊 LTV/CAC Calculator
            </Link>
            <Link
              href="/value-equation"
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover-glow text-sm"
            >
              ⚖️ Value Equation
            </Link>
            <Link
              href="/offer-stack"
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover-glow text-sm"
            >
              🎯 Offer Builder
            </Link>
            <Link
              href="/pricing"
              className="px-4 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white hover-glow text-sm"
            >
              💵 Pricing Tool
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-zinc-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            9 Frameworks to Scale Your Business
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Based on Alex Hormozi&apos;s proven methodology that has helped scale multiple
            companies to 8 and 9 figures.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FRAMEWORKS.map((framework) => {
              const content = (
                <>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{framework.icon}</span>
                    <h3 className="text-lg font-semibold text-white">{framework.title}</h3>
                  </div>
                  <p className="text-zinc-400 text-sm">{framework.description}</p>
                  {framework.link && (
                    <span className="inline-block mt-3 text-sky-400 text-sm font-medium">
                      Try Tool →
                    </span>
                  )}
                </>
              );

              return framework.link ? (
                <Link
                  key={framework.title}
                  href={framework.link}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover-glow block"
                >
                  {content}
                </Link>
              ) : (
                <div
                  key={framework.title}
                  className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover-glow opacity-60"
                >
                  {content}
                  <span className="inline-block mt-3 text-zinc-500 text-sm">
                    Coming soon
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Playbooks Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            Generate Custom Playbooks
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Answer a few questions and get a personalized action plan for your business.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'Business Strategy', desc: 'Prioritization and focus plan' },
              { title: 'LTV Optimization', desc: 'Improve your unit economics' },
              { title: 'Grand Slam Offer', desc: 'Create irresistible offers' },
              { title: 'Lead Generation', desc: 'Build your lead machine' },
            ].map((playbook) => (
              <Link
                key={playbook.title}
                href="/generator"
                className="bg-zinc-800 border border-zinc-700 rounded-xl p-6 hover-glow text-left"
              >
                <h3 className="text-md font-semibold text-white mb-1">{playbook.title}</h3>
                <p className="text-zinc-500 text-sm">{playbook.desc}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 px-4 bg-zinc-800/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-4">
            What Users Are Saying
          </h2>
          <p className="text-zinc-400 text-center mb-12 max-w-2xl mx-auto">
            Business owners using Hormozi Advisor to grow their companies.
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            <TestimonialCard
              quote="Finally, a tool that actually applies Hormozi's frameworks to MY specific business. The LTV/CAC calculator alone saved me from a bad acquisition."
              name="Sarah K."
              role="SaaS Founder"
              rating={5}
            />
            <TestimonialCard
              quote="The bottleneck diagnostic pinpointed exactly where I was stuck. Turns out it wasn't leads - it was my offer. Game changer."
              name="Marcus T."
              role="Agency Owner"
              rating={5}
            />
            <TestimonialCard
              quote="I've read both books twice. This tool makes it 10x easier to actually implement the frameworks instead of just reading about them."
              name="Jennifer L."
              role="Course Creator"
              rating={5}
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-zinc-800/50 to-zinc-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Scale Your Business?
          </h2>
          <p className="text-zinc-400 mb-8 max-w-xl mx-auto">
            Stop guessing. Start executing with proven frameworks that have generated
            over $100M in value.
          </p>
          <Link
            href="/chat"
            className="inline-block px-8 py-4 text-lg font-semibold bg-sky-600 text-white rounded-xl hover:bg-sky-500 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-4">
        <div className="max-w-6xl mx-auto text-center text-zinc-500 text-sm">
          <p>
            Powered by AI trained on Alex Hormozi&apos;s methodology.
            Not affiliated with Alex Hormozi or Acquisition.com.
          </p>
        </div>
      </footer>
    </main>
  );
}

// Testimonial Card Component
function TestimonialCard({
  quote,
  name,
  role,
  rating,
}: {
  quote: string;
  name: string;
  role: string;
  rating: number;
}) {
  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-6">
      {/* Stars */}
      <div className="flex gap-1 mb-4">
        {Array.from({ length: rating }).map((_, i) => (
          <span key={i} className="text-sky-400">★</span>
        ))}
      </div>
      {/* Quote */}
      <p className="text-zinc-300 text-sm mb-4 italic">&quot;{quote}&quot;</p>
      {/* Author */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-sky-500 to-sky-700 rounded-full flex items-center justify-center text-white font-bold text-sm">
          {name.split(' ').map(n => n[0]).join('')}
        </div>
        <div>
          <div className="text-white font-medium text-sm">{name}</div>
          <div className="text-zinc-500 text-xs">{role}</div>
        </div>
      </div>
    </div>
  );
}
