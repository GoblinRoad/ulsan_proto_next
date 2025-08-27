export interface TouristSpot {
    id: string;
    type: string;
    name: string;
    district: 'jung' | 'nam' | 'dong' | 'buk' | 'ulju';
    category: '체험관광' | '음식' | '역사관광' | '레저스포츠' | '자연관광' | '시장' | '문화관광' | '쇼핑';
    description: string;
    address: string;
    coins: number;
    image: string;
    visited: boolean;
    coordinates: {
        lat: number;
        lng: number;
    };
    tel?: string;
}

// 거리 정보가 포함된 관광지 타입
export interface TouristSpotWithDistance extends TouristSpot {
    distance: number; // 미터 단위
}

export type DistrictFilter = 'all' | 'jung' | 'nam' | 'dong' | 'buk' | 'ulju';
export type CategoryFilter = 'all' | '문화관광' | '자연관광' | '역사관광' | '체험관광' | '레저스포츠' | '시장';

export interface SpotCounts {
    all: number;
    jung: number;
    nam: number;
    dong: number;
    buk: number;
    ulju: number;
}

export interface CategoryCounts {
    all: number;
    문화관광: number;
    자연관광: number;
    역사관광: number;
    체험관광: number;
    레저스포츠: number;
    시장: number;
    음식: number;
}

// 위치 정보 타입
export interface Coordinates {
    lat: number;
    lng: number;
}

// 카테고리별 색상 정보
export const CATEGORY_COLORS = {
    체험관광: '#F97316', // orange-500
    역사관광: '#8B5CF6', // violet-500
    레저스포츠: '#EF4444', // red-500
    자연관광: '#10B981', // emerald-500
    시장: '#F59E0B', // amber-500
    문화관광: '#3B82F6', // blue-500
} as const;

// 지도 설정 상수
export const MAP_CONFIG = {
    ULSAN_CENTER: { lat: 35.5384, lng: 129.3114 },
    DEFAULT_SEARCH_RADIUS: 5000, // 5km
    SEARCH_RADIUS_OPTIONS: [1000, 3000, 5000, 10000, 20000], // 미터 단위
    DEFAULT_ZOOM_LEVEL: 6,
    MIN_ZOOM_LEVEL: 3,
    MAX_LIST_ITEMS: 10 // 목록에 표시할 최대 개수
} as const;