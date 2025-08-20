"use client"

import React, { createContext, useContext, useReducer, useState, type ReactNode } from "react"
import { testModeManager } from "@/data/testData"

interface TouristSpot {
  id: string
  name: string
  category: "famous" | "hidden"
  description: string
  address: string
  coordinates: { lat: number; lng: number }
  coins: number
  image: string
  visited: boolean
  visitDate?: string
}

interface User {
  name: string
  totalCoins: number
  visitedSpots: number
  level: number
  badges: string[]
}

interface AppState {
  user: User
  touristSpots: TouristSpot[]
  currentStreak: number
  selectedCourse: string | null
}

type AppAction =
    | { type: "CHECK_IN_SPOT"; payload: { spotId: string; photoUrl?: string } }
    | { type: "EXCHANGE_COINS"; payload: { amount: number; reward: string } }
    | { type: "SELECT_COURSE"; payload: string }
    | { type: "UPDATE_USER"; payload: Partial<User> }

const initialState: AppState = {
  user: {
    name: "여행자",
    totalCoins: 0,
    visitedSpots: 0,
    level: 1,
    badges: [],
  },
  touristSpots: [
    {
      id: "1",
      name: "장생포 고래문화마을",
      category: "famous",
      description: "울산의 고래 문화를 체험할 수 있는 특별한 공간",
      address: "울산광역시 남구 장생포고래로 244",
      coordinates: { lat: 35.5372, lng: 129.3794 },
      coins: 50,
      image: "https://images.pexels.com/photos/1139541/pexels-photo-1139541.jpeg",
      visited: false,
    },
    {
      id: "2",
      name: "울산대공원",
      category: "famous",
      description: "아름다운 장미원과 나비원이 있는 대규모 공원",
      address: "울산광역시 남구 대공원로 94",
      coordinates: { lat: 35.5569, lng: 129.3311 },
      coins: 30,
      image: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg",
      visited: false,
    },
    {
      id: "3",
      name: "태화강 국가정원",
      category: "famous",
      description: "국내 최대 규모의 도심 생태정원",
      address: "울산광역시 중구 태화강국가정원길 154",
      coordinates: { lat: 35.5461, lng: 129.3194 },
      coins: 40,
      image: "https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg",
      visited: false,
    },
    {
      id: "4",
      name: "신불산 폭포자연휴양림",
      category: "hidden",
      description: "숨겨진 자연의 보고, 아름다운 폭포와 등산로",
      address: "울산광역시 울주군 상북면 덕현리",
      coordinates: { lat: 35.6234, lng: 129.0567 },
      coins: 80,
      image: "https://images.pexels.com/photos/1670187/pexels-photo-1670187.jpeg",
      visited: false,
    },
    {
      id: "5",
      name: "영남알프스 복합웰컴센터",
      category: "hidden",
      description: "영남알프스의 아름다운 전망을 감상할 수 있는 곳",
      address: "울산광역시 울주군 상북면 알프스온천1길 25",
      coordinates: { lat: 35.6178, lng: 129.0891 },
      coins: 70,
      image: "https://images.pexels.com/photos/417173/pexels-photo-417173.jpeg",
      visited: false,
    },
    {
      id: "6",
      name: "울산테마식물수목원",
      category: "hidden",
      description: "다양한 식물을 관찰할 수 있는 도심 속 자연공간",
      address: "울산광역시 동구 대왕암로 293",
      coordinates: { lat: 35.5123, lng: 129.4234 },
      coins: 60,
      image: "https://images.pexels.com/photos/1408221/pexels-photo-1408221.jpeg",
      visited: false,
    },
  ],
  currentStreak: 0,
  selectedCourse: null,
}

const AppContext = createContext<
    | {
  state: AppState
  dispatch: React.Dispatch<AppAction>
  isTestMode: boolean
  bypassLocationCheck: boolean
  toggleTestMode: () => void
  setBypassLocationCheck: (bypass: boolean) => void
}
    | undefined
>(undefined)

function appReducer(state: AppState, action: AppAction): AppState {
  switch (action.type) {
    case "CHECK_IN_SPOT": {
      const { spotId } = action.payload
      const spot = state.touristSpots.find((s) => s.id === spotId)
      if (!spot || spot.visited) return state

      const updatedSpots = state.touristSpots.map((s) =>
          s.id === spotId ? { ...s, visited: true, visitDate: new Date().toISOString() } : s,
      )

      const newTotalCoins = state.user.totalCoins + spot.coins
      const newVisitedSpots = state.user.visitedSpots + 1
      const newLevel = Math.floor(newTotalCoins / 200) + 1

      return {
        ...state,
        touristSpots: updatedSpots,
        user: {
          ...state.user,
          totalCoins: newTotalCoins,
          visitedSpots: newVisitedSpots,
          level: newLevel,
        },
        currentStreak: state.currentStreak + 1,
      }
    }
    case "EXCHANGE_COINS": {
      const { amount } = action.payload
      if (state.user.totalCoins < amount) return state

      return {
        ...state,
        user: {
          ...state.user,
          totalCoins: state.user.totalCoins - amount,
        },
      }
    }
    case "SELECT_COURSE": {
      return {
        ...state,
        selectedCourse: action.payload,
      }
    }
    case "UPDATE_USER": {
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload,
        },
      }
    }
    default:
      return state
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(appReducer, initialState)

  const [isTestMode, setIsTestMode] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("testMode")
      return saved ? JSON.parse(saved) : testModeManager.isTestMode()
    }
    return testModeManager.isTestMode()
  })

  const [bypassLocationCheck, setBypassLocationCheckState] = useState(() => {
    if (typeof window !== "undefined") {
      const saved = sessionStorage.getItem("bypassLocationCheck")
      return saved ? JSON.parse(saved) : testModeManager.isBypassLocationCheck()
    }
    return testModeManager.isBypassLocationCheck()
  })

  const toggleTestMode = () => {
    const newTestMode = testModeManager.toggleTestMode()
    setIsTestMode(newTestMode)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("testMode", JSON.stringify(newTestMode))
    }
    if (!newTestMode) {
      setBypassLocationCheckState(false)
      if (typeof window !== "undefined") {
        sessionStorage.setItem("bypassLocationCheck", JSON.stringify(false))
      }
    }
  }

  const setBypassLocationCheck = (bypass: boolean) => {
    testModeManager.setBypassLocationCheck(bypass)
    setBypassLocationCheckState(bypass)
    if (typeof window !== "undefined") {
      sessionStorage.setItem("bypassLocationCheck", JSON.stringify(bypass))
    }
  }

  const enhancedState = React.useMemo(() => {
    if (isTestMode) {
      const testSpots = testModeManager.getTestSpots()
      const convertedTestSpots = testSpots.map((spot) => ({
        id: spot.id,
        name: spot.name,
        category: "famous" as const,
        description: spot.description,
        address: spot.address,
        coordinates: spot.coordinates,
        coins: spot.coins,
        image: spot.image,
        visited: spot.visited,
      }))

      return {
        ...state,
        touristSpots: [...convertedTestSpots, ...state.touristSpots],
      }
    }
    return state
  }, [state, isTestMode])

  return (
      <AppContext.Provider
          value={{
            state: enhancedState,
            dispatch,
            isTestMode,
            bypassLocationCheck,
            toggleTestMode,
            setBypassLocationCheck,
          }}
      >
        {children}
      </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error("useApp must be used within an AppProvider")
  }
  return context
}
