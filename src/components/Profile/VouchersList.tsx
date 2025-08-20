"use client"

import React from "react"
import { ArrowLeft, Gift, Calendar,  Search, Ticket } from "lucide-react"

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

interface VouchersListProps {
    onBack: () => void
    onVoucherClick: (voucher: Voucher) => void
}

const VouchersList: React.FC<VouchersListProps> = ({ onBack, onVoucherClick }) => {
    const [searchQuery, setSearchQuery] = React.useState("")
    const [selectedFilter, setSelectedFilter] = React.useState("all")

    // 전체 상품권 데이터 (실제로는 API에서 가져올 데이터)
    const allVouchers: Voucher[] = [
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
        {
            id: "4",
            title: "울산사랑상품권",
            subtitle: "50,000원권",
            value: "50,000원",
            purchaseDate: "2024-11-25",
            expiryDate: "2025-11-25",
            status: "active",
            serialNumber: "ULS-2024-001236",
            description: "울산 지역 가맹점에서 사용 가능",
            color: "from-purple-400 to-indigo-400",
        },
        {
            id: "5",
            title: "태화강 카페",
            subtitle: "음료 할인 30%",
            value: "30% 할인",
            purchaseDate: "2024-11-20",
            expiryDate: "2024-12-20",
            status: "expired",
            serialNumber: "THR-2024-002001",
            description: "태화강 국가정원 내 카페",
            color: "from-teal-400 to-green-400",
        },
        {
            id: "6",
            title: "울산사랑상품권",
            subtitle: "20,000원권",
            value: "20,000원",
            purchaseDate: "2024-11-15",
            expiryDate: "2025-11-15",
            status: "active",
            serialNumber: "ULS-2024-001237",
            description: "울산 지역 가맹점에서 사용 가능",
            color: "from-orange-400 to-red-400",
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

    // 필터링된 상품권 목록
    const filteredVouchers = allVouchers.filter(voucher => {
        const matchesSearch = voucher.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            voucher.subtitle.toLowerCase().includes(searchQuery.toLowerCase())

        if (selectedFilter === "all") return matchesSearch
        return matchesSearch && voucher.status === selectedFilter
    })

    const filterOptions = [
        { value: "all", label: "전체", count: allVouchers.length },
        { value: "active", label: "사용가능", count: allVouchers.filter(v => v.status === "active").length },
        { value: "used", label: "사용완료", count: allVouchers.filter(v => v.status === "used").length },
        { value: "expired", label: "만료됨", count: allVouchers.filter(v => v.status === "expired").length },
    ]

    return (
        <div className="max-w-md mx-auto min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="flex items-center justify-between p-4">
                    <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-gray-800">
                        <ArrowLeft className="w-5 h-5" />
                        <span>뒤로</span>
                    </button>
                    <h1 className="text-lg font-semibold text-gray-800">나의 상품권</h1>
                    <div className="w-12"></div> {/* 균형을 위한 빈 공간 */}
                </div>

                {/* 검색바 */}
                <div className="p-4 pt-0">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="상품권 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* 필터 탭 */}
                <div className="px-4 pb-4">
                    <div className="flex space-x-2">
                        {filterOptions.map(option => (
                            <button
                                key={option.value}
                                onClick={() => setSelectedFilter(option.value)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                                    selectedFilter === option.value
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {option.label} ({option.count})
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* 상품권 목록 */}
                {filteredVouchers.length === 0 ? (
                    <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm text-center">
                        <Ticket className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">
                            {searchQuery ? "검색 결과가 없습니다" : "상품권이 없습니다"}
                        </h3>
                        <p className="text-gray-500 text-sm">
                            {searchQuery ? "다른 검색어를 입력해보세요" : "리워드 센터에서 상품권을 교환해보세요!"}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {filteredVouchers.map((voucher, index) => (
                            <div
                                key={voucher.id}
                                onClick={() => onVoucherClick(voucher)}
                                className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:shadow-md cursor-pointer transition-all animate-slideUp"
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div className="flex items-center space-x-4">
                                    <div
                                        className={`w-14 h-14 bg-gradient-to-r ${voucher.color} rounded-xl flex items-center justify-center flex-shrink-0`}
                                    >
                                        <Gift className="w-7 h-7 text-white" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between mb-2">
                                            <h4 className="font-semibold text-gray-800 truncate text-lg">{voucher.title}</h4>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(voucher.status)}`}>
                                                {getStatusText(voucher.status)}
                                            </span>
                                        </div>

                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-gray-600 text-sm">{voucher.subtitle}</p>
                                            <span className="text-blue-600 font-bold text-lg">{voucher.value}</span>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-500">
                                            <div className="flex items-center space-x-1">
                                                <Calendar className="w-3 h-3" />
                                                <span>구매: {voucher.purchaseDate}</span>
                                            </div>
                                            <div className="flex items-center space-x-1">
                                                <span>만료: {voucher.expiryDate}</span>
                                            </div>
                                        </div>

                                        <p className="text-xs text-gray-400 mt-2 truncate">{voucher.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* 통계 정보 */}
                <div className="mt-6 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                    <h3 className="text-sm font-semibold text-gray-600 mb-3">보유 현황</h3>
                    <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                            <div className="text-green-500 font-bold text-xl">
                                {allVouchers.filter(v => v.status === "active").length}
                            </div>
                            <div className="text-xs text-gray-500">사용가능</div>
                        </div>
                        <div>
                            <div className="text-gray-500 font-bold text-xl">
                                {allVouchers.filter(v => v.status === "used").length}
                            </div>
                            <div className="text-xs text-gray-500">사용완료</div>
                        </div>
                        <div>
                            <div className="text-red-500 font-bold text-xl">
                                {allVouchers.filter(v => v.status === "expired").length}
                            </div>
                            <div className="text-xs text-gray-500">만료됨</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VouchersList