import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface TouristSpot {
  id: string;
  name: string;
  category: 'famous' | 'hidden';
  coordinates: { lat: number; lng: number };
  visited: boolean;
}

interface MapViewProps {
  spots: TouristSpot[];
}

const MapView: React.FC<MapViewProps> = ({ spots }) => {
  return (
    <div className="relative h-[calc(100vh-200px)] bg-blue-50">
      {/* 지도 배경 (실제 구현시에는 Google Maps나 Naver Maps API 사용) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
        <div className="text-center">
          <Navigation className="w-16 h-16 text-blue-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">지도 로딩 중...</h3>
          <p className="text-gray-500 text-sm">실제 서비스에서는 지도 API가 표시됩니다</p>
        </div>
      </div>
      
      {/* 관광지 마커들 시뮬레이션 */}
      {spots.map((spot, index) => (
        <div
          key={spot.id}
          className={`absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounceIn`}
          style={{
            left: `${20 + (index % 3) * 30}%`,
            top: `${30 + Math.floor(index / 3) * 25}%`,
            animationDelay: `${index * 0.2}s`
          }}
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg cursor-pointer hover:scale-110 transition-transform ${
            spot.visited ? 'bg-green-500' : 
            spot.category === 'famous' ? 'bg-blue-500' : 'bg-purple-500'
          }`}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
          <div className="absolute top-10 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs whitespace-nowrap">
            {spot.name}
          </div>
        </div>
      ))}

      {/* 범례 */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg">
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">유명지</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">숨은명소</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">방문완료</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapView;