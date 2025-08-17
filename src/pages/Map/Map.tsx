import React, { useState, useMemo } from 'react';
import { RefreshCw, AlertCircle, Loader2 } from 'lucide-react';
import MapView from './components/MapView';
import FilterTabs from './components/FilterTabs';
import DistrictFilterTabs from './components/DistrictFilterTabs';
import SpotList from './components/SpotList';
import SearchInput from './components/SearchInput';
import useTourApi from '../../hooks/useTourApi';
import { CategoryFilter, DistrictFilter, CategoryCounts, SpotCounts } from '../../types/tourist';

const Map: React.FC = () => {
  const { spots, loading, error, refetch } = useTourApi();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [districtFilter, setDistrictFilter] = useState<DistrictFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // 검색어로 필터링하는 함수
  const searchFilter = (spot: any, term: string) => {
    if (!term) return true;

    const searchText = term.toLowerCase().trim();
    return (
        spot.name.toLowerCase().includes(searchText) ||
        spot.address.toLowerCase().includes(searchText) ||
        spot.description.toLowerCase().includes(searchText)
    );
  };

  // 세 단계 필터링된 관광지 (검색 + 구별 + 카테고리)
  const filteredSpots = useMemo(() => {
    let filtered = spots;

    // 1단계: 검색어 필터링
    if (searchTerm) {
      filtered = filtered.filter(spot => searchFilter(spot, searchTerm));
    }

    // 2단계: 구별 필터링
    if (districtFilter !== 'all') {
      filtered = filtered.filter(spot => spot.district === districtFilter);
    }

    // 3단계: 카테고리 필터링
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(spot => spot.category === categoryFilter);
    }

    return filtered;
  }, [spots, searchTerm, districtFilter, categoryFilter]);

  // 구별 관광지 개수 계산 (검색어 + 카테고리 필터 적용)
  const spotCounts: SpotCounts = useMemo(() => {
    let baseFiltered = spots;

    // 검색어 필터 적용
    if (searchTerm) {
      baseFiltered = baseFiltered.filter(spot => searchFilter(spot, searchTerm));
    }

    // 카테고리 필터 적용
    const categoryFiltered = categoryFilter === 'all'
        ? baseFiltered
        : baseFiltered.filter(spot => spot.category === categoryFilter);

    return {
      all: categoryFiltered.length,
      jung: categoryFiltered.filter(spot => spot.district === 'jung').length,
      nam: categoryFiltered.filter(spot => spot.district === 'nam').length,
      dong: categoryFiltered.filter(spot => spot.district === 'dong').length,
      buk: categoryFiltered.filter(spot => spot.district === 'buk').length,
      ulju: categoryFiltered.filter(spot => spot.district === 'ulju').length,
    };
  }, [spots, searchTerm, categoryFilter]);

  // 카테고리별 관광지 개수 계산 (검색어 + 구별 필터 적용)
  const categoryCounts: CategoryCounts = useMemo(() => {
    let baseFiltered = spots;

    // 검색어 필터 적용
    if (searchTerm) {
      baseFiltered = baseFiltered.filter(spot => searchFilter(spot, searchTerm));
    }

    // 구별 필터 적용
    const districtFiltered = districtFilter === 'all'
        ? baseFiltered
        : baseFiltered.filter(spot => spot.district === districtFilter);

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
  }, [spots, searchTerm, districtFilter]);

  // 검색어가 있을 때 필터 초기화 함수
  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    // 검색어가 입력되면 필터를 초기화하여 모든 결과를 보여줄 수 있음 (선택사항)
    // if (term) {
    //   setDistrictFilter('all');
    //   setCategoryFilter('all');
    // }
  };

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

            {/* 검색 입력 */}
            <div className="mb-3">
              <SearchInput
                  searchTerm={searchTerm}
                  setSearchTerm={handleSearchChange}
                  placeholder="관광지 이름이나 주소로 검색..."
              />
            </div>

            {/* 구별 필터 */}
            <div className="mb-2">
              <div className="flex items-center space-x-2 mb-2">
                <span className="text-sm font-medium text-gray-700">구별</span>
                <span className="text-xs text-gray-500">({filteredSpots.length}개)</span>
                {searchTerm && (
                    <span className="text-xs text-blue-500">
                    "{searchTerm}" 검색 결과
                  </span>
                )}
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
          ) : (
              <SpotList spots={filteredSpots} />
          )}
        </div>
      </div>
  );
};

export default Map;