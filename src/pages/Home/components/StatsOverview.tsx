import React from 'react';
import { MapPin, Target } from 'lucide-react';

interface StatsOverviewProps {
  visitedSpots: number;
  totalSpots: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  visitedSpots,
  totalSpots
}) => {
  const progress = (visitedSpots / totalSpots) * 100;

  const stats = [
    {
      icon: MapPin,
      label: '방문 완료',
      value: `${visitedSpots}`,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      label: '달성률',
      value: `${Math.round(progress)}%`,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-sky-100'
    }
  ];

  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map(({ icon: Icon, label, value, color, bgColor }, index) => (
        <div
          key={label}
          className={`${bgColor} rounded-xl p-4 border border-gray-100 animate-slideUp`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center space-x-3 mb-2">
            <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
          </div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-xl font-bold text-gray-800">{value}</p>
        </div>
      ))}
    </div>
  );
};

export default StatsOverview;