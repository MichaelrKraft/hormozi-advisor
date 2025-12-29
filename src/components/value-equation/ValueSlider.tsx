'use client';

import { useState } from 'react';

interface ValueSliderProps {
  label: string;
  description: string;
  value: number;
  onChange: (value: number) => void;
  isInverted?: boolean; // For time delay and effort (lower is better)
  lowLabel?: string;
  highLabel?: string;
}

export default function ValueSlider({
  label,
  description,
  value,
  onChange,
  isInverted = false,
  lowLabel = 'Low',
  highLabel = 'High',
}: ValueSliderProps) {
  const [isDragging, setIsDragging] = useState(false);

  // For inverted sliders, the visual color should be opposite
  const getSliderColor = () => {
    if (isInverted) {
      // Lower is better for inverted
      if (value <= 3) return 'bg-emerald-500';
      if (value <= 6) return 'bg-yellow-500';
      return 'bg-red-500';
    } else {
      // Higher is better for normal
      if (value >= 8) return 'bg-emerald-500';
      if (value >= 5) return 'bg-yellow-500';
      return 'bg-red-500';
    }
  };

  const getValueLabel = () => {
    if (isInverted) {
      if (value <= 3) return 'Excellent';
      if (value <= 5) return 'Good';
      if (value <= 7) return 'Okay';
      return 'Needs Work';
    } else {
      if (value >= 8) return 'Excellent';
      if (value >= 6) return 'Good';
      if (value >= 4) return 'Okay';
      return 'Needs Work';
    }
  };

  return (
    <div className="bg-zinc-800 border border-zinc-700 rounded-xl p-5">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="text-lg font-semibold text-white">{label}</h3>
          <p className="text-sm text-zinc-400">{description}</p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${getSliderColor().replace('bg-', 'text-')}`}>
            {value}
          </div>
          <div className="text-xs text-zinc-500">{getValueLabel()}</div>
        </div>
      </div>

      <div className="mt-4">
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          className={`w-full h-3 rounded-full appearance-none cursor-pointer transition-all ${
            isDragging ? 'scale-y-125' : ''
          }`}
          style={{
            background: `linear-gradient(to right, ${
              isInverted ? '#10b981' : '#ef4444'
            } 0%, ${
              isInverted ? '#ef4444' : '#10b981'
            } 100%)`,
          }}
        />
        <div className="flex justify-between text-xs text-zinc-500 mt-1">
          <span>{lowLabel}</span>
          <span>{highLabel}</span>
        </div>
      </div>

      {/* Visual indicator of what this means */}
      {isInverted && (
        <div className="mt-2 text-xs text-zinc-500 italic">
          Lower is better for offer value
        </div>
      )}
    </div>
  );
}
