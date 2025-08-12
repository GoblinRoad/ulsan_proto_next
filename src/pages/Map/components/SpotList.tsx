import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Coins, CheckCircle, Star } from 'lucide-react';

interface TouristSpot {
  id: string;
  name: string;
  category: 'famous' | 'hidden';
  description: string;
  address: string;
  coins: number;
  image: string;
  visited: boolean;
}

interface SpotListProps {
  spots: TouristSpot[];
}

const SpotList: React.FC<SpotListProps> = ({ spots }) => {
  return (
    <div className="px-4 py-4 space-y-4">
      {spots.map((spot, index) => (
        <Link
          key={spot.id}
          to={spot.visited ? '#' : `/checkin/${spot.id}`}
          className={`block bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all animate-slideUp ${
            spot.visited ? 'opacity-75' : 'hover:shadow-md hover:scale-[1.02]'
          }`}
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <div className="flex space-x-4">
            <div 
              className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 relative"
              style={{ backgroundImage: `url(${spot.image})` }}
            >
              {spot.visited && (
                <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-gray-800 truncate">{spot.name}</h3>
                  {spot.category === 'famous' ? (
                    <Star className="w-4 h-4 text-yellow-500 flex-shrink-0" />
                  ) : (
                    <div className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></div>
                  )}
                </div>
                <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 rounded-full">
                  <Coins className="w-3 h-3 text-white" />
                  <span className="text-white text-xs font-bold">{spot.coins}</span>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-2">{spot.description}</p>
              
              <div className="flex items-center text-xs text-gray-500">
                <MapPin className="w-3 h-3 mr-1" />
                <span className="truncate">{spot.address}</span>
              </div>
            </div>
          </div>
          
          {spot.visited && (
            <div className="mt-3 pt-3 border-t border-gray-100">
              <div className="flex items-center justify-center text-sm text-green-600 font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                방문 완료
              </div>
            </div>
          )}
        </Link>
      ))}
      
      {spots.length === 0 && (
        <div className="text-center py-12">
          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">해당 조건의 관광지가 없습니다</p>
        </div>
      )}
    </div>
  );
};

export default SpotList;