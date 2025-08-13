import React from 'react';
import { Coins, Bell } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const Header: React.FC = () => {
  const { state } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">울</span>
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-800">울산 코인투어</h1>
              <p className="text-xs text-gray-500">숨은 매력을 찾아서</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">{state.user.totalCoins}</span>
            </div>
            <button className="p-2 text-gray-600 hover:text-blue-500 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;