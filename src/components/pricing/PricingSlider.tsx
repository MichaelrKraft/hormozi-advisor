'use client';

import { useState } from 'react';

interface PricingSliderProps {
  id: string;
  question: string;
  lowLabel: string;
  highLabel: string;
  value: number;
  onChange: (id: string, value: number) => void;
  category: string;
  categoryIcon: string;
}

export default function PricingSlider({
  id,
  question,
  lowLabel,
  highLabel,
  value,
  onChange,
  category,
  categoryIcon,
}: PricingSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span>{categoryIcon}</span>
            <span className="text-xs text-zinc-500 uppercase">{category}</span>
          </div>
          <h3 className="text-white font-medium">{question}</h3>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-amber-400">{value}</div>
          <div className="text-xs text-zinc-500">/10</div>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(id, parseInt(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all ${
            isDragging ? 'scale-y-125' : ''
          }`}
          style={{
            background: `linear-gradient(to right, #3b82f6 0%, #eab308 50%, #ef4444 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>
    </div>
  );
}
