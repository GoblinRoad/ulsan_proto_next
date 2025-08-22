import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { popularCourses } from './courses';
import { ArrowLeft, MapPin, Clock, Loader2, X, Phone, Ban, Car } from 'lucide-react';
import kakaoLogo from '../../assets/images/kakaotalk_logo_icon.png';
import KakaoMap from '../../components/Map/KakaoMap';
import { fetchKakaoDirections, fetchKakaoCarDirections, formatDurationHM } from '../../services/kakaoNavi';
import { getCourseSpotsInfoWithCache, CourseSpotInfo } from '../../services/courseSpotService';

// HTML 태그를 파싱하여 줄바꿈으로 변환하는 함수
const parseHtmlText = (text: string): string => {
  if (!text) return '';
  return text
    .replace(/<br\s*\/?>/gi, '\n')  // <br> 태그를 줄바꿈으로 변환
    .replace(/<[^>]*>/g, '')       // 다른 HTML 태그 제거
    .trim();
};

interface SpotDetail {
  name: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
  address?: string;
  tel?: string;
  useTime?: string;
  restDate?: string;
  parking?: string;
}

const PopularCourseDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const courseId = Number(id);
  const course = popularCourses.find(c => c.id === courseId);

  if (!course) {
    return (
      <div className="max-w-md mx-auto px-4 py-10">
        <p className="text-gray-600">요청하신 코스를 찾을 수 없습니다.</p>
      </div>
    );
  }

  const defaultCenter = { lat: 35.538, lng: 129.311 }; // 울산 시청 근방 대략 좌표

  const [etaText, setEtaText] = useState<string | null>(null);
  const [spotsInfo, setSpotsInfo] = useState<CourseSpotInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [accuratePath, setAccuratePath] = useState<{ lat: number; lng: number }[]>([]);



  // 카카오맵으로 길찾기 이동하는 함수
  const openKakaoMapNavigation = (lat: number, lng: number, name: string) => {
    // 사용자 현재 위치 가져오기
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;
          const url = `http://m.map.kakao.com/scheme/route?sp=${userLat},${userLng}&ep=${lat},${lng}&by=car`;
          window.open(url, '_blank');
        },
        (error) => {
          console.error('위치 정보를 가져올 수 없습니다:', error);
          // 위치 정보를 가져올 수 없으면 울산 시청을 출발지로 사용
          const fallbackUrl = `http://m.map.kakao.com/scheme/route?sp=35.538,129.311&ep=${lat},${lng}&by=car`;
          window.open(fallbackUrl, '_blank');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5분
        }
      );
    } else {
      // Geolocation을 지원하지 않는 경우 울산 시청을 출발지로 사용
      const fallbackUrl = `http://m.map.kakao.com/scheme/route?sp=35.538,129.311&ep=${lat},${lng}&by=car`;
      window.open(fallbackUrl, '_blank');
    }
  };

  // 실제 API 데이터를 사용하는 spots
  const spots: SpotDetail[] = useMemo(() => {
    return spotsInfo.map(spot => ({
      name: spot.name,
      lat: spot.lat,
      lng: spot.lng,
      image: spot.image,
      description: spot.description,
      address: spot.address,
      tel: spot.tel,
      useTime: spot.useTime,
      restDate: spot.restDate,
      parking: spot.parking
    }));
  }, [spotsInfo]);

  const center = useMemo(() => {
    if (!spots.length) return defaultCenter;
    const sum = spots.reduce(
      (acc: { lat: number; lng: number }, s: SpotDetail) => ({ lat: acc.lat + s.lat, lng: acc.lng + s.lng }),
      { lat: 0, lng: 0 }
    );
    return { lat: sum.lat / spots.length, lng: sum.lng / spots.length };
  }, [spots]);

  // 정확한 경로만 사용 (자동차 길찾기 API 결과가 있을 때만)
  const path = useMemo(() => {
    return accuratePath.length > 0 ? accuratePath : [];
  }, [accuratePath]);

  // API 데이터 로드 (상세 페이지에서는 전체 코스 정보 로딩)
  useEffect(() => {
    let isMounted = true;
    
    const loadCourseData = async () => {
      setLoading(true);
      try {
        // 상세 페이지에서는 전체 코스의 관광지 정보를 가져옴
        const courseSpotsInfo = await getCourseSpotsInfoWithCache(course.name);
        if (isMounted) {
          setSpotsInfo(courseSpotsInfo);
        }
      } catch (error) {
        console.error('코스 데이터 로드 실패:', error);
        if (isMounted) {
          // 에러 시 기본 데이터로 fallback
          setSpotsInfo([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCourseData();

    return () => {
      isMounted = false;
    };
  }, [course.name]);

  useEffect(() => {
    let isMounted = true;
    
    const calculateRoute = async () => {
      if (spots.length < 2) return;
      
      try {
        const origin = { x: spots[0].lng, y: spots[0].lat, name: spots[0].name };
        const destination = { x: spots[spots.length - 1].lng, y: spots[spots.length - 1].lat, name: spots[spots.length - 1].name };
        const waypoints = spots.slice(1, -1).map(s => ({ x: s.lng, y: s.lat, name: s.name }));
        
        // 자동차 길찾기 API 사용
        const directionsData = await fetchKakaoCarDirections(origin, destination, waypoints);
        
        if (isMounted && directionsData) {
          const summary = directionsData.routes[0].summary;
          setEtaText(formatDurationHM(summary.duration));
          
          // 정확한 경로 정보를 path state에 저장
          const accuratePath: { lat: number; lng: number }[] = [];
          
          if (directionsData.routes[0].sections) {
            directionsData.routes[0].sections.forEach(section => {
              section.roads.forEach(road => {
                // vertexes 배열을 lat, lng 쌍으로 변환
                for (let i = 0; i < road.vertexes.length; i += 2) {
                  accuratePath.push({
                    lng: road.vertexes[i],
                    lat: road.vertexes[i + 1]
                  });
                }
              });
            });
          }
          
          // 정확한 경로로 업데이트
          setAccuratePath(accuratePath);
        }
      } catch (error) {
        console.error('경로 계산 실패:', error);
      }
    };

    // 약간의 지연을 두어 spots 데이터가 안정화된 후 계산
    const timeoutId = setTimeout(calculateRoute, 100);

    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
    };
  }, [spots]);

  return (
    <>
      <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
        <div className="flex items-center space-x-3 pt-2">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </button>
          {loading ? (
            <div className="flex-1">
              <div className="h-6 bg-gray-200 animate-pulse rounded mb-2 w-48"></div>
              <div className="h-4 bg-gray-200 animate-pulse rounded w-32"></div>
            </div>
          ) : (
            <div>
              <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
              <p className="text-sm text-gray-600 mt-1">{course.description}</p>
            </div>
          )}
        </div>

        {/* 코스 소개 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          {loading ? (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="h-4 bg-gray-200 animate-pulse rounded mb-2 w-24"></div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-3 bg-gray-200 animate-pulse rounded w-3/4"></div>
              </div>
            </div>
          ) : (
            <div>
              <h3 className="font-semibold text-gray-800 mb-3">코스 소개</h3>
              <p className="text-sm text-gray-700 leading-relaxed">{course.detailedDescription}</p>
            </div>
          )}
        </div>

        {/* 관광지 목록 */}
        {loading ? (
          <div className="space-y-3">
            {course.items.map((_, idx) => (
              <div key={idx} className="w-full h-48 bg-gray-200 animate-pulse rounded-xl" />
            ))}
            <div className="text-center py-4 text-sm text-gray-500">
              관광지 정보를 불러오는 중...
            </div>
          </div>
        ) : spots.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>관광지 정보를 불러올 수 없습니다.</p>
            <p className="text-sm mt-2">잠시 후 다시 시도해주세요.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {spots.map((spot: SpotDetail, idx: number) => (
              <button
                key={idx}
                className="w-full text-left group"
                onClick={() => navigate(`/spot/${course.name}/${idx}`)}
              >
                <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  <img 
                    src={spot.image} 
                    alt={spot.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 오버레이 그라데이션 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* 관광지 정보 오버레이 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-white/90 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-gray-800">{idx + 1}</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg">{spot.name}</h3>
                        <p className="text-white/80 text-sm">탭하여 상세 보기</p>
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* 지도 섹션 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-bold text-gray-800">코스 전체보기</h3>
              {etaText && (
                <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span>{etaText}</span>
                </div>
              )}
            </div>
          </div>

          {loading ? (
            <div className="w-full rounded-xl border border-gray-100 bg-gray-50" style={{ height: 260 }}>
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">지도 로딩 중...</h3>
                  <p className="text-gray-500 text-sm">경로 정보를 가져오고 있습니다</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50" style={{ height: 260 }}>
              <div id="kakao-map-container" ref={undefined} />
              <KakaoMap
                center={center}
                markers={spots.map(s => ({ lat: s.lat, lng: s.lng, title: s.name }))}
                path={path}
                height={260}
                showOrder
              />
            </div>
          )}
        </div>
      </div>


    </>
  );
};

export default PopularCourseDetail;


