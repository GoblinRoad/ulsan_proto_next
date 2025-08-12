import React from 'react';
import { Sparkles } from 'lucide-react';

interface User {
  name: string;
  level: number;
}

interface WelcomeBannerProps {
  user: User;
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ user }) => {
  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return '좋은 아침이에요';
    if (hour < 18) return '좋은 오후예요';
    return '좋은 저녁이에요';
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white animate-bounceIn">
      <div className="flex items-center justify-between mb-3">
        <div>
          <p className="text-blue-100 text-sm mb-1">{getTimeGreeting()}</p>
          <h2 className="text-xl font-bold">{user.name}님!</h2>
        </div>
        <div className="flex items-center space-x-1 bg-white/20 px-3 py-1 rounded-full">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Lv.{user.level}</span>
        </div>
      </div>
      <p className="text-blue-100 text-sm leading-relaxed">
        오늘도 울산의 숨은 매력을 발견해보세요!<br />
        새로운 관광지를 방문하고 코인을 모아보아요 🐋
      </p>
    </div>
  );
};

export default WelcomeBanner;