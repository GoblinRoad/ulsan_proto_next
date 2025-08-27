"use client"

import React, {useMemo} from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Phone, Globe, Camera, Clock, Calendar, Coins } from "lucide-react"
import KakaoMap from "@/components/Map/KakaoMap"
import ImageCarousel from "@/components/Carousel/ImageCarousel"
import type {
    TourApiDetailItem,
    TourApiIntroItem,
    TourApiDetailResponse,
    TourApiIntroResponse,
} from "@/types/tourApi.ts"
import {testModeManager} from "@/data/testData"
import kakaoLogo from "../../assets/images/kakaotalk_logo_icon.png";
import CopyButton from "../../components/Buttons/CopyButton";

const openKakaoMapNavigation = (lat: string, lng: string) => {
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
                const fallbackUrl = `http://m.map.kakao.com/scheme/route?sp=35.538,129.311&ep=${lat},${lng}&by=car`;
                window.open(fallbackUrl, '_blank');
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000
            }
        );
    } else {
        const fallbackUrl = `http://m.map.kakao.com/scheme/route?sp=35.538,129.311&ep=${lat},${lng}&by=car`;
        window.open(fallbackUrl, '_blank');
    }
};

const MapSpotDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [spotDetail, setSpotDetail] = useState<TourApiDetailItem | null>(null)
    const [spotIntro, setSpotIntro] = useState<TourApiIntroItem | null>(null)
    const [spotImages, setSpotImages] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const serviceKey = import.meta.env.VITE_TOURAPI_KEY
    const isTestMode = () => {
        return sessionStorage.getItem("testMode") === "true"
    }

    const hasAdditionalInfo = useMemo(() => {
        return spotIntro && (
            spotIntro.usefee ||
            spotIntro.usetime ||
            spotIntro.usetimeculture ||
            spotIntro.opentimefood ||
            spotIntro.restdate ||
            spotIntro.parking ||
            spotIntro.parkingculture
        );
    }, [spotIntro]);

    const mapMarkers = useMemo(() => {
        if (!spotDetail || !spotDetail.mapx || !spotDetail.mapy) return [];

        return [{
            lat: parseFloat(spotDetail.mapy),
            lng: parseFloat(spotDetail.mapx),
            title: spotDetail.title,
            address: spotDetail.addr1,
            contentId: spotDetail.contentid
        }];
    }, [spotDetail]);

    const mapCenter = useMemo(() => {
        if (!spotDetail || !spotDetail.mapx || !spotDetail.mapy) {
            return { lat: 35.5384, lng: 129.3114 };
        }

        return {
            lat: parseFloat(spotDetail.mapy),
            lng: parseFloat(spotDetail.mapx)
        };
    }, [spotDetail]);

    const formatContentWithLineBreaks = (content: string) => {
        if (!content) return '';
        return content.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    };

    const fetchSpotImages = async () => {
        if (!id || !serviceKey || !spotDetail) return

        try {
            const params = new URLSearchParams({
                serviceKey: decodeURIComponent(serviceKey),
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                contentId: id,
                imageYN: "Y",
                numOfRows: "10",
                pageNo: "1",
            })

            const response = await fetch(`https://apis.data.go.kr/B551011/KorService2/detailImage2?${params}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()

            if (data.response.header.resultCode === "0000") {
                const items = data.response.body.items?.item || []
                let imageArray: any[] = [];

                if (Array.isArray(items)) {
                    imageArray = items;
                } else if (items) {
                    imageArray = [items];
                }

                // API 이미지들을 형식에 맞게 변환
                const formattedImages = imageArray.map((img: any) => ({
                    contentid: img.contentid,
                    originimgurl: img.originimgurl,
                    smallimageurl: img.smallimageurl || img.originimgurl,
                    imgname: img.imgname || spotDetail?.title || "관광지 이미지",
                    cpyrhtDivCd: img.cpyrhtDivCd || "Type3",
                    serialnum: img.serialnum || "1"
                }));

                // 기존 이미지들에 새로운 이미지만 추가 (중복 제거)
                setSpotImages(currentImages => {
                    const newImages = formattedImages.filter(newImg =>
                        !currentImages.some(existingImg =>
                            existingImg.originimgurl === newImg.originimgurl
                        )
                    );

                    // 기존 이미지 + 새로운 이미지
                    return [...currentImages, ...newImages];
                });

                // 새로운 이미지들만 프리로딩
                formattedImages.forEach((image: any) => {
                    const img = new Image();
                    img.src = image.originimgurl;
                });
            }
        } catch (err) {
            console.error("이미지 가져오기 실패:", err)
            // 에러 발생해도 기존 이미지는 유지
        }
    }

    const fetchSpotDetail = async () => {
        if (!id || !serviceKey) return

        try {
            const params = new URLSearchParams({
                serviceKey: decodeURIComponent(serviceKey),
                MobileOS: "WEB",
                MobileApp: "Ulsan",
                _type: "json",
                contentId: id,
                numOfRows: "10",
                pageNo: "1",
            })

            const response = await fetch(`https://apis.data.go.kr/B551011/KorService2/detailCommon2?${params}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TourApiDetailResponse = await response.json()

            if (data.response.header.resultCode !== "0000") {
                throw new Error(`API Error: ${data.response.header.resultMsg}`)
            }

            const items = data.response.body.items?.item
            if (items && items.length > 0) {
                const spotData = items[0];
                setSpotDetail(spotData)

                // firstimage가 있으면 즉시 이미지 상태에 설정
                if (spotData.firstimage) {
                    setSpotImages([{
                        contentid: spotData.contentid,
                        originimgurl: spotData.firstimage,
                        smallimageurl: spotData.firstimage,
                        imgname: spotData.title + " (메인)",
                        cpyrhtDivCd: "Type3",
                        serialnum: "main"
                    }]);
                }
            } else {
                throw new Error("관광지 정보를 찾을 수 없습니다.")
            }
        } catch (err) {
            console.error("상세정보 가져오기 실패:", err)
            setError(err instanceof Error ? err.message : "상세정보를 불러오는데 실패했습니다.")
        }
    }

    const fetchSpotIntro = async () => {
        if (!id || !serviceKey || !spotDetail) return

        try {
            const params = new URLSearchParams({
                serviceKey: decodeURIComponent(serviceKey),
                MobileOS: "ETC",
                MobileApp: "AppTest",
                _type: "json",
                contentId: id,
                contentTypeId: spotDetail.contenttypeid || "12",
                numOfRows: "10",
                pageNo: "1",
            })

            const response = await fetch(`https://apis.data.go.kr/B551011/KorService2/detailIntro2?${params}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data: TourApiIntroResponse = await response.json()

            if (data.response.header.resultCode !== "0000") {
                throw new Error(`API Error: ${data.response.header.resultMsg}`)
            }

            const items = data.response.body.items?.item
            if (items && items.length > 0) {
                setSpotIntro(items[0])
            }
        } catch (err) {
            console.error("소개정보 가져오기 실패:", err)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            setError(null)

            if (isTestMode() && id) {
                const mockDetail = testModeManager.getTestSpotDetail(id)
                if (mockDetail) {
                    setSpotDetail(mockDetail)
                    setSpotIntro({
                        usefee: "무료",
                        usetime: "09:00~18:00",
                        restdate: "없음",
                        parking: "무료 주차장 있음",
                        description: "설명"
                    })
                    // 테스트 모드에서도 기본 이미지 설정
                    if (mockDetail.firstimage) {
                        setSpotImages([{
                            originimgurl: mockDetail.firstimage,
                            smallimageurl: mockDetail.firstimage,
                            imgname: mockDetail.title,
                            contentid: mockDetail.contentid,
                            cpyrhtDivCd: '1',
                            serialnum: '1'
                        }])
                    }
                } else {
                    setError("테스트용 관광지를 찾을 수 없습니다.")
                }
                setLoading(false)
                return
            }

            await fetchSpotDetail()
            setLoading(false)
        }

        fetchData()
    }, [id])

    useEffect(() => {
        if (spotDetail) {
            fetchSpotIntro()
            // spotDetail이 설정된 후 약간의 딜레이를 두고 추가 이미지 가져오기
            setTimeout(() => {
                fetchSpotImages()
            }, 100);
        }
    }, [spotDetail])

    if (loading) {
        return (
            <div className="max-w-md mx-auto">
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                        <p className="text-gray-600">관광지 정보를 불러오는 중...</p>
                    </div>
                </div>
            </div>
        )
    }

    if (error || !spotDetail) {
        return (
            <div className="max-w-md mx-auto">
                <div className="min-h-screen bg-white flex items-center justify-center">
                    <div className="text-center px-4">
                        <div className="text-red-500 text-6xl mb-4">⚠️</div>
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{error || "관광지를 찾을 수 없습니다"}</h2>
                        <button
                            onClick={() => navigate("/map")}
                            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            지도로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-md mx-auto">
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

                {/* 메인 이미지 섹션 */}
                <section className="relative h-64">
                    {spotImages.length > 0 ? (
                        <div className="w-full h-64">
                            <ImageCarousel images={spotImages} height="h-64" simple = {true} />
                        </div>
                    ) : spotDetail.firstimage ? (
                        <div
                            className="w-full h-full bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${spotDetail.firstimage})`
                            }}
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-100 to-cyan-100 flex items-center justify-center">
                            <Camera className="w-16 h-16 text-gray-400" />
                        </div>
                    )}
                </section>

                {/* 상세 정보 섹션 */}
                <div className="px-4 py-8 space-y-6">
                    {/* 관광지 정보 타이틀 */}
                    <div className="text-center mb-6">
                        <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-800">
                            {spotDetail.title}
                        </h2>
                        <div className="w-20 h-1 bg-gray-800 mx-auto rounded-full"></div>
                    </div>

                    {/* 관광지 소개 */}
                    {spotDetail.overview && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-2xl font-bold mb-4 text-gray-800">관광지소개</h3>
                            <div className="text-base leading-relaxed text-gray-700 whitespace-pre-line">
                                {formatContentWithLineBreaks(spotDetail.overview)}
                            </div>
                        </div>
                    )}

                    {/* 기본 정보 */}
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <h3 className="text-2xl font-bold mb-4 text-gray-800">기본 정보</h3>
                        <div className="space-y-4">
                            {spotDetail.addr1 && (
                                <div className="flex items-start space-x-3">
                                    <MapPin className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">주소</p>
                                        <div className="flex items-center">
                                            <p className="text-base text-gray-700">{spotDetail.addr1}</p>
                                            <CopyButton text={spotDetail.addr1} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {spotDetail.tel && (
                                <div className="flex items-start space-x-3">
                                    <Phone className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">연락처</p>
                                        <div className="flex items-center">
                                            <p className="text-base text-gray-700">{spotDetail.tel}</p>
                                            <CopyButton text={spotDetail.tel} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {spotDetail.homepage && (
                                <div className="flex items-start space-x-3">
                                    <Globe className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">홈페이지</p>
                                        <a
                                            href={spotDetail.homepage.replace(/<[^>]*>/g, "")}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-base text-blue-600 hover:text-blue-800 underline"
                                        >
                                            홈페이지 방문
                                        </a>
                                    </div>
                                </div>
                            )}

                            {/* 추가 정보들 */}
                            {(spotIntro?.usetime || spotIntro?.usetimeculture || spotIntro?.opentimefood) && (
                                <div className="flex items-start space-x-3">
                                    <Clock className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">운영시간</p>
                                        <p className="text-base text-gray-700 whitespace-pre-line">
                                            {formatContentWithLineBreaks(
                                                spotIntro?.usetime || spotIntro?.usetimeculture || spotIntro?.opentimefood || ""
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {spotIntro?.restdate && (
                                <div className="flex items-start space-x-3">
                                    <Calendar className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">휴무일</p>
                                        <p className="text-base text-gray-700 whitespace-pre-line">
                                            {formatContentWithLineBreaks(spotIntro.restdate)}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {(spotIntro?.parking || spotIntro?.parkingculture) && (
                                <div className="flex items-start space-x-3">
                                    <Coins className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">주차</p>
                                        <p className="text-base text-gray-700 whitespace-pre-line">
                                            {formatContentWithLineBreaks(spotIntro.parking || spotIntro.parkingculture || "")}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {spotIntro?.usefee && (
                                <div className="flex items-start space-x-3">
                                    <Coins className="w-6 h-6 flex-shrink-0 mt-0.5 text-gray-600" />
                                    <div className="flex-1">
                                        <p className="font-semibold text-lg text-gray-800">이용요금</p>
                                        <p className="text-base text-gray-700 whitespace-pre-line">
                                            {formatContentWithLineBreaks(spotIntro.usefee)}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* 카카오 지도 섹션 */}
                    {mapMarkers.length > 0 && (
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                            <h3 className="text-2xl font-bold mb-3 text-gray-800">관광지 위치</h3>
                            <div className="h-64 rounded-lg overflow-hidden mb-3">
                                <KakaoMap
                                    center={mapCenter}
                                    markers={mapMarkers}
                                    height={256}
                                    draggable={false}
                                />
                            </div>

                            {/* 카카오 지도 길찾기 버튼 */}
                            <button
                                onClick={() => openKakaoMapNavigation(spotDetail.mapy, spotDetail.mapx)}
                                className="w-full bg-[#FEE500] hover:bg-[#FDD800] text-black px-4 py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                            >
                                <img
                                    src={kakaoLogo}
                                    alt="KakaoTalk"
                                    className="w-5 h-5"
                                />
                                <span>카카오맵으로 길찾기</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default MapSpotDetail