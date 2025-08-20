"use client"

import React, {useMemo} from "react"
import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, MapPin, Phone, Globe, Camera } from "lucide-react"
import type {
    TourApiDetailItem,
    TourApiIntroItem,
    TourApiDetailResponse,
    TourApiIntroResponse,
} from "@/types/tourApi.ts"
import {testModeManager} from "@/data/testData"

const SpotDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [spotDetail, setSpotDetail] = useState<TourApiDetailItem | null>(null)
    const [spotIntro, setSpotIntro] = useState<TourApiIntroItem | null>(null)
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
                setSpotDetail(items[0])
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
                        contentid: id,
                        contenttypeid: mockDetail.contenttypeid || "12",
                        usefee: "무료",
                        usetime: "09:00~18:00",
                        restdate: "없음",
                        parking: "무료 주차장 있음",
                    })
                } else {
                    setError("테스트용 관광지를 찾을 수 없습니다.")
                }
                setLoading(false)
                return
            }

            // 실제 API 호출
            await fetchSpotDetail()
            setLoading(false)
        }

        fetchData()
    }, [id])


    useEffect(() => {
        if (spotDetail) {
            fetchSpotIntro()
        }
    }, [spotDetail])


    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p className="text-gray-600">관광지 정보를 불러오는 중...</p>
                </div>
            </div>
        )
    }

    if (error || !spotDetail) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm sticky top-0 z-10">
                <div className="max-w-md mx-auto px-4 py-3 flex items-center">
                    <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-lg hover:bg-gray-100 transition-colors">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <h1 className="flex-1 text-lg font-semibold text-gray-800 text-center mr-8">관광지 상세정보</h1>
                </div>
            </div>

            <div className="max-w-md mx-auto">
                {/* Main Image */}
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-cyan-100">
                    {spotDetail.firstimage ? (
                        <img
                            src={spotDetail.firstimage || "/placeholder.svg"}
                            alt={spotDetail.title}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <Camera className="w-16 h-16 text-gray-400" />
                        </div>
                    )}

                </div>

                {/* Content */}
                <div className="bg-white rounded-t-3xl -mt-6 relative z-10 px-6 pt-6 pb-24">
                    {/* Title and Basic Info */}
                    <div className="mb-6">

                        <h1 className="text-2xl font-bold text-gray-800 mb-2">{spotDetail.title}</h1>

                        {spotDetail.addr1 && (
                            <div className="flex items-start space-x-2 text-gray-600 mb-2">
                                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                <span className="text-sm">{spotDetail.addr1}</span>
                            </div>
                        )}

                        {spotDetail.tel && (
                            <div className="flex items-center space-x-2 text-gray-600 mb-2">
                                <Phone className="w-4 h-4 flex-shrink-0" />
                                <span className="text-sm">{spotDetail.tel}</span>
                            </div>
                        )}

                        {spotDetail.homepage && (
                            <div className="flex items-center space-x-2 text-gray-600">
                                <Globe className="w-4 h-4 flex-shrink-0" />
                                <a
                                    href={spotDetail.homepage.replace(/<[^>]*>/g, "")}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-500 hover:underline"
                                >
                                    홈페이지 방문
                                </a>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {spotDetail.overview && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">소개</h3>
                            <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
                                {spotDetail.overview.replace(/<[^>]*>/g, "")}
                            </p>
                        </div>
                    )}

                    {/* Additional Info */}
                    {hasAdditionalInfo && (
                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3">상세정보</h3>
                            <div className="space-y-3">
                                {spotIntro?.usefee && (
                                    <div className="flex items-start space-x-2">
                                        <div className="w-4 h-4 mt-0.5 text-gray-500 flex-shrink-0">💰</div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">이용요금</span>
                                            <p
                                                className="text-sm text-gray-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: spotIntro.usefee.replace(/<br\s*\/?>/gi, "<br>").replace(/<[^>]*>/g, ""),
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}

                                {(spotIntro?.usetime || spotIntro?.usetimeculture || spotIntro?.opentimefood) && (
                                    <div className="flex items-start space-x-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">이용시간</span>
                                            <p
                                                className="text-sm text-gray-600"
                                                dangerouslySetInnerHTML={{
                                                    __html: (spotIntro?.usetime || spotIntro?.usetimeculture || spotIntro?.opentimefood)
                                                        ?.replace(/\r?\n/g, "")
                                                        .replace(/<br\s*\/?>/gi, "<br/>") || "",
                                                }}
                                            />
                                        </div>
                                    </div>
                                )}


                                {spotIntro?.restdate && (
                                    <div className="flex items-start space-x-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">휴무일</span>
                                            <p className="text-sm text-gray-600">{spotIntro.restdate.replace(/<[^>]*>/g, "")}</p>
                                        </div>
                                    </div>
                                )}

                                {(spotIntro?.parking || spotIntro?.parkingculture) && (
                                    <div className="flex items-start space-x-2">
                                        <div>
                                            <span className="text-sm font-medium text-gray-700">주차정보</span>
                                            <p className="text-sm text-gray-600">
                                                {(spotIntro.parking || spotIntro.parkingculture)?.replace(/<[^>]*>/g, "")}
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default SpotDetail
