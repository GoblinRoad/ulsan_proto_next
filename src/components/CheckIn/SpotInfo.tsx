import type React from "react"
import { MapPin, Coins } from "lucide-react"
import type { TourApiDetailItem, TourApiIntroItem } from "../../types/tourApi"

interface SpotInfoProps {
    spotDetail: TourApiDetailItem
    spotIntro: TourApiIntroItem | null
}

const SpotInfo: React.FC<SpotInfoProps> = ({ spotDetail, spotIntro }) => {
    return (
        <div className="space-y-4">
            {/* 관광지 상세 정보 */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                {spotDetail.firstimage && (
                    <div
                        className="w-full h-48 rounded-lg bg-cover bg-center mb-4"
                        style={{ backgroundImage: `url(${spotDetail.firstimage})` }}
                    />
                )}
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{spotDetail.title}</h2>

                        {spotDetail.overview && (
                            <p className="text-gray-600 mb-3 text-sm leading-relaxed">
                                {spotDetail.overview.replace(/<[^>]*>/g, "").substring(0, 150)}
                                {spotDetail.overview.length > 150 ? "..." : ""}
                            </p>
                        )}

                        <div className="space-y-2">
                            <div className="flex items-center text-sm text-gray-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>
                  {spotDetail.addr1} {spotDetail.addr2}
                </span>
                            </div>

                            {spotDetail.tel && (
                                <div className="flex items-center text-sm text-gray-500">
                                    <span className="w-4 h-4 mr-1">📞</span>
                                    <span>{spotDetail.tel}</span>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 px-3 py-2 rounded-full">
                        <Coins className="w-4 h-4 text-white" />
                        <span className="text-white font-bold">100</span>
                    </div>
                </div>
            </div>

            {/* 소개정보 */}
            {spotIntro && (
                <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">이용안내</h3>
                    <div className="space-y-2 text-sm">
                        {spotIntro.usefee && (
                            <div>
                                <span className="font-medium text-gray-700">이용요금: </span>
                                <span
                                    className="text-gray-600"
                                    dangerouslySetInnerHTML={{ __html: spotIntro.usefee.replace(/<br\s*\/?>/gi, ", ") }}
                                />
                            </div>
                        )}

                        {(spotIntro.usetime || spotIntro.usetimeculture || spotIntro.opentimefood) && (
                            <div>
                                <span className="font-medium text-gray-700">이용시간: </span>
                                <span className="text-gray-600">
                  {spotIntro.usetime || spotIntro.usetimeculture || spotIntro.opentimefood}
                </span>
                            </div>
                        )}

                        {(spotIntro.parking || spotIntro.parkingculture) && (
                            <div>
                                <span className="font-medium text-gray-700">주차: </span>
                                <span className="text-gray-600">{spotIntro.parking || spotIntro.parkingculture}</span>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default SpotInfo
