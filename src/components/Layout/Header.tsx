import React from 'react';
import { Coins } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';
import whaleToUlsanLogo from '../../assets/logo/whaleToUlsan_logo.png';

const Header: React.FC = () => {
  const { state } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
      <div className="max-w-md mx-auto px-4 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img 
              src={whaleToUlsanLogo} 
              alt="웨일투울산" 
              className="w-16 h-16 object-contain -my-2"
            />
            <div>
              <h1 className="text-lg font-bold text-gray-800">웨일투울산</h1>
              <p className="text-xs text-gray-500">추억을 남기고, 가치를 더하다</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-white font-bold text-sm">{state.user.totalCoins}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;