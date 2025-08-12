import React from 'react';

interface FilterTabsProps {
  filter: 'all' | 'famous' | 'hidden';
  setFilter: (filter: 'all' | 'famous' | 'hidden') => void;
}

const FilterTabs: React.FC<FilterTabsProps> = ({ filter, setFilter }) => {
  const tabs = [
    { key: 'all' as const, label: '전체', count: '6' },
    { key: 'famous' as const, label: '유명 관광지', count: '3' },
    { key: 'hidden' as const, label: '숨은 명소', count: '3' }
  ];

  return (
    <div className="flex space-x-1">
      {tabs.map(({ key, label, count }) => (
        <button
          key={key}
          onClick={() => setFilter(key)}
          className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
            filter === key
              ? 'bg-blue-500 text-white shadow-sm'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          {label}
          <span className={`ml-1 text-xs ${filter === key ? 'text-blue-200' : 'text-gray-400'}`}>
            ({count})
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;