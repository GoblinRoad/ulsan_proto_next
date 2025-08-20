export interface TourSpot {
    id: string // contentId
    latitude: number
    longitude: number
    created_at: string
    updated_at: string
}

export class TourSpotsService {

    static async getTourSpotLocation(contentId: string): Promise<TourSpot | null> {
        try {
            const response = await fetch(`/api/tour-spots?contentId=${contentId}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data.spot
        } catch (error) {
            console.error("관광지 위치 정보 조회 오류:", error)
            return null
        }
    }

    static async getAllTourSpots(): Promise<TourSpot[]> {
        try {
            const response = await fetch("/api/tour-spots")

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data.spots || []
        } catch (error) {
            console.error("전체 관광지 조회 오류:", error)
            return []
        }
    }

    /**
     * 특정 위치 주변의 관광지들을 가져옵니다
     */
    static async getNearbyTourSpots(latitude: number, longitude: number, radiusKm = 10): Promise<TourSpot[]> {
        try {
            const response = await fetch(`/api/tour-spots?lat=${latitude}&lng=${longitude}&radius=${radiusKm}`)

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }

            const data = await response.json()
            return data.spots || []
        } catch (error) {
            console.error("주변 관광지 조회 오류:", error)
            return this.getAllTourSpots()
        }
    }

    static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
        const R = 6371e3 // 지구 반지름 (미터)
        const φ1 = (lat1 * Math.PI) / 180
        const φ2 = (lat2 * Math.PI) / 180
        const Δφ = ((lat2 - lat1) * Math.PI) / 180
        const Δλ = ((lng2 - lng1) * Math.PI) / 180

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2)
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

        return R * c // 거리 (미터)
    }
}
