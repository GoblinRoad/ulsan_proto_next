import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { popularCourses } from './courses';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import KakaoMap from '../../components/Map/KakaoMap';
import { fetchKakaoDirections, formatDurationHM } from '../../services/kakaoNavi';
import { getCourseSpotsInfoWithCache, CourseSpotInfo } from '../../services/courseSpotService';

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

  const [expandedIndices, setExpandedIndices] = useState<Set<number>>(new Set());
  const [etaText, setEtaText] = useState<string | null>(null);
  const [spotsInfo, setSpotsInfo] = useState<CourseSpotInfo[]>([]);
  const [loading, setLoading] = useState(true);

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

  // 데모: 카카오 내비 다중경유지 응답의 vertexes 형식과 동일하게 폴리라인 경로 목데이터 구성
  // 실제 연동 시, API 응답의 roads[].vertexes를 (x,y)쌍으로 끊어 lat/lng로 변환하여 전달
  const mockPath = useMemo(() => {
    // 모든 지점을 순서대로 연결
    return spots.map(s => ({ lat: s.lat, lng: s.lng }));
  }, [spots]);

  // API 데이터 로드 (비동기 최적화)
  useEffect(() => {
    let isMounted = true;
    
    const loadCourseData = async () => {
      setLoading(true);
      try {
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
        
        const summary = await fetchKakaoDirections({ origin, destination, waypoints, priority: 'TIME', summary: true });
        
        if (isMounted && summary) {
          setEtaText(formatDurationHM(summary.duration));
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
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      <div className="flex items-center space-x-3 pt-2">
        <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100">
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">{course.name}</h2>
      </div>

      <div className="w-full rounded-xl overflow-hidden border border-gray-100 bg-gray-50" style={{ height: 260 }}>
        <div id="kakao-map-container" ref={undefined} />
        <KakaoMap
          center={center}
          markers={spots.map(s => ({ lat: s.lat, lng: s.lng, title: s.name }))}
          path={mockPath}
          height={260}
          showOrder
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{etaText ? `총 최단 이동 시간 (자동차): ${etaText}` : ''}</span>
          </div>
          <div className={`w-10 h-10 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center`}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>



        {loading ? (
          <div className="space-y-3">
            {course.items.map((_, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                <div className="flex items-center p-3">
                  <div className="w-20 h-20 bg-gray-200 animate-pulse rounded" />
                  <div className="p-3 flex-1">
                    <div className="h-4 bg-gray-200 animate-pulse rounded mb-2" />
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-24" />
                  </div>
                </div>
              </div>
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
          <div className="space-y-3">
            {spots.map((spot: SpotDetail, idx: number) => (
              <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  className="w-full text-left"
                  onClick={() => {
                    const newExpandedIndices = new Set(expandedIndices);
                    if (newExpandedIndices.has(idx)) {
                      newExpandedIndices.delete(idx);
                    } else {
                      newExpandedIndices.add(idx);
                    }
                    setExpandedIndices(newExpandedIndices);
                  }}
                >
                  <div className="flex items-center">
                    <img src={spot.image} alt={spot.name} className="w-20 h-20 object-cover" />
                    <div className="p-3 flex-1">
                      <p className="font-semibold text-gray-800">{idx + 1}. {spot.name}</p>
                      <p className="text-xs text-gray-500">탭하여 상세 보기</p>
                    </div>
                  </div>
                </button>
                {expandedIndices.has(idx) && (
                  <div className="p-3 border-t text-sm text-gray-700 bg-gray-50 space-y-2">
                    <p>{spot.description}</p>
                    {spot.address && (
                      <p className="text-gray-600">
                        <span className="font-medium">주소:</span> {spot.address}
                      </p>
                    )}
                    {spot.tel && (
                      <p className="text-gray-600">
                        <span className="font-medium">전화:</span> {spot.tel}
                      </p>
                    )}
                    {spot.useTime && (
                      <p className="text-gray-600">
                        <span className="font-medium">이용시간:</span> {spot.useTime}
                      </p>
                    )}
                    {spot.restDate && (
                      <p className="text-gray-600">
                        <span className="font-medium">휴무일:</span> {spot.restDate}
                      </p>
                    )}
                    {spot.parking && (
                      <p className="text-gray-600">
                        <span className="font-medium">주차:</span> {spot.parking}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PopularCourseDetail;


