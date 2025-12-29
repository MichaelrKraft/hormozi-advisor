'use client';

interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (recommendations.length === 0) {
    return (
      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-6 text-center">
        <span className="text-4xl mb-3 block">🎉</span>
        <h3 className="text-lg font-semibold text-emerald-400 mb-2">
          Looking Great!
        </h3>
        <p className="text-zinc-400 text-sm">
          Your business metrics are solid. Keep iterating and testing to maintain your edge.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-zinc-800/50 border border-zinc-700 rounded-xl p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span>💡</span> Recommended Next Steps
      </h3>
      <ul className="space-y-3">
        {recommendations.map((rec, index) => (
          <li key={index} className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 bg-sky-500/20 text-sky-400 rounded-full flex items-center justify-center text-sm font-medium">
              {index + 1}
            </span>
            <span className="text-zinc-300 text-sm leading-relaxed">{rec}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
