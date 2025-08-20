import type { TouristSpot } from "../types/tourist"
import type {TourApiDetailItem, TourApiIntroItem} from "../types/tourApi"

// 개발/테스트 환경 확인
// export const isDevelopment = import.meta.env.DEV || import.meta.env.NODE_ENV === "development"

// 현재 위치 기준 테스트 관광지 데이터
export const TEST_CURRENT_LOCATION = {
    lat: 37.00410605635676,
    lng: 127.09495886839127,
}

// 테스트용 관광지 데이터 (현재 위치 근처)
export const TEST_TOURIST_SPOTS: TouristSpot[] = [
    {
        id: "test-001",
        type: "test",
        name: "[테스트] 현재 위치 관광지",
        district: "jung",
        category: "문화관광",
        description: "체크인 테스트를 위한 가상의 관광지입니다. 현재 위치에서 바로 체크인할 수 있습니다.",
        address: "테스트 주소 (현재 위치)",
        coins: 100,
        image: "/placeholder.svg?height=200&width=300",
        visited: false,
        coordinates: {
            lat: TEST_CURRENT_LOCATION.lat + 0.0001, // 약 10m 거리
            lng: TEST_CURRENT_LOCATION.lng + 0.0001,
        },
        tel: "052-000-0000",
    },
    {
        id: "test-002",
        type: "test",
        name: "[테스트] 근처 카페",
        district: "nam",
        category: "음식",
        description: "테스트용 카페입니다. 위치 검증 테스트에 사용됩니다.",
        address: "테스트 카페 주소",
        coins: 50,
        image: "/placeholder.svg?height=200&width=300",
        visited: false,
        coordinates: {
            lat: TEST_CURRENT_LOCATION.lat + 0.0005, // 약 50m 거리
            lng: TEST_CURRENT_LOCATION.lng + 0.0005,
        },
        tel: "052-000-0001",
    },
    {
        id: "test-003",
        type: "test",
        name: "[테스트] 멀리 있는 관광지",
        district: "dong",
        category: "자연관광",
        description: "위치 검증 실패 테스트를 위한 관광지입니다. 현재 위치에서 멀리 떨어져 있습니다.",
        address: "테스트 원거리 주소",
        coins: 120,
        image: "/placeholder.svg?height=200&width=300",
        visited: false,
        coordinates: {
            lat: TEST_CURRENT_LOCATION.lat + 0.01, // 약 1km 거리
            lng: TEST_CURRENT_LOCATION.lng + 0.01,
        },
        tel: "052-000-0002",
    },
]

// 테스트용 상세 정보 데이터
export const TEST_SPOT_DETAILS: Record<string, TourApiDetailItem> = {
    "test-001": {
        contentid: "test-001",
        contenttypeid: "12",
        title: "[테스트] 현재 위치 관광지",
        createdtime: "20240101000000",
        modifiedtime: "20240101000000",
        tel: "052-000-0000",
        telname: "테스트 관광지",
        homepage: "",
        firstimage: "/placeholder.svg?height=400&width=600",
        firstimage2: "",
        cpyrhtDivCd: "Type1",
        areacode: "7",
        sigungucode: "110",
        lDongRegnCd: "",
        lDongSignguCd: "",
        lclsSystm1: "",
        lclsSystm2: "",
        lclsSystm3: "",
        cat1: "A02",
        cat2: "A0206",
        cat3: "A02060100",
        addr1: "테스트 주소 (현재 위치)",
        addr2: "",
        zipcode: "44000",
        mapx: TEST_CURRENT_LOCATION.lng.toString(),
        mapy: TEST_CURRENT_LOCATION.lat.toString(),
        mlevel: "6",
        overview:
            "체크인 테스트를 위한 가상의 관광지입니다. 현재 위치에서 바로 체크인할 수 있도록 설정되어 있습니다. 개발 및 테스트 목적으로만 사용됩니다.",
    },
    "test-002": {
        contentid: "test-002",
        contenttypeid: "39",
        title: "[테스트] 근처 카페",
        createdtime: "20240101000000",
        modifiedtime: "20240101000000",
        tel: "052-000-0001",
        telname: "테스트 카페",
        homepage: "",
        firstimage: "/placeholder.svg?height=400&width=600",
        firstimage2: "",
        cpyrhtDivCd: "Type1",
        areacode: "7",
        sigungucode: "140",
        lDongRegnCd: "",
        lDongSignguCd: "",
        lclsSystm1: "",
        lclsSystm2: "",
        lclsSystm3: "",
        cat1: "A05",
        cat2: "A0502",
        cat3: "A05020100",
        addr1: "테스트 카페 주소",
        addr2: "",
        zipcode: "44000",
        mapx: (TEST_CURRENT_LOCATION.lng + 0.0005).toString(),
        mapy: (TEST_CURRENT_LOCATION.lat + 0.0005).toString(),
        mlevel: "6",
        overview: "테스트용 카페입니다. 위치 검증 테스트에 사용되며, 현재 위치에서 약 50m 거리에 있습니다.",
    },
    "test-003": {
        contentid: "test-003",
        contenttypeid: "12",
        title: "[테스트] 멀리 있는 관광지",
        createdtime: "20240101000000",
        modifiedtime: "20240101000000",
        tel: "052-000-0002",
        telname: "테스트 원거리 관광지",
        homepage: "",
        firstimage: "/placeholder.svg?height=400&width=600",
        firstimage2: "",
        cpyrhtDivCd: "Type1",
        areacode: "7",
        sigungucode: "170",
        lDongRegnCd: "",
        lDongSignguCd: "",
        lclsSystm1: "",
        lclsSystm2: "",
        lclsSystm3: "",
        cat1: "A01",
        cat2: "A0101",
        cat3: "A01010100",
        addr1: "테스트 원거리 주소",
        addr2: "",
        zipcode: "44000",
        mapx: (TEST_CURRENT_LOCATION.lng + 0.01).toString(),
        mapy: (TEST_CURRENT_LOCATION.lat + 0.01).toString(),
        mlevel: "6",
        overview: "위치 검증 실패 테스트를 위한 관광지입니다. 현재 위치에서 약 1km 떨어져 있어 체크인이 불가능합니다.",
    },
}

