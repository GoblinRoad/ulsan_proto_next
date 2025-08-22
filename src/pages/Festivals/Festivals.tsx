import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MapPin, Loader2 } from 'lucide-react';
import { getFestivalsWithCache, FestivalInfo } from '../../services/festivalService';

const Festivals: React.FC = () => {
  const navigate = useNavigate();
  const [festivals, setFestivals] = useState<FestivalInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFestivals = async () => {
      try {
        const festivalData = await getFestivalsWithCache();
        setFestivals(festivalData);
      } catch (error) {
        console.error('축제 정보 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    loadFestivals();
  }, []);

  const handleFestivalClick = (festivalId: string) => {
    navigate(`/festival/${festivalId}`);
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 py-8">
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">축제 정보 로딩 중...</h3>
            <p className="text-gray-500 text-sm">오늘의 축제/행사 정보를 가져오고 있습니다</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 space-y-6 animate-slideUp">
      {/* Header */}
      <div className="flex items-center space-x-3 pt-2">
        <button 
          onClick={() => navigate(-1)} 
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="w-5 h-5 text-gray-700" />
        </button>
        <h2 className="text-xl font-bold text-gray-800">축제/행사</h2>
      </div>

      {festivals.length === 0 ? (
        <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">축제/행사가 없습니다</h3>
            <p className="text-gray-500 text-sm">오늘 진행되는 축제/행사가 없습니다</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <div className="space-y-4">
            {festivals.map((festival) => (
              <div
                key={festival.contentId}
                className="group cursor-pointer"
                onClick={() => handleFestivalClick(festival.contentId)}
              >
                <div className="relative h-32 rounded-xl overflow-hidden hover:scale-[1.02] transition-transform duration-200">
                  {/* 배경 이미지 */}
                  <div className="absolute inset-0">
                    {festival.firstimage ? (
                      <img
                        src={festival.firstimage}
                        alt={festival.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                        <Calendar className="w-8 h-8 text-white" />
                      </div>
                    )}
                  </div>
                  
                  {/* 그라데이션 오버레이 */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  
                  {/* 텍스트 콘텐츠 */}
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-bold text-lg mb-1 line-clamp-1">
                      {festival.title}
                    </h3>
                    <div className="flex items-center space-x-2 text-sm text-white/80 mb-1">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">
                        {festival.addr1}
                        {festival.addr2 && ` ${festival.addr2}`}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-white/80">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {festival.eventstartdate.slice(4, 6)}.{festival.eventstartdate.slice(6, 8)}
                        {festival.eventstartdate !== festival.eventenddate && 
                          ` - ${festival.eventenddate.slice(4, 6)}.${festival.eventenddate.slice(6, 8)}`
                        }
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Festivals;
