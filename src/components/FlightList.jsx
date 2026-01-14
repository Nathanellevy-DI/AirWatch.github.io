import { useState } from 'react';
import { Plane, MapPin, ArrowUpDown, TrendingUp, TrendingDown, Minus, Search, Filter } from 'lucide-react';
import { formatDistance, metersToFeet, msToKnots } from '../utils/geo';

function FlightList({ flights, onFlightSelect, isLoading }) {
    const [sortBy, setSortBy] = useState('distance');
    const [filterText, setFilterText] = useState('');

    const filteredFlights = flights.filter(f =>
        f.callsign.toLowerCase().includes(filterText.toLowerCase()) ||
        f.originCountry.toLowerCase().includes(filterText.toLowerCase()) ||
        (f.airline && f.airline.toLowerCase().includes(filterText.toLowerCase()))
    );

    const sortedFlights = [...filteredFlights].sort((a, b) => {
        switch (sortBy) {
            case 'altitude': return (b.baroAltitude || 0) - (a.baroAltitude || 0);
            case 'speed': return (b.velocity || 0) - (a.velocity || 0);
            case 'callsign': return a.callsign.localeCompare(b.callsign);
            default: return (a.distance || 0) - (b.distance || 0);
        }
    });

    const getVerticalIcon = (rate) => {
        if (!rate) return <Minus className="w-3 h-3 text-gray-500" />;
        if (rate > 0.5) return <TrendingUp className="w-3 h-3 text-green-400" />;
        if (rate < -0.5) return <TrendingDown className="w-3 h-3 text-amber-400" />;
        return <Minus className="w-3 h-3 text-gray-500" />;
    };

    return (
        <div className="pt-16 lg:pl-72 pb-20 lg:pb-4 min-h-screen">
            <div className="p-4 lg:p-6">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <div>
                        <h2 className="text-2xl font-bold text-white">All Flights</h2>
                        <p className="text-gray-500">{flights.length} aircraft tracked in view</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative flex-1 sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="text"
                                value={filterText}
                                onChange={(e) => setFilterText(e.target.value)}
                                placeholder="Search flights..."
                                className="w-full pl-10 pr-4 py-2.5 bg-[#161b22] border border-white/10 rounded-xl
                         text-white placeholder-gray-500 focus:outline-none focus:border-violet-500/50"
                            />
                        </div>

                        {/* Sort */}
                        <div className="relative">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="appearance-none bg-[#161b22] border border-white/10 rounded-xl
                         px-4 py-2.5 pr-10 text-white focus:outline-none focus:border-violet-500/50"
                            >
                                <option value="distance">Distance</option>
                                <option value="altitude">Altitude</option>
                                <option value="speed">Speed</option>
                                <option value="callsign">Callsign</option>
                            </select>
                            <ArrowUpDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        </div>
                    </div>
                </div>

                {/* Flight Table */}
                <div className="bg-[#161b22] rounded-2xl border border-white/5 overflow-hidden">
                    {/* Table Header */}
                    <div className="hidden lg:grid grid-cols-7 gap-4 px-6 py-3 bg-[#0d1117] border-b border-white/5 text-xs uppercase tracking-wider text-gray-500">
                        <div className="col-span-2">Flight</div>
                        <div>Origin</div>
                        <div className="text-right">Altitude</div>
                        <div className="text-right">Speed</div>
                        <div className="text-right">Heading</div>
                        <div className="text-right">Distance</div>
                    </div>

                    {/* Flight Rows */}
                    <div className="divide-y divide-white/5">
                        {sortedFlights.length === 0 && !isLoading ? (
                            <div className="text-center py-16">
                                <MapPin className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-white mb-2">No Flights Found</h3>
                                <p className="text-gray-500">Try adjusting your search or zoom out on the map</p>
                            </div>
                        ) : (
                            sortedFlights.map((flight, i) => (
                                <button
                                    key={flight.icao24}
                                    onClick={() => onFlightSelect(flight)}
                                    className="w-full flex lg:grid lg:grid-cols-7 gap-4 px-4 lg:px-6 py-4 
                           hover:bg-white/5 transition-colors text-left items-center"
                                >
                                    {/* Flight Info */}
                                    <div className="flex items-center gap-3 lg:col-span-2 flex-1 lg:flex-none">
                                        <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                                            <Plane className="w-5 h-5 text-violet-400"
                                                style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }} />
                                        </div>
                                        <div className="min-w-0">
                                            <div className="font-semibold text-white truncate">{flight.callsign}</div>
                                            <div className="text-xs text-gray-500 truncate lg:hidden">
                                                {flight.airline || flight.categoryLabel}
                                            </div>
                                            <div className="hidden lg:block text-xs text-violet-400 truncate">
                                                {flight.airline || flight.categoryLabel}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Origin - Desktop */}
                                    <div className="hidden lg:flex items-center gap-2">
                                        <span className="text-gray-300">{flight.originCountry}</span>
                                    </div>

                                    {/* Stats - Mobile */}
                                    <div className="flex flex-col items-end gap-1 lg:hidden">
                                        <div className="font-semibold text-violet-400">
                                            {flight.baroAltitude ? `${(metersToFeet(flight.baroAltitude) / 1000).toFixed(0)}k ft` : '--'}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                            {formatDistance(flight.distance || 0)}
                                        </div>
                                    </div>

                                    {/* Altitude - Desktop */}
                                    <div className="hidden lg:flex items-center justify-end gap-1">
                                        {getVerticalIcon(flight.verticalRate)}
                                        <span className="text-white font-medium">
                                            {flight.baroAltitude ? metersToFeet(flight.baroAltitude).toLocaleString() : '--'}
                                        </span>
                                        <span className="text-gray-500 text-xs">ft</span>
                                    </div>

                                    {/* Speed - Desktop */}
                                    <div className="hidden lg:block text-right text-gray-300">
                                        {flight.velocity ? msToKnots(flight.velocity) : '--'} <span className="text-gray-500 text-xs">kts</span>
                                    </div>

                                    {/* Heading - Desktop */}
                                    <div className="hidden lg:block text-right text-gray-300">
                                        {flight.trueTrack ? `${Math.round(flight.trueTrack)}°` : '--'}
                                    </div>

                                    {/* Distance - Desktop */}
                                    <div className="hidden lg:block text-right font-medium text-violet-400">
                                        {formatDistance(flight.distance || 0)}
                                    </div>
                                </button>
                            ))
                        )}
                    </div>
                </div>

                {/* Loading */}
                {isLoading && flights.length === 0 && (
                    <div className="space-y-2 mt-4">
                        {[...Array(8)].map((_, i) => (
                            <div key={i} className="bg-[#161b22] rounded-xl p-4 animate-pulse">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-xl bg-[#0d1117]" />
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 w-24 bg-[#0d1117] rounded" />
                                        <div className="h-3 w-32 bg-[#0d1117] rounded" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default FlightList;
