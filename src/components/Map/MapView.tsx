import React, { useEffect, useRef, useState } from 'react';
import { Navigation, AlertCircle } from 'lucide-react';
import useKakaoMap from '../../hooks/useKakaoMap';
import { TouristSpot, CATEGORY_COLORS } from '../../types/tourist';
import { createCustomMarker, getCategoryIcon } from '../../utils/markerUtils';

interface MapViewProps {
  spots: TouristSpot[];
}

const MapView: React.FC<MapViewProps> = ({ spots }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const { isLoaded, error } = useKakaoMap();
  const [isMapInitialized, setIsMapInitialized] = useState(false);

  // 울산 중심 좌표 (울산시청 기준)
  const ulsanCenter = {
    lat: 35.5384,
    lng: 129.3114
  };

  useEffect(() => {
    if (!isLoaded || !mapContainer.current || isMapInitialized) return;

    try {
      // 카카오맵 초기화
      const options = {
        center: new window.kakao.maps.LatLng(ulsanCenter.lat, ulsanCenter.lng),
        level: 7 // 지도 확대 레벨 (울산 전체가 보이도록)
      };

      map.current = new window.kakao.maps.Map(mapContainer.current, options);
      setIsMapInitialized(true);

      // 지도 타입 컨트롤 추가
      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.current.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      // 확대/축소 컨트롤 추가
      const zoomControl = new window.kakao.maps.ZoomControl();
      map.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);

    } catch (err) {
      console.error('카카오맵 초기화 오류:', err);
    }
  }, [isLoaded, isMapInitialized]);

  useEffect(() => {
    if (!isMapInitialized || !map.current) return;

    // 기존 마커 제거
    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    // 새로운 마커 추가
    spots.forEach((spot) => {
      const markerPosition = new window.kakao.maps.LatLng(spot.coordinates.lat, spot.coordinates.lng);

      // 카스텀 마커 이미지 생성
      const markerImageSrc = createCustomMarker(spot.category, spot.visited);
      const imageSize = new window.kakao.maps.Size(32, 42);
      const imageOption = { offset: new window.kakao.maps.Point(16, 42) };
      const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: spot.name,
        image: markerImage
      });

      marker.setMap(map.current);
      markers.current.push(marker);

      // 마커 클릭 이벤트 - 인포윈도우 표시
      const getDistrictName = (district: string) => {
        switch (district) {
          case 'jung': return '중구';
          case 'nam': return '남구';
          case 'dong': return '동구';
          case 'buk': return '북구';
          default: return '기타';
        }
      };

      const getDistrictColor = (district: string) => {
        switch (district) {
          case 'jung': return '#EF4444'; // red-500
          case 'nam': return '#3B82F6'; // blue-500
          case 'dong': return '#EAB308'; // yellow-500
          case 'buk': return '#8B5CF6'; // violet-500
          default: return '#6B7280'; // gray-500
        }
      };

      const categoryColor = CATEGORY_COLORS[spot.category] || '#6B7280';
      const categoryIcon = getCategoryIcon(spot.category);

      const infoWindow = new window.kakao.maps.InfoWindow({
        content: `
          <div style="padding: 12px; min-width: 200px; max-width: 280px; font-family: 'Pretendard', sans-serif;">
            <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 8px;">
              <h4 style="margin: 0; font-size: 15px; font-weight: 700; flex: 1; color: #1F2937;">${spot.name}</h4>
            </div>
            
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 8px;">
              <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 8px; border-radius: 8px; background: ${getDistrictColor(spot.district)}15; color: ${getDistrictColor(spot.district)}; font-weight: 600;">
                📍 ${getDistrictName(spot.district)}
              </span>
              <span style="display: flex; align-items: center; gap: 4px; font-size: 11px; padding: 3px 8px; border-radius: 8px; background: ${categoryColor}; color: ${categoryColor}; font-weight: 600;">
                ${categoryIcon} ${spot.category}
              </span>
            </div>
            
            <p style="margin: 0 0 10px 0; font-size: 13px; color: #4B5563; line-height: 1.4;">${spot.description}</p>
            
            <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #E5E7EB;">
              <div style="display: flex; align-items: center; gap: 4px; background: linear-gradient(135deg, #FCD34D, #F59E0B); color: white; padding: 4px 10px; border-radius: 14px; font-size: 12px; font-weight: 700; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                💰 ${spot.coins} 코인
              </div>
              ${spot.visited ? `
                <div style="display: flex; align-items: center; gap: 4px; color: #059669; font-size: 12px; font-weight: 600;">
                  ✅ 방문 완료
                </div>
              ` : `
                <div style="font-size: 11px; color: #6B7280;">
                  탭하여 체크인
                </div>
              `}
            </div>
          </div>
        `,
        removable: true
      });

      window.kakao.maps.event.addListener(marker, 'click', () => {
        infoWindow.open(map.current, marker);
      });
    });

    // 마커가 모두 보이도록 지도 범위 조정
    if (spots.length > 0) {
      const bounds = new window.kakao.maps.LatLngBounds();
      spots.forEach(spot => {
        bounds.extend(new window.kakao.maps.LatLng(spot.coordinates.lat, spot.coordinates.lng));
      });
      map.current.setBounds(bounds);
    }
  }, [spots, isMapInitialized]);

  if (error) {
    return (
        <div className="h-[calc(100vh-240px)] bg-red-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-600 mb-2">지도 로드 오류</h3>
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        </div>
    );
  }

  if (!isLoaded) {
    return (
        <div className="h-[calc(100vh-240px)] bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">카카오맵 로딩 중...</h3>
            <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
          </div>
        </div>
    );
  }

  return (
      <div className="relative h-[calc(100vh-240px)]">
        {/* 카카오맵 컨테이너 */}
        <div ref={mapContainer} className="w-full h-full" />

        {/* 범례 */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg p-3 shadow-lg max-w-xs">
          <h4 className="text-sm font-semibold mb-2 text-gray-800">카테고리별 색상</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
                <div key={category} className="flex items-center space-x-2">
                  <div
                      className="w-3 h-3 rounded-full border border-gray-200"
                      style={{ backgroundColor: color }}
                  ></div>
                  <span className="text-gray-600 truncate">{category}</span>
                </div>
            ))}
            <div className="flex items-center space-x-2 col-span-2 pt-1 border-t border-gray-200">
              <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span className="text-gray-600">방문완료</span>
            </div>
          </div>
        </div>

        {/* 관광지 개수 표시 */}
        <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
        <span className="text-sm font-semibold text-gray-700">
          관광지 {spots.length}개
        </span>
        </div>
      </div>
  );
};

export default MapView;