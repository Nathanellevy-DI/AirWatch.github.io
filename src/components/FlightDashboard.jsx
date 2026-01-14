import { useEffect, useState } from 'react';
import {
    X, Plane, Navigation, ArrowUp, ArrowDown, Minus,
    Globe, Gauge, Mountain, Clock, MapPin,
    Building2, Flag, Activity, Compass, Radio, Zap,
    TrendingUp, BarChart3, Info
} from 'lucide-react';
import { formatDistance, metersToFeet, msToKnots, msToFpm } from '../utils/geo';

function FlightDashboard({ flight, isVisible, onClose }) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) setIsAnimating(true);
    }, [isVisible]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
    };

    const verticalRateFpm = flight?.verticalRate ? msToFpm(flight.verticalRate) : 0;
    const altitudeFt = flight?.baroAltitude ? metersToFeet(flight.baroAltitude) : 0;
    const speedKts = flight?.velocity ? msToKnots(flight.velocity) : 0;
    const altitudePercent = Math.min((altitudeFt / 45000) * 100, 100);
    const speedPercent = Math.min((speedKts / 550) * 100, 100);

    if (!flight) return null;

    return (
        <div className={`fixed inset-0 z-[1000] transition-opacity duration-300
                    ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleClose} />

            {/* Dashboard Panel */}
            <div className={`absolute inset-4 lg:inset-8 bg-[#0d1117] rounded-3xl border border-white/10 
                      overflow-hidden transform transition-all duration-300
                      ${isAnimating ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>

                {/* Header */}
                <div className="bg-gradient-to-r from-violet-600 to-purple-600 px-6 py-5">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-lg 
                            flex items-center justify-center shadow-lg">
                                <Plane className="w-8 h-8 text-white"
                                    style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }} />
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold text-white">{flight.callsign}</h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-white/80">
                                        {flight.airline || flight.icao24.toUpperCase()}
                                    </span>
                                    <span className="text-white/50">•</span>
                                    <span className="text-white/60">{flight.categoryLabel}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <div className={`px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2
                            ${flight.onGround
                                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                                    : 'bg-green-500/20 text-green-400 border border-green-500/30'}`}>
                                <div className={`w-2 h-2 rounded-full ${flight.onGround ? 'bg-amber-400' : 'bg-green-400 animate-pulse'}`} />
                                {flight.onGround ? 'On Ground' : 'In Flight'}
                            </div>
                            <button
                                onClick={handleClose}
                                className="w-12 h-12 rounded-xl bg-white/10 hover:bg-white/20 
                         flex items-center justify-center transition-colors"
                            >
                                <X className="w-6 h-6 text-white" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Dashboard Content */}
                <div className="p-6 overflow-y-auto max-h-[calc(100vh-200px)] hide-scrollbar">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* Left Column - Main Stats */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Stats Cards Row */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                                {[
                                    { label: 'Altitude', value: altitudeFt.toLocaleString(), unit: 'ft', icon: Mountain, color: 'violet' },
                                    { label: 'Speed', value: speedKts, unit: 'kts', icon: Gauge, color: 'blue' },
                                    { label: 'Heading', value: flight.trueTrack ? `${Math.round(flight.trueTrack)}°` : '--', unit: '', icon: Compass, color: 'amber' },
                                    { label: 'V/S', value: verticalRateFpm > 0 ? `+${verticalRateFpm}` : verticalRateFpm, unit: 'fpm', icon: TrendingUp, color: verticalRateFpm > 0 ? 'green' : verticalRateFpm < 0 ? 'red' : 'gray' },
                                ].map((stat, i) => (
                                    <div key={i} className={`bg-[#161b22] rounded-2xl p-4 border border-white/5`}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className={`w-8 h-8 rounded-lg bg-${stat.color}-500/20 flex items-center justify-center`}>
                                                <stat.icon className={`w-4 h-4 text-${stat.color}-400`} />
                                            </div>
                                            <span className="text-xs text-gray-500 uppercase">{stat.label}</span>
                                        </div>
                                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                                        {stat.unit && <div className="text-xs text-gray-500">{stat.unit}</div>}
                                    </div>
                                ))}
                            </div>

                            {/* Performance Bars */}
                            <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <BarChart3 className="w-5 h-5 text-violet-400" />
                                    <h3 className="font-semibold text-white">Flight Performance</h3>
                                </div>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Altitude</span>
                                            <span className="text-white font-medium">{altitudeFt.toLocaleString()} ft / 45,000 ft</span>
                                        </div>
                                        <div className="h-3 bg-[#0d1117] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                                                style={{ width: `${altitudePercent}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Ground Speed</span>
                                            <span className="text-white font-medium">{speedKts} kts / 550 kts</span>
                                        </div>
                                        <div className="h-3 bg-[#0d1117] rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
                                                style={{ width: `${speedPercent}%` }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-2">
                                            <span className="text-gray-400">Vertical Rate</span>
                                            <span className={`font-medium ${verticalRateFpm > 0 ? 'text-green-400' : verticalRateFpm < 0 ? 'text-amber-400' : 'text-gray-400'}`}>
                                                {verticalRateFpm > 0 ? '+' : ''}{verticalRateFpm} fpm
                                            </span>
                                        </div>
                                        <div className="h-3 bg-[#0d1117] rounded-full overflow-hidden relative">
                                            <div className="absolute left-1/2 w-px h-full bg-gray-700" />
                                            {verticalRateFpm !== 0 && (
                                                <div className={`h-full absolute ${verticalRateFpm > 0 ? 'left-1/2 bg-gradient-to-r from-green-500 to-emerald-500' : 'right-1/2 bg-gradient-to-l from-amber-500 to-orange-500'} rounded-full transition-all duration-500`}
                                                    style={{ width: `${Math.min(Math.abs(verticalRateFpm) / 40, 50)}%` }} />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Position Data */}
                            <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Globe className="w-5 h-5 text-violet-400" />
                                    <h3 className="font-semibold text-white">Position & Navigation</h3>
                                </div>
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                                    <div className="bg-[#0d1117] rounded-xl p-3">
                                        <div className="text-xs text-gray-500 mb-1">Latitude</div>
                                        <div className="font-mono text-white">{flight.latitude.toFixed(5)}°</div>
                                    </div>
                                    <div className="bg-[#0d1117] rounded-xl p-3">
                                        <div className="text-xs text-gray-500 mb-1">Longitude</div>
                                        <div className="font-mono text-white">{flight.longitude.toFixed(5)}°</div>
                                    </div>
                                    <div className="bg-[#0d1117] rounded-xl p-3">
                                        <div className="text-xs text-gray-500 mb-1">Distance</div>
                                        <div className="font-mono text-violet-400">{formatDistance(flight.distance || 0)}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column - Aircraft Info */}
                        <div className="space-y-6">

                            {/* Aircraft Info Card */}
                            <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Info className="w-5 h-5 text-violet-400" />
                                    <h3 className="font-semibold text-white">Aircraft Information</h3>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-gray-400">ICAO24</span>
                                        <span className="font-mono font-semibold text-white">{flight.icao24.toUpperCase()}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-gray-400">Category</span>
                                        <span className="text-white">{flight.categoryLabel}</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-white/5">
                                        <span className="text-gray-400">Origin</span>
                                        <div className="flex items-center gap-2">
                                            <Flag className="w-4 h-4 text-violet-400" />
                                            <span className="text-white">{flight.originCountry}</span>
                                        </div>
                                    </div>
                                    {flight.squawk && (
                                        <div className="flex justify-between items-center py-2">
                                            <span className="text-gray-400">Squawk</span>
                                            <span className="font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                                                {flight.squawk}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Airline Card */}
                            {flight.airline && (
                                <div className="bg-gradient-to-br from-violet-600/20 to-purple-600/10 rounded-2xl p-5 border border-violet-500/20">
                                    <div className="flex items-center gap-3 mb-3">
                                        <div className="w-12 h-12 rounded-xl bg-violet-500 flex items-center justify-center">
                                            <Building2 className="w-6 h-6 text-white" />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{flight.airline}</div>
                                            {flight.airlineCountry && (
                                                <div className="text-sm text-violet-300">{flight.airlineCountry}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-violet-500/20">
                                        <div className="text-xs text-violet-300/60 uppercase">Flight Number</div>
                                        <div className="text-xl font-bold text-white">{flight.callsign}</div>
                                    </div>
                                </div>
                            )}

                            {/* Compass Visual */}
                            <div className="bg-[#161b22] rounded-2xl p-5 border border-white/5">
                                <div className="flex items-center gap-2 mb-4">
                                    <Compass className="w-5 h-5 text-violet-400" />
                                    <h3 className="font-semibold text-white">Heading</h3>
                                </div>
                                <div className="flex items-center justify-center">
                                    <div className="relative w-32 h-32">
                                        <div className="absolute inset-0 rounded-full border-4 border-[#0d1117]" />
                                        <div className="absolute inset-2 rounded-full border-2 border-gray-800" />
                                        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-xs font-bold text-white">N</span>
                                        <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs text-gray-500">S</span>
                                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">W</span>
                                        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500">E</span>
                                        <div className="absolute inset-0 flex items-center justify-center"
                                            style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }}>
                                            <div className="w-1 h-12 bg-gradient-to-t from-violet-500 to-purple-400 rounded-full origin-bottom -translate-y-2" />
                                        </div>
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div className="w-4 h-4 rounded-full bg-violet-500 shadow-lg shadow-violet-500/50" />
                                        </div>
                                    </div>
                                </div>
                                <div className="text-center mt-4">
                                    <div className="text-3xl font-bold text-white">
                                        {flight.trueTrack ? `${Math.round(flight.trueTrack)}°` : '--'}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FlightDashboard;
