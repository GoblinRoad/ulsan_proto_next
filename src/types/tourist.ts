export interface TouristSpot {
    id: string;
    type: string;
    name: string;
    district: 'jung' | 'nam' | 'dong' | 'buk' | 'ulju';
    category: '숙박' | '추천코스' | '축제/공연/행사' | '체험관광' | '음식' | '역사관광' | '레저스포츠' | '자연관광' | '쇼핑' | '문화관광';
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

export type DistrictFilter = 'all' | 'jung' | 'nam' | 'dong' | 'buk' | 'ulju';
export type CategoryFilter = 'all' | '숙박' | '추천코스' | '축제/공연/행사' | '체험관광' | '음식' | '역사관광' | '레저스포츠' | '자연관광' | '쇼핑' | '문화관광';

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
    숙박: number;
    추천코스: number;
    '축제/공연/행사': number;
    체험관광: number;
    음식: number;
    역사관광: number;
    레저스포츠: number;
    자연관광: number;
    쇼핑: number;
    문화관광: number;
}

// 카테고리별 색상 정보
export const CATEGORY_COLORS = {
    숙박: '#F59E0B', // amber-500
    추천코스: '#8B5CF6', // violet-500
    '축제/공연/행사': '#EF4444', // red-500
    체험관광: '#EC4899', // pink-500
    음식: '#F97316', // orange-500
    역사관광: '#8B5CF6', // violet-500
    레저스포츠: '#EF4444', // red-500
    자연관광: '#10B981', // emerald-500
    쇼핑: '#10B981', // emerald-500
    문화관광: '#3B82F6' // blue-500
} as const;