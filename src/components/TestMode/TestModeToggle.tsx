"use client"

import type React from "react"
import { useState } from "react"
import { Settings, MapPin, CheckCircle, XCircle } from "lucide-react"
import { TEST_CURRENT_LOCATION } from "../../data/testData"
import { useApp } from "@/contexts/AppContext"

const TestModeToggle: React.FC = () => {
    const { isTestMode, bypassLocationCheck, toggleTestMode, setBypassLocationCheck } = useApp()
    const [showPanel, setShowPanel] = useState(false)

    // if (!isDevelopment) {
    //     return null
    // }

    return (
        <div className="relative">
            {/* 테스트 모드 토글 버튼 */}
            <button
                onClick={() => setShowPanel(!showPanel)}
                className={`p-2 rounded-full shadow-lg transition-colors ${
                    isTestMode ? "bg-green-500 text-white" : "bg-gray-600 text-white"
                }`}
                title="개발자 테스트 모드"
            >
                <Settings className="w-4 h-4" />
            </button>

            {/* 테스트 모드 패널 */}
            {showPanel && (
                <div className="absolute top-12 right-0 z-50 bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-80">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold text-gray-800">개발자 테스트 모드</h3>
                        <button onClick={() => setShowPanel(false)} className="text-gray-400 hover:text-gray-600">
                            ×
                        </button>
                    </div>

                    <div className="space-y-4">
                        {/* 테스트 모드 토글 */}
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium text-gray-700">테스트 모드</p>
                                <p className="text-sm text-gray-500">가상 관광지 데이터 표시</p>
                            </div>
                            <button
                                onClick={toggleTestMode}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                    isTestMode ? "bg-green-500" : "bg-gray-300"
                                }`}
                            >
                <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        isTestMode ? "translate-x-6" : "translate-x-1"
                    }`}
                />
                            </button>
                        </div>

                        {/* 위치 검증 우회 */}
                        {isTestMode && (
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-gray-700">위치 검증 우회</p>
                                    <p className="text-sm text-gray-500">어디서든 체크인 가능</p>
                                </div>
                                <button
                                    onClick={() => setBypassLocationCheck(!bypassLocationCheck)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                                        bypassLocationCheck ? "bg-orange-500" : "bg-gray-300"
                                    }`}
                                >
                  <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          bypassLocationCheck ? "translate-x-6" : "translate-x-1"
                      }`}
                  />
                                </button>
                            </div>
                        )}

                        {/* 현재 위치 정보 */}
                        <div className="border-t pt-4">
                            <p className="font-medium text-gray-700 mb-2">현재 테스트 위치</p>
                            <div className="bg-gray-50 rounded-lg p-3">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <MapPin className="w-4 h-4" />
                                    <span>위도: {TEST_CURRENT_LOCATION.lat.toFixed(6)}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                                    <MapPin className="w-4 h-4" />
                                    <span>경도: {TEST_CURRENT_LOCATION.lng.toFixed(6)}</span>
                                </div>
                            </div>
                        </div>

                        {/* 테스트 관광지 목록 */}
                        {isTestMode && (
                            <div className="border-t pt-4">
                                <p className="font-medium text-gray-700 mb-2">테스트 관광지</p>
                                <div className="space-y-2">
                                    <div className="flex items-center space-x-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>현재 위치 관광지 (10m)</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                        <span>근처 카페 (50m)</span>
                                    </div>
                                    <div className="flex items-center space-x-2 text-sm">
                                        <XCircle className="w-4 h-4 text-red-500" />
                                        <span>멀리 있는 관광지 (1km)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="text-xs text-gray-400 border-t pt-2">개발 환경에서만 표시됩니다</div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default TestModeToggle