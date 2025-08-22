"use client"

import type React from "react"
import { ArrowLeft, Gift, Calendar, Clock, Hash, MapPin, Phone, Share2, Download } from "lucide-react"

interface Voucher {
    id: string
    title: string
    subtitle: string
    value: string
    purchaseDate: string
    expiryDate: string
    status: "active" | "used" | "expired"
    serialNumber: string
    description: string
    color: string
}

interface VoucherDetailProps {
    voucher: Voucher
    onBack: () => void
}

const VoucherDetail: React.FC<VoucherDetailProps> = ({ voucher, onBack }) => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-600 border-green-200"
            case "used":
                return "bg-gray-100 text-gray-600 border-gray-200"
            case "expired":
                return "bg-red-100 text-red-600 border-red-200"
            default:
                return "bg-gray-100 text-gray-600 border-gray-200"
        }
    }

    const getStatusText = (status: string) => {
        switch (status) {
            case "active":
                return "사용가능"
            case "used":
                return "사용완료"
            case "expired":
                return "만료됨"
            default:
                return "알 수 없음"
        }
    }

    const handleShare = () => {
        // 상품권 공유 기능
        if (navigator.share) {
            navigator.share({
                title: voucher.title,
                text: `${voucher.title} ${voucher.subtitle}`,
                url: window.location.href,
            })
        } else {
            // 폴백: 클립보드에 복사
            navigator.clipboard.writeText(`${voucher.title} ${voucher.subtitle} - ${voucher.serialNumber}`)
            alert("상품권 정보가 클립보드에 복사되었습니다.")
        }
    }

    const handleDownload = () => {
        // 상품권 이미지 다운로드 기능
        alert("상품권 이미지를 다운로드합니다.")
    }

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="flex items-center justify-between p-4">
                    <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                        <span>뒤로</span>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">상품권 상세</h1>
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleShare}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                        >
                            <Share2 className="w-5 h-5" />
                        </button>
                        <button
                            onClick={handleDownload}
                            className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg"
                        >
                            <Download className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-4 space-y-4">
                {/* 상품권 카드 */}
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                    <div className="text-center mb-6">
                        <div
                            className={`w-20 h-20 bg-gradient-to-r ${voucher.color} rounded-2xl flex items-center justify-center mx-auto mb-4`}
                        >
                            <Gift className="w-10 h-10 text-white" />
                        </div>
                        <h2 className="text-xl font-bold text-gray-800 mb-1">{voucher.title}</h2>
                        <p className="text-gray-600">{voucher.subtitle}</p>
                        <div className="mt-4">
                            <span className="text-3xl font-bold text-blue-600">{voucher.value}</span>
                        </div>
                    </div>

                    {/* 상태 */}
                    <div className="flex justify-center mb-6">
            <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(voucher.status)}`}>
              {getStatusText(voucher.status)}
            </span>
                    </div>

                    {/* QR 코드 영역 (실제로는 QR 코드 생성) */}
                    <div className="bg-gray-100 rounded-lg p-8 text-center mb-4">
                        <div className="w-32 h-32 bg-white rounded-lg mx-auto flex items-center justify-center border-2 border-dashed border-gray-300">
                            <div className="text-center">
                                <Hash className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                <p className="text-xs text-gray-500">QR 코드</p>
                            </div>
                        </div>
                    </div>

                    {/* 시리얼 번호 */}
                    <div className="text-center">
                        <p className="text-xs text-gray-500 mb-1">상품권 번호</p>
                        <p className="font-mono text-sm text-gray-800 bg-gray-50 px-3 py-2 rounded-lg">{voucher.serialNumber}</p>
                    </div>
                </div>

                {/* 상품권 정보 */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">상품권 정보</h3>

                    <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">구매일</p>
                                <p className="font-medium text-gray-800">{voucher.purchaseDate}</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <Clock className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">유효기간</p>
                                <p className="font-medium text-gray-800">{voucher.expiryDate}까지</p>
                            </div>
                        </div>

                        <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-gray-400" />
                            <div>
                                <p className="text-sm text-gray-500">사용처</p>
                                <p className="font-medium text-gray-800">{voucher.description}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 사용 안내 */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">사용 안내</h3>

                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <p>가맹점에서 QR 코드를 제시하거나 상품권 번호를 알려주세요.</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <p>유효기간 내에 사용하지 않으면 자동으로 만료됩니다.</p>
                        </div>
                        <div className="flex items-start space-x-2">
                            <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0"></span>
                            <p>분실 시 재발급이 불가능하니 주의해주세요.</p>
                        </div>
                    </div>
                </div>

                {/* 고객센터 */}
                <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">고객센터</h3>

                    <div className="flex items-center space-x-3">
                        <Phone className="w-5 h-5 text-gray-400" />
                        <div>
                            <p className="text-sm text-gray-500">문의전화</p>
                            <p className="font-medium text-blue-600">052-123-4567</p>
                        </div>
                    </div>

                    <p className="text-xs text-gray-500 mt-3">평일 09:00 - 18:00 (점심시간 12:00 - 13:00 제외)</p>
                </div>

                {/* 사용하기 버튼 */}
                {voucher.status === "active" && (
                    <div className="sticky bottom-4">
                        <button className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors shadow-lg">
                            상품권 사용하기
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default VoucherDetail
