import { Plane, Navigation, ChevronRight, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatDistance, metersToFeet, msToKnots } from '../utils/geo';

function FlightCard({ flight, onClick }) {
    // Vertical rate indicator
    const getVerticalIndicator = () => {
        if (!flight.verticalRate) return null;
        if (flight.verticalRate > 0.5) {
            return <TrendingUp className="w-3.5 h-3.5 text-aviation-success" />;
        }
        if (flight.verticalRate < -0.5) {
            return <TrendingDown className="w-3.5 h-3.5 text-aviation-warning" />;
        }
        return <Minus className="w-3.5 h-3.5 text-gray-500" />;
    };

    return (
        <button
            onClick={onClick}
            className="w-full bg-gradient-to-r from-aviation-slate/80 to-aviation-slate/40 
                 backdrop-blur-lg border border-white/5 rounded-2xl p-4
                 hover:from-aviation-slate hover:to-aviation-slate/60 
                 active:scale-[0.98] transition-all duration-200 text-left group"
        >
            <div className="flex items-center gap-4">
                {/* Plane Icon */}
                <div className="relative">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-aviation-accent/20 to-aviation-glow/10 
                          flex items-center justify-center border border-aviation-accent/20
                          group-hover:border-aviation-accent/40 transition-colors">
                        <Plane
                            className="w-7 h-7 text-aviation-accent transition-transform duration-300"
                            style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }}
                        />
                    </div>
                    {!flight.onGround && (
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-aviation-dark 
                          flex items-center justify-center border border-aviation-dark">
                            {getVerticalIndicator()}
                        </div>
                    )}
                </div>

                {/* Flight Info */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-white text-lg tracking-tight">{flight.callsign}</span>
                        {flight.onGround && (
                            <span className="px-2 py-0.5 bg-aviation-warning/20 text-aviation-warning text-xs 
                             font-semibold rounded-full border border-aviation-warning/30">
                                GND
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        {flight.airline ? (
                            <span className="text-aviation-glow font-medium">{flight.airline}</span>
                        ) : (
                            <span className="text-gray-400">{flight.originCountry}</span>
                        )}
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-500">{flight.categoryLabel}</span>
                    </div>
                </div>

                {/* Stats */}
                <div className="text-right shrink-0">
                    <div className="text-xl font-bold text-aviation-glow mb-0.5">
                        {formatDistance(flight.distance)}
                    </div>
                    <div className="flex items-center justify-end gap-2 text-xs text-gray-500">
                        <span>{flight.baroAltitude ? `${(metersToFeet(flight.baroAltitude) / 1000).toFixed(1)}k ft` : '--'}</span>
                        <span>•</span>
                        <span>{flight.velocity ? `${msToKnots(flight.velocity)} kts` : '--'}</span>
                    </div>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-aviation-accent 
                                transition-colors shrink-0" />
            </div>
        </button>
    );
}

export default FlightCard;
