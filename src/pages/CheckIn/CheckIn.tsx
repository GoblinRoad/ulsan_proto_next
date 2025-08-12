import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Camera, ArrowLeft, MapPin, Coins, CheckCircle } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

const CheckIn: React.FC = () => {
  const { spotId } = useParams<{ spotId: string }>();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const [photo, setPhoto] = useState<string | null>(null);
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const spot = state.touristSpots.find(s => s.id === spotId);

  if (!spot) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-2">관광지를 찾을 수 없습니다</h2>
          <button 
            onClick={() => navigate('/map')}
            className="text-blue-500 hover:text-blue-600"
          >
            지도로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  if (spot.visited) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="max-w-md mx-auto text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">이미 방문하신 곳이에요!</h2>
          <p className="text-gray-600 mb-6">다른 관광지를 탐험해보세요</p>
          <button 
            onClick={() => navigate('/map')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            지도로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const handlePhotoCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhoto(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCheckIn = () => {
    if (!photo) return;
    
    dispatch({ type: 'CHECK_IN_SPOT', payload: { spotId: spot.id, photoUrl: photo } });
    setIsCheckedIn(true);
    
    setTimeout(() => {
      navigate('/');
    }, 3000);
  };

  if (isCheckedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-400 to-emerald-500 p-4">
        <div className="max-w-md mx-auto text-center text-white animate-bounceIn">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Coins className="w-10 h-10 coin-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-2">체크인 완료!</h2>
          <p className="text-green-100 mb-4">{spot.coins} 코인을 획득하셨습니다!</p>
          <div className="bg-white/20 rounded-lg p-4 mb-6">
            <h3 className="font-semibold mb-2">{spot.name}</h3>
            <p className="text-sm text-green-100">{spot.description}</p>
          </div>
          <p className="text-sm text-green-100">잠시 후 홈 화면으로 이동합니다...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => navigate('/map')}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800">체크인</h1>
            <p className="text-sm text-gray-500">{spot.name}</p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* 관광지 정보 */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <div 
            className="w-full h-48 rounded-lg bg-cover bg-center mb-4"
            style={{ backgroundImage: `url(${spot.image})` }}
          />
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800 mb-2">{spot.name}</h2>
              <p className="text-gray-600 mb-3">{spot.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{spot.address}</span>
              </div>
            </div>
            <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 rounded-full">
              <Coins className="w-4 h-4 text-white" />
              <span className="text-white font-bold">{spot.coins}</span>
            </div>
          </div>
        </div>

        {/* 사진 촬영 */}
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
                onChange={handlePhotoCapture}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative">
                <img
                  src={photo}
                  alt="체크인 사진"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  onClick={() => setPhoto(null)}
                  className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-colors"
                >
                  ✕
                </button>
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  다시 촬영
                </button>
                <button
                  onClick={handleCheckIn}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
                >
                  체크인 완료
                </button>
              </div>
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
          </ul>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;