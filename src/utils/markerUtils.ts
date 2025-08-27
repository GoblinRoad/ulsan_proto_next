import { CATEGORY_COLORS } from '../types/tourist';

// 카테고리별 고래 마커 이미지 매핑 (실제 사용하는 6개 카테고리)
const WHALE_MARKER_MAP: { [key: string]: string } = {
    '문화관광': '/src/assets/marker/whale_blue.png',
    '자연관광': '/src/assets/marker/whale_green.png',
    '역사관광': '/src/assets/marker/whale_purple.png',
    '체험관광': '/src/assets/marker/whale_orange.png',
    '레저스포츠': '/src/assets/marker/whale_red.png',
    '시장': '/src/assets/marker/whale_yellow.png',
    'default': '/src/assets/marker/whale_marker1.png'
};

const VISITED_WHALE_MARKER = '/src/assets/marker/whale_visited.png';

export const createCustomMarker = (category: string, visited: boolean = false, selected: boolean = false): string => {
    if (visited) {
        return VISITED_WHALE_MARKER;
    }

    return WHALE_MARKER_MAP[category] || WHALE_MARKER_MAP['default'];
};

export const getMarkerSize = (selected: boolean = false): { width: number, height: number } => {
    return selected ? { width: 40, height: 40 } : { width: 32, height: 32 };
};

export const getMarkerOptions = (category: string, visited: boolean = false, selected: boolean = false) => {
    const imagePath = createCustomMarker(category, visited, selected);
    const size = getMarkerSize(selected);

    return {
        url: imagePath,
        size: size,
        anchor: { x: size.width / 2, y: size.height },
        zIndex: selected ? 1000 : 100
    };
};

export const getWhaleMarkerPath = (category: string, visited: boolean = false): string => {
    if (visited) {
        return VISITED_WHALE_MARKER;
    }
    return WHALE_MARKER_MAP[category] || WHALE_MARKER_MAP['default'];
};

export const getAllWhaleMarkerPaths = (): string[] => {
    const allPaths = Object.values(WHALE_MARKER_MAP);
    allPaths.push(VISITED_WHALE_MARKER);
    return allPaths;
};

export const getCategoryIcon = (category: string): string => {
    switch (category) {
        case '문화관광': return '🎭';
        case '자연관광': return '🌲';
        case '역사관광': return '🏛️';
        case '체험관광': return '📸';
        case '레저스포츠': return '⚡';
        case '시장': return '🏪';
        default: return '📍';
    }
};