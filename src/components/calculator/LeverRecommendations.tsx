'use client';

import type { Recommendation } from '@/types/calculator';

interface LeverRecommendationsProps {
  recommendations: Recommendation[];
}

export default function LeverRecommendations({
  recommendations,
}: LeverRecommendationsProps) {
  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">
        Top Recommendations to Improve Your Ratio
      </h3>
      <div className="space-y-3">
        {recommendations.map((rec, index) => (
          <RecommendationCard key={rec.lever} recommendation={rec} index={index} />
        ))}
      </div>
    </div>
  );
}

interface RecommendationCardProps {
  recommendation: Recommendation;
  index: number;
}

function RecommendationCard({ recommendation, index }: RecommendationCardProps) {
  const impactColors = {
    high: 'bg-emerald-900/30 text-emerald-400 border-emerald-600',
    medium: 'bg-sky-900/30 text-sky-400 border-sky-600',
    low: 'bg-zinc-800 text-zinc-400 border-zinc-600',
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-sky-600 text-white flex items-center justify-center font-bold">
          {index + 1}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-white">{recommendation.lever}</h4>
            <span
              className={`text-xs px-2 py-0.5 rounded-full border ${
                impactColors[recommendation.impact]
              }`}
            >
              {recommendation.impact} impact
            </span>
          </div>
          <p className="text-zinc-400 text-sm mb-2">{recommendation.action}</p>
          <p className="text-sky-400/80 text-sm italic">
            &quot;{recommendation.hormoziQuote}&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
