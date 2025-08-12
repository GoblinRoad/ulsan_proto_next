import React from 'react';
import { Calendar, MapPin, CheckCircle } from 'lucide-react';

interface TouristSpot {
  id: string;
  name: string;
  visited: boolean;
  visitDate?: string;
  image: string;
  coins: number;
}

interface VisitHistoryProps {
  touristSpots: TouristSpot[];
}

const VisitHistory: React.FC<VisitHistoryProps> = ({ touristSpots }) => {
  const visitedSpots = touristSpots
    .filter(spot => spot.visited && spot.visitDate)
    .sort((a, b) => new Date(b.visitDate!).getTime() - new Date(a.visitDate!).getTime());

  if (visitedSpots.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">방문 기록이 없습니다</h3>
        <p className="text-gray-500 text-sm">첫 번째 관광지를 방문해보세요!</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">방문 기록</h3>
      
      <div className="space-y-3">
        {visitedSpots.map((spot, index) => (
          <div 
            key={spot.id}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg animate-slideUp"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div 
              className="w-12 h-12 rounded-lg bg-cover bg-center flex-shrink-0"
              style={{ backgroundImage: `url(${spot.image})` }}
            />
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-2 mb-1">
                <h4 className="font-medium text-gray-800 truncate">{spot.name}</h4>
                <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              </div>
              <div className="flex items-center text-xs text-gray-500">
                <Calendar className="w-3 h-3 mr-1" />
                <span>{formatDate(spot.visitDate!)}</span>
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-orange-500 text-sm font-medium">+{spot.coins}</div>
              <div className="text-xs text-gray-500">코인</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VisitHistory;