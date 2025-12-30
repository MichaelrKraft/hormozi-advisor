'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface MobileHeaderProps {
  currentPage?: string;
}

const TOOLS = [
  { href: '/calculator', label: 'LTV/CAC Calculator', icon: '📊', desc: 'Know your numbers' },
  { href: '/strategies', label: 'Strategy Simulator', icon: '📈', desc: '5 ways to improve your ratio' },
  { href: '/value-equation', label: 'Value Equation', icon: '⚖️', desc: '$100M Offers formula' },
  { href: '/offer-stack', label: 'Grand Slam Offers', icon: '🎯', desc: 'Offers so good people feel stupid saying no' },
  { href: '/pricing', label: 'Pricing Tool', icon: '💵', desc: 'Strongest profit lever' },
  { href: '/bottleneck', label: 'Bottleneck Finder', icon: '🔍', desc: 'Find your #1 constraint' },
];

const MOBILE_NAV_LINKS = [
  { href: '/score', label: 'My Score', icon: '📊' },
  { href: '/chat', label: 'Chat', icon: '💬', isPrimary: true },
  { href: '/calculator', label: 'LTV/CAC', icon: '📊' },
  { href: '/strategies', label: 'Strategy Simulator', icon: '📈' },
  { href: '/value-equation', label: 'Value Equation', icon: '⚖️' },
  { href: '/offer-stack', label: 'Grand Slam Offers', icon: '🎯' },
  { href: '/bottleneck', label: 'Bottleneck', icon: '🔍' },
  { href: '/pricing', label: 'Pricing', icon: '💵' },
  { href: '/generator', label: 'Playbooks', icon: '📋' },
];

export default function MobileHeader({ currentPage }: MobileHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [toolsDropdownOpen, setToolsDropdownOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/hormozi-logo.png"
            alt="Hormozi Advisor Logo"
            width={46}
            height={46}
            className="rounded"
          />
          <span className="text-lg font-bold text-white">Hormozi Advisor</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex gap-2 items-center">
          <Link
            href="/score"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentPage === 'score'
                ? 'bg-sky-600/20 text-sky-400 border border-sky-600'
                : 'text-sky-400 hover:text-sky-300 border border-sky-600/50 hover:border-sky-500'
            }`}
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
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentPage === 'generator'
                ? 'bg-sky-600/20 text-sky-400 border border-sky-600'
                : 'text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500'
            }`}
          >
            Playbooks
          </Link>

          <Link
            href="/chat"
            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
              currentPage === 'chat'
                ? 'bg-sky-600/20 text-sky-400 border border-sky-600'
                : 'bg-sky-600 text-white hover:bg-sky-500'
            }`}
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
          {MOBILE_NAV_LINKS.map((link) => {
            const isActive = currentPage === link.href.slice(1);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'text-sky-400 bg-sky-600/10'
                    : link.isPrimary
                    ? 'text-white bg-sky-600'
                    : 'text-zinc-300 hover:bg-zinc-800'
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.icon} {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
