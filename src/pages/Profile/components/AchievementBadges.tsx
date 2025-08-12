import React from 'react';
import { Award, Star, Target, Zap } from 'lucide-react';

interface AchievementBadgesProps {
  badges: string[];
  visitedSpots: number;
}

const AchievementBadges: React.FC<AchievementBadgesProps> = ({ badges, visitedSpots }) => {
  const achievements = [
    {
      id: 'first-visit',
      name: '첫 발걸음',
      description: '첫 관광지 방문',
      icon: Star,
      unlocked: visitedSpots >= 1,
      color: 'from-yellow-400 to-orange-400'
    },
    {
      id: 'explorer',
      name: '탐험가',
      description: '3곳 이상 방문',
      icon: Target,
      unlocked: visitedSpots >= 3,
      color: 'from-blue-400 to-cyan-400'
    },
    {
      id: 'master',
      name: '여행 마스터',
      description: '모든 관광지 방문',
      icon: Award,
      unlocked: visitedSpots >= 6,
      color: 'from-purple-400 to-pink-400'
    },
    {
      id: 'speedster',
      name: '스피드러너',
      description: '하루에 3곳 방문',
      icon: Zap,
      unlocked: false,
      color: 'from-green-400 to-emerald-400'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">성취 배지</h3>
      
      <div className="grid grid-cols-2 gap-3">
        {achievements.map(({ id, name, description, icon: Icon, unlocked, color }, index) => (
          <div
            key={id}
            className={`p-4 rounded-lg border-2 transition-all animate-slideUp ${
              unlocked 
                ? 'border-transparent bg-gradient-to-r ' + color + ' text-white' 
                : 'border-gray-200 bg-gray-50'
            }`}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="text-center">
              <div className={`w-12 h-12 mx-auto mb-3 rounded-full flex items-center justify-center ${
                unlocked ? 'bg-white/20' : 'bg-gray-200'
              }`}>
                <Icon className={`w-6 h-6 ${unlocked ? 'text-white' : 'text-gray-400'}`} />
              </div>
              <h4 className={`font-semibold text-sm mb-1 ${unlocked ? 'text-white' : 'text-gray-800'}`}>
                {name}
              </h4>
              <p className={`text-xs ${unlocked ? 'text-white/80' : 'text-gray-500'}`}>
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementBadges;