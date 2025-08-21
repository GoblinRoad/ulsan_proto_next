import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Loader, ArrowLeft, Key } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const ResetPassword: React.FC = () => {
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { error } = await resetPassword(email);
      if (error) {
        if (error.message.includes("rate limit")) {
          setError("너무 많은 요청이 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError("비밀번호 재설정 이메일 발송 중 오류가 발생했습니다.");
        }
      } else {
        setSuccess(true);
      }
    } catch (err) {
      setError("비밀번호 재설정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="max-w-md mx-auto px-4 py-3">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => navigate("/login")}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <h1 className="text-lg font-bold text-gray-800">비밀번호 재설정</h1>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 py-8">
          <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 text-center animate-slideUp">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-green-500" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              이메일을 확인해주세요
            </h2>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              <span className="font-medium text-blue-600">{email}</span>로
              <br />
              비밀번호 재설정 링크를 발송했습니다.
              <br />
              <br />
              이메일을 확인하고 링크를 클릭하여
              <br />
              새로운 비밀번호를 설정해주세요.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors"
            >
              로그인 페이지로 돌아가기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/login")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">비밀번호 재설정</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slideUp">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Key className="w-10 h-10 text-blue-500" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">비밀번호 재설정</h2>
            <p className="text-sm text-gray-500">
              가입하신 이메일 주소를 입력해주세요
              <br />
              비밀번호 재설정 링크를 보내드립니다
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="이메일을 입력하세요"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-4 rounded-lg font-semibold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center mt-6"
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                "재설정 링크 보내기"
              )}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-500 text-center leading-relaxed">
              이메일이 도착하지 않았나요?
              <br />
              스팸함을 확인하거나 몇 분 후 다시 시도해주세요.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;