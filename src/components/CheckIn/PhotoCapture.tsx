"use client"

import type React from "react"
import { useRef } from "react"
import { Camera, ArrowLeft, CheckCircle, Upload } from "lucide-react"
import type { TourApiDetailItem } from "../../types/tourApi"

interface PhotoCaptureProps {
    spotDetail: TourApiDetailItem
    photo: string | null
    originalFile: File | null
    locationDistance: number | null
    onPhotoCapture: (event: React.ChangeEvent<HTMLInputElement>) => void
    onPhotoReset: () => void
    onCheckIn: () => void
    onBack: () => void
}

const PhotoCapture: React.FC<PhotoCaptureProps> = ({
                                                       spotDetail,
                                                       photo,
                                                       originalFile,
                                                       locationDistance,
                                                       onPhotoCapture,
                                                       onPhotoReset,
                                                       onCheckIn,
                                                       onBack,
                                                   }) => {
    const fileInputRef = useRef<HTMLInputElement>(null)

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 p-4">
                <div className="flex items-center space-x-3">
                    <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg">
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-lg font-bold text-gray-800">인증 사진 촬영</h1>
                        <p className="text-sm text-gray-500">{spotDetail.title}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto p-4 space-y-6">
                {/* 위치 인증 완료 표시 */}
                <div className="bg-green-50 rounded-xl p-4 border border-green-100">
                    <div className="flex items-center space-x-2 text-green-700 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-semibold">위치 인증 완료</span>
                    </div>
                    <p className="text-sm text-green-600">관광지 현장에서 체크인 가능 (거리: {locationDistance?.toFixed(0)}m)</p>
                </div>

                {/* 사진 촬영 섹션 */}
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
                                onChange={onPhotoCapture}
                                className="hidden"
                            />
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="relative">
                                <img
                                    src={photo || "/placeholder.svg"}
                                    alt="체크인 사진"
                                    className="w-full h-64 object-cover rounded-lg"
                                />
                                <button
                                    onClick={onPhotoReset}
                                    className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                                >
                                    ✕
                                </button>
                                {originalFile && (
                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                                        {(originalFile.size / 1024 / 1024).toFixed(1)}MB → 최적화됨
                                    </div>
                                )}
                            </div>
                            <div className="flex space-x-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                                >
                                    다시 촬영
                                </button>
                                <button
                                    onClick={onCheckIn}
                                    className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center justify-center space-x-2"
                                >
                                    <Upload className="w-4 h-4" />
                                    <span>체크인 완료</span>
                                </button>
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                capture="environment"
                                onChange={onPhotoCapture}
                                className="hidden"
                            />
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
                        <li>• 사진은 자동으로 최적화되어 업로드됩니다</li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default PhotoCapture
