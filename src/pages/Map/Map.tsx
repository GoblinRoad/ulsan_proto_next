import React, { useState, useMemo, useCallback } from 'react';
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import MapView from './components/MapView';
import FilterTabs from './components/FilterTabs';
import DistrictFilterTabs from './components/DistrictFilterTabs';
import SpotList from './components/SpotList';
import {TEST_TOURIST_SPOTS} from "@/data/testData"
import useTourApi from '../../hooks/useTourApi';
import { CategoryFilter, DistrictFilter, CategoryCounts, SpotCounts } from '../../types/tourist';

const Map: React.FC = () => {
  const { spots, loading, error, refetch } = useTourApi();
  const [checkedInSpots, setCheckedInSpots] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [districtFilter, setDistrictFilter] = useState<DistrictFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');

  const handleCheckInComplete = useCallback((spotId: string) => {
    setCheckedInSpots(prev => new Set([...prev, spotId]));
    // 선택적으로 전체 데이터 새로고침
    refetch();
  }, [refetch]);


  // 두 단계 필터링된 관광지
  const filteredSpots = useMemo(() => {
    let filtered = spots;

    // 1단계: 구별 필터링
    if (districtFilter !== 'all') {
      filtered = filtered.filter(spot => spot.district === districtFilter);
    }

    // 2단계: 카테고리 필터링
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(spot => spot.category === categoryFilter);
    }

    return filtered;
  }, [spots, districtFilter, categoryFilter]);

  // 구별 관광지 개수 계산 (카테고리 필터 적용)
  const spotCounts: SpotCounts = useMemo(() => {
    const categoryFiltered = categoryFilter === 'all'
        ? spots
        : spots.filter(spot => spot.category === categoryFilter);

    return {
      all: categoryFiltered.length,
      jung: categoryFiltered.filter(spot => spot.district === 'jung').length,
      nam: categoryFiltered.filter(spot => spot.district === 'nam').length,
      dong: categoryFiltered.filter(spot => spot.district === 'dong').length,
      buk: categoryFiltered.filter(spot => spot.district === 'buk').length,
      ulju: categoryFiltered.filter(spot => spot.district === 'ulju').length,
    };
  }, [spots, categoryFilter]);

  // 카테고리별 관광지 개수 계산 (구별 필터 적용)
  const categoryCounts: CategoryCounts = useMemo(() => {
    const districtFiltered = districtFilter === 'all'
        ? spots
        : spots.filter(spot => spot.district === districtFilter);

    return {
      all: districtFiltered.length,
      문화관광: districtFiltered.filter(spot => spot.category === '문화관광').length,
      자연관광: districtFiltered.filter(spot => spot.category === '자연관광').length,
      역사관광: districtFiltered.filter(spot => spot.category === '역사관광').length,
      체험관광: districtFiltered.filter(spot => spot.category === '체험관광').length,
      '축제/공연/행사': districtFiltered.filter(spot => spot.category === '축제/공연/행사').length,
      레저스포츠: districtFiltered.filter(spot => spot.category === '레저스포츠').length,
      쇼핑: districtFiltered.filter(spot => spot.category === '쇼핑').length,
      숙박: districtFiltered.filter(spot => spot.category === '숙박').length,
      음식: districtFiltered.filter(spot => spot.category === '음식').length,
      추천코스: districtFiltered.filter(spot => spot.category === '추천코스').length,
    };
  }, [spots, districtFilter]);

  // 로딩 상태
  if (loading) {
    return (
        <div className="max-w-md mx-auto">
          <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
            <div className="px-4 py-3">
              <h2 className="text-lg font-bold text-gray-800">관광지 찾기</h2>
            </div>
          </div>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <Loader2 className="w-12 h-12 text-blue-500 mx-auto mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">관광지 정보 로딩 중...</h3>
              <p className="text-gray-500 text-sm">울산 관광지 데이터를 가져오고 있습니다</p>
            </div>
          </div>
        </div>
    );
  }

  // 에러 상태
  if (error) {
    return (
        <div className="max-w-md mx-auto">
          <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
            <div className="px-4 py-3">
              <h2 className="text-lg font-bold text-gray-800">관광지 찾기</h2>
            </div>
          </div>
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center px-4">
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-red-600 mb-2">데이터 로드 실패</h3>
              <p className="text-gray-600 text-sm mb-4">{error}</p>
              <button
                  onClick={refetch}
                  className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors mx-auto"
              >
                <RefreshCw className="w-4 h-4" />
                <span>다시 시도</span>
              </button>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="max-w-md mx-auto">
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-bold text-gray-800">관광지 찾기</h2>
                <button
                    onClick={refetch}
                    className="p-1 hover:bg-gray-100 rounded-md transition-colors"
                    title="새로고침"
                >
                  <RefreshCw className="w-4 h-4 text-gray-500" />
                </button>
              </div>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                    onClick={() => setViewMode('list')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'list' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                >
                  목록
                </button>
                <button
                    onClick={() => setViewMode('map')}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                        viewMode === 'map' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-600'
                    }`}
                >
                  지도
                </button>
              </div>
            </div>

            {/* 구별 필터 */}
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">구별</span>
                <span className="text-xs text-gray-500">({filteredSpots.length}개)</span>
              </div>
              <DistrictFilterTabs
                  filter={districtFilter}
                  setFilter={setDistrictFilter}
                  spotCounts={spotCounts}
              />
            </div>

            {/* 카테고리 필터 */}
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">카테고리</span>
              </div>
              <FilterTabs
                  filter={categoryFilter}
                  setFilter={setCategoryFilter}
                  categoryCounts={categoryCounts}
              />
            </div>
          </div>
        </div>

        <div className="min-h-screen bg-gray-50">
          {viewMode === 'map' ? (
              <MapView spots={filteredSpots} />
          ) : sessionStorage.getItem("testMode") === "true" ? (
              <SpotList
                  spots={TEST_TOURIST_SPOTS}
                  onCheckInComplete={handleCheckInComplete}
              />
          ) : (
              <SpotList
                  spots={filteredSpots}
                  onCheckInComplete={handleCheckInComplete}
              />
          )}
        </div>
      </div>
  );
};

export default Map;