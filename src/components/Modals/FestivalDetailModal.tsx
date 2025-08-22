import React, { useState, useEffect } from 'react';
import { X, Calendar, MapPin, Phone, Loader2 } from 'lucide-react';
import KakaoMap from '../Map/KakaoMap';
import { getFestivalsWithCache } from '../../services/festivalService';

interface FestivalDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  festivalId: string;
}

interface FestivalDetail {
  contentId: string;
  title: string;
  addr1: string;
  addr2?: string;
  tel?: string;
  firstimage?: string;
  firstimage2?: string;
  eventstartdate: string;
  eventenddate: string;
  mapx: string;
  mapy: string;
  overview?: string;
}

const FestivalDetailModal: React.FC<FestivalDetailModalProps> = ({
  isOpen,
  onClose,
  festivalId
}) => {
  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'map'>('info');

  useEffect(() => {
    if (isOpen && festivalId) {
      loadFestivalDetail();
    }
  }, [isOpen, festivalId]);

  const loadFestivalDetail = async () => {
    setLoading(true);
    try {
      const serviceKey = import.meta.env.VITE_TOURAPI_KEY;
      
      if (!serviceKey) {
        throw new Error('Tour API 키가 설정되지 않았습니다.');
      }

              // 축제 기본 정보는 searchFestival2에서 가져오기
        const festivalList = await getFestivalsWithCache();
        const currentFestival = festivalList.find(f => f.contentId === festivalId);
        
        if (currentFestival) {
          setFestival({
            contentId: currentFestival.contentId,
            title: currentFestival.title,
            addr1: currentFestival.addr1,
            addr2: currentFestival.addr2,
            tel: currentFestival.tel,
            firstimage: currentFestival.firstimage,
            firstimage2: currentFestival.firstimage2,
            eventstartdate: currentFestival.eventstartdate,
            eventenddate: currentFestival.eventenddate,
            mapx: currentFestival.mapx,
            mapy: currentFestival.mapy,
            overview: undefined
          });
        }

    } catch (error) {
      console.error('축제 상세정보 로드 실패:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}.${month}.${day}`;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 배경 오버레이 */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* 모달 컨테이너 */}
      <div className="relative bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-hidden shadow-2xl">
        {/* 헤더 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-800">축제/행사 정보</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <Loader2 className="w-8 h-8 text-blue-500 mx-auto mb-4 animate-spin" />
            <p className="text-gray-600">축제 정보를 불러오는 중...</p>
          </div>
        ) : festival ? (
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            {/* 축제 이미지 */}
            <div className="relative h-48 bg-gray-200">
              {festival.firstimage ? (
                <img
                  src={festival.firstimage}
                  alt={festival.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                  <Calendar className="w-12 h-12 text-white" />
                </div>
              )}
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setActiveTab('info')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'info'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                정보
              </button>
              <button
                onClick={() => setActiveTab('map')}
                className={`flex-1 py-3 text-sm font-medium transition-colors ${
                  activeTab === 'map'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                위치
              </button>
            </div>

            {/* 탭 콘텐츠 */}
            <div className="p-4">
              {activeTab === 'info' ? (
                <div className="space-y-4">
                  {/* 축제 제목 */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">
                      {festival.title}
                    </h3>
                  </div>

                                     {/* 축제 정보 */}
                   <div className="space-y-3">
                     {festival.addr1 && (
                       <div className="flex items-start space-x-3">
                         <MapPin className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                         <div>
                           <p className="font-semibold text-lg text-gray-700">주소</p>
                           <p className="text-base text-gray-600">
                             {festival.addr1}
                             {festival.addr2 && ` ${festival.addr2}`}
                           </p>
                         </div>
                       </div>
                     )}

                     <div className="flex items-start space-x-3">
                       <Calendar className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                       <div>
                         <p className="font-semibold text-lg text-gray-700">기간</p>
                         <p className="text-base text-gray-600">
                           {formatDate(festival.eventstartdate)}
                           {festival.eventstartdate !== festival.eventenddate && 
                             ` - ${formatDate(festival.eventenddate)}`
                           }
                         </p>
                       </div>
                     </div>

                     {festival.tel && (
                       <div className="flex items-start space-x-3">
                         <Phone className="w-6 h-6 text-gray-400 mt-0.5 flex-shrink-0" />
                         <div>
                           <p className="font-semibold text-lg text-gray-700">연락처</p>
                           <p className="text-base text-gray-600">{festival.tel}</p>
                         </div>
                       </div>
                     )}
                   </div>

                   {/* 카카오 지도 */}
                   <div className="mt-6">
                     <h4 className="font-semibold text-lg text-gray-700 mb-3">축제 위치</h4>
                     <div className="h-48 rounded-lg overflow-hidden mb-4">
                       <KakaoMap
                         center={{ lat: parseFloat(festival.mapy), lng: parseFloat(festival.mapx) }}
                         markers={[{ lat: parseFloat(festival.mapy), lng: parseFloat(festival.mapx), title: festival.title }]}
                         height={192}
                         showOrder={false}
                       />
                     </div>
                     
                     {/* 카카오 지도 길찾기 버튼 */}
                     <button
                       onClick={() => {
                         const url = `https://map.kakao.com/link/to/${festival.title},${festival.mapy},${festival.mapx}`;
                         window.open(url, '_blank');
                       }}
                       className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                     >
                       <img 
                         src="/kakaotalk_logo_icon.png" 
                         alt="KakaoTalk" 
                         className="w-5 h-5"
                       />
                       <span>카카오맵으로 길찾기</span>
                     </button>
                   </div>

                  {/* 축제 소개 */}
                  {festival.overview && (
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-800 mb-2">축제 소개</h4>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {festival.overview}
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-64 rounded-lg overflow-hidden">
                  <KakaoMap
                    center={{ lat: parseFloat(festival.mapy), lng: parseFloat(festival.mapx) }}
                    markers={[{ lat: parseFloat(festival.mapy), lng: parseFloat(festival.mapx), title: festival.title }]}
                    height={256}
                    showOrder={false}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-600">축제 정보를 찾을 수 없습니다.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default FestivalDetailModal;
