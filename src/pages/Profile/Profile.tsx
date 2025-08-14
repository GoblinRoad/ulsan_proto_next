import React, {useState} from 'react';
import { useApp } from '../../contexts/AppContext';
import UserStats from './components/UserStats';
import Settings from './components/Settings';
import RecentActivity from "./components/RecentActivity.tsx";
import VoucherDetail from "./components/VoucherDetail.tsx";
import MyVouchers from "./components/MyVouchers.tsx";
import VouchersList from "./components/VouchersList.tsx";

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

const Profile: React.FC = () => {
    const { state } = useApp();
    const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null)
    const [showVouchersList, setShowVouchersList] = useState(false)

    const handleVoucherClick = (voucher: Voucher) => {
        setSelectedVoucher(voucher)
    }

    const handleBackToProfile = () => {
        setSelectedVoucher(null)
        setShowVouchersList(false)
    }

    const handleShowVouchersList = () => {
        setShowVouchersList(true)
    }

    const handleBackToVouchersList = () => {
        setSelectedVoucher(null)
    }

    // 상품권 상세 페이지
    if (selectedVoucher) {
        return <VoucherDetail voucher={selectedVoucher} onBack={showVouchersList ? handleBackToVouchersList : handleBackToProfile} />
    }

    // 전체 상품권 목록 페이지
    if (showVouchersList) {
        return <VouchersList onBack={handleBackToProfile} onVoucherClick={handleVoucherClick} />
    }

    // 메인 프로필 페이지
    return (
        <div className="max-w-md mx-auto px-4 py-4 space-y-4">
            <UserStats user={state.user} />
            <MyVouchers onVoucherClick={handleVoucherClick} onShowMore={handleShowVouchersList} />
            <RecentActivity touristSpots={state.touristSpots} />
            <Settings />
        </div>
    );
};

export default Profile;