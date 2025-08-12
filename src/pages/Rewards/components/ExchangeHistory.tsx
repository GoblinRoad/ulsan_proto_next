import React from 'react';
import { Calendar, Gift } from 'lucide-react';

const ExchangeHistory: React.FC = () => {
  const history = [
    {
      id: '1',
      title: '울산사랑상품권 5,000원권',
      date: '2024-12-10',
      status: '사용완료',
      coins: 500
    },
    {
      id: '2',
      title: '카페 아메리카노 1잔',
      date: '2024-12-08',
      status: '사용가능',
      coins: 200
    }
  ];

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-sm border border-gray-100">
        <Gift className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">교환 내역이 없습니다</h3>
        <p className="text-gray-500 text-sm">코인을 모아서 상품권을 교환해보세요!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {history.map((item, index) => (
        <div 
          key={item.id} 
          className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm animate-slideUp"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-medium text-gray-800">{item.title}</h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              item.status === '사용완료' ? 'bg-gray-100 text-gray-600' : 'bg-green-100 text-green-600'
            }`}>
              {item.status}
            </span>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>{item.date}</span>
            </div>
            <div className="text-orange-500 font-medium">
              {item.coins} 코인 사용
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ExchangeHistory;