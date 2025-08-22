import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Phone, Loader2, Navigation, Clock, Coins } from 'lucide-react';
import KakaoMap from '../../components/Map/KakaoMap';
import ImageCarousel from '../../components/Carousel/ImageCarousel';
import CopyButton from '../../components/Buttons/CopyButton';
import { getCourseSpotsInfoWithCache, getSpotImages, CourseSpotInfo, SpotImage } from '../../services/courseSpotService';

const SpotDetail: React.FC = () => {
  const { courseName, spotIndex } = useParams<{ courseName: string; spotIndex: string }>();
  const navigate = useNavigate();
  const [spot, setSpot] = useState<CourseSpotInfo | null>(null);
  const [spotImages, setSpotImages] = useState<SpotImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      setScrollPosition(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadSpotDetail = async () => {
      if (!courseName || !spotIndex) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // 코스의 모든 관광지 정보 가져오기
        const spots = await getCourseSpotsInfoWithCache(courseName);
        const index = parseInt(spotIndex);
        
        if (index >= 0 && index < spots.length) {
          const selectedSpot = spots[index];
          setSpot(selectedSpot);
          
          // 이미지 가져오기를 비동기로 실행 (로딩 상태에 영향 주지 않음)
          getSpotImages(selectedSpot.contentId)
            .then(images => {
              setSpotImages(images);
              // 이미지 프리로딩
              images.forEach(image => {
                const img = new Image();
                img.src = image.originimgurl;
              });
            })
            .catch(error => {
              console.error('이미지 로드 실패:', error);
              // 이미지 로드 실패해도 기본 이미지 사용
            });
        }
      } catch (error) {
        console.error('관광지 상세정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSpotDetail();
  }, [courseName, spotIndex]);

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const year = dateString.substring(0, 4);
    const month = dateString.substring(4, 6);
    const day = dateString.substring(6, 8);
    return `${year}.${month}.${day}`;
  };

  const formatContent = (content: string) => {
    if (!content) return '';
    return content.replace(/<br\s*\/?>/gi, '\n');
  };

  const formatContentWithLineBreaks = (content: string) => {
    if (!content) return '';
    return content.replace(/<br\s*\/?>/gi, '\n');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-gray-600 mx-auto mb-4" />
          <p className="text-gray-600">관광지 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!spot) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">관광지 정보를 찾을 수 없습니다.</p>
          <button
            onClick={() => navigate(-1)}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 뒤로가기 버튼 */}
      <div className="fixed top-4 left-4 z-50">
        <button
          onClick={() => navigate(-1)}
          className="bg-black/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 첫 번째 섹션 - 배경 이미지와 제목 */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)}
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${spot.image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* 관광지 소개 콘텐츠 */}
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {spot.name}
          </h1>
          
          <div className="space-y-4 mb-8">
            {spot.address && (
              <div className="flex items-center justify-center space-x-2 text-lg">
                <MapPin className="w-5 h-5" />
                <span>{spot.address}</span>
              </div>
            )}
          </div>
          
          {/* 스크롤 안내 */}
          <div className="mt-12 animate-bounce">
            <div className="text-white/60 text-sm mb-2">스크롤하여 상세 정보 보기</div>
            <svg className="w-6 h-6 mx-auto text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* 상세 정보 섹션 */}
      <section 
        ref={(el) => (sectionRefs.current[1] = el)}
        className={`relative min-h-screen bg-white transition-opacity duration-1000 ease-in-out ${
          scrollPosition > window.innerHeight * 0.5 ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="relative z-20 text-gray-800 px-4 w-full py-8">
          <div className="space-y-6">
            {/* 관광지 정보 */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                {spot.name}
              </h2>
              <div className="w-20 h-1 bg-gray-800 mx-auto rounded-full"></div>
            </div>

            {/* 관광지 이미지 캐러셀 */}
            {spotImages.length > 0 ? (
              <div className="mb-8">
                <ImageCarousel images={spotImages} height="h-80" />
              </div>
            ) : (
              <div className="mb-8">
                <ImageCarousel 
                  images={[{
                    contentid: spot.contentId,
                    originimgurl: spot.image,
                    smallimageurl: spot.image,
                    imgname: spot.name,
                    cpyrhtDivCd: '1',
                    serialnum: '1'
                  }]} 
                  height="h-80" 
                />
              </div>
            )}

            {/* 관광지소개 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">관광지소개</h3>
              <div className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
                {formatContentWithLineBreaks(spot.description)}
              </div>
            </div>

            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">기본 정보</h3>
              <div className="space-y-4">
                {spot.address && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">주소</p>
                      <div className="flex items-center">
                        <p className="text-base text-gray-700">{spot.address}</p>
                        <CopyButton text={spot.address} />
                      </div>
                    </div>
                  </div>
                )}

                {spot.tel && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">연락처</p>
                      <div className="flex items-center">
                        <p className="text-base text-gray-700">{spot.tel}</p>
                        <CopyButton text={spot.tel} />
                      </div>
                    </div>
                  </div>
                )}

                {spot.useTime && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">운영시간</p>
                      <p className="text-base text-gray-700 whitespace-pre-line">{formatContentWithLineBreaks(spot.useTime)}</p>
                    </div>
                  </div>
                )}

                {spot.restDate && (
                  <div className="flex items-start space-x-3">
                    <Calendar className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">휴무일</p>
                      <p className="text-base text-gray-700 whitespace-pre-line">{formatContentWithLineBreaks(spot.restDate)}</p>
                    </div>
                  </div>
                )}

                {spot.parking && (
                  <div className="flex items-start space-x-3">
                    <Coins className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">주차</p>
                      <p className="text-base text-gray-700 whitespace-pre-line">{formatContentWithLineBreaks(spot.parking)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 카카오 지도 */}
            <div className="mt-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">관광지 위치</h3>
                <div className="h-64 rounded-lg overflow-hidden mb-3">
                  <KakaoMap
                    center={{ lat: spot.lat, lng: spot.lng }}
                    markers={[{ lat: spot.lat, lng: spot.lng, title: spot.name }]}
                    height={256}
                    showOrder={false}
                    customMarker="/src/assets/marker/whale_marker1.png"
                  />
                </div>
                
                {/* 카카오 지도 길찾기 버튼 */}
                <button
                  onClick={() => {
                    const url = `https://map.kakao.com/link/to/${spot.name},${spot.lat},${spot.lng}`;
                    window.open(url, '_blank');
                  }}
                  className="w-full bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <img 
                    src="/src/assets/images/kakaotalk_logo_icon.png" 
                    alt="KakaoTalk" 
                    className="w-5 h-5"
                  />
                  <span>카카오맵으로 길찾기</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default SpotDetail;
