'use client';

import Link from 'next/link';
import type { ToolScore, HealthRating } from '@/types/score';
import { RATING_META } from '@/types/score';

interface ScoreCardProps {
  title: string;
  icon: string;
  href: string;
  toolScore: ToolScore;
  details?: React.ReactNode;
}

export default function ScoreCard({ title, icon, href, toolScore, details }: ScoreCardProps) {
  const { score, rating, status, lastUpdated } = toolScore;
  const meta = RATING_META[rating];

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      className={`relative bg-zinc-800/50 border rounded-xl p-5 transition-all hover:border-zinc-600 ${
        status === 'complete' ? meta.bgColor : 'border-zinc-700'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h3 className="font-semibold text-white">{title}</h3>
        </div>
        {status === 'complete' && (
          <div className={`text-2xl font-bold ${meta.color}`}>{score}</div>
        )}
      </div>

      {/* Content */}
      {status === 'complete' ? (
        <>
          {/* Score Bar */}
          <div className="mb-4">
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-500 ${getBarColor(rating)}`}
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <span className={`text-sm font-medium ${meta.color}`}>
                {meta.emoji} {meta.label}
              </span>
              {lastUpdated && (
                <span className="text-xs text-zinc-500">{formatDate(lastUpdated)}</span>
              )}
            </div>
          </div>

          {/* Details Section */}
          {details && (
            <div className="pt-3 border-t border-zinc-700/50 space-y-1.5">
              {details}
            </div>
          )}

          {/* Link to tool */}
          <Link
            href={href}
            className="mt-4 block text-center text-sm text-zinc-400 hover:text-amber-400 transition-colors"
          >
            Update Analysis →
          </Link>
        </>
      ) : (
        <>
          {/* Incomplete State */}
          <div className="py-6 text-center">
            <div className="text-zinc-500 mb-4">
              <span className="text-4xl opacity-50">📊</span>
            </div>
            <p className="text-zinc-500 text-sm mb-4">Not yet completed</p>
            <Link
              href={href}
              className="inline-block px-4 py-2 bg-amber-600/20 text-amber-400 rounded-lg text-sm font-medium hover:bg-amber-600/30 transition-colors"
            >
              Complete {title}
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

function getBarColor(rating: HealthRating): string {
  switch (rating) {
    case 'critical':
      return 'bg-red-500';
    case 'poor':
      return 'bg-orange-500';
    case 'average':
      return 'bg-yellow-500';
    case 'good':
      return 'bg-emerald-500';
    case 'excellent':
      return 'bg-amber-500';
  }
}

// Detail line component for consistent styling
export function ScoreDetail({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-500">{label}</span>
      <span className={highlight ? 'text-amber-400 font-medium' : 'text-zinc-300'}>
        {value}
      </span>
    </div>
  );
}
