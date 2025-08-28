import React, { useEffect, useRef, useState } from 'react';
import { Navigation, AlertCircle, MapPin } from 'lucide-react';
import useKakaoMap from '../../hooks/useKakaoMap';
import { TouristSpot } from '../../types/tourist';
import { createCustomMarker } from '../../utils/markerUtils';
import MapLegend from './MapLegend';

interface MapViewProps {
  spots: (TouristSpot & { distance?: number })[];
  centerLocation?: { lat: number; lng: number };
  showCurrentLocation?: boolean;
  onMarkerClick?: (spot: TouristSpot & { distance?: number }) => void;
  selectedSpot?: (TouristSpot & { distance?: number }) | null;
}

const MapView: React.FC<MapViewProps> = ({
                                           spots,
                                           centerLocation,
                                           showCurrentLocation = false,
                                           onMarkerClick,
                                           selectedSpot
                                         }) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const markers = useRef<any[]>([]);
  const currentLocationMarker = useRef<any>(null);
  const prevSpotsRef = useRef<string>('');
  const { isLoaded, error } = useKakaoMap();
  const [isMapInitialized, setIsMapInitialized] = useState(false);
  const [containerHeight, setContainerHeight] = useState('400px');

  const ulsanCenter = {
    lat: 35.5384,
    lng: 129.3114
  };

  useEffect(() => {
    const calculateHeight = () => {
      const vh = window.innerHeight;

      let usedHeight = 80;

      usedHeight += 180;

      usedHeight += 200;

      const calculatedHeight = vh - usedHeight;
      const minHeight = 250;
      const maxHeight = 400;
      const finalHeight = Math.max(Math.min(calculatedHeight, maxHeight), minHeight);

      setContainerHeight(`${finalHeight}px`);
    };

    calculateHeight();
    const timer = setTimeout(calculateHeight, 100);
    window.addEventListener('resize', calculateHeight);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateHeight);
    };
  }, []);

  useEffect(() => {
    if (!isLoaded || !mapContainer.current || isMapInitialized) return;

    try {
      const center = centerLocation || ulsanCenter;
      const options = {
        center: new window.kakao.maps.LatLng(center.lat, center.lng),
        level: 6
      };

      map.current = new window.kakao.maps.Map(mapContainer.current, options);
      setIsMapInitialized(true);

      const mapTypeControl = new window.kakao.maps.MapTypeControl();
      map.current.addControl(mapTypeControl, window.kakao.maps.ControlPosition.TOPRIGHT);

      const zoomControl = new window.kakao.maps.ZoomControl();
      map.current.addControl(zoomControl, window.kakao.maps.ControlPosition.RIGHT);





    } catch (err) {
      console.error('카카오맵 초기화 오류:', err);
    }
  }, [isLoaded, isMapInitialized, centerLocation]);

  const moveToCurrentLocation = () => {
    if (centerLocation && map.current) {
      const center = new window.kakao.maps.LatLng(centerLocation.lat, centerLocation.lng);
      map.current.setCenter(center);
    }
  };

  useEffect(() => {
    if (!isMapInitialized || !map.current) return;

    markers.current.forEach(marker => marker.setMap(null));
    markers.current = [];

    spots.forEach((spot) => {
      const markerPosition = new window.kakao.maps.LatLng(spot.coordinates.lat, spot.coordinates.lng);

      const isSelected = selectedSpot?.id === spot.id;
      const markerImageSrc = createCustomMarker(spot.category, spot.visited, isSelected);
      const imageSize = new window.kakao.maps.Size(isSelected ? 38 : 32, isSelected ? 50 : 42);
      const imageOption = {
        offset: new window.kakao.maps.Point(
            isSelected ? 19 : 16,
            isSelected ? 50 : 42
        )
      };
      const markerImage = new window.kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOption);

      const marker = new window.kakao.maps.Marker({
        position: markerPosition,
        title: spot.name,
        image: markerImage,
        zIndex: isSelected ? 999 : 1
      });

      marker.setMap(map.current);
      markers.current.push(marker);

      window.kakao.maps.event.addListener(marker, 'click', () => {
        if (onMarkerClick) {
          onMarkerClick(spot);
        }
      });
    });


    const currentSpotIds = spots.map(s => s.id).sort().join(',');

    if (spots.length > 0 && !selectedSpot && currentSpotIds !== prevSpotsRef.current) {
      const bounds = new window.kakao.maps.LatLngBounds();

      if (centerLocation && showCurrentLocation) {
        bounds.extend(new window.kakao.maps.LatLng(centerLocation.lat, centerLocation.lng));
      }

      spots.forEach(spot => {
        bounds.extend(new window.kakao.maps.LatLng(spot.coordinates.lat, spot.coordinates.lng));
      });

      map.current.setBounds(bounds);

      setTimeout(() => {
        const level = map.current.getLevel();
        if (level < 3) {
          map.current.setLevel(3);
        }
      }, 100);

      prevSpotsRef.current = currentSpotIds;
    } else if (spots.length === 0 && centerLocation) {
      const center = new window.kakao.maps.LatLng(centerLocation.lat, centerLocation.lng);
      map.current.setCenter(center);
      map.current.setLevel(6);
      prevSpotsRef.current = '';
    }

  }, [spots, isMapInitialized, centerLocation, onMarkerClick, selectedSpot]);

  useEffect(() => {
    if (!isMapInitialized || !map.current || !showCurrentLocation || !centerLocation) return;

    if (currentLocationMarker.current) {
      currentLocationMarker.current.setMap(null);
    }

    const currentPosition = new window.kakao.maps.LatLng(centerLocation.lat, centerLocation.lng);

    const currentLocationSvg = `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="1" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
        </defs>
        <circle cx="12" cy="12" r="10" fill="#10B981" opacity="0.3"/>
        <circle cx="12" cy="12" r="8" fill="#10B981" stroke="#ffffff" stroke-width="3" filter="url(#shadow)"/>
        <circle cx="12" cy="12" r="4" fill="#ffffff"/>
        <circle cx="12" cy="12" r="2" fill="#10B981"/>
      </svg>
    `.trim();

    const currentLocationImageSrc = 'data:image/svg+xml,' + encodeURIComponent(currentLocationSvg);

    const currentLocationImageSize = new window.kakao.maps.Size(24, 24);
    const currentLocationImageOption = { offset: new window.kakao.maps.Point(12, 12) };
    const currentLocationMarkerImage = new window.kakao.maps.MarkerImage(
        currentLocationImageSrc,
        currentLocationImageSize,
        currentLocationImageOption
    );

    currentLocationMarker.current = new window.kakao.maps.Marker({
      position: currentPosition,
      title: '현재 위치',
      image: currentLocationMarkerImage,
      zIndex: 1000
    });

    currentLocationMarker.current.setMap(map.current);

  }, [isMapInitialized, showCurrentLocation, centerLocation]);

  useEffect(() => {
    return () => {
      markers.current.forEach(marker => {
        window.kakao.maps.event.removeListener(marker, 'click');
      });
    };
  }, []);

  if (error) {
    return (
        <div style={{ height: containerHeight }} className="bg-red-50 flex items-center justify-center">
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
        <div style={{ height: containerHeight }} className="bg-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Navigation className="w-16 h-16 text-blue-400 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">카카오맵 로딩 중...</h3>
            <p className="text-gray-500 text-sm">잠시만 기다려주세요</p>
          </div>
        </div>
    );
  }

  return (
      <div className="relative overflow-hidden" style={{ height: containerHeight }}>
        <div ref={mapContainer} className="w-full h-full" />

        {/* 새로운 범례 컴포넌트 */}
        <MapLegend className="absolute bottom-6 left-4" />

        {showCurrentLocation && centerLocation && (
            <button
                onClick={moveToCurrentLocation}
                className="absolute bottom-6 right-4 bg-white rounded-lg p-3 shadow-lg hover:bg-gray-50 transition-colors z-10"
                title="현재 위치로 이동"
            >
              <MapPin className="w-5 h-5 text-emerald-500" />
            </button>
        )}

        <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
          <span className="text-sm font-semibold text-gray-700">
            관광지 {spots.length}개
          </span>
        </div>
      </div>
  );
};

export default MapView;