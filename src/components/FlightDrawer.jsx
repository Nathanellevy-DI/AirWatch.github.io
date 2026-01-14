import { Plane, MapPin, Radar, ArrowDownUp } from 'lucide-react';
import FlightCard from './FlightCard';
import { useState } from 'react';

function FlightDrawer({ flights, onFlightSelect, isLoading }) {
    const [sortBy, setSortBy] = useState('distance'); // 'distance' | 'altitude' | 'speed'

    const sortedFlights = [...flights].sort((a, b) => {
        switch (sortBy) {
            case 'altitude':
                return (b.baroAltitude || 0) - (a.baroAltitude || 0);
            case 'speed':
                return (b.velocity || 0) - (a.velocity || 0);
            default:
                return a.distance - b.distance;
        }
    });

    return (
        <div className="px-4 pt-4 pb-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-aviation-accent/20 flex items-center justify-center">
                        <Radar className="w-5 h-5 text-aviation-accent" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold text-white">Nearby Aircraft</h2>
                        <p className="text-xs text-gray-500">{flights.length} flights within 150km</p>
                    </div>
                </div>

                {/* Sort dropdown */}
                <div className="relative">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="appearance-none bg-aviation-slate/80 border border-white/10 rounded-xl 
                     px-4 py-2 pr-8 text-sm text-white font-medium
                     focus:outline-none focus:border-aviation-accent/50 cursor-pointer"
                    >
                        <option value="distance">By Distance</option>
                        <option value="altitude">By Altitude</option>
                        <option value="speed">By Speed</option>
                    </select>
                    <ArrowDownUp className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                </div>
            </div>

            {/* Flight List */}
            {flights.length === 0 && !isLoading ? (
                <div className="text-center py-16">
                    <div className="relative w-20 h-20 mx-auto mb-6">
                        <div className="w-20 h-20 rounded-full bg-aviation-slate flex items-center justify-center">
                            <MapPin className="w-10 h-10 text-gray-600" />
                        </div>
                        <div className="absolute inset-0 rounded-full border-2 border-dashed border-gray-700 animate-spin"
                            style={{ animationDuration: '10s' }} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">No Aircraft Detected</h3>
                    <p className="text-sm text-gray-400 max-w-xs mx-auto">
                        No flights found within 150km of your location. This could be due to low air traffic or API limits.
                    </p>
                    <p className="text-xs text-gray-600 mt-4">
                        Data refreshes automatically every 15 seconds
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {sortedFlights.map((flight, index) => (
                        <div
                            key={flight.icao24}
                            className="animate-fade-in"
                            style={{ animationDelay: `${index * 50}ms` }}
                        >
                            <FlightCard
                                flight={flight}
                                onClick={() => onFlightSelect(flight)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {/* Loading skeleton */}
            {isLoading && flights.length === 0 && (
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="bg-aviation-slate/50 rounded-2xl p-4 animate-pulse">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 rounded-xl bg-aviation-dark/50"></div>
                                <div className="flex-1">
                                    <div className="h-5 w-24 bg-aviation-dark/50 rounded mb-2"></div>
                                    <div className="h-3 w-40 bg-aviation-dark/50 rounded"></div>
                                </div>
                                <div className="text-right">
                                    <div className="h-6 w-16 bg-aviation-dark/50 rounded mb-1"></div>
                                    <div className="h-3 w-20 bg-aviation-dark/50 rounded"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default FlightDrawer;
