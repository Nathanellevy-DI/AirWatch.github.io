import { useState } from 'react';
import { Search, X, Loader2, Plane, Globe } from 'lucide-react';

function SearchBar({ onSearch, isSearching }) {
    const [query, setQuery] = useState('');
    const [isFocused, setIsFocused] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query.trim());
        }
    };

    const handleClear = () => {
        setQuery('');
    };

    const quickSearches = [
        { code: 'UAL', label: 'United' },
        { code: 'DAL', label: 'Delta' },
        { code: 'AAL', label: 'American' },
        { code: 'BAW', label: 'British Airways' },
        { code: 'DLH', label: 'Lufthansa' },
        { code: 'AFR', label: 'Air France' },
    ];

    return (
        <div className="space-y-3">
            <form onSubmit={handleSubmit} className="relative">
                <div className={`relative flex items-center transition-all duration-200 ${isFocused ? 'ring-2 ring-violet-500/50' : ''
                    }`}>
                    <div className="absolute left-4 text-gray-400">
                        {isSearching ? (
                            <Loader2 className="w-5 h-5 animate-spin text-violet-400" />
                        ) : (
                            <Search className="w-5 h-5" />
                        )}
                    </div>

                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value.toUpperCase())}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder="Search by flight number, airline, or ICAO..."
                        className="w-full bg-[#0d1117] border border-white/10 
                     rounded-xl pl-12 pr-24 py-4 text-white placeholder-gray-500
                     focus:outline-none focus:border-violet-500/50
                     text-base font-medium tracking-wide"
                        disabled={isSearching}
                    />

                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-20 text-gray-400 hover:text-white p-1 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    <button
                        type="submit"
                        disabled={!query.trim() || isSearching}
                        className="absolute right-2 bg-violet-500 hover:bg-violet-400 disabled:bg-gray-700
                     text-white font-semibold px-4 py-2.5 rounded-lg
                     transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
                    >
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">Find</span>
                    </button>
                </div>
            </form>

            {/* Quick search buttons */}
            <div className="flex flex-wrap gap-2">
                <span className="text-xs text-gray-500 flex items-center mr-2">Quick search:</span>
                {quickSearches.map(item => (
                    <button
                        key={item.code}
                        type="button"
                        onClick={() => {
                            setQuery(item.code);
                            onSearch(item.code);
                        }}
                        disabled={isSearching}
                        className="text-xs px-3 py-1.5 bg-white/5 text-gray-400 
                     rounded-lg hover:bg-violet-500/20 hover:text-violet-400 
                     transition-all disabled:opacity-50 border border-white/5"
                    >
                        {item.code}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default SearchBar;
