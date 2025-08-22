"use client"

import type React from "react"
import { useState,  useEffect } from "react"
import {useLocation, useNavigate, useSearchParams} from "react-router-dom"
import { Loader, AlertCircle } from "lucide-react"

import useLocationAuth from "@/hooks/useLocationAuth"
import { CheckInService, type CheckInData } from "@/services/checkinService.ts"
import { TourSpotsService, type TourSpot } from "@/services/tourSpotsService.ts"
import type {
  TourApiDetailItem,
  TourApiIntroItem,
  TourApiDetailResponse,
  TourApiIntroResponse,
} from "@/types/tourApi.ts"

import LocationVerification from "@/components/CheckIn/LocationVerification"
import PhotoCapture from "@/components/CheckIn/PhotoCapture"
import CheckInProgress from "@/components/CheckIn/CheckInProgress"
import CheckInComplete from "@/components/CheckIn/CheckInComplete"
import { testModeManager } from "@/data/testData"

const CheckIn: React.FC = () => {
  const [searchParams] = useSearchParams()
  const contentId = searchParams.get("contentId")
  const contentType = searchParams.get("contentType")
  const location = useLocation()
  const onComplete = location.state?.onComplete

  const navigate = useNavigate()

  // 상태
  const [spotDetail, setSpotDetail] = useState<TourApiDetailItem | null>(null)
  const [spotIntro, setSpotIntro] = useState<TourApiIntroItem | null>(null)
  const [tourSpotLocation, setTourSpotLocation] = useState<TourSpot | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [photo, setPhoto] = useState<string | null>(null)
  const [originalFile, setOriginalFile] = useState<File | null>(null)
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInStep, setCheckInStep] = useState<
      "loading" | "location_check" | "photo_capture" | "uploading" | "complete"
  >("loading")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [authError, setAuthError] = useState<string | null>(null)

  const serviceKey = import.meta.env.VITE_TOURAPI_KEY

  const locationAuth = useLocationAuth({
    targetLocation: tourSpotLocation
        ? { lat: tourSpotLocation.latitude, lng: tourSpotLocation.longitude }
        : spotDetail?.mapx && spotDetail?.mapy
            ? { lat: Number.parseFloat(spotDetail.mapy), lng: Number.parseFloat(spotDetail.mapx) }
            : { lat: 0, lng: 0 },
    allowedRadius: 300,
  })

  // -----------------------------
  // 관광지 상세/소개 정보
  // -----------------------------
  const fetchSpotDetail = async () => {
    if (!contentId || !serviceKey) return

    if (testModeManager.isTestMode()) {
      const testDetail = testModeManager.getTestSpotDetail(contentId)
      if (testDetail) setSpotDetail(testDetail)
      return
    }

    try {
      const params = new URLSearchParams({
        serviceKey: decodeURIComponent(serviceKey),
        MobileOS: "WEB",
        MobileApp: "Ulsan",
        _type: "json",
        contentId: contentId,
        numOfRows: "10",
        pageNo: "1",
      })

      const response = await fetch(`https://apis.data.go.kr/B551011/KorService2/detailCommon2?${params}`)
      if (!response.ok) console.error(`HTTP error! status: ${response.status}`)

      const data: TourApiDetailResponse = await response.json()
      if (data.response.header.resultCode !== "0000") console.error(`API Error: ${data.response.header.resultMsg}`)

      const items = data.response.body.items?.item
      if (items && items.length > 0) setSpotDetail(items[0])
    } catch (err) {
      console.error("상세정보 가져오기 실패:", err)
      setError(err instanceof Error ? err.message : "상세정보를 불러오는데 실패했습니다.")
    }
  }

  const fetchSpotIntro = async () => {
    if (!contentId || !contentType || !serviceKey) return

    if (testModeManager.isTestMode()) {
      const testDetail = testModeManager.getTestSpotDetail(contentId)
      if (testDetail) setSpotIntro({ description: testDetail.overview } as TourApiIntroItem)
      return
    }

    try {
      const params = new URLSearchParams({
        serviceKey: decodeURIComponent(serviceKey),
        MobileOS: "ETC",
        MobileApp: "AppTest",
        _type: "json",
        contentId: contentId,
        contentTypeId: contentType,
        numOfRows: "10",
        pageNo: "1",
      })

      const response = await fetch(`https://apis.data.go.kr/B551011/KorService2/detailIntro2?${params}`)
      if (!response.ok) console.error(`HTTP error! status: ${response.status}`)

      const data: TourApiIntroResponse = await response.json()
      if (data.response.header.resultCode !== "0000") console.error(`API Error: ${data.response.header.resultMsg}`)

      const items = data.response.body.items?.item
      if (items && items.length > 0) setSpotIntro(items[0])
    } catch (err) {
      console.error("소개정보 가져오기 실패:", err)
    }
  }

  // -----------------------------
  // DB 관광지 위치 가져오기
  // -----------------------------
  const fetchTourSpotLocation = async () => {
    if (!contentId) return
    try {
      const location = await TourSpotsService.getTourSpotLocation(contentId)
      if (location) setTourSpotLocation(location)
    } catch (err) {
      console.error("DB 관광지 위치 정보 가져오기 실패:", err)
    }
  }

  // -----------------------------
  // 초기 데이터 로드
  // -----------------------------
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      setAuthError(null)
      setCheckInStep("loading")

      const isTestMode = sessionStorage.getItem("testMode") === "true"
      if (isTestMode) {
        const mockDetail = testModeManager.getTestSpotDetail(contentId!)
        const mockIntro = testModeManager.getTestSpotIntro(contentId!)
        if (mockDetail) setSpotDetail(mockDetail)
        if (mockIntro) setSpotIntro(mockIntro)
        setLoading(false)
        setCheckInStep("location_check")
        return
      }

      try {
        await Promise.all([fetchTourSpotLocation(), fetchSpotDetail(), fetchSpotIntro()])
        setLoading(false);
        if (!authError) {
          setCheckInStep("location_check");
        }
      } catch (err) {
        console.error("데이터 로드 중 오류:", err)
        setError("데이터를 불러오는 중 오류가 발생했습니다.")
      }

      setLoading(false)
      if (!authError) setCheckInStep("location_check")
    }

    fetchData()
  }, [contentId, contentType])

  // -----------------------------
  // 위치 체크 후 사진 단계
  // -----------------------------
  useEffect(() => {
    if (checkInStep === "location_check" && locationAuth.isWithinRange && !locationAuth.isLoading) {
      setTimeout(() => setCheckInStep("photo_capture"), 2000)
    }
  }, [checkInStep, locationAuth.isWithinRange, locationAuth.isLoading])

  // -----------------------------
  // 사진 캡처 핸들러
  // -----------------------------
  const handlePhotoCapture = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setOriginalFile(file)
      // 미리보기용으로 Data URL을 생성하여 photo 상태에 저장
      const reader = new FileReader()
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setPhoto(reader.result)
        }
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("이미지 처리 오류:", error)
      setError("이미지 처리에 실패했습니다.")
    }
  }
  const handlePhotoReset = () => {
    setPhoto(null)
    setOriginalFile(null)
  }

  // -----------------------------
  // 체크인 제출
  // -----------------------------
  const handleCheckIn = async () => {
    if (!originalFile || !spotDetail || !locationAuth.currentLocation || !contentId) {
      setError("필수 정보가 누락되었습니다.")
      return
    }

    setCheckInStep("uploading")
    setUploadProgress(0)
    setError(null)

    try {
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => (prev >= 90 ? (clearInterval(progressInterval), 90) : prev + 10))
      }, 200)

      const checkInData: CheckInData = {
        spotId: contentId,
        photo: originalFile,
        location: locationAuth.currentLocation,
        timestamp: new Date().toISOString(),
        spotName: spotDetail.title,
      }


      const result = await CheckInService.submitCheckIn(checkInData)

      clearInterval(progressInterval)
      setUploadProgress(100)

      if (result.success) {
        setTimeout(() => {
          setCheckInStep("complete")
          setIsCheckedIn(true)

          // isCheckedIn을 활용한 추가 로직
          if (isCheckedIn) {
            // 완료 후 추가 작업 (예: 알림 표시, 데이터 동기화 등)
            onComplete?.() // 부모 컴포넌트로 완료 상태 전달
          }

          setTimeout(() => navigate("/"), 3000)
        }, 1000)
      }
    } catch (error) {
      console.error("체크인 실패:", error)
      setError(error instanceof Error ? error.message : "체크인 처리 중 오류가 발생했습니다.")
      setCheckInStep("photo_capture")
      setUploadProgress(0)
    }
  }

  // -----------------------------
  // 렌더링
  // -----------------------------
  if (loading || checkInStep === "loading") {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <Loader className="w-8 h-8 animate-spin text-blue-500 mx-auto mb-4" />
            <p className="text-gray-600">관광지 정보를 불러오는 중...</p>
          </div>
        </div>
    )
  }

  if (error || authError || !spotDetail) {
    const errorMessage = authError || (error ? error: "관광지를 찾을 수 없습니다")
    const isAuthError = !!authError

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center px-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {isAuthError ? "로그인이 필요합니다" : (error ? error : "오류가 발생했습니다")}
            </h2>
            <p className="text-gray-600 mb-4">
              {isAuthError ? "체크인을 하려면 로그인이 필요합니다." :
                      errorMessage}
            </p>
            <button
                onClick={() => navigate(isAuthError ? "/login" : "/map")}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              {isAuthError ? "로그인하기" : "지도로 돌아가기"}
            </button>
          </div>
        </div>
    )
  }

  switch (checkInStep) {
    case "location_check":
      return <LocationVerification spotDetail={spotDetail} locationAuth={locationAuth} onBack={() => navigate("/map")} />
    case "photo_capture":
      return (
          <div className="min-h-screen bg-gray-50">
            <PhotoCapture
                spotDetail={spotDetail}
                photo={photo}
                originalFile={originalFile}
                locationDistance={locationAuth.distance}
                onPhotoCapture={handlePhotoCapture}
                onPhotoReset={handlePhotoReset}
                onCheckIn={handleCheckIn}
                onBack={() => navigate("/map")}
            />
            {error && (
                <div className="fixed bottom-4 left-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
                  <p className="text-sm">{error}</p>
                  <button onClick={() => setError(null)} className="absolute top-2 right-2 text-red-500 hover:text-red-700">×</button>
                </div>
            )}
          </div>
      )
    case "uploading":
      return <CheckInProgress uploadProgress={uploadProgress} />
    case "complete":
      return <CheckInComplete spotDetail={spotDetail} locationDistance={locationAuth.distance} />
    default:
      return null
  }
}

export default CheckIn