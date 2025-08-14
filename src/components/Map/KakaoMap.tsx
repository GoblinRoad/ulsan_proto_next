import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

interface MarkerInfo {
  lat: number;
  lng: number;
  title?: string;
}

interface KakaoMapProps {
  center: { lat: number; lng: number };
  markers: MarkerInfo[];
  path?: { lat: number; lng: number }[]; // 경로 폴리라인
  height?: number;
}

function loadKakaoScript(appKey?: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== 'undefined' && window.kakao && window.kakao.maps) {
      window.kakao.maps.load(() => resolve());
      return;
    }

    // index.html에서 이미 SDK를 직접 로드하는 경우를 고려해, appKey가 없어도 진행

    const scriptId = 'kakao-maps-sdk';
    if (document.getElementById(scriptId)) {
      (window as any).kakao.maps.load(() => resolve());
      return;
    }
    const script = document.createElement('script');
    script.id = scriptId;
    script.async = true;
    script.src = appKey
      ? `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false`
      : `https://dapi.kakao.com/v2/maps/sdk.js?autoload=false`;
    script.onload = () => {
      window.kakao.maps.load(() => resolve());
    };
    script.onerror = () => reject(new Error('Failed to load Kakao Maps script'));
    document.head.appendChild(script);
  });
}

const KakaoMap: React.FC<KakaoMapProps> = ({ center, markers, path, height = 220 }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const appKey = (import.meta.env.REACT_APP_KAKAOMAP_API_KEY || import.meta.env.VITE_KAKAO_MAP_APP_KEY) as string | undefined;
    let map: any;
    let kakaoMarkers: any[] = [];
    let polyline: any | null = null;

    loadKakaoScript(appKey)
      .then(() => {
        if (!containerRef.current) return;
        const kakao = window.kakao;
        const options = {
          center: new kakao.maps.LatLng(center.lat, center.lng),
          level: 6
        };
        map = new kakao.maps.Map(containerRef.current, options);

        kakaoMarkers = markers.map(m => {
          const marker = new kakao.maps.Marker({
            position: new kakao.maps.LatLng(m.lat, m.lng),
            title: m.title || ''
          });
          marker.setMap(map);
          return marker;
        });

        if (markers.length > 1) {
          const bounds = new kakao.maps.LatLngBounds();
          markers.forEach(m => bounds.extend(new kakao.maps.LatLng(m.lat, m.lng)));
          map.setBounds(bounds, 24, 24, 24, 24);
        }

        if (path && path.length > 1) {
          const kakaoPath = path.map(p => new kakao.maps.LatLng(p.lat, p.lng));
          polyline = new kakao.maps.Polyline({
            map,
            path: kakaoPath,
            strokeWeight: 4,
            strokeColor: '#2563eb',
            strokeOpacity: 0.9,
            strokeStyle: 'solid'
          });

          const bounds = new kakao.maps.LatLngBounds();
          kakaoPath.forEach(p => bounds.extend(p));
          map.setBounds(bounds, 24, 24, 24, 24);
        }
      })
      .catch(() => {
        // noop: 상단에서 fallback UI 표시
      });

    return () => {
      kakaoMarkers.forEach(m => m.setMap(null));
      if (polyline) polyline.setMap(null);
      map = null;
    };
  }, [center.lat, center.lng, markers, path]);

  const appKey = (import.meta.env.REACT_APP_KAKAOMAP_API_KEY || import.meta.env.VITE_KAKAO_MAP_APP_KEY) as string | undefined;
  const showFallback = !appKey;

  return (
    <div className="w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50" style={{ height }}>
      {showFallback ? (
        <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
          지도를 불러오려면 REACT_APP_KAKAOMAP_API_KEY 또는 VITE_KAKAO_MAP_APP_KEY를 설정해주세요.
        </div>
      ) : (
        <div ref={containerRef} className="w-full h-full" />
      )}
    </div>
  );
};

export default KakaoMap;


