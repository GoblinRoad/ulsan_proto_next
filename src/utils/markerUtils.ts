import { CATEGORY_COLORS } from '../types/tourist';

export const createCustomMarker = (category: string, visited: boolean = false): string => {
    const color = visited ? '#9CA3AF' : CATEGORY_COLORS[category as keyof typeof CATEGORY_COLORS] || '#6B7280';

    // SVG 마커 생성
    const svg = `
    <svg width="32" height="42" viewBox="0 0 32 42" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      <!-- 마커 배경 -->
      <path d="M16 0C7.163 0 0 7.163 0 16c0 16 16 26 16 26s16-10 16-26C32 7.163 24.837 0 16 0z" 
            fill="${color}" 
            filter="url(#shadow)"/>
      <!-- 내부 원 -->
      <circle cx="16" cy="16" r="8" fill="white" opacity="0.9"/>
      <!-- 중앙 점 -->
      <circle cx="16" cy="16" r="4" fill="${color}"/>
      ${visited ? `
        <!-- 체크마크 (방문완료) -->
        <path d="M12 16l2 2 4-4" stroke="white" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      ` : ''}
    </svg>
  `;

    // SVG를 base64로 인코딩
    const encodedSvg = btoa(unescape(encodeURIComponent(svg)));
    return `data:image/svg+xml;base64,${encodedSvg}`;
};

export const getCategoryIcon = (category: string): string => {
    switch (category) {
        case '문화관광': return '🎭';
        case '자연관광': return '🌲';
        case '역사관광': return '🏛️';
        case '쇼핑': return '🛍️';
        case '숙박': return '🏨';
        case '체험관광': return '📸';
        case '레저스포츠': return '⚡';
        case '음식': return '🍽️';
        case '추천코스': return '🗺️';
        case '축제/공연/행사': return '🎪';
        default: return '📍';
    }
};