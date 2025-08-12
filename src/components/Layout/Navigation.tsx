import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, MapPin, Gift, User } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: '홈' },
    { path: '/map', icon: MapPin, label: '지도' },
    { path: '/rewards', icon: Gift, label: '리워드' },
    { path: '/profile', icon: User, label: '내 정보' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-blue-100 shadow-lg">
      <div className="max-w-md mx-auto px-4">
        <div className="flex items-center justify-around py-2">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path;
            return (
              <Link
                key={path}
                to={path}
                className={`flex flex-col items-center py-2 px-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'text-blue-500 bg-blue-50 scale-105'
                    : 'text-gray-600 hover:text-blue-400 hover:bg-blue-25'
                }`}
              >
                <Icon className={`w-5 h-5 mb-1 ${isActive ? 'text-blue-500' : ''}`} />
                <span className={`text-xs font-medium ${isActive ? 'text-blue-500' : ''}`}>
                  {label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;