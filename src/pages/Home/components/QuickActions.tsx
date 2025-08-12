import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Camera, Gift, Compass } from 'lucide-react';

const QuickActions: React.FC = () => {
  const actions = [
    {
      icon: MapPin,
      label: '근처 관광지',
      path: '/map',
      color: 'from-blue-400 to-cyan-400'
    },
    {
      icon: Camera,
      label: '체크인',
      path: '/map',
      color: 'from-green-400 to-emerald-400'
    },
    {
      icon: Gift,
      label: '리워드',
      path: '/rewards',
      color: 'from-yellow-400 to-orange-400'
    },
    {
      icon: Compass,
      label: '추천 코스',
      path: '/',
      color: 'from-purple-400 to-pink-400'
    }
  ];

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">빠른 실행</h3>
      <div className="grid grid-cols-4 gap-3">
        {actions.map(({ icon: Icon, label, path, color }, index) => (
          <Link
            key={label}
            to={path}
            className="flex flex-col items-center p-3 rounded-lg hover:bg-gray-50 transition-colors animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className={`w-12 h-12 bg-gradient-to-r ${color} rounded-lg flex items-center justify-center mb-2`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <span className="text-xs text-gray-600 text-center font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;