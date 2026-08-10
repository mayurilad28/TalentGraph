import React from 'react';

interface MatchScoreRingProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const MatchScoreRing: React.FC<MatchScoreRingProps> = ({
  score,
  size = 'md',
  showLabel = true,
}) => {
  const normalizedScore = Math.min(100, Math.max(0, Math.round(score)));

  // Color logic
  let strokeColor = '#ef4444'; // Red < 50
  let textColor = 'text-rose-400';
  let badgeBg = 'bg-rose-500/10 border-rose-500/20';

  if (normalizedScore >= 80) {
    strokeColor = '#10b981'; // Emerald
    textColor = 'text-emerald-400';
    badgeBg = 'bg-emerald-500/10 border-emerald-500/20';
  } else if (normalizedScore >= 60) {
    strokeColor = '#6366f1'; // Indigo
    textColor = 'text-indigo-400';
    badgeBg = 'bg-indigo-500/10 border-indigo-500/20';
  } else if (normalizedScore >= 40) {
    strokeColor = '#f59e0b'; // Amber
    textColor = 'text-amber-400';
    badgeBg = 'bg-amber-500/10 border-amber-500/20';
  }

  const dimensions = {
    sm: { diameter: 44, strokeWidth: 3.5, textSize: 'text-xs font-bold' },
    md: { diameter: 64, strokeWidth: 5, textSize: 'text-sm font-extrabold' },
    lg: { diameter: 88, strokeWidth: 6.5, textSize: 'text-xl font-black' },
  }[size];

  const radius = (dimensions.diameter - dimensions.strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={dimensions.diameter}
          height={dimensions.diameter}
          className="transform -rotate-90"
        >
          {/* Background Track */}
          <circle
            cx={dimensions.diameter / 2}
            cy={dimensions.diameter / 2}
            r={radius}
            stroke="#1e293b"
            strokeWidth={dimensions.strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={dimensions.diameter / 2}
            cy={dimensions.diameter / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <span className={`absolute ${dimensions.textSize} ${textColor}`}>
          {normalizedScore}%
        </span>
      </div>
      {showLabel && (
        <span className={`mt-1 text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${badgeBg} ${textColor}`}>
          Match
        </span>
      )}
    </div>
  );
};
