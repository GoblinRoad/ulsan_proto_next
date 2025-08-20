import React from 'react';
import { User, Award, Coins, MapPin, Star } from 'lucide-react';
import TestModeToggle from "@/components/TestMode/TestModeToggle.tsx";

interface UserStatsProps {
  user: {
    name: string;
    totalCoins: number;
    visitedSpots: number;
    level: number;
  };
}

const UserStats: React.FC<UserStatsProps> = ({ user }) => {
  const stats = [
    { icon: Coins, label: '보유 코인', value: user.totalCoins.toLocaleString(), color: 'from-yellow-400 to-orange-400' },
    { icon: MapPin, label: '방문 완료', value: user.visitedSpots, color: 'from-green-400 to-emerald-400' },
    { icon: Award, label: '레벨', value: user.level, color: 'from-purple-400 to-pink-400' },
    { icon: Star, label: '달성률', value: `${Math.round((user.visitedSpots / 6) * 100)}%`, color: 'from-blue-400 to-cyan-400' }
  ];

  return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 animate-slideUp relative">
        {/* 테스트 모드 토글을 오른쪽 상단에 배치 */}
        <div className="absolute top-4 right-4">
          <TestModeToggle />
        </div>

        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-800">{user.name}</h2>
            <p className="text-gray-600">울산 여행 탐험가</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {stats.map(({ icon: Icon, label, value, color }, index) => (
              <div
                  key={label}
                  className="bg-gray-50 rounded-lg p-4 animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`w-10 h-10 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-3`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-lg font-bold text-gray-800">{value}</p>
              </div>
          ))}
        </div>
      </div>
  );
};

export default UserStats;