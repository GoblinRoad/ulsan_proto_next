export interface CheckInData {
    spotId: string
    userId: string
    photo: string
    location: {
        lat: number
        lng: number
    }
    timestamp: string
    spotName: string
}

export interface CheckInResult {
    success: boolean
    message: string
    data?: {
        checkInId: string
        photoUrl: string
        coinsEarned: number
    }
    error?: string
}

export interface UserProfile {
    id: string
    email: string
    username: string
    full_name?: string
    avatar_url?: string
    total_coins: number
    total_checkins: number
    level: number
    created_at: string
    updated_at: string
}

export interface CheckInHistory {
    id: string
    spot_id: string
    spot_name: string
    photo_url: string
    location_lat: number
    location_lng: number
    coins_earned: number
    verification_status: "pending" | "approved" | "rejected"
    created_at: string
}

export interface TourSpot {
    id: string
    latitude: number
    longitude: number
    created_at: string
    updated_at: string
}
