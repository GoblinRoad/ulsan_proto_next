import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Shield,
  FileText,
  AlertTriangle,
  ChevronRight,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";

const PrivacySettings: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // 로그인 방식 판별
  const getLoginMethod = () => {
    if (user?.app_metadata?.provider === "kakao") {
      return "카카오 로그인";
    }
    return "이메일 로그인";
  };

  const getLastLoginTime = () => {
    if (user?.last_sign_in_at) {
      return new Date(user.last_sign_in_at).toLocaleString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "정보 없음";
  };

  // 회원 탈퇴 처리
  const handleDeleteAccount = async () => {
    setDeleteLoading(true);
    try {
      await signOut();
      navigate("/login");
      // TODO: 실제 계정 삭제 API 호출
    } catch (error) {
      console.error("계정 삭제 중 오류:", error);
      alert("계정 삭제 중 오류가 발생했습니다.");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const accountInfo = [
    { label: "이메일", value: user?.email || "정보 없음" },
    { label: "로그인 방식", value: getLoginMethod() },
    { label: "마지막 로그인", value: getLastLoginTime() },
  ];

  const privacyItems = [
    {
      label: "개인정보 처리방침",
      description: "개인정보 수집 및 이용에 대한 정책",
      action: () => {
        alert("개인정보 처리방침 페이지로 이동합니다.");
      },
    },
    {
      label: "앱 내 권한 안내",
      description: "위치, 카메라 등 앱 권한 설명",
      action: () => {
        alert("앱 권한 안내 페이지로 이동합니다.");
      },
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/profile")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">
              개인정보 및 보안
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* 계정 정보 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">계정 정보</h3>
          </div>

          <div className="space-y-3">
            {accountInfo.map(({ label, value }, index) => (
              <div
                key={label}
                className="flex justify-between items-center py-2 animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-sm text-gray-600">{label}</span>
                <span className="text-sm text-gray-800 font-medium">
                  {value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 개인정보 및 권한 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">
              개인정보 및 권한
            </h3>
          </div>

          <div className="space-y-1">
            {privacyItems.map(({ label, description, action }, index) => (
              <button
                key={label}
                onClick={action}
                className="w-full flex items-center justify-between p-3 text-left hover:bg-gray-50 rounded-lg transition-colors animate-slideUp"
                style={{ animationDelay: `${(index + 3) * 0.1}s` }}
              >
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {label}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {description}
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            ))}
          </div>
        </div>

        {/* 회원 탈퇴 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">계정 관리</h3>
          </div>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full p-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition-colors animate-slideUp"
            style={{ animationDelay: "0.5s" }}
          >
            <div className="text-sm font-medium">회원 탈퇴</div>
            <div className="text-xs text-red-400 mt-1">
              계정 및 모든 데이터가 영구적으로 삭제됩니다
            </div>
          </button>
        </div>
      </div>

      {/* 회원 탈퇴 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full animate-slideUp">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                정말 탈퇴하시겠습니까?
              </h3>
              <p className="text-sm text-gray-600">
                계정 탈퇴 시 모든 데이터가 영구적으로 삭제되며 복구할 수
                없습니다.
              </p>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 px-4 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                disabled={deleteLoading}
              >
                취소
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteLoading}
                className="flex-1 py-3 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleteLoading ? "처리 중..." : "탈퇴하기"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PrivacySettings;
