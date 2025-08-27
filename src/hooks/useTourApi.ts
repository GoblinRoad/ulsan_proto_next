import { useState, useEffect } from 'react';
import { TourApiResponse, TourApiItem, SIGUNGU_CODES, CATEGORY_MAPPING, CATEGORY_INFO } from '../types/tourApi';
import { TouristSpot } from '../types/tourist';

interface UseTourApiResult {
    spots: TouristSpot[];
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface CachedData {
    data: TouristSpot[];
    timestamp: number;
    version: string;
}

const CACHE_KEY = 'tour_spots_cache';
const CACHE_DURATION = 24 * 60 * 60 * 1000;
const CACHE_VERSION = '1.0.0';

const useTourApi = (): UseTourApiResult => {
    const [spots, setSpots] = useState<TouristSpot[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const getDistrictFromSigunguCode = (lDongSignguCd: string): 'jung' | 'nam' | 'dong' | 'buk' | 'ulju' => {
        switch (lDongSignguCd) {
            case SIGUNGU_CODES.jung:
                return 'jung';
            case SIGUNGU_CODES.nam:
                return 'nam';
            case SIGUNGU_CODES.dong:
                return 'dong';
            case SIGUNGU_CODES.buk:
                return 'buk';
            case SIGUNGU_CODES.ulju:
                return 'ulju';
            default:
                return 'jung';
        }
    };

    const getCategoryFromCode = (lclsSystm1: string): TouristSpot['category'] => {
        return CATEGORY_MAPPING[lclsSystm1 as keyof typeof CATEGORY_MAPPING] || '음식';
    };

    const getCategoryInfo = (category: string) => {
        return CATEGORY_INFO[category as keyof typeof CATEGORY_INFO] || CATEGORY_INFO['문화관광'];
    };

    const transformTourApiData = (items: TourApiItem[]): TouristSpot[] => {
        return items
            .filter(item => item.mapx && item.mapy && item.title && item.addr1)
            .map((item) => {
                const category = getCategoryFromCode(item.lclsSystm1);
                const categoryInfo = getCategoryInfo(category);

                return {
                    id: item.contentid,
                    type: item.contenttypeid,
                    name: item.title,
                    district: getDistrictFromSigunguCode(item.lDongSignguCd),
                    category,
                    description: `${item.addr1} ${item.addr2 || ''}`.trim(),
                    address: `${item.addr1} ${item.addr2 || ''}`.trim(),
                    coins: categoryInfo.coins,
                    image: item.firstimage || item.firstimage2 || '/placeholder-image.jpg',
                    visited: false,
                    coordinates: {
                        lat: parseFloat(item.mapy),
                        lng: parseFloat(item.mapx)
                    },
                    tel: item.tel
                };
            });
    };

    const loadFromCache = (): TouristSpot[] | null => {
        try {
            const cachedDataStr = localStorage.getItem(CACHE_KEY);
            if (!cachedDataStr) return null;

            const cachedData: CachedData = JSON.parse(cachedDataStr);

            if (cachedData.version !== CACHE_VERSION) {
                localStorage.removeItem(CACHE_KEY);
                return null;
            }

            const now = Date.now();
            const isExpired = (now - cachedData.timestamp) > CACHE_DURATION;

            if (isExpired) {
                return null;
            }

            return cachedData.data;

        } catch (error) {
            console.error('캐시 로드 중 오류:', error);
            localStorage.removeItem(CACHE_KEY);
            return null;
        }
    };

    const saveToCache = (data: TouristSpot[]): void => {
        try {
            const cacheData: CachedData = {
                data,
                timestamp: Date.now(),
                version: CACHE_VERSION
            };

            localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));

        } catch (error) {
            console.error('캐시 저장 중 오류:', error);

            if (error instanceof Error && error.name === 'QuotaExceededError') {
                localStorage.removeItem(CACHE_KEY);

                try {
                    localStorage.setItem(CACHE_KEY, JSON.stringify({
                        data,
                        timestamp: Date.now(),
                        version: CACHE_VERSION
                    }));
                } catch (retryError) {
                    console.error('캐시 재저장 실패:', retryError);
                }
            }
        }
    };

    const fetchTourData = async (forceRefresh = false) => {
        setLoading(true);
        setError(null);

        try {
            if (!forceRefresh) {
                const cachedData = loadFromCache();
                if (cachedData) {
                    setSpots(cachedData);
                    setLoading(false);
                    return;
                }
            }

            const serviceKey = import.meta.env.VITE_TOURAPI_KEY;
            if (!serviceKey) {
                throw new Error('관광공사 API 키가 설정되지 않았습니다.');
            }

            const baseUrl = 'https://apis.data.go.kr/B551011/KorService2/areaBasedList2';

            const promises = Object.values(SIGUNGU_CODES).map(async (lDongSignguCd) => {
                const params = new URLSearchParams({
                    serviceKey: decodeURIComponent(serviceKey),
                    pageNo: '1',
                    numOfRows: '1000',
                    MobileOS: 'WEB',
                    MobileApp: 'Ulsan',
                    _type: 'json',
                    arrange: 'C',
                    lDongRegnCd: '31',
                    lDongSignguCd
                });

                const response = await fetch(`${baseUrl}?${params}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: TourApiResponse = await response.json();

                if (data.response.header.resultCode !== '0000') {
                    throw new Error(`API Error: ${data.response.header.resultMsg}`);
                }

                return data.response.body.items?.item || [];
            });

            const results = await Promise.all(promises);
            const allItems = results.flat();

            if (allItems.length === 0) {
                throw new Error('조회된 관광지 데이터가 없습니다.');
            }

            const transformedSpots = transformTourApiData(allItems);
            setSpots(transformedSpots);

            saveToCache(transformedSpots);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.';
            setError(errorMessage);
            console.error('Tour API Error:', err);

            if (!forceRefresh) {
                try {
                    const cachedDataStr = localStorage.getItem(CACHE_KEY);
                    if (cachedDataStr) {
                        const cachedData: CachedData = JSON.parse(cachedDataStr);
                        if (cachedData.data && cachedData.data.length > 0) {
                            setSpots(cachedData.data);
                            setError(`${errorMessage} (캐시된 데이터를 사용 중)`);
                        }
                    }
                } catch (cacheError) {
                    console.error('캐시 복구 시도 실패:', cacheError);
                }
            }

        } finally {
            setLoading(false);
        }
    };

    const refetch = () => {
        fetchTourData(true);
    };

    useEffect(() => {
        fetchTourData();
    }, []);

    return { spots, loading, error, refetch };
};

export default useTourApi;