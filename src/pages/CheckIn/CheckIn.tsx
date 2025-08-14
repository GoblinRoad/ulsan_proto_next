import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Camera, ArrowLeft, MapPin, Coins, Loader } from 'lucide-react';
import {
  TourApiDetailItem,
  TourApiIntroItem,
  TourApiDetailResponse,
  TourApiIntroResponse
} from '../../types/tourApi';

const CheckIn: React.FC = () => {
  const [searchParams] = useSearchParams();
  const contentId = searchParams.get('contentId');
  const contentType = searchParams.get('contentType');
  const navigate = useNavigate();

  // 상태 관리
  const [spotDetail, setSpotDetail] = useState<TourApiDetailItem | null>(null);
  const [spotIntro, setSpotIntro] = useState<TourApiIntroItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // API 키 확인
  const serviceKey = import.meta.env.VITE_TOURAPI_KEY;

  // 관광지 상세정보 가져오기
  const fetchSpotDetail = async () => {
    if (!contentId || !serviceKey) return;

    try {
      const params = new URLSearchParams({
        serviceKey: decodeURIComponent(serviceKey),
        MobileOS: 'WEB',
        MobileApp: 'Ulsan',
        _type: 'json',
        contentId: contentId,
        numOfRows: '10',
        pageNo: '1'
      });

      const response = await fetch(
          `https://apis.data.go.kr/B551011/KorService2/detailCommon2?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TourApiDetailResponse = await response.json();

      if (data.response.header.resultCode !== '0000') {
        throw new Error(`API Error: ${data.response.header.resultMsg}`);
      }

      const items = data.response.body.items?.item;
      if (items && items.length > 0) {
        setSpotDetail(items[0]);
      } else {
        throw new Error('관광지 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('상세정보 가져오기 실패:', err);
      setError(err instanceof Error ? err.message : '상세정보를 불러오는데 실패했습니다.');
    }
  };

  // 관광지 소개정보 가져오기
  const fetchSpotIntro = async () => {
    if (!contentId || !contentType || !serviceKey) return;

    try {
      const params = new URLSearchParams({
        serviceKey: decodeURIComponent(serviceKey),
        MobileOS: 'ETC',
        MobileApp: 'AppTest',
        _type: 'json',
        contentId: contentId,
        contentTypeId: contentType,
        numOfRows: '10',
        pageNo: '1'
      });

      const response = await fetch(
          `https://apis.data.go.kr/B551011/KorService2/detailIntro2?${params}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: TourApiIntroResponse = await response.json();

      if (data.response.header.resultCode !== '0000') {
        throw new Error(`API Error: ${data.response.header.resultMsg}`);
      }

      const items = data.response.body.items?.item;
      if (items && items.length > 0) {
        setSpotIntro(items[0]);
      }
    } catch (err) {
      console.error('소개정보 가져오기 실패:', err);
      // 소개정보는 선택사항이므로 에러를 state에 저장하지 않음
    }
  };

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      await Promise.all([
        fetchSpotDetail(),
        fetchSpotIntro()
      ]);

      setLoading(false);
    };

    fetchData();
  }, [contentId, contentType]);

  // 사진 촬영 처리
  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // 체크인 처리
  const handleCheckIn = () => {
    if (!photo || !spotDetail) return;

    // 여기에 실제 체크인 로직 추가 (예: 서버에 데이터 전송)
    setIsCheckedIn(true);

    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  // 로딩 상태
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">관광지 정보를 불러오는 중...</p>
          </div>
        </div>
    );
  }

  // 에러 상태
  if (error || !spotDetail) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {error || '관광지를 찾을 수 없습니다'}
            </h2>
            <button
                onClick={() => navigate('/map')}
                className="text-blue-500 hover:text-blue-600"
            >
              지도로 돌아가기
            </button>
          </div>
        </div>
    );
  }

  // 체크인 완료 상태
  if (isCheckedIn) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 p-4">
          <div className="max-w-md mx-auto text-center text-white animate-bounceIn">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Coins className="w-10 h-10 coin-spin" />
            </div>
            <h2 className="text-2xl font-bold mb-2">체크인 완료!</h2>
            <p className="text-green-100 mb-4">100 코인을 획득하셨습니다!</p>
            <div className="bg-white/20 rounded-lg p-4 mb-6">
              <h3 className="font-semibold mb-2">{spotDetail.title}</h3>
              <p className="text-sm text-green-100">{spotDetail.addr1} {spotDetail.addr2}</p>
            </div>
            <p className="text-sm text-green-100">잠시 후 홈 화면으로 이동합니다...</p>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 p-4">
          <div className="flex items-center space-x-3">
            <button
                onClick={() => navigate('/map')}
                className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-800">체크인</h1>
              <p className="text-sm text-gray-500">{spotDetail.title}</p>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto p-4 space-y-6">
          {/* 관광지 정보 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            {spotDetail.firstimage && (
                <div
                    className="w-full h-48 rounded-lg bg-cover bg-center mb-4"
                    style={{ backgroundImage: `url(${spotDetail.firstimage})` }}
                />
            )}
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-2">{spotDetail.title}</h2>

                {/* 개요 정보 */}
                {spotDetail.overview && (
                    <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                      {spotDetail.overview.replace(/<[^>]*>/g, '').substring(0, 150)}
                      {spotDetail.overview.length > 150 ? '...' : ''}
                    </p>
                )}

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{spotDetail.addr1} {spotDetail.addr2}</span>
                  </div>

                  {spotDetail.tel && (
                      <div className="flex items-center text-sm text-gray-500">
                        <span className="w-4 h-4 mr-1">📞</span>
                        <span>{spotDetail.tel}</span>
                      </div>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 rounded-full">
                <Coins className="w-4 h-4 text-white" />
                <span className="text-white font-bold">100</span>
              </div>
            </div>
          </div>

          {/* 소개정보 */}
          {spotIntro && (
              <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">이용안내</h3>
                <div className="space-y-2 text-sm">
                  {/* 공통 정보 */}
                  {spotIntro.usefee && (
                      <div>
                        <span className="font-medium text-gray-700">이용요금: </span>
                        <span className="text-gray-600"
                              dangerouslySetInnerHTML={{ __html: spotIntro.usefee.replace(/<br\s*\/?>/gi, ', ') }} />
                      </div>
                  )}

                  {/* 문화시설(14) 정보 */}
                  {spotIntro.usetimeculture && (
                      <div>
                        <span className="font-medium text-gray-700">이용시간: </span>
                        <span className="text-gray-600">{spotIntro.usetimeculture}</span>
                      </div>
                  )}
                  {spotIntro.restdateculture && (
                      <div>
                        <span className="font-medium text-gray-700">휴무일: </span>
                        <span className="text-gray-600">{spotIntro.restdateculture}</span>
                      </div>
                  )}
                  {spotIntro.parkingculture && (
                      <div>
                        <span className="font-medium text-gray-700">주차: </span>
                        <span className="text-gray-600">{spotIntro.parkingculture}</span>
                      </div>
                  )}

                  {/* 관광지(12) 정보 */}
                  {spotIntro.usetime && (
                      <div>
                        <span className="font-medium text-gray-700">이용시간: </span>
                        <span className="text-gray-600">{spotIntro.usetime}</span>
                      </div>
                  )}
                  {spotIntro.restdate && (
                      <div>
                        <span className="font-medium text-gray-700">휴무일: </span>
                        <span className="text-gray-600">{spotIntro.restdate}</span>
                      </div>
                  )}
                  {spotIntro.parking && (
                      <div>
                        <span className="font-medium text-gray-700">주차: </span>
                        <span className="text-gray-600">{spotIntro.parking}</span>
                      </div>
                  )}

                  {/* 축제/공연/행사(15) 정보 */}
                  {spotIntro.eventstartdate && spotIntro.eventenddate && (
                      <div>
                        <span className="font-medium text-gray-700">행사기간: </span>
                        <span className="text-gray-600">{spotIntro.eventstartdate} ~ {spotIntro.eventenddate}</span>
                      </div>
                  )}
                  {spotIntro.eventplace && (
                      <div>
                        <span className="font-medium text-gray-700">행사장소: </span>
                        <span className="text-gray-600">{spotIntro.eventplace}</span>
                      </div>
                  )}
                  {spotIntro.playtime && (
                      <div>
                        <span className="font-medium text-gray-700">공연시간: </span>
                        <span className="text-gray-600">{spotIntro.playtime}</span>
                      </div>
                  )}

                  {/* 음식점(39) 정보 */}
                  {spotIntro.firstmenu && (
                      <div>
                        <span className="font-medium text-gray-700">대표메뉴: </span>
                        <span className="text-gray-600">{spotIntro.firstmenu}</span>
                      </div>
                  )}
                  {spotIntro.opentimefood && (
                      <div>
                        <span className="font-medium text-gray-700">영업시간: </span>
                        <span className="text-gray-600">{spotIntro.opentimefood}</span>
                      </div>
                  )}
                  {spotIntro.restdatefood && (
                      <div>
                        <span className="font-medium text-gray-700">휴무일: </span>
                        <span className="text-gray-600">{spotIntro.restdatefood}</span>
                      </div>
                  )}

                  {/* 숙박(32) 정보 */}
                  {spotIntro.checkintime && (
                      <div>
                        <span className="font-medium text-gray-700">체크인: </span>
                        <span className="text-gray-600">{spotIntro.checkintime}</span>
                      </div>
                  )}
                  {spotIntro.checkouttime && (
                      <div>
                        <span className="font-medium text-gray-700">체크아웃: </span>
                        <span className="text-gray-600">{spotIntro.checkouttime}</span>
                      </div>
                  )}

                  {/* 쇼핑(38) 정보 */}
                  {spotIntro.opentime && (
                      <div>
                        <span className="font-medium text-gray-700">영업시간: </span>
                        <span className="text-gray-600">{spotIntro.opentime}</span>
                      </div>
                  )}
                  {spotIntro.saleitem && (
                      <div>
                        <span className="font-medium text-gray-700">판매품목: </span>
                        <span className="text-gray-600">{spotIntro.saleitem}</span>
                      </div>
                  )}

                  {/* 주차요금 (공통) */}
                  {spotIntro.parkingfee && (
                      <div>
                        <span className="font-medium text-gray-700">주차요금: </span>
                        <span className="text-gray-600">{spotIntro.parkingfee}</span>
                      </div>
                  )}
                </div>
              </div>
          )}

          {/* 사진 촬영 */}
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">인증 사진을 촬영해주세요</h3>

            {!photo ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Camera className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">관광지와 함께 사진을 찍어주세요</p>
                  <button
                      onClick={() => fileInputRef.current?.click()}
                      className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
                  >
                    사진 촬영하기
                  </button>
                  <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handlePhotoCapture}
                      className="hidden"
                  />
                </div>
            ) : (
                <div className="space-y-4">
                  <div className="relative">
                    <img
                        src={photo}
                        alt="체크인 사진"
                        className="w-full h-64 object-cover rounded-lg"
                    />
                    <button
                        onClick={() => setPhoto(null)}
                        className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="flex space-x-3">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                    >
                      다시 촬영
                    </button>
                    <button
                        onClick={handleCheckIn}
                        className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                    >
                      체크인 완료
                    </button>
                  </div>
                </div>
            )}
          </div>

          {/* 주의사항 */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <h4 className="font-semibold text-blue-800 mb-2">체크인 안내</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• 관광지 현장에서만 체크인 가능합니다</li>
              <li>• 명확한 인증을 위해 관광지가 잘 보이는 사진을 촬영해주세요</li>
              <li>• 체크인은 한 번만 가능하니 신중히 진행해주세요</li>
            </ul>
          </div>
        </div>
      </div>
  );
};

export default CheckIn;