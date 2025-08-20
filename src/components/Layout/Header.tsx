"use client"

import type React from "react"
import { Coins, LogIn } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { useApp } from "@/contexts/AppContext"

const Header: React.FC = () => {
  const { user } = useAuth()
  const { state } = useApp()
  return (
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-blue-100 shadow-sm">
        <div className="max-w-md mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">울</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-800">울산 코인투어</h1>
                <p className="text-xs text-gray-500">숨은 매력을 찾아서</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                  // 로그인된 상태
                    <div className="flex items-center space-x-4">
                    {/* 코인 표시 */}
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-1.5 rounded-full">
                      <Coins className="w-4 h-4 text-white" />
                      <span className="text-white font-bold text-sm">{state.user.totalCoins}</span>
                    </div>
                  </div>
              ) : (
                  // 로그인되지 않은 상태
                  <Link
                      to="/login"
                      className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span className="font-medium">로그인</span>
                  </Link>
              )}
            </div>
          </div>
        </div>
      </header>
  )
}

export default Header
