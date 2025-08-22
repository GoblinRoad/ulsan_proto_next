import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Phone, Loader2, Navigation, Clock, Coins } from 'lucide-react';
import KakaoMap from '../../components/Map/KakaoMap';
import ImageCarousel from '../../components/Carousel/ImageCarousel';
import CopyButton from '../../components/Buttons/CopyButton';
import { getFestivalIntro, getFestivalInfo, getFestivalsWithCache, getFestivalImages, FestivalImage } from '../../services/festivalService';

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

// 축제 기본 정보를 URL 파라미터로 받기 위한 인터페이스
interface FestivalBasicInfo {
  title: string;
  addr1: string;
  addr2?: string;
  tel?: string;
  firstimage?: string;
  eventstartdate: string;
  eventenddate: string;
  mapx: string;
  mapy: string;
}

interface FestivalIntro {
  sponsor1?: string;
  sponsor1tel?: string;
  eventplace?: string;
  playtime?: string;
  usetimefestival?: string;
  eventhomepage?: string;
}

interface FestivalInfo {
  infoname: string;
  infotext: string;
  fldgubun: string;
}

const FestivalDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [festival, setFestival] = useState<FestivalDetail | null>(null);
  const [festivalIntro, setFestivalIntro] = useState<FestivalIntro | null>(null);
  const [festivalInfo, setFestivalInfo] = useState<FestivalInfo[]>([]);
  const [festivalImages, setFestivalImages] = useState<FestivalImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const loadFestivalDetail = async () => {
      if (!id) return;



      try {
        const serviceKey = import.meta.env.VITE_TOURAPI_KEY;
        
        if (!serviceKey) {
          throw new Error('Tour API 키가 설정되지 않았습니다.');
        }

        // 축제 기본 정보를 searchFestival2에서 가져오기
        const festivalList = await getFestivalsWithCache();
        const currentFestival = festivalList.find(f => f.contentId === id);
        
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

        // 축제 소개 정보 가져오기
        try {
          const introData = await getFestivalIntro(id);
          setFestivalIntro(introData);
        } catch (introError) {
          console.error('축제 소개 정보 로드 실패:', introError);
        }

        // 축제 상세 정보 가져오기
        try {
          const infoData = await getFestivalInfo(id);
          setFestivalInfo(infoData);
        } catch (infoError) {
          console.error('축제 상세 정보 로드 실패:', infoError);
        }

        // 축제 이미지 가져오기
        try {
          const imagesData = await getFestivalImages(id);
          setFestivalImages(imagesData);
        } catch (imagesError) {
          console.error('축제 이미지 로드 실패:', imagesError);
        }

      } catch (error) {
        console.error('축제 상세정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFestivalDetail();
  }, [id]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrollY(currentScrollY);
      setScrollPosition(currentScrollY);

      // 현재 활성 섹션 찾기
      const windowHeight = window.innerHeight;
      const currentSection = Math.floor(currentScrollY / windowHeight);
      setActiveSection(currentSection);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600">축제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (!festival) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">축제 정보를 찾을 수 없습니다.</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const year = dateString.slice(0, 4);
    const month = dateString.slice(4, 6);
    const day = dateString.slice(6, 8);
    return `${year}.${month}.${day}`;
  };

  const formatContent = (content: string) => {
    return content.replace(/<br\s*\/?>/gi, '\n');
  };

  return (
    <div className="relative">
      {/* 상단 네비게이션 */}
      <div className="fixed top-0 left-0 right-0 z-50 p-4">
        <button 
          onClick={() => navigate(-1)}
          className="bg-black/20 backdrop-blur-sm rounded-full p-2 text-white hover:bg-black/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
      </div>

      {/* 축제 소개 섹션 */}
      <section 
        ref={(el) => (sectionRefs.current[0] = el)}
        className="relative h-screen flex items-center justify-center overflow-hidden"
      >
        {/* 배경 이미지 */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${festival.firstimage || '/placeholder-image.jpg'})`
          }}
        />
        
        {/* 배경 오버레이 */}
        <div className="absolute inset-0 bg-black/60" />
        
        {/* 축제 소개 콘텐츠 */}
        <div className="relative z-10 text-center text-white px-4 max-w-2xl">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {festival.title}
          </h1>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-center justify-center space-x-2 text-lg">
              <Calendar className="w-5 h-5" />
              <span>
                {formatDate(festival.eventstartdate)}
                {festival.eventstartdate !== festival.eventenddate && 
                  ` - ${formatDate(festival.eventenddate)}`
                }
              </span>
            </div>
            
            <div className="flex items-center justify-center space-x-2 text-lg">
              <MapPin className="w-5 h-5" />
              <span>{festival.addr1}</span>
            </div>
          </div>

          {festival.overview && (
            <div className="bg-black/60 rounded-xl p-6 mb-6">
              <p className="text-sm leading-relaxed text-white">
                {festival.overview}
              </p>
            </div>
          )}
          
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
            {/* 축제 정보 */}
            <div className="text-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                {festival.title}
              </h2>
              <div className="w-20 h-1 bg-gray-800 mx-auto rounded-full"></div>
            </div>

            {/* 축제 이미지 캐러셀 */}
            {festivalImages.length > 0 && (
              <div className="mb-8">
                <ImageCarousel images={festivalImages} height="h-80" />
              </div>
            )}

            {/* 행사소개 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">행사소개</h3>
              <div className="text-base leading-relaxed text-gray-700">
                제21회 울산 민족예술제 도깨비난장은 예술인들이 주체가 되어 기획·운영하는 지역 문화예술 행사이다. 
                이번 축제는 '이곳저곳에서 살아가던 도깨비들이 한 곳에 모이면 비밀의 문이 열린다'는 설정을 기반으로 
                도심 속에서 펼쳐지는 공연과 체험 프로그램을 구성하였다. 행사는 울산 도심 공간을 무대로 다양한 예술 공연, 
                시민 참여형 체험 활동, 전시와 부스 운영 등을 진행하는 방식으로 운영된다.
              </div>
            </div>

            {/* 행사내용 */}
            {festivalInfo.length > 0 && (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-2xl font-bold mb-4 text-gray-800">행사내용</h3>
                <div className="space-y-3">
                  {festivalInfo.map((info, index) => (
                    <div key={index} className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
                      {formatContent(info.infotext)}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 기본 정보 */}
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">기본 정보</h3>
              <div className="space-y-4">
                {festival.addr1 && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">주소</p>
                      <div className="flex items-center">
                        <p className="text-base text-gray-700">
                          {festival.addr1}
                          {festival.addr2 && ` ${festival.addr2}`}
                        </p>
                        <CopyButton text={`${festival.addr1}${festival.addr2 ? ` ${festival.addr2}` : ''}`} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex items-start space-x-3">
                  <Calendar className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                  <div className="flex-1">
                    <p className="font-semibold text-lg text-gray-800">기간</p>
                    <p className="text-base text-gray-700">
                      {formatDate(festival.eventstartdate)}
                      {festival.eventstartdate !== festival.eventenddate && 
                        ` - ${formatDate(festival.eventenddate)}`
                      }
                    </p>
                  </div>
                </div>

                {festival.tel && (
                  <div className="flex items-start space-x-3">
                    <Phone className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">연락처</p>
                      <div className="flex items-center">
                        <p className="text-base text-gray-700">{festival.tel}</p>
                        <CopyButton text={festival.tel} />
                      </div>
                    </div>
                  </div>
                )}

                {festivalIntro?.playtime && (
                  <div className="flex items-start space-x-3">
                    <Clock className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">운영시간</p>
                      <p className="text-base text-gray-700">{festivalIntro.playtime}</p>
                    </div>
                  </div>
                )}

                {festivalIntro?.eventplace && (
                  <div className="flex items-start space-x-3">
                    <MapPin className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">행사장소</p>
                      <p className="text-base text-gray-700">{festivalIntro.eventplace}</p>
                    </div>
                  </div>
                )}

                {festivalIntro?.usetimefestival && (
                  <div className="flex items-start space-x-3">
                    <Coins className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                    <div className="flex-1">
                      <p className="font-semibold text-lg text-gray-800">이용요금</p>
                      <p className="text-base text-gray-700 whitespace-pre-line">{formatContent(festivalIntro.usetimefestival)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 카카오 지도 */}
            <div className="mt-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h3 className="text-2xl font-bold mb-3 text-gray-800">행사 위치</h3>
                <div className="h-64 rounded-lg overflow-hidden mb-3">
                  <KakaoMap
                    center={{ lat: parseFloat(festival.mapy), lng: parseFloat(festival.mapx) }}
                    markers={[{ lat: parseFloat(festival.mapy), lng: parseFloat(festival.mapx), title: festival.title }]}
                    height={256}
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

export default FestivalDetail;
