import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchInputProps {
    searchTerm: string;
    setSearchTerm: (term: string) => void;
    placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
                                                     searchTerm,
                                                     setSearchTerm,
                                                     placeholder = "관광지 이름이나 주소로 검색..."
                                                 }) => {
    const handleClear = () => {
        setSearchTerm('');
    };

    return (
        <div className="relative">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={placeholder}
                className="w-full pl-10 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            {searchTerm && (
                <button
                    onClick={handleClear}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X className="w-4 h-4" />
                </button>
            )}
        </div>
    );
};

export default SearchInput;