// 테스트 모드 상태 관리
export class TestModeManager {
    private static instance: TestModeManager
    private testMode = false
    private bypassLocationCheck = false

    static getInstance(): TestModeManager {
        if (!TestModeManager.instance) {
            TestModeManager.instance = new TestModeManager()
            TestModeManager.instance.loadFromStorage()
        }
        return TestModeManager.instance
    }

    private loadFromStorage(): void {
        if (typeof window !== "undefined") {
            const savedTestMode = sessionStorage.getItem("testMode")
            const savedBypass = sessionStorage.getItem("bypassLocationCheck")

            if (savedTestMode) {
                this.testMode = JSON.parse(savedTestMode)
            }
            if (savedBypass) {
                this.bypassLocationCheck = JSON.parse(savedBypass)
            }
        }
    }

    private saveToStorage(): void {
        if (typeof window !== "undefined") {
            sessionStorage.setItem("testMode", JSON.stringify(this.testMode))
            sessionStorage.setItem("bypassLocationCheck", JSON.stringify(this.bypassLocationCheck))
        }
    }

    isTestMode(): boolean {
        return isDevelopment && this.testMode
    }

    enableTestMode(): void {
        if (isDevelopment) {
            this.testMode = true
            this.saveToStorage()
            console.log("[v0] 테스트 모드가 활성화되었습니다.")
        }
    }

    disableTestMode(): void {
        this.testMode = false
        this.bypassLocationCheck = false
        this.saveToStorage()
        console.log("[v0] 테스트 모드가 비활성화되었습니다.")
    }

    toggleTestMode(): boolean {
        if (this.testMode) {
            this.disableTestMode()
        } else {
            this.enableTestMode()
        }
        return this.testMode
    }

    isBypassLocationCheck(): boolean {
        return this.isTestMode() && this.bypassLocationCheck
    }

    setBypassLocationCheck(bypass: boolean): void {
        if (this.isTestMode()) {
            this.bypassLocationCheck = bypass
            this.saveToStorage()
            console.log(`[v0] 위치 검증 우회: ${bypass ? "활성화" : "비활성화"}`)
        }
    }

    getTestSpots(): TouristSpot[] {
        return this.isTestMode() ? TEST_TOURIST_SPOTS : []
    }

    getTestSpotDetail(spotId: string): TourApiDetailItem | null {
        return this.isTestMode() ? TEST_SPOT_DETAILS[spotId] || null : null
    }

    getTestSpotIntro(spotId: string): TourApiIntroItem | null {
        if (!this.isTestMode()) return null

        const testDetail = TEST_SPOT_DETAILS[spotId]
        if (!testDetail) return null

        // TourApiIntroItem 타입에 맞게 변환
        return {
            contentid: testDetail.contentid,
            contenttypeid: testDetail.contenttypeid,
            description: testDetail.overview, // overview를 description으로 매핑
        }
    }
}

export const testModeManager = TestModeManager.getInstance()
