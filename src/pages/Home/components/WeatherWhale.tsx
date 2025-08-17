import React from 'react';
import { useWeatherApi } from '../../../hooks/useWeatherApi';
import { WeatherCondition } from '../../../types/weather';

type WeatherVariant = 'dayClear' | 'nightClear' | 'cloudy' | 'rain' | 'snow' | 'overcast';

const conditionToVariant = (condition: WeatherCondition, isNight: boolean): WeatherVariant => {
  switch (condition) {
    case 'sunny':
      return isNight ? 'nightClear' : 'dayClear';
    case 'cloudy':
      return 'cloudy';
    case 'overcast':
      return 'overcast';
    case 'rainy':
      return 'rain';
    case 'snowy':
      return 'snow';
    default:
      return isNight ? 'nightClear' : 'dayClear';
  }
};

const variantToGradient: Record<WeatherVariant, string> = {
  dayClear: 'from-sky-400 to-blue-600',
  nightClear: 'from-indigo-800 to-blue-900',
  cloudy: 'from-slate-400 to-sky-600',
  overcast: 'from-gray-500 to-slate-600',
  rain: 'from-indigo-600 to-slate-700',
  snow: 'from-sky-200 to-blue-400'
};

const WeatherWhale: React.FC = () => {
  const { weatherData, weatherCondition, loading, error } = useWeatherApi();

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 18 || currentHour < 6;

  const variant = conditionToVariant(weatherCondition, isNight);

  if (loading) {
    return (
        <div className="bg-gradient-to-r from-sky-400 to-blue-600 rounded-2xl p-4 min-h-[150px] flex items-center justify-center">
          <div className="text-white text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
            <p className="text-sm">날씨 정보를 불러오는 중...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="bg-gradient-to-r from-gray-400 to-gray-600 rounded-2xl p-4 min-h-[150px] flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-sm mb-2">날씨 정보를 불러올 수 없습니다</p>
            <p className="text-xs opacity-75">{error}</p>
          </div>
        </div>
    );
  }

  const formatTime = (fcstTime: string) => {
    if (!fcstTime || fcstTime.length !== 4) return '';
    const hour = fcstTime.slice(0, 2);
    const minute = fcstTime.slice(2, 4);
    return `${hour}:${minute}`;
  };

  return (
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${variantToGradient[variant]} min-h-[150px]`}>
        {/* 배경 SVG */}
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-20">
          {/* Hills */}
          <defs>
            <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
            </linearGradient>
          </defs>
          <path d="M0 150 C 80 120, 160 180, 240 150 C 300 130, 340 160, 400 150 L 400 200 L 0 200 Z" fill="url(#hillGrad)" />

          {/* Whale silhouette */}
          <path
              d="M120 120 c 30 -35 80 -40 120 -20 c 10 5 25 10 35 8 c -5 8 -15 15 -25 17 c 5 10 5 18 0 26 c -10 -6 -20 -10 -33 -10 c -20 20 -60 22 -92 8 c -10 -4 -18 -12 -20 -20 c -2 -8 3 -15 15 -9 z"
              fill="#ffffff"
              opacity="0.9"
          />

          {/* Bubbles - 날씨에 따라 다르게 표시 */}
          {weatherCondition === 'rainy' && (
              <g>
                {/* 빗방울 */}
                <circle cx="95" cy="60" r="1.5" fill="#ffffff" opacity="0.8">
                  <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,80; 0,160"
                      dur="2s"
                      repeatCount="indefinite"
                  />
                </circle>
                <circle cx="110" cy="50" r="1.2" fill="#ffffff" opacity="0.7">
                  <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,90; 0,180"
                      dur="2.5s"
                      repeatCount="indefinite"
                  />
                </circle>
                <circle cx="85" cy="70" r="1.3" fill="#ffffff" opacity="0.6">
                  <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="0,0; 0,70; 0,140"
                      dur="1.8s"
                      repeatCount="indefinite"
                  />
                </circle>
              </g>
          )}

          {weatherCondition === 'snowy' && (
              <g>
                {/* 눈송이 */}
                <g transform="translate(95, 60)" fill="#ffffff" opacity="0.8">
                  <path d="M0,-3 L0,3 M-3,0 L3,0 M-2,-2 L2,2 M-2,2 L2,-2" stroke="#ffffff" strokeWidth="0.5" />
                  <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="95,60; 95,140; 95,220"
                      dur="4s"
                      repeatCount="indefinite"
                  />
                </g>
                <g transform="translate(110, 50)" fill="#ffffff" opacity="0.7">
                  <path d="M0,-2.5 L0,2.5 M-2.5,0 L2.5,0 M-1.8,-1.8 L1.8,1.8 M-1.8,1.8 L1.8,-1.8" stroke="#ffffff" strokeWidth="0.4" />
                  <animateTransform
                      attributeName="transform"
                      type="translate"
                      values="110,50; 110,130; 110,210"
                      dur="4.5s"
                      repeatCount="indefinite"
                  />
                </g>
              </g>
          )}

          {(weatherCondition === 'sunny' || weatherCondition === 'cloudy') && (
              <g>
                {/* 기본 거품들 */}
                <circle cx="95" cy="130" r="3" fill="#ffffff" opacity="0.6" />
                <circle cx="90" cy="140" r="2" fill="#ffffff" opacity="0.5" />
                <circle cx="100" cy="145" r="1.8" fill="#ffffff" opacity="0.5" />
              </g>
          )}

          {/* 구름 - 날씨에 따라 개수 조절 */}
          <g fill="#ffffff" opacity={weatherCondition === 'overcast' ? "0.8" : "0.5"}>
            <ellipse cx="60" cy="40" rx="20" ry="8" />
            <ellipse cx="85" cy="42" rx="12" ry="6" />
            {(weatherCondition === 'cloudy' || weatherCondition === 'overcast') && (
                <>
                  <ellipse cx="150" cy="35" rx="15" ry="7" />
                  <ellipse cx="180" cy="38" rx="18" ry="8" />
                </>
            )}
            <ellipse cx="300" cy="36" rx="18" ry="7" />
            <ellipse cx="320" cy="38" rx="10" ry="5" />
          </g>

          {/* 태양 (맑은 날씨일 때만) */}
          {weatherCondition === 'sunny' && !isNight && (
              <g>
                <circle cx="350" cy="50" r="15" fill="#ffffff" opacity="0.7" />
                <g stroke="#ffffff" strokeWidth="2" opacity="0.5">
                  <line x1="350" y1="25" x2="350" y2="35" />
                  <line x1="350" y1="65" x2="350" y2="75" />
                  <line x1="325" y1="50" x2="335" y2="50" />
                  <line x1="365" y1="50" x2="375" y2="50" />
                  <line x1="332" y1="32" x2="339" y2="39" />
                  <line x1="361" y1="61" x2="368" y2="68" />
                  <line x1="368" y1="32" x2="361" y2="39" />
                  <line x1="339" y1="61" x2="332" y2="68" />
                </g>
              </g>
          )}

          {/* 달 (밤일 때) */}
          {isNight && weatherCondition !== 'overcast' && (
              <g>
                <circle cx="350" cy="50" r="12" fill="#ffffff" opacity="0.6" />
                <circle cx="348" cy="47" r="10" fill="#ffffff" opacity="0.3" />
              </g>
          )}
        </svg>

        {/* 날씨 정보 오버레이 */}
        <div className="relative z-10 p-4 h-full flex flex-col justify-between">
          <div className="text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">울산 날씨</h3>
                <p className="text-sm opacity-90">
                  {weatherData && formatTime(weatherData.fcstTime)} 예보
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">{weatherData?.temperature}°</p>
                <p className="text-sm opacity-90">습도 {weatherData?.humidity}%</p>
              </div>
            </div>
          </div>

          <div className="text-white">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <span>강수 {weatherData?.rainProbability}%</span>
                <span>바람 {weatherData?.windSpeed}m/s</span>
              </div>
              <div>
                {weatherData?.precipitation !== '강수없음' && (
                    <span>{weatherData?.precipitation}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};

export default WeatherWhale;