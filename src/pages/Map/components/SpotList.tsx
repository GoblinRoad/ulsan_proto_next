import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Coins, CheckCircle, Star, Building, ShoppingBag, Bed, Camera, Zap, TreePine, Utensils, Route, Calendar } from 'lucide-react';
import { TouristSpot } from '../../../types/tourist';

interface SpotListProps {
  spots: TouristSpot[];
}

const SpotList: React.FC<SpotListProps> = ({ spots }) => {
  const getDistrictInfo = (district: string) => {
    switch (district) {
      case 'jung':
        return { name: '중구', color: 'bg-red-500', textColor: 'text-red-600' };
      case 'nam':
        return { name: '남구', color: 'bg-blue-500', textColor: 'text-blue-600' };
      case 'dong':
        return { name: '동구', color: 'bg-yellow-500', textColor: 'text-yellow-600' };
      case 'buk':
        return { name: '북구', color: 'bg-purple-500', textColor: 'text-purple-600' };
      case 'ulju':
        return { name: '울주군', color: 'bg-green-500', textColor: 'text-green-600' };
      default:
        return { name: '기타', color: 'bg-gray-500', textColor: 'text-gray-600' };
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case '문화관광':
        return <Star className="w-4 h-4" />;
      case '자연관광':
        return <TreePine className="w-4 h-4" />;
      case '역사관광':
        return <Building className="w-4 h-4" />;
      case '쇼핑':
        return <ShoppingBag className="w-4 h-4" />;
      case '숙박':
        return <Bed className="w-4 h-4" />;
      case '체험관광':
        return <Camera className="w-4 h-4" />;
      case '레저스포츠':
        return <Zap className="w-4 h-4" />;
      case '음식':
        return <Utensils className="w-4 h-4" />;
      case '추천코스':
        return <Route className="w-4 h-4" />;
      case '축제/공연/행사':
        return <Calendar className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case '문화관광':
        return 'text-blue-600 bg-blue-50';
      case '자연관광':
        return 'text-emerald-600 bg-emerald-50';
      case '역사관광':
        return 'text-violet-600 bg-violet-50';
      case '쇼핑':
        return 'text-emerald-600 bg-emerald-50';
      case '숙박':
        return 'text-amber-600 bg-amber-50';
      case '체험관광':
        return 'text-pink-600 bg-pink-50';
      case '레저스포츠':
        return 'text-red-600 bg-red-50';
      case '음식':
        return 'text-orange-600 bg-orange-50';
      case '추천코스':
        return 'text-violet-600 bg-violet-50';
      case '축제/공연/행사':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  return (
      <div className="px-4 py-4 space-y-4">
        {spots.map((spot, index) => {
          const districtInfo = getDistrictInfo(spot.district);
          const categoryColor = getCategoryColor(spot.category);

          return (
              <Link
                  key={spot.id}
                  to={spot.visited ? '#' : `/checkin?contentId=${spot.id}&contentType=${spot.type}`}
                  className={`block bg-white rounded-xl p-4 shadow-sm border border-gray-100 transition-all animate-slideUp ${
                      spot.visited ? 'opacity-75' : 'hover:shadow-md hover:scale-[1.02]'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex space-x-4">
                  <div
                      className="w-20 h-20 rounded-lg bg-cover bg-center flex-shrink-0 relative bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center"
                      style={{ backgroundImage: spot.image !== '/placeholder-image.jpg' ? `url(${spot.image})` : undefined }}
                  >
                    {spot.image === '/placeholder-image.jpg' && (
                        <div className={`p-2 rounded-lg ${categoryColor}`}>
                          {getCategoryIcon(spot.category)}
                        </div>
                    )}
                    {spot.visited && (
                        <div className="absolute inset-0 bg-green-500/20 rounded-lg flex items-center justify-center">
                          <CheckCircle className="w-8 h-8 text-green-500" />
                        </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{spot.name}</h3>
                      </div>
                      <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-2 py-1 rounded-full flex-shrink-0">
                        <Coins className="w-3 h-3 text-white" />
                        <span className="text-white text-xs font-bold">{spot.coins}</span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 mb-2">
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 ${districtInfo.color} rounded-full flex-shrink-0`}></div>
                        <span className={`text-xs font-medium ${districtInfo.textColor}`}>
                      {districtInfo.name}
                    </span>
                      </div>
                      <div className={`flex items-center space-x-1 px-2 py-0.5 rounded-full ${categoryColor}`}>
                        {getCategoryIcon(spot.category)}
                        <span className="text-xs font-medium">
                      {spot.category}
                    </span>
                      </div>
                    </div>

                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">{spot.description}</p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        <span className="truncate">{spot.address}</span>
                      </div>
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
          );
        })}

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