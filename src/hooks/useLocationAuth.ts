"use client"

import { useState, useEffect, useCallback, useMemo } from "react"
import { testModeManager } from "../data/testData"

interface Coordinates {
    lat: number
    lng: number
}

interface LocationAuthResult {
    isLocationEnabled: boolean
    currentLocation: Coordinates | null
    locationError: string | null
    isWithinRange: boolean
    distance: number | null
    isLoading: boolean

    getCurrentLocation: () => void
    watchLocation: () => (() => void) | undefined
}

interface UseLocationAuthProps {
    targetLocation: Coordinates
    allowedRadius?: number // 미터 단위, 기본값 300m
}

const useLocationAuth = ({ targetLocation, allowedRadius = 300 }: UseLocationAuthProps): LocationAuthResult => {
    const [currentLocation, setCurrentLocation] = useState<Coordinates | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [isLocationEnabled, setIsLocationEnabled] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    // 두 좌표 사이의 거리 계산 (Haversine formula)
    const calculateDistance = useCallback((coord1: Coordinates, coord2: Coordinates): number => {
        const R = 6371e3 // 지구 반지름 (미터)
        const φ1 = (coord1.lat * Math.PI) / 180
        const φ2 = (coord2.lat * Math.PI) / 180
        const Δφ = ((coord2.lat - coord1.lat) * Math.PI) / 180
        const Δλ = ((coord2.lng - coord1.lng) * Math.PI) / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c // 거리 (미터)
    }, [])

    // 위치 정보 가져오기
    const getCurrentLocation = useCallback(() => {
        if (!navigator.geolocation) {
            setLocationError("이 브라우저는 위치 서비스를 지원하지 않습니다.")
            return
        }

        setIsLoading(true)
        setLocationError(null)

        const options = {
            enableHighAccuracy: true, // 높은 정확도 사용
            timeout: 10000, // 10초 타임아웃
            maximumAge: 60000, // 1분간 캐시된 위치 정보 사용
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }

                setCurrentLocation(coords)
                setIsLocationEnabled(true)
                setIsLoading(false)

                console.log("현재 위치:", coords)
                console.log("위치 정확도:", position.coords.accuracy, "m")
            },
            (error) => {
                setIsLoading(false)

                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        setLocationError("위치 정보 접근이 거부되었습니다. 브라우저 설정에서 위치 권한을 허용해주세요.")
                        break
                    case error.POSITION_UNAVAILABLE:
                        setLocationError("위치 정보를 사용할 수 없습니다.")
                        break
                    case error.TIMEOUT:
                        setLocationError("위치 정보 요청 시간이 초과되었습니다.")
                        break
                    default:
                        setLocationError("알 수 없는 오류가 발생했습니다.")
                        break
                }
            },
            options,
        )
    }, [])

    // 실시간 위치 추적 (옵션)
    const watchLocation = useCallback(() => {
        if (!navigator.geolocation) return

        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 30000,
        }

        const watchId = navigator.geolocation.watchPosition(
            (position) => {
                const coords = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                }
                setCurrentLocation(coords)
            },
            (error) => {
                console.error("위치 추적 오류:", error)
            },
            options,
        )

        return () => {
            navigator.geolocation.clearWatch(watchId)
        }
    }, [])

    // 컴포넌트 마운트 시 위치 정보 요청
    useEffect(() => {
        getCurrentLocation()
    }, [getCurrentLocation])

    // 거리 계산 및 범위 내 확인
    const distance = currentLocation ? calculateDistance(currentLocation, targetLocation) : null
    const isWithinRange = useMemo(() => {
        if (testModeManager.isBypassLocationCheck()) {
            console.log("[v0] 테스트 모드: 위치 검증 우회됨")
            return true
        }
        return distance !== null && distance <= allowedRadius
    }, [distance, allowedRadius])

    return {
        isLocationEnabled,
        currentLocation,
        locationError,
        isWithinRange,
        distance,
        isLoading,
        getCurrentLocation,
        watchLocation,
    }
}

export default useLocationAuth
