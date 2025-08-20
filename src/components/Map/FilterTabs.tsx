import React from 'react';
import { CategoryFilter, CategoryCounts } from '../../types/tourist';

interface FilterTabsProps {
  filter: CategoryFilter;
  setFilter: (filter: CategoryFilter) => void;
  categoryCounts: CategoryCounts;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ filter, setFilter, categoryCounts }) => {
  const tabs = [
    { key: 'all' as const, label: '전체', count: categoryCounts.all, color: 'bg-gray-500' },
    { key: '문화관광' as const, label: '문화관광', count: categoryCounts.문화관광, color: 'bg-blue-500' },
    { key: '자연관광' as const, label: '자연관광', count: categoryCounts.자연관광, color: 'bg-emerald-500' },
    { key: '역사관광' as const, label: '역사관광', count: categoryCounts.역사관광, color: 'bg-violet-500' },
    { key: '체험관광' as const, label: '체험관광', count: categoryCounts.체험관광, color: 'bg-pink-500' },
    { key: '축제/공연/행사' as const, label: '축제/행사', count: categoryCounts['축제/공연/행사'], color: 'bg-red-500' },
    { key: '레저스포츠' as const, label: '레저스포츠', count: categoryCounts.레저스포츠, color: 'bg-red-500' },
    { key: '쇼핑' as const, label: '쇼핑', count: categoryCounts.쇼핑, color: 'bg-emerald-500' },
    { key: '숙박' as const, label: '숙박', count: categoryCounts.숙박, color: 'bg-amber-500' },
    { key: '음식' as const, label: '음식', count: categoryCounts.음식, color: 'bg-orange-500' },
    { key: '추천코스' as const, label: '추천코스', count: categoryCounts.추천코스, color: 'bg-violet-500' }
  ];

  return (
      <div className="flex space-x-1 overflow-x-auto scrollbar-hide pb-1">
        {tabs.map(({ key, label, count, color }) => (
            <button
                key={key}
                onClick={() => setFilter(key)}
                className={`flex-shrink-0 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    filter === key
                        ? `${color} text-white shadow-sm`
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
            >
              {label}
              <span className={`ml-1 text-xs ${filter === key ? 'text-white opacity-80' : 'text-gray-400'}`}>
            ({count})
          </span>
            </button>
        ))}
      </div>
  );
};

export default FilterTabs;