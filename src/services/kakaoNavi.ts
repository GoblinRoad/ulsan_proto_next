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

export interface DirectionsSummary {
  distance: number; // meters
  duration: number; // seconds
}

export async function fetchKakaoDirections(body: DirectionsRequestBody): Promise<DirectionsSummary | null> {
  const restKey = import.meta.env.REACT_APP_KAKAOMOBILITY_REST_KEY as string | undefined;
  if (!restKey) return null;
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
    if (!res.ok) return null;
    const data = await res.json();
    const summary = data?.routes?.[0]?.summary;
    if (!summary) return null;
    return { distance: summary.distance, duration: summary.duration };
  } catch {
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


