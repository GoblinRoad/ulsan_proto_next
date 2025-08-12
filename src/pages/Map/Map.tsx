import React, { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import MapView from './components/MapView';
import FilterTabs from './components/FilterTabs';
import SpotList from './components/SpotList';

const Map: React.FC = () => {
  const { state } = useApp();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('list');
  const [filter, setFilter] = useState<'all' | 'famous' | 'hidden'>('all');

  const filteredSpots = state.touristSpots.filter(spot => {
    if (filter === 'all') return true;
    return spot.category === filter;
  });

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold text-gray-800">관광지 찾기</h2>
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
          <FilterTabs filter={filter} setFilter={setFilter} />
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