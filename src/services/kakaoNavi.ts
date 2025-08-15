export interface CoordinateXY {
  x: number; // lng
  y: number; // lat
  name?: string;
}

export interface DirectionsRequestBody {
  origin: CoordinateXY;
  destination: CoordinateXY;
  waypoints?: CoordinateXY[];
  priority?: 'TIME' | 'DISTANCE' | 'RECOMMEND';
  alternatives?: boolean;
  road_details?: boolean;
  summary?: boolean;
}

export interface DirectionsResponse {
  trans_id: string;
  routes: Array<{
    result_code: number;
    result_msg: string;
    summary: {
      origin: { name: string; x: number; y: number };
      destination: { name: string; x: number; y: number };
      waypoints: Array<{ name: string; x: number; y: number }>;
      priority: string;
      bound: {
        min_x: number;
        min_y: number;
        max_x: number;
        max_y: number;
      };
      fare: {
        taxi: number;
        toll: number;
      };
      distance: number;
      duration: number;
    };
    sections?: Array<{
      distance: number;
      duration: number;
      bound: {
        min_x: number;
        min_y: number;
        max_x: number;
        max_y: number;
      };
      roads: Array<{
        name: string;
        distance: number;
        duration: number;
        traffic_speed: number;
        traffic_state: number;
        vertexes: number[];
      }>;
      guides: Array<{
        name: string;
        x: number;
        y: number;
        distance: number;
        duration: number;
        type: number;
        guidance: string;
        road_index: number;
      }>;
    }>;
  }>;
}

export interface DirectionsSummary {
  distance: number; // meters
  duration: number; // seconds
}

export async function fetchKakaoDirections(body: DirectionsRequestBody): Promise<DirectionsSummary | null> {
  const restKey = import.meta.env.VITE_KAKAOMOBILITY_REST_KEY as string | undefined;
  if (!restKey) {
    return null;
  }
  try {
    const res = await fetch('https://apis-navi.kakaomobility.com/v1/waypoints/directions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `KakaoAK ${restKey}`,
      },
      body: JSON.stringify({
        ...body,
        priority: body.priority ?? 'TIME',
        alternatives: body.alternatives ?? false,
        road_details: body.road_details ?? false,
        summary: body.summary ?? true,
      }),
    });
    if (!res.ok) {
      return null;
    }
    const data = await res.json();
    const summary = data?.routes?.[0]?.summary;
    if (!summary) {
      return null;
    }
    return { distance: summary.distance, duration: summary.duration };
  } catch (error) {
    return null;
  }
}

// 자동차 길찾기 API를 사용하여 정확한 경로 정보 가져오기
export async function fetchKakaoCarDirections(
  origin: CoordinateXY,
  destination: CoordinateXY,
  waypoints?: CoordinateXY[]
): Promise<DirectionsResponse | null> {
  const restKey = import.meta.env.VITE_KAKAOMOBILITY_REST_KEY as string | undefined;
  
  if (!restKey) {
    console.error('Kakao Mobility REST API 키가 설정되지 않았습니다.');
    return null;
  }

  try {
    // URL 파라미터 구성
    const params = new URLSearchParams();
    
    // 출발지
    params.append('origin', `${origin.x},${origin.y},name=${origin.name || ''}`);
    
    // 목적지
    params.append('destination', `${destination.x},${destination.y},name=${destination.name || ''}`);
    
    // 경유지 (있는 경우)
    if (waypoints && waypoints.length > 0) {
      const waypointStr = waypoints
        .map(wp => `${wp.x},${wp.y},name=${wp.name || ''}`)
        .join('|');
      params.append('waypoints', waypointStr);
    }
    
    // 기타 옵션
    params.append('priority', 'TIME');
    params.append('summary', 'false'); // 상세 경로 정보 필요
    params.append('road_details', 'true'); // 도로 상세 정보 필요
    params.append('alternatives', 'false');

    const url = `https://apis-navi.kakaomobility.com/v1/directions?${params}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Authorization': `KakaoAK ${restKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: DirectionsResponse = await response.json();
    
    if (data.routes && data.routes.length > 0 && data.routes[0].result_code === 0) {
      return data;
    } else {
      return null;
    }

  } catch (error) {
    return null;
  }
}

export function formatDurationHM(totalSeconds: number): string {
  const minutes = Math.round(totalSeconds / 60);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h <= 0) return `${m}분`;
  return `${h}시간 ${m}분`;
}


