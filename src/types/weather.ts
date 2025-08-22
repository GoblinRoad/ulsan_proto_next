export interface WeatherApiResponse {
    response: {
        header: {
            resultCode: string;
            resultMsg: string;
        };
        body: {
            dataType: string;
            items: {
                item: WeatherItem[];
            };
            pageNo: number;
            numOfRows: number;
            totalCount: number;
        };
    };
}

export interface WeatherItem {
    baseDate: string;
    baseTime: string;
    category: string;
    fcstDate: string;
    fcstTime: string;
    fcstValue: string;
    nx: number;
    ny: number;
}

export interface ProcessedWeatherData {
    temperature: number;
    humidity: number;
    rainProbability: number;
    skyCondition: number;
    precipitationType: number;
    precipitation: string;
    windSpeed: number;
    fcstDate: string;
    fcstTime: string;
}

export type WeatherCondition = 'sunny' | 'cloudy' | 'overcast' | 'rainy' | 'snowy';