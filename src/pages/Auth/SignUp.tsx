import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Eye, EyeOff, Loader, ArrowLeft, User } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";

const SignUp: React.FC = () => {
  const { signUp, signInWithKakao } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const { error } = await signUp(email, password, fullName);
      if (error) {
        setError(error.message);
      } else {
        setSuccess("회원가입이 완료되었습니다! 이메일을 확인해주세요.");
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      setError("회원가입 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleKakaoLogin = async () => {
    try {
      await signInWithKakao();
    } catch (err) {
      setError("카카오 로그인 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate("/")}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-800">회원가입</h1>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 animate-slideUp">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">울</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              계정 만들기
            </h2>
            <p className="text-gray-600">울산 여행을 시작해보세요</p>
          </div>

          {/* Alert Messages */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Sign Up Form */}
          <form onSubmit={handleSignUp} className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="이름을 입력하세요"
                  required
                />
              </div>
            </div>

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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                  placeholder="비밀번호를 입력하세요"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                최소 6자 이상 입력해주세요
              </p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <Loader className="w-6 h-6 animate-spin" />
              ) : (
                "가입하기"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">또는</span>
            </div>
          </div>

          {/* Kakao Login */}
          <button
            onClick={handleKakaoLogin}
            className="w-full bg-yellow-400 text-gray-900 py-4 rounded-xl font-semibold text-lg hover:bg-yellow-500 transition-colors flex items-center justify-center space-x-2"
          >
            <span className="text-xl">🗣</span>
            <span>카카오로 계속하기</span>
          </button>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link
                to="/login"
                className="text-blue-500 font-medium hover:text-blue-600"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
