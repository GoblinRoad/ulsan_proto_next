import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { Loader } from "lucide-react";

const AuthCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // URL fragment에서 OAuth 토큰 처리
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');

        if (accessToken) {
          // OAuth 토큰이 있으면 Supabase에서 세션 설정
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) {
            console.error("Session setting error:", error);
            navigate("/login");
            return;
          }

          if (data.session) {
            console.log("OAuth 로그인 성공:", data.session.user.email);
            navigate("/");
            return;
          }
        }

        // 일반적인 세션 확인 (이메일 로그인 등)
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Auth callback error:", error);
          navigate("/login");
          return;
        }

        if (data.session) {
          navigate("/");
        } else {
          navigate("/login");
        }
      } catch (err) {
        console.error("Callback handling error:", err);
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Loader className="w-8 h-8 text-white animate-spin" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">
            로그인 처리 중...
          </h2>
          <p className="text-gray-600">잠시만 기다려주세요</p>
        </div>
      </div>
    </div>
  );
};

export default AuthCallback;
