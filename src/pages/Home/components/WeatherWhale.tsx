import React from 'react';
import { Sun, CloudSun, Wind, Moon } from 'lucide-react';
import { useWeatherApi } from '../../../hooks/useWeatherApi';
import { WeatherCondition } from '../../../types/weather';

type WeatherVariant = 'dayClear' | 'nightClear' | 'cloudy' | 'rain' | 'snow';

const conditionToVariant = (condition: WeatherCondition, isNight: boolean): WeatherVariant => {
  switch (condition) {
    case 'sunny':
      return isNight ? 'nightClear' : 'dayClear';
    case 'cloudy':
    case 'overcast':
      return 'cloudy';
    case 'rainy':
      return 'rain';
    case 'snowy':
      return 'snow';
    default:
      return isNight ? 'nightClear' : 'dayClear';
  }
};

const conditionToKorean = (condition: WeatherCondition) => {
  switch (condition) {
    case 'sunny':
      return '맑음';
    case 'cloudy':
      return '구름많음';
    case 'overcast':
      return '흐림';
    case 'rainy':
      return '비';
    case 'snowy':
      return '눈';
    default:
      return '맑음';
  }
};

const variantToGradient: Record<WeatherVariant, string> = {
  dayClear: 'from-sky-400 to-blue-600',
  nightClear: 'from-indigo-800 to-blue-900',
  cloudy: 'from-slate-400 to-sky-600',
  rain: 'from-indigo-600 to-slate-700',
  snow: 'from-sky-200 to-blue-400'
};

//체감온도 공식
const calculateFeelsLike = (temp: number, windSpeed: number, humidity: number) => {
  if (temp >= 27) {
    const T = temp;
    const H = humidity;
    const HI = -8.78469475556 + 1.61139411 * T + 2.33854883889 * H - 0.14611605 * T * H
        - 0.012308094 * (T * T) - 0.0164248277778 * (H * H) + 0.002211732 * (T * T) * H
        + 0.00072546 * T * (H * H) - 0.000003582 * (T * T) * (H * H);
    return Math.round(HI - (windSpeed * 0.5));
  }

  if (temp <= 10 && windSpeed >= 1.3) {
    const windChill = 13.12 + 0.6215 * temp - 11.37 * Math.pow(windSpeed * 3.6, 0.16)
        + 0.3965 * temp * Math.pow(windSpeed * 3.6, 0.16);
    return Math.round(windChill);
  }

  return Math.round(temp - (windSpeed * 0.4) + (humidity - 50) * 0.1);
};

const WeatherWhale: React.FC = () => {
  const { weatherData, weatherCondition, loading, error } = useWeatherApi();

  const now = new Date();
  const dateLabel = now.toLocaleDateString('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });

  const currentHour = new Date().getHours();
  const isNight = currentHour >= 19 || currentHour < 6;
  const variant = conditionToVariant(weatherCondition, isNight);

  if (loading) {
    return (
        <div className="relative rounded-2xl p-6 text-white animate-bounceIn bg-gradient-to-r from-sky-400 to-blue-600">
          <div className="flex items-center justify-center h-32">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
              <p className="text-sm">날씨 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
    );
  }

  if (error || !weatherData) {
    return (
        <div className="relative rounded-2xl p-6 text-white animate-bounceIn bg-gradient-to-r from-gray-400 to-gray-600">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">{dateLabel}</p>
              <h2 className="text-xl font-bold mt-1">울산 현재 날씨</h2>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {isNight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
          </div>
          <div className="text-blue-100 text-sm">날씨 정보를 불러올 수 없습니다</div>
        </div>
    );
  }

  const feelsLike = calculateFeelsLike(
      weatherData.temperature,
      weatherData.windSpeed,
      weatherData.humidity
  );

  return (
      <div className={`relative rounded-2xl overflow-hidden bg-gradient-to-r ${variantToGradient[variant]} animate-bounceIn`}>
        <svg viewBox="0 0 400 200" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 w-full h-full opacity-20">
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

          {/* Small bubbles */}
          <circle cx="95" cy="130" r="3" fill="#ffffff" opacity="0.6" />
          <circle cx="90" cy="140" r="2" fill="#ffffff" opacity="0.5" />
          <circle cx="100" cy="145" r="1.8" fill="#ffffff" opacity="0.5" />

          {/* Minimal clouds */}
          <g fill="#ffffff" opacity="0.5">
            <ellipse cx="60" cy="40" rx="20" ry="8" />
            <ellipse cx="85" cy="42" rx="12" ry="6" />
            <ellipse cx="300" cy="36" rx="18" ry="7" />
            <ellipse cx="320" cy="38" rx="10" ry="5" />
          </g>
        </svg>

        <div className="relative z-10 p-6 text-white">
          <div className="flex items-start justify-between mb-4">
            <div>
              <p className="text-blue-100 text-sm">{dateLabel}</p>
              <h2 className="text-xl font-bold mt-1">울산 현재 날씨</h2>
            </div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
              {isNight ? <Moon className="w-6 h-6" /> : <Sun className="w-6 h-6" />}
            </div>
          </div>

          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline space-x-2">
                <span className="text-4xl font-extrabold">{weatherData.temperature}°</span>
                <span className="text-blue-100 text-base">{conditionToKorean(weatherCondition)}</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-blue-100">
              <CloudSun className="w-4 h-4" />
              <span className="text-sm">체감 {feelsLike}°</span>
              <span className="text-blue-200">•</span>
              <Wind className="w-4 h-4" />
              <span className="text-sm">{weatherData.windSpeed}m/s</span>
            </div>
          </div>
        </div>
      </div>
  );
};

export default WeatherWhale;