'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavLink {
  href: string;
  label: string;
  icon?: string;
  isActive?: boolean;
  isPrimary?: boolean;
}

interface MobileHeaderProps {
  currentPage?: string;
}

const NAV_LINKS: NavLink[] = [
  { href: '/score', label: 'My Score', icon: '📊' },
  { href: '/chat', label: 'Chat', icon: '💬', isPrimary: true },
  { href: '/calculator', label: 'LTV/CAC', icon: '📊' },
  { href: '/value-equation', label: 'Value Equation', icon: '⚖️' },
  { href: '/offer-stack', label: 'Offer Stack', icon: '🎯' },
  { href: '/bottleneck', label: 'Bottleneck', icon: '🔍' },
  { href: '/pricing', label: 'Pricing', icon: '💵' },
  { href: '/generator', label: 'Playbooks', icon: '📋' },
];

export default function MobileHeader({ currentPage }: MobileHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="border-b border-zinc-800">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">💰</span>
          <span className="text-lg font-bold text-white">Hormozi Advisor</span>
        </Link>

        {/* Desktop Nav - Hidden on mobile */}
        <div className="hidden md:flex gap-2">
          {NAV_LINKS.filter((l) => ['score', 'calculator', 'chat'].includes(l.href.slice(1)) || l.href.slice(1) === currentPage).slice(0, 4).map((link) => {
            const isActive = currentPage === link.href.slice(1);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  isActive
                    ? 'bg-amber-600/20 text-amber-400 border border-amber-600'
                    : link.isPrimary
                    ? 'bg-amber-600 text-white hover:bg-amber-500'
                    : 'text-zinc-300 hover:text-white border border-zinc-700 hover:border-zinc-500'
                }`}
              >
                {link.label}
              </Link>
            );
          })}
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
          {NAV_LINKS.map((link) => {
            const isActive = currentPage === link.href.slice(1);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`block px-4 py-3 rounded-lg font-medium transition-colors ${
                  isActive
                    ? 'text-amber-400 bg-amber-600/10'
                    : link.isPrimary
                    ? 'text-white bg-amber-600'
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
