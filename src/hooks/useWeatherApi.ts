import { useState, useEffect } from 'react';
import { WeatherApiResponse, ProcessedWeatherData, WeatherCondition } from '../types/weather';

const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

const ULSAN_COORDINATES = {
    nx: 35,
    ny: 129
};

// 현재 시간을 기준으로 가장 가까운 예보 시간 계산
const getBaseDateTime = (): { date: string; time: string } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = now.getHours();

    // 예보는 3시간 간격으로 발표됨 (02, 05, 08, 11, 14, 17, 20, 23시)
    const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];
    let baseHour = baseHours.reduce((prev, curr) =>
        Math.abs(curr - hour) < Math.abs(prev - hour) ? curr : prev
    );

    // 현재 시간이 발표 시간보다 이전이면 이전 발표 시간 사용
    if (hour < baseHour) {
        const index = baseHours.indexOf(baseHour);
        if (index > 0) {
            baseHour = baseHours[index - 1];
        } else {
            // 하루 전날 23시
            const yesterday = new Date(now);
            yesterday.setDate(yesterday.getDate() - 1);
            const yesterdayYear = yesterday.getFullYear();
            const yesterdayMonth = String(yesterday.getMonth() + 1).padStart(2, '0');
            const yesterdayDay = String(yesterday.getDate()).padStart(2, '0');
            return {
                date: `${yesterdayYear}${yesterdayMonth}${yesterdayDay}`,
                time: '2300'
            };
        }
    }

    return {
        date: `${year}${month}${day}`,
        time: String(baseHour).padStart(2, '0') + '00'
    };
};

// 날씨 데이터 처리
const processWeatherData = (items: any[]): ProcessedWeatherData | null => {
    if (!items || items.length === 0) return null;

    const weatherMap = new Map<string, string>();

    // 첫 번째 예보 시간의 데이터만 추출
    const firstFcstTime = items[0].fcstTime;
    const firstFcstDate = items[0].fcstDate;

    items
        .filter(item => item.fcstTime === firstFcstTime && item.fcstDate === firstFcstDate)
        .forEach(item => {
            weatherMap.set(item.category, item.fcstValue);
        });

    return {
        temperature: parseFloat(weatherMap.get('TMP') || '0'),
        humidity: parseFloat(weatherMap.get('REH') || '0'),
        rainProbability: parseFloat(weatherMap.get('POP') || '0'),
        skyCondition: parseInt(weatherMap.get('SKY') || '1'),
        precipitationType: parseInt(weatherMap.get('PTY') || '0'),
        precipitation: weatherMap.get('PCP') || '강수없음',
        windSpeed: parseFloat(weatherMap.get('WSD') || '0'),
        fcstDate: firstFcstDate,
        fcstTime: firstFcstTime
    };
};

// 날씨 상태 결정
const getWeatherCondition = (data: ProcessedWeatherData): WeatherCondition => {
    // 강수 형태가 있는 경우
    if (data.precipitationType > 0) {
        if (data.precipitationType === 3) return 'snowy'; // 눈
        return 'rainy'; // 비 또는 비/눈
    }

    // 하늘 상태에 따라 결정
    if (data.skyCondition === 1) return 'sunny'; // 맑음
    if (data.skyCondition === 3) return 'cloudy'; // 구름많음
    return 'overcast'; // 흐림
};

export const useWeatherApi = () => {
    const [weatherData, setWeatherData] = useState<ProcessedWeatherData | null>(null);
    const [weatherCondition, setWeatherCondition] = useState<WeatherCondition>('sunny');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchWeather = async () => {
        try {
            setLoading(true);
            setError(null);

            const { date, time } = getBaseDateTime();
            const apiKey = import.meta.env.VITE_TOURAPI_KEY;

            if (!apiKey) {
                throw new Error('날씨 API 키가 설정되지 않았습니다.');
            }

            const params = new URLSearchParams({
                serviceKey: decodeURIComponent(apiKey),
                pageNo: '1',
                numOfRows: '12',
                dataType: 'json',
                base_date: date,
                base_time: time,
                nx: ULSAN_COORDINATES.nx.toString(),
                ny: ULSAN_COORDINATES.ny.toString()
            });

            const apiResponse = await fetch(`${BASE_URL}?${params}`);

            console.log('API Response:', apiResponse);

            if (!apiResponse.ok) {
                throw new Error(`HTTP error! status: ${apiResponse.status}`);
            }

            // 응답 텍스트를 먼저 확인
            const responseText = await apiResponse.text();
            console.log('Response Text:', responseText.substring(0, 200));

            // XML 응답인지 확인
            if (responseText.trim().startsWith('<')) {
                throw new Error('API가 XML로 응답했습니다. JSON 응답을 확인해주세요.');
            }

            let responseData: WeatherApiResponse;
            try {
                responseData = JSON.parse(responseText);
            } catch (parseError) {
                console.error('JSON Parse Error:', parseError);
                throw new Error('응답을 JSON으로 파싱할 수 없습니다.');
            }

            if (responseData.response.header.resultCode !== '00') {
                throw new Error(`API Error: ${responseData.response.header.resultMsg}`);
            }

            const processedData = processWeatherData(responseData.response.body.items.item);

            if (processedData) {
                setWeatherData(processedData);
                setWeatherCondition(getWeatherCondition(processedData));
            } else {
                throw new Error('날씨 데이터를 처리할 수 없습니다.');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '날씨 정보를 가져오는데 실패했습니다.';
            setError(errorMessage);
            console.error('Weather API Error:', err);

            // 오류 발생 시 기본값 설정
            setWeatherData({
                temperature: 20,
                humidity: 50,
                rainProbability: 0,
                skyCondition: 1,
                precipitationType: 0,
                precipitation: '강수없음',
                windSpeed: 0,
                fcstDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
                fcstTime: '1200'
            });
            setWeatherCondition('sunny');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();

        // 30분마다 새로고침
        const interval = setInterval(fetchWeather, 30 * 60 * 1000);

        return () => clearInterval(interval);
    }, []);

    return {
        weatherData,
        weatherCondition,
        loading,
        error,
        refetch: fetchWeather
    };
};