import React, { useState } from "react";
import { useApp } from "@/contexts/AppContext";
import { useAuth } from "@/contexts/AuthContext";
import UserStats from "@/components/Profile/UserStats";
import Settings from "@/components/Profile/Settings";
import RecentActivity from "@/components/Profile/RecentActivity.tsx";
import VoucherDetail from "@/components/Profile/VoucherDetail.tsx";
import MyVouchers from "@/components/Profile/MyVouchers.tsx";
import VouchersList from "@/components/Profile/VouchersList.tsx";
import { Link } from "react-router-dom";
import { User, LogIn } from "lucide-react";

interface Voucher {
  id: string;
  title: string;
  subtitle: string;
  value: string;
  purchaseDate: string;
  expiryDate: string;
  status: "active" | "used" | "expired";
  serialNumber: string;
  description: string;
  color: string;
}

const Profile: React.FC = () => {
  const { state } = useApp();
  const { user, loading } = useAuth();
  const [selectedVoucher, setSelectedVoucher] = useState<Voucher | null>(null);
  const [showVouchersList, setShowVouchersList] = useState(false);

  const handleVoucherClick = (voucher: Voucher) => {
    setSelectedVoucher(voucher);
  };

  const handleBackToProfile = () => {
    setSelectedVoucher(null);
    setShowVouchersList(false);
  };

  const handleShowVouchersList = () => {
    setShowVouchersList(true);
  };

  const handleBackToVouchersList = () => {
    setSelectedVoucher(null);
  };

  // 로딩 중
  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  // 로그인되지 않은 경우
  if (!user) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <User className="w-10 h-10 text-gray-400" />
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            로그인이 필요합니다
          </h2>

          <p className="text-gray-600 mb-8 leading-relaxed">
            프로필과 상품권을 확인하려면
            <br />
            로그인해 주세요
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <LogIn className="w-5 h-5" />
              <span>로그인하기</span>
            </Link>

            <Link
              to="/signup"
              className="w-full bg-gray-100 text-gray-700 py-4 rounded-xl font-semibold text-lg hover:bg-gray-200 transition-colors block"
            >
              계정 만들기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 상품권 상세 페이지
  if (selectedVoucher) {
    return (
      <VoucherDetail
        voucher={selectedVoucher}
        onBack={
          showVouchersList ? handleBackToVouchersList : handleBackToProfile
        }
      />
    );
  }

  // 전체 상품권 목록 페이지
  if (showVouchersList) {
    return (
      <VouchersList
        onBack={handleBackToProfile}
        onVoucherClick={handleVoucherClick}
      />
    );
  }

  // 메인 프로필 페이지
  return (
    <div className="max-w-md mx-auto px-4 py-4 space-y-4">
      <UserStats user={state.user} />
      <MyVouchers
        onVoucherClick={handleVoucherClick}
        onShowMore={handleShowVouchersList}
      />
      <RecentActivity touristSpots={state.touristSpots} />
      <Settings />
    </div>
  );
};

export default Profile;
