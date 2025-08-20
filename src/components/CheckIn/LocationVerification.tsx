"use client"

import type React from "react"
import { Navigation, CheckCircle, XCircle, RefreshCw, MapPin, Coins } from "lucide-react"
import type { TourApiDetailItem } from "../../types/tourApi"

interface LocationVerificationProps {
    spotDetail: TourApiDetailItem
    locationAuth: {
        isLoading: boolean
        locationError: string | null
        isWithinRange: boolean
        distance: number | null
        getCurrentLocation: () => void
    }
    onBack: () => void
}

const LocationVerification: React.FC<LocationVerificationProps> = ({ spotDetail, locationAuth, onBack }) => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                        <Navigation className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">위치 확인</h1>
                        <p className="text-sm text-gray-500">{spotDetail.title}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4">
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 text-center">
                    {locationAuth.isLoading ? (
                        <>
                            <Navigation className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">위치 확인 중...</h3>
                            <p className="text-gray-600 text-sm">현재 위치를 확인하고 있습니다.</p>
                            <div className="mt-4 text-xs text-gray-500">위치 서비스가 활성화되어 있는지 확인해주세요.</div>
                        </>
                    ) : locationAuth.locationError ? (
                        <>
                            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-red-600 mb-2">위치 확인 실패</h3>
                            <p className="text-red-600 text-sm mb-4">{locationAuth.locationError}</p>
                            <button
                                onClick={locationAuth.getCurrentLocation}
                                className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                            >
                                <RefreshCw className="w-4 h-4" />
                                <span>다시 시도</span>
                            </button>
                            <div className="mt-4 text-xs text-gray-500 space-y-1">
                                <p>• 브라우저 설정에서 위치 권한을 허용해주세요</p>
                                <p>• GPS가 켜져있는지 확인해주세요</p>
                            </div>
                        </>
                    ) : locationAuth.isWithinRange ? (
                        <>
                            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-green-600 mb-2">위치 확인 완료!</h3>
                            <p className="text-gray-600 text-sm mb-2">관광지 현장에서 체크인이 가능합니다.</p>
                            <p className="text-sm text-gray-500">현재 위치로부터 {locationAuth.distance?.toFixed(0)}m 거리</p>
                            <div className="mt-4 text-sm text-green-600 animate-pulse">잠시 후 사진 촬영 화면으로 이동합니다...</div>
                        </>
                    ) : (
                        <>
                            <XCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                            <h3 className="text-lg font-semibold text-orange-600 mb-2">관광지 근처가 아닙니다</h3>
                            <p className="text-gray-600 text-sm mb-2">관광지에서 300m 이내에 있어야 체크인할 수 있습니다.</p>
                            {locationAuth.distance && (
                                <p className="text-sm text-orange-600 mb-4">
                                    현재 위치로부터 {(locationAuth.distance / 1000).toFixed(1)}km 거리
                                </p>
                            )}
                            <div className="space-y-2">
                                <button
                                    onClick={locationAuth.getCurrentLocation}
                                    className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mx-auto"
                                >
                                    <RefreshCw className="w-4 h-4" />
                                    <span>위치 다시 확인</span>
                                </button>
                                <p className="text-xs text-gray-500">관광지로 이동한 후 다시 시도해주세요.</p>
                            </div>
                        </>
                    )}
                </div>

                {/* 관광지 정보 미리보기 */}
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mt-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">체크인 예정 관광지</h3>
                    {spotDetail.firstimage && (
                        <div
                            className="w-full h-32 rounded-lg bg-cover bg-center mb-3"
                            style={{ backgroundImage: `url(${spotDetail.firstimage})` }}
                        />
                    )}
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-gray-800">{spotDetail.title}</h4>
                            <p className="text-sm text-gray-500 flex items-center mt-1">
                                <MapPin className="w-3 h-3 mr-1" />
                                {spotDetail.addr1}
                            </p>
                        </div>
                        <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 rounded-full">
                            <Coins className="w-4 h-4 text-white" />
                            <span className="text-white font-bold">100</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LocationVerification
