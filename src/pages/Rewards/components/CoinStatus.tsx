import React from 'react';
import { Coins, TrendingUp } from 'lucide-react';

interface CoinStatusProps {
  totalCoins: number;
}

const CoinStatus: React.FC<CoinStatusProps> = ({ totalCoins }) => {
  const nextRewardCoins = 1000;
  const progress = Math.min((totalCoins / nextRewardCoins) * 100, 100);

  return (
    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 text-white animate-bounceIn">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-yellow-100 text-sm mb-1">보유 코인</p>
          <div className="flex items-center space-x-2">
            <Coins className="w-8 h-8" />
            <span className="text-3xl font-bold">{totalCoins.toLocaleString()}</span>
          </div>
        </div>
        <div className="text-right">
          <TrendingUp className="w-8 h-8 mb-2 ml-auto" />
          <p className="text-yellow-100 text-sm">Level {Math.floor(totalCoins / 200) + 1}</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm text-yellow-100">
          <span>다음 리워드까지</span>
          <span>{nextRewardCoins - totalCoins} 코인 남음</span>
        </div>
        <div className="w-full bg-yellow-500/30 rounded-full h-2">
          <div 
            className="bg-white rounded-full h-2 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default CoinStatus;