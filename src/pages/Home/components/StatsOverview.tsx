import React from 'react';
import { Coins, MapPin, Target, Zap } from 'lucide-react';

interface StatsOverviewProps {
  totalCoins: number;
  visitedSpots: number;
  totalSpots: number;
  currentStreak: number;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({
  totalCoins,
  visitedSpots,
  totalSpots,
  currentStreak
}) => {
  const progress = (visitedSpots / totalSpots) * 100;

  const stats = [
    {
      icon: Coins,
      label: '보유 코인',
      value: totalCoins.toLocaleString(),
      color: 'from-yellow-400 to-orange-400',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: MapPin,
      label: '방문 완료',
      value: `${visitedSpots}/${totalSpots}`,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50'
    },
    {
      icon: Target,
      label: '달성률',
      value: `${Math.round(progress)}%`,
      color: 'from-blue-400 to-cyan-400',
      bgColor: 'bg-blue-50'
    },
    {
      icon: Zap,
      label: '연속 방문',
      value: `${currentStreak}일`,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50'
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