import React, { useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { popularCourses } from './courses';
import { ArrowLeft, MapPin, Clock } from 'lucide-react';
import KakaoMap from '../../components/Map/KakaoMap';

interface SpotDetail {
  name: string;
  lat: number;
  lng: number;
  image: string;
  description: string;
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

  // 목데이터: 코스 내 각 장소의 좌표/설명/이미지 (데모용)
  const mockSpots: SpotDetail[] = useMemo(() => {
    const base: Record<string, SpotDetail> = {
      '반구대암각화': { name: '반구대암각화', lat: 35.5799, lng: 129.2003, image: 'https://images.pexels.com/photos/240040/pexels-photo-240040.jpeg', description: '국보 제285호로 지정된 선사시대 암각화 유적.' },
      '천전리각석': { name: '천전리각석', lat: 35.5967, lng: 129.0888, image: 'https://images.pexels.com/photos/240040/pexels-photo-240040.jpeg', description: '선사시대부터 삼국시대에 걸친 각석이 남아있는 문화재.' },
      '트레비어': { name: '트레비어', lat: 35.565, lng: 129.123, image: 'https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg', description: '수제 맥주로 유명한 양조장.' },
      '유진목장': { name: '유진목장', lat: 35.561, lng: 129.14, image: 'https://images.pexels.com/photos/158179/cows-cattle-ireland-green-158179.jpeg', description: '가족 나들이에 좋은 체험형 목장.' },
      '언양시장': { name: '언양시장', lat: 35.5656, lng: 129.1283, image: 'https://images.pexels.com/photos/375889/pexels-photo-375889.jpeg', description: '언양불고기로 유명한 전통 시장.' },
      '복순도가': { name: '복순도가', lat: 35.551, lng: 129.151, image: 'https://images.pexels.com/photos/5537971/pexels-photo-5537971.jpeg', description: '막걸리로 유명한 양조장.' },
      '석남사': { name: '석남사', lat: 35.504, lng: 129.061, image: 'https://images.pexels.com/photos/2086748/pexels-photo-2086748.jpeg', description: '신라시대에 창건된 고찰.' },
      '태화강국가정원': { name: '태화강국가정원', lat: 35.5461, lng: 129.3194, image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg', description: '도심 속 대규모 생태정원.' },
      '간절곶': { name: '간절곶', lat: 35.3587, lng: 129.3608, image: 'https://images.pexels.com/photos/2088283/pexels-photo-2088283.jpeg', description: '한반도에서 해가 가장 먼저 뜨는 곳 중 하나.' },
      'Fe01': { name: 'Fe01', lat: 35.53, lng: 129.31, image: 'https://images.pexels.com/photos/460537/pexels-photo-460537.jpeg', description: '현대적인 감성의 카페/공간.' },
      '진하해수욕장(명선도)': { name: '진하해수욕장(명선도)', lat: 35.3808, lng: 129.3524, image: 'https://images.pexels.com/photos/248797/pexels-photo-248797.jpeg', description: '파도와 백사장이 아름다운 해변.' },
      '남창시장': { name: '남창시장', lat: 35.415, lng: 129.288, image: 'https://images.pexels.com/photos/1616403/pexels-photo-1616403.jpeg', description: '로컬 먹거리와 활기가 넘치는 전통시장.' },
      '외고산옹기마을': { name: '외고산옹기마을', lat: 35.4496, lng: 129.2035, image: 'https://images.pexels.com/photos/277565/pexels-photo-277565.jpeg', description: '옹기문화 체험과 전시를 즐길 수 있는 마을.' },
      '대운산 치유의 숲': { name: '대운산 치유의 숲', lat: 35.438, lng: 129.158, image: 'https://images.pexels.com/photos/1671325/pexels-photo-1671325.jpeg', description: '피톤치드 가득한 힐링 숲길.' },
      '장생포고래문화특구': { name: '장생포고래문화특구', lat: 35.495, lng: 129.383, image: 'https://images.pexels.com/photos/112840/pexels-photo-112840.jpeg', description: '고래 문화를 테마로 한 관광지.' },
      '태화루': { name: '태화루', lat: 35.554, lng: 129.307, image: 'https://images.pexels.com/photos/262367/pexels-photo-262367.jpeg', description: '역사와 풍광이 아름다운 누각.' },
      '중구 문화의 거리': { name: '중구 문화의 거리', lat: 35.569, lng: 129.326, image: 'https://images.pexels.com/photos/2187601/pexels-photo-2187601.jpeg', description: '예술과 문화가 숨쉬는 거리.' },
      '울산시립미술관': { name: '울산시립미술관', lat: 35.559, lng: 129.318, image: 'https://images.pexels.com/photos/277757/pexels-photo-277757.jpeg', description: '현대미술 전시 공간.' },
      '울산대교전망대': { name: '울산대교전망대', lat: 35.517, lng: 129.377, image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg', description: '도심과 바다가 내려다보이는 전망대.' },
      '대왕암공원': { name: '대왕암공원', lat: 35.486, lng: 129.434, image: 'https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg', description: '해송 숲과 기암괴석이 어우러진 해안공원.' },
      '출렁다리': { name: '출렁다리', lat: 35.55, lng: 129.28, image: 'https://images.pexels.com/photos/349377/pexels-photo-349377.jpeg', description: '스릴 넘치는 보행 현수교.' },
      '일산해수욕장': { name: '일산해수욕장', lat: 35.496, lng: 129.43, image: 'https://images.pexels.com/photos/533923/pexels-photo-533923.jpeg', description: '시원한 바다와 모래사장이 펼쳐진 해변.' },
      '주전몽돌해변': { name: '주전몽돌해변', lat: 35.558, lng: 129.454, image: 'https://images.pexels.com/photos/356286/pexels-photo-356286.jpeg', description: '몽돌이 깔린 독특한 해변.' },
      '박상진의사생가': { name: '박상진의사생가', lat: 35.620, lng: 129.366, image: 'https://images.pexels.com/photos/221457/pexels-photo-221457.jpeg', description: '독립운동가 박상진 의사의 생가.' },
      '달천철장': { name: '달천철장', lat: 35.620, lng: 129.283, image: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg', description: '삼국시대부터 이어진 제철 유적.' },
      '강동몽돌해변': { name: '강동몽돌해변', lat: 35.607, lng: 129.439, image: 'https://images.pexels.com/photos/356286/pexels-photo-356286.jpeg', description: '몽돌이 매력적인 해변.' },
      '보성학교전시관': { name: '보성학교전시관', lat: 35.555, lng: 129.312, image: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg', description: '근대 교육의 역사 전시.' }
    };
    return (course.items || []).map(name => base[name] || {
      name,
      lat: defaultCenter.lat,
      lng: defaultCenter.lng,
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg',
      description: '설명 준비중입니다.'
    });
  }, [course]);

  const center = useMemo(() => {
    if (!mockSpots.length) return defaultCenter;
    const sum = mockSpots.reduce(
      (acc, s) => ({ lat: acc.lat + s.lat, lng: acc.lng + s.lng }),
      { lat: 0, lng: 0 }
    );
    return { lat: sum.lat / mockSpots.length, lng: sum.lng / mockSpots.length };
  }, [mockSpots]);

  const [expandedIdx, setExpandedIdx] = useState<number | null>(null);

  // 데모: 카카오 내비 다중경유지 응답의 vertexes 형식과 동일하게 폴리라인 경로 목데이터 구성
  // 실제 연동 시, API 응답의 roads[].vertexes를 (x,y)쌍으로 끊어 lat/lng로 변환하여 전달
  const mockPath = useMemo(() => {
    // 간단히 출발지~첫번째~두번째 지점 등 일부만 직선 보간
    if (mockSpots.length < 2) return [] as { lat: number; lng: number }[];
    const pts = mockSpots.slice(0, Math.min(5, mockSpots.length));
    return pts.map(s => ({ lat: s.lat, lng: s.lng }));
  }, [mockSpots]);

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
          markers={mockSpots.map(s => ({ lat: s.lat, lng: s.lng, title: s.name }))}
          path={mockPath}
          height={260}
        />
      </div>

      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{course.duration}</span>
          </div>
          <div className={`w-10 h-10 bg-gradient-to-r ${course.color} rounded-lg flex items-center justify-center`}>
            <MapPin className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="space-y-3">
          {mockSpots.map((spot, idx) => (
            <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
              <button
                className="w-full text-left"
                onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
              >
                <div className="flex items-center">
                  <img src={spot.image} alt={spot.name} className="w-20 h-20 object-cover" />
                  <div className="p-3 flex-1">
                    <p className="font-semibold text-gray-800">{idx + 1}. {spot.name}</p>
                    <p className="text-xs text-gray-500">탭하여 상세 보기</p>
                  </div>
                </div>
              </button>
              {expandedIdx === idx && (
                <div className="p-3 border-t text-sm text-gray-700 bg-gray-50">
                  {spot.description}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PopularCourseDetail;


