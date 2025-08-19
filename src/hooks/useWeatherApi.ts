import { useState, useEffect } from 'react';
import { WeatherApiResponse, ProcessedWeatherData, WeatherCondition } from '../types/weather';

const BASE_URL = 'https://apis.data.go.kr/1360000/VilageFcstInfoService_2.0/getVilageFcst';

const ULSAN_COORDINATES = {
    nx: 55,  // 울산 동구 기준 (문서 예제와 동일)
    ny: 127
};

const getBaseDateTime = (): { date: string; time: string } => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const hour = now.getHours();
    const minute = now.getMinutes();

    const baseHours = [2, 5, 8, 11, 14, 17, 20, 23];

    let baseHour = baseHours[0];

    for (let i = baseHours.length - 1; i >= 0; i--) {
        const publishTime = baseHours[i];
        const publishMinute = 10;

        if (hour > publishTime || (hour === publishTime && minute >= publishMinute)) {
            baseHour = publishTime;
            break;
        }
    }

    if (hour < 2 || (hour === 2 && minute < 10)) {
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

    return {
        date: `${year}${month}${day}`,
        time: String(baseHour).padStart(2, '0') + '00'
    };
};

const processWeatherData = (items: any[]): ProcessedWeatherData | null => {
    if (!items || items.length === 0) return null;

    const weatherMap = new Map<string, string>();

    const now = new Date();
    const currentHour = now.getHours();

    let targetItem = items.find(item => {
        const fcstHour = parseInt(item.fcstTime.slice(0, 2));
        return fcstHour >= currentHour;
    }) || items[0];

    const targetDate = targetItem.fcstDate;
    const targetTime = targetItem.fcstTime;

    items
        .filter(item => item.fcstTime === targetTime && item.fcstDate === targetDate)
        .forEach(item => {
            weatherMap.set(item.category, item.fcstValue);
        });

    return {
        temperature: parseFloat(weatherMap.get('TMP') || '0'),
        humidity: parseFloat(weatherMap.get('REH') || '0'),
        rainProbability: parseFloat(weatherMap.get('POP') || '0'),
        skyCondition: parseInt(weatherMap.get('SKY') || '1'),
        precipitationType: parseInt(weatherMap.get('PTY') || '0'),
        precipitation: formatPrecipitation(weatherMap.get('PCP') || '강수없음'),
        windSpeed: parseFloat(weatherMap.get('WSD') || '0'),
        fcstDate: targetDate,
        fcstTime: targetTime
    };
};

const formatPrecipitation = (pcpValue: string): string => {
    if (!pcpValue || pcpValue === '강수없음' || pcpValue === '0' || pcpValue === '-') {
        return '강수없음';
    }

    const value = parseFloat(pcpValue);

    if (value < 1.0) {
        return '1mm 미만';
    } else if (value >= 1.0 && value < 30.0) {
        return `${value}mm`;
    } else if (value >= 30.0 && value < 50.0) {
        return '30.0~50.0mm';
    } else {
        return '50.0mm 이상';
    }
};

const getWeatherCondition = (data: ProcessedWeatherData): WeatherCondition => {
    if (data.precipitationType > 0) {
        switch (data.precipitationType) {
            case 1: return 'rainy';      // 비
            case 2: return 'rainy';      // 비/눈
            case 3: return 'snowy';      // 눈
            case 4: return 'rainy';      // 소나기
            default: return 'rainy';
        }
    }

    switch (data.skyCondition) {
        case 1: return 'sunny';    // 맑음
        case 3: return 'cloudy';   // 구름많음
        case 4: return 'overcast'; // 흐림
        default: return 'sunny';
    }
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
                numOfRows: '36',
                dataType: 'json',
                base_date: date,
                base_time: time,
                nx: ULSAN_COORDINATES.nx.toString(),
                ny: ULSAN_COORDINATES.ny.toString()
            });

            const apiResponse = await fetch(`${BASE_URL}?${params}`);

            if (!apiResponse.ok) {
                throw new Error(`HTTP error! status: ${apiResponse.status}`);
            }

            const responseText = await apiResponse.text();

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
                throw new Error(`API Error [${responseData.response.header.resultCode}]: ${responseData.response.header.resultMsg}`);
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

            const defaultData: ProcessedWeatherData = {
                temperature: 20,
                humidity: 50,
                rainProbability: 10,
                skyCondition: 1,
                precipitationType: 0,
                precipitation: '강수없음',
                windSpeed: 2,
                fcstDate: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
                fcstTime: '1200'
            };
            setWeatherData(defaultData);
            setWeatherCondition('sunny');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWeather();

        const interval = setInterval(fetchWeather, 60 * 60 * 1000);

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