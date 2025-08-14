import React from 'react';

type WeatherVariant = 'dayClear' | 'nightClear' | 'cloudy' | 'rain' | 'snow';

interface WeatherWhaleProps {
  variant: WeatherVariant;
}

const variantToGradient: Record<WeatherVariant, string> = {
  dayClear: 'from-sky-400 to-blue-600',
  nightClear: 'from-indigo-800 to-blue-900',
  cloudy: 'from-slate-400 to-sky-600',
  rain: 'from-indigo-600 to-slate-700',
  snow: 'from-sky-200 to-blue-400'
};

const WeatherWhale: React.FC<WeatherWhaleProps> = ({ variant }) => {
  return (
    <div className={`absolute inset-0 rounded-2xl overflow-hidden bg-gradient-to-r ${variantToGradient[variant]}`}>
      <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="w-full h-full opacity-20">
        {/* Hills */}
        <defs>
          <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path d="M0 150 C 80 120, 160 180, 240 150 C 300 130, 340 160, 400 150 L 400 200 L 0 200 Z" fill="url(#hillGrad)" />

        {/* Whale silhouette */}
        <path
          d="M120 120 c 30 -35 80 -40 120 -20 c 10 5 25 10 35 8 c -5 8 -15 15 -25 17 c 5 10 5 18 0 26 c -10 -6 -20 -10 -33 -10 c -20 20 -60 22 -92 8 c -10 -4 -18 -12 -20 -20 c -2 -8 3 -15 15 -9 z"
          fill="#ffffff"
          opacity="0.9"
        />

        {/* Small bubbles */}
        <circle cx="95" cy="130" r="3" fill="#ffffff" opacity="0.6" />
        <circle cx="90" cy="140" r="2" fill="#ffffff" opacity="0.5" />
        <circle cx="100" cy="145" r="1.8" fill="#ffffff" opacity="0.5" />

        {/* Minimal clouds */}
        <g fill="#ffffff" opacity="0.5">
          <ellipse cx="60" cy="40" rx="20" ry="8" />
          <ellipse cx="85" cy="42" rx="12" ry="6" />
          <ellipse cx="300" cy="36" rx="18" ry="7" />
          <ellipse cx="320" cy="38" rx="10" ry="5" />
        </g>
      </svg>
    </div>
  );
};

export default WeatherWhale;


