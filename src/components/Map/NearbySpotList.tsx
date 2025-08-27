import { useNavigate } from 'react-router-dom';
import { MapPin, Camera, Eye, Coins } from 'lucide-react';
import { TouristSpot, CATEGORY_COLORS } from '@/types/tourist';
import { getCategoryIcon } from '@/utils/markerUtils';
import { testModeManager } from '@/data/testData';

interface NearbySpotListProps {
    spots: (TouristSpot & { distance: number })[];
    onCheckInComplete: (spotId: string) => void;
    formatDistance: (distance: number) => string;
    showDetailView?: boolean;
}

const NearbySpotList: React.FC<NearbySpotListProps> = ({
                                                           spots,
                                                           formatDistance
                                                       }) => {
    const navigate = useNavigate();

    const handleCheckIn = (spot: TouristSpot) => {
        if (!spot.visited) {
            if (testModeManager.isTestMode()) {
                const testSpot = testModeManager.getTestSpotDetail(spot.id);
                if (testSpot) {
                    navigate(
                        `/checkin?contentId=${testSpot.contentid}&contentType=${testSpot.contenttypeid}&fromSpotId=${encodeURIComponent(spot.id)}`
                    );
                }
            } else {
                navigate(
                    `/checkin?contentId=${spot.id}&contentType=${spot.type}&fromSpotId=${encodeURIComponent(spot.id)}`
                );
            }
        }
    };

    const handleDetail = (spot: TouristSpot) => {
        navigate(`/checkin/spot/${spot.id}`);
    };

    const getDistrictName = (district: string) => {
        switch (district) {
            case 'jung': return '중구';
            case 'nam': return '남구';
            case 'dong': return '동구';
            case 'buk': return '북구';
            case 'ulju': return '울주군';
            default: return '기타';
        }
    };

    const getDistrictColor = (district: string) => {
        switch (district) {
            case 'jung': return '#EF4444';
            case 'nam': return '#3B82F6';
            case 'dong': return '#EAB308';
            case 'buk': return '#8B5CF6';
            case 'ulju': return '#10B981';
            default: return '#6B7280';
        }
    };

    return (
        <div className="space-y-3">
            {spots.map((spot) => {
                const categoryColor = CATEGORY_COLORS[spot.category] || '#6B7280';
                const categoryIcon = getCategoryIcon(spot.category);
                const districtColor = getDistrictColor(spot.district);

                return (
                    <div
                        key={spot.id}
                        className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                        <div className="flex space-x-3">
                            {/* 이미지 */}
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                {spot.image && spot.image !== '/placeholder-image.jpg' ? (
                                    <img
                                        src={spot.image}
                                        alt={spot.name}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            const target = e.target as HTMLImageElement;
                                            target.style.display = 'none';
                                            target.parentElement!.innerHTML = `
                        <div class="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-lg">
                          ${categoryIcon}
                        </div>
                      `;
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-blue-600 text-lg">
                                        {categoryIcon}
                                    </div>
                                )}
                            </div>

                            {/* 정보 */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-2">
                                    <h4 className="font-semibold text-gray-900 text-sm line-clamp-2 leading-tight">
                                        {spot.name}
                                    </h4>
                                    <div className="flex items-center space-x-1 ml-2 flex-shrink-0">
                                        <MapPin className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs text-gray-500 font-medium">
                      {formatDistance(spot.distance)}
                    </span>
                                    </div>
                                </div>

                                <div className="flex items-center space-x-2 mb-2 flex-wrap gap-1">
                  <span
                      className="text-xs px-2 py-1 rounded-full text-white font-medium"
                      style={{ backgroundColor: districtColor }}
                  >
                    {getDistrictName(spot.district)}
                  </span>
                                    <span
                                        className="text-xs px-2 py-1 rounded-full text-white font-medium"
                                        style={{ backgroundColor: categoryColor }}
                                    >
                    {categoryIcon} {spot.category}
                  </span>
                                    <div className="flex items-center space-x-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full">
                                        <Coins className="w-3 h-3" />
                                        <span className="text-xs font-bold">{spot.coins}</span>
                                    </div>
                                </div>

                                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-3">
                                    {spot.description}
                                </p>

                                {/* 액션 버튼 */}
                                {spot.visited ? (
                                    <div className="flex items-center justify-center bg-green-50 text-green-600 py-2 px-3 rounded-lg">
                                        <span className="text-xs font-semibold">✅ 방문 완료</span>
                                    </div>
                                ) : (
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleDetail(spot)}
                                            className="flex-1 flex items-center justify-center space-x-1 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-3 rounded-lg transition-colors"
                                        >
                                            <Eye className="w-3 h-3" />
                                            <span className="text-xs font-medium">상세보기</span>
                                        </button>
                                        <button
                                            onClick={() => handleCheckIn(spot)}
                                            className="flex-1 flex items-center justify-center space-x-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-3 rounded-lg transition-colors"
                                        >
                                            <Camera className="w-3 h-3" />
                                            <span className="text-xs font-medium">체크인</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default NearbySpotList;