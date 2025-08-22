"use client"

import type React from "react"
import { Gift, Calendar, ChevronRight, Ticket } from "lucide-react"

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

interface MyVouchersProps {
    onVoucherClick: (voucher: Voucher) => void
    onShowMore: () => void
}

const MyVouchers: React.FC<MyVouchersProps> = ({ onVoucherClick, onShowMore }) => {
    // 실제 앱에서는 사용자의 구매한 상품권 데이터를 가져옴
    const myVouchers: Voucher[] = [
        {
            id: "1",
            title: "울산사랑상품권",
            subtitle: "10,000원권",
            value: "10,000원",
            purchaseDate: "2024-12-10",
            expiryDate: "2025-12-10",
            status: "active",
            serialNumber: "ULS-2024-001234",
            description: "울산 지역 가맹점에서 사용 가능",
            color: "from-green-400 to-emerald-400",
        },
        {
            id: "2",
            title: "울산사랑상품권",
            subtitle: "5,000원권",
            value: "5,000원",
            purchaseDate: "2024-12-08",
            expiryDate: "2025-12-08",
            status: "active",
            serialNumber: "ULS-2024-001235",
            description: "울산 지역 가맹점에서 사용 가능",
            color: "from-blue-400 to-cyan-400",
        },
        {
            id: "3",
            title: "고래고기 맛집",
            subtitle: "할인쿠폰 20%",
            value: "20% 할인",
            purchaseDate: "2024-12-05",
            expiryDate: "2024-12-31",
            status: "used",
            serialNumber: "WHM-2024-001001",
            description: "장생포 지역 고래고기 전문점",
            color: "from-red-400 to-pink-400",
        },
    ]

    const getStatusColor = (status: string) => {
        switch (status) {
            case "active":
                return "bg-green-100 text-green-600"
            case "used":
                return "bg-gray-100 text-gray-600"
            case "expired":
                return "bg-red-100 text-red-600"
            default:
                return "bg-gray-100 text-gray-600"
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

    if (myVouchers.length === 0) {
        return (
            <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm">
                <div className="text-center">
                    <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">보유한 상품권이 없습니다</h3>
                    <p className="text-gray-500 text-sm">리워드 센터에서 상품권을 교환해보세요!</p>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="p-4 border-b border-gray-100">
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                        <Gift className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-semibold text-gray-800">나의 상품권</h3>
                        <span className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                {myVouchers.filter((v) => v.status === "active").length}개
            </span>
                    </div>
                    <button
                        onClick={onShowMore}
                        className="text-sm text-blue-500 hover:underline"
                    >
                        더보기
                    </button>
                </div>
            </div>

            <div className="p-4 space-y-3">
                {myVouchers.map((voucher, index) => (
                    <div
                        key={voucher.id}
                        onClick={() => onVoucherClick(voucher)}
                        className="flex items-center space-x-4 p-3 rounded-lg border border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors animate-slideUp"
                        style={{ animationDelay: `${index * 0.1}s` }}
                    >
                        <div
                            className={`w-12 h-12 bg-gradient-to-r ${voucher.color} rounded-lg flex items-center justify-center flex-shrink-0`}
                        >
                            <Gift className="w-6 h-6 text-white" />
                        </div>

                        <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="font-medium text-gray-800 truncate">{voucher.title}</h4>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                  {getStatusText(voucher.status)}
                </span>
                            </div>
                            <p className="text-sm text-gray-600">{voucher.subtitle}</p>
                            <div className="flex items-center justify-between mt-2">
                                <div className="flex items-center space-x-1 text-xs text-gray-500">
                                    <Calendar className="w-3 h-3" />
                                    <span>구매: {voucher.purchaseDate}</span>
                                </div>
                                <ChevronRight className="w-4 h-4 text-gray-400" />
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MyVouchers