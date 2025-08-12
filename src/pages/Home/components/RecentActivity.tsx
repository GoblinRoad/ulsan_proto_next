import React from 'react';
import { CheckCircle, Clock } from 'lucide-react';

interface TouristSpot {
  id: string;
  name: string;
  visited: boolean;
  visitDate?: string;
  image: string;
}

interface RecentActivityProps {
  touristSpots: TouristSpot[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ touristSpots }) => {
  const recentVisits = touristSpots
    .filter(spot => spot.visited && spot.visitDate)
    .sort((a, b) => new Date(b.visitDate!).getTime() - new Date(a.visitDate!).getTime())
    .slice(0, 3);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
  };

  if (recentVisits.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-gray-600 mb-2">아직 방문한 곳이 없어요</h3>
        <p className="text-gray-500 text-sm">첫 번째 관광지를 방문해보세요!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-4">최근 활동</h3>
      <div className="space-y-3">
        {recentVisits.map((spot, index) => (
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
              <h4 className="font-medium text-gray-800 truncate">{spot.name}</h4>
              <p className="text-sm text-gray-500">{formatDate(spot.visitDate!)}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;