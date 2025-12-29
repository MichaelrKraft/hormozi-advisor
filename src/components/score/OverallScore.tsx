'use client';

import type { HealthRating } from '@/types/score';
import { RATING_META } from '@/types/score';

interface OverallScoreProps {
  score: number;
  rating: HealthRating;
  completeness: number;
  toolsCompleted: number;
  totalTools: number;
}

export default function OverallScore({
  score,
  rating,
  completeness,
  toolsCompleted,
  totalTools,
}: OverallScoreProps) {
  const meta = RATING_META[rating];

  // SVG circle parameters
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      {/* Score Ring */}
      <div className="relative">
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#27272a"
            strokeWidth={strokeWidth}
          />
          {/* Score circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getStrokeColor(rating)}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className={`text-5xl font-bold ${meta.color}`}>
            {score > 0 ? score : '—'}
          </div>
          <div className="text-zinc-500 text-sm mt-1">out of 100</div>
        </div>
      </div>

      {/* Rating label */}
      <div className={`mt-4 px-4 py-2 rounded-full ${meta.bgColor}`}>
        <span className={`font-semibold ${meta.color}`}>
          {meta.emoji} {score > 0 ? meta.label : 'Start Your Analysis'}
        </span>
      </div>

      {/* Completeness */}
      <div className="mt-4 text-center">
        <div className="text-zinc-500 text-sm">
          {toolsCompleted} of {totalTools} tools completed
        </div>
        <div className="w-48 h-1.5 bg-zinc-700 rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-amber-500 rounded-full transition-all duration-500"
            style={{ width: `${completeness}%` }}
          />
        </div>
      </div>
    </div>
  );
}

function getStrokeColor(rating: HealthRating): string {
  switch (rating) {
    case 'critical':
      return '#ef4444'; // red-500
    case 'poor':
      return '#f97316'; // orange-500
    case 'average':
      return '#eab308'; // yellow-500
    case 'good':
      return '#10b981'; // emerald-500
    case 'excellent':
      return '#f59e0b'; // amber-500
  }
}
