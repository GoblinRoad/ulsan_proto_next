import type React from "react"
import { Upload } from "lucide-react"

interface CheckInProgressProps {
    uploadProgress: number
}

const CheckInProgress: React.FC<CheckInProgressProps> = ({ uploadProgress }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-400 to-cyan-500 p-4">
            <div className="max-w-md mx-auto text-center text-white">
                <div className="relative mb-6">
                    <Upload className="w-16 h-16 mx-auto mb-4 animate-pulse" />
                    <div className="w-full bg-white/20 rounded-full h-3">
                        <div
                            className="bg-white h-3 rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${uploadProgress}%` }}
                        ></div>
                    </div>
                </div>
                <h2 className="text-2xl font-bold mb-2">체크인 처리 중...</h2>
                <p className="text-blue-100 mb-4">사진을 업로드하고 체크인을 완료하고 있습니다.</p>
                <p className="text-sm text-blue-100">{uploadProgress}% 완료</p>
            </div>
        </div>
    )
}

export default CheckInProgress
