import React from 'react';
import { DistrictFilter, SpotCounts } from '../../../types/tourist';

interface DistrictFilterTabsProps {
    filter: DistrictFilter;
    setFilter: (filter: DistrictFilter) => void;
    spotCounts: SpotCounts;
}

const DistrictFilterTabs: React.FC<DistrictFilterTabsProps> = ({ filter, setFilter, spotCounts }) => {
    const tabs = [
        { key: 'all' as const, label: '전체', count: spotCounts.all, color: 'bg-gray-500' },
        { key: 'jung' as const, label: '중구', count: spotCounts.jung, color: 'bg-red-500' },
        { key: 'nam' as const, label: '남구', count: spotCounts.nam, color: 'bg-blue-500' },
        { key: 'dong' as const, label: '동구', count: spotCounts.dong, color: 'bg-yellow-500' },
        { key: 'buk' as const, label: '북구', count: spotCounts.buk, color: 'bg-purple-500' },
        { key: 'ulju' as const, label: '울주군', count: spotCounts.ulju, color: 'bg-green-500' }
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

export default DistrictFilterTabs;