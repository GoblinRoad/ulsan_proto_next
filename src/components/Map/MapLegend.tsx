import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { getCategoryIcon, getWhaleMarkerPath } from '../../utils/markerUtils';

interface MapLegendProps {
    className?: string;
}

const MapLegend: React.FC<MapLegendProps> = ({ className = "" }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const categories = [
        { key: '문화관광', label: '문화관광', icon: getCategoryIcon('문화관광') },
        { key: '자연관광', label: '자연관광', icon: getCategoryIcon('자연관광') },
        { key: '역사관광', label: '역사관광', icon: getCategoryIcon('역사관광') },
        { key: '체험관광', label: '체험관광', icon: getCategoryIcon('체험관광') },
        { key: '레저스포츠', label: '레저스포츠', icon: getCategoryIcon('레저스포츠') },
        { key: '시장', label: '시장', icon: getCategoryIcon('시장') },
    ];

    return (
        <div className={`bg-white rounded-lg shadow-lg z-10 ${className}`}>
            {/* 항상 보이는 헤더 */}
            <div
                className="flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-gray-50 rounded-t-lg"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-700">카테고리</span>
                    <div className="flex items-center space-x-1">
                        <img
                            src={getWhaleMarkerPath('문화관광')}
                            alt="고래 마커"
                            className="w-4 h-4"
                        />
                    </div>
                </div>
                {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-500" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                )}
            </div>

            {/* 확장된 내용 */}
            {isExpanded && (
                <div className="px-3 pb-3 border-t border-gray-100">
                    <div className="space-y-2 mt-2">
                        {/* 카테고리별 고래 마커 */}
                        <div className="space-y-1">
                            {categories.map(({ key, label, icon }) => (
                                <div key={key} className="flex items-center space-x-2">
                                    <img
                                        src={getWhaleMarkerPath(key)}
                                        alt={label}
                                        className="w-4 h-5 flex-shrink-0"
                                    />
                                    <span className="text-xs text-gray-600">{icon} {label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MapLegend;