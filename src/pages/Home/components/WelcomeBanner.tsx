import React from 'react';
import { Sun, CloudSun, Wind } from 'lucide-react';

interface WelcomeBannerProps {
  user: { name: string; level: number };
}

const WelcomeBanner: React.FC<WelcomeBannerProps> = () => {
  const now = new Date();
  const dateLabel = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  // 임시 더미 데이터 (추후 실제 API 연동 시 교체 가능)
  const weather = {
    location: '울산',
    temperature: 26,
    condition: '맑음',
    windKph: 9
  };

  return (
    <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl p-6 text-white animate-bounceIn">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-blue-100 text-sm">{dateLabel}</p>
          <h2 className="text-xl font-bold mt-1">{weather.location} 현재 날씨</h2>
        </div>
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
          <Sun className="w-6 h-6" />
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-extrabold">{weather.temperature}°</span>
            <span className="text-blue-100 text-base">{weather.condition}</span>
          </div>
        </div>
        <div className="flex items-center space-x-2 text-blue-100">
          <CloudSun className="w-4 h-4" />
          <span className="text-sm">체감 {Math.round(weather.temperature - 1)}°</span>
          <span className="text-blue-200">•</span>
          <Wind className="w-4 h-4" />
          <span className="text-sm">풍속 {weather.windKph}km/h</span>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;