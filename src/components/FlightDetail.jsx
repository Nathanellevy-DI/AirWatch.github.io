import { useEffect, useState } from 'react';
import {
    X, Plane, Navigation, ArrowUp, ArrowDown, Minus,
    Globe, Gauge, Mountain, Clock, MapPin,
    Building2, Flag, TrendingUp, BarChart3, Activity,
    Compass, Radio, Wind
} from 'lucide-react';
import { formatDistance, metersToFeet, msToKnots, msToFpm } from '../utils/geo';

function FlightDetail({ flight, isVisible, onClose }) {
    const [isAnimating, setIsAnimating] = useState(false);

    useEffect(() => {
        if (isVisible) {
            setIsAnimating(true);
        }
    }, [isVisible]);

    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(onClose, 300);
    };

    const verticalRateFpm = flight.verticalRate ? msToFpm(flight.verticalRate) : 0;
    const altitudeFt = flight.baroAltitude ? metersToFeet(flight.baroAltitude) : 0;
    const speedKts = flight.velocity ? msToKnots(flight.velocity) : 0;

    // Calculate time since last contact
    const getLastSeen = () => {
        if (!flight.lastContact) return 'Live';
        const now = Math.floor(Date.now() / 1000);
        const diff = now - flight.lastContact;
        if (diff < 60) return `${diff}s ago`;
        if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
        return `${Math.floor(diff / 3600)}h ago`;
    };

    // Altitude bar percentage (max ~45000ft for commercial)
    const altitudePercent = Math.min((altitudeFt / 45000) * 100, 100);

    // Speed bar percentage (max ~550kts for jets)
    const speedPercent = Math.min((speedKts / 550) * 100, 100);

    if (!flight) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/50 z-[999] transition-opacity duration-300 ${isAnimating ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={handleClose}
            />

            {/* Full Screen Dashboard Panel */}
            <div
                className={`fixed inset-x-0 bottom-0 top-16 z-[1000] bg-[#f5f0e8] 
                    rounded-t-[2rem] transform transition-transform duration-300 ease-out
                    shadow-2xl overflow-hidden
                    ${isAnimating ? 'translate-y-0' : 'translate-y-full'}`}
                style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
            >
                {/* Header */}
                <div className="bg-[#2d3a3a] text-white px-6 py-5 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-[#c4a962] flex items-center justify-center shadow-lg">
                            <Plane className="w-7 h-7 text-[#2d3a3a]" style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }} />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold tracking-tight">{flight.callsign}</h2>
                            <p className="text-[#c4a962] text-sm font-medium">
                                {flight.airline || flight.originCountry} • {flight.categoryLabel}
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={handleClose}
                        className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 
                     flex items-center justify-center transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Stats Row */}
                <div className="px-6 py-4 grid grid-cols-3 gap-3">
                    {/* Altitude Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#c4a962]/20 flex items-center justify-center">
                                <Mountain className="w-4 h-4 text-[#c4a962]" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium uppercase">Altitude</span>
                        </div>
                        <div className="text-2xl font-bold text-[#2d3a3a]">
                            {altitudeFt.toLocaleString()}
                        </div>
                        <div className="text-xs text-gray-400">feet</div>
                    </div>

                    {/* Speed Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#5a7a6b]/20 flex items-center justify-center">
                                <Gauge className="w-4 h-4 text-[#5a7a6b]" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium uppercase">Speed</span>
                        </div>
                        <div className="text-2xl font-bold text-[#2d3a3a]">
                            {speedKts}
                        </div>
                        <div className="text-xs text-gray-400">knots</div>
                    </div>

                    {/* Distance Card */}
                    <div className="bg-white rounded-2xl p-4 shadow-sm">
                        <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-lg bg-[#d4a574]/20 flex items-center justify-center">
                                <MapPin className="w-4 h-4 text-[#d4a574]" />
                            </div>
                            <span className="text-xs text-gray-500 font-medium uppercase">Distance</span>
                        </div>
                        <div className="text-2xl font-bold text-[#c4a962]">
                            {formatDistance(flight.distance)}
                        </div>
                        <div className="text-xs text-gray-400">from you</div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="px-6 pb-6 grid grid-cols-2 gap-4 overflow-y-auto max-h-[calc(100vh-320px)]">

                    {/* Flight Statistics - Bar Chart Style */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <BarChart3 className="w-5 h-5 text-[#c4a962]" />
                            <h3 className="font-bold text-[#2d3a3a]">Flight Statistics</h3>
                        </div>

                        {/* Visual Bars */}
                        <div className="space-y-4">
                            {/* Altitude Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Altitude</span>
                                    <span className="font-medium text-[#2d3a3a]">{altitudeFt.toLocaleString()} ft</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#c4a962] to-[#d4b972] rounded-full transition-all duration-500"
                                        style={{ width: `${altitudePercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Speed Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Ground Speed</span>
                                    <span className="font-medium text-[#2d3a3a]">{speedKts} kts</span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-[#5a7a6b] to-[#7a9a8b] rounded-full transition-all duration-500"
                                        style={{ width: `${speedPercent}%` }}
                                    />
                                </div>
                            </div>

                            {/* Vertical Rate Bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-1">
                                    <span className="text-gray-500">Vertical Rate</span>
                                    <span className={`font-medium ${verticalRateFpm > 0 ? 'text-green-600' : verticalRateFpm < 0 ? 'text-amber-600' : 'text-gray-500'}`}>
                                        {verticalRateFpm > 0 ? '+' : ''}{verticalRateFpm} fpm
                                    </span>
                                </div>
                                <div className="h-3 bg-gray-100 rounded-full overflow-hidden flex items-center justify-center relative">
                                    <div className="absolute left-1/2 w-0.5 h-full bg-gray-300" />
                                    {verticalRateFpm !== 0 && (
                                        <div
                                            className={`h-full absolute ${verticalRateFpm > 0 ? 'left-1/2 bg-gradient-to-r from-green-400 to-green-500' : 'right-1/2 bg-gradient-to-l from-amber-400 to-amber-500'} rounded-full transition-all duration-500`}
                                            style={{ width: `${Math.min(Math.abs(verticalRateFpm) / 30, 50)}%` }}
                                        />
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Aircraft Info Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Plane className="w-5 h-5 text-[#5a7a6b]" />
                            <h3 className="font-bold text-[#2d3a3a]">Aircraft</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">ICAO24</span>
                                <span className="font-mono font-bold text-[#2d3a3a]">{flight.icao24.toUpperCase()}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Type</span>
                                <span className="font-medium text-[#2d3a3a] text-right text-sm">{flight.categoryLabel}</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500 text-sm">Origin</span>
                                <div className="flex items-center gap-1">
                                    <Flag className="w-3 h-3 text-[#c4a962]" />
                                    <span className="font-medium text-[#2d3a3a]">{flight.originCountry}</span>
                                </div>
                            </div>
                            {flight.squawk && (
                                <div className="flex items-center justify-between">
                                    <span className="text-gray-500 text-sm">Squawk</span>
                                    <span className="font-mono font-bold text-[#c4a962] bg-[#c4a962]/10 px-2 py-0.5 rounded">
                                        {flight.squawk}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Navigation Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm">
                        <div className="flex items-center gap-2 mb-4">
                            <Compass className="w-5 h-5 text-[#d4a574]" />
                            <h3 className="font-bold text-[#2d3a3a]">Navigation</h3>
                        </div>

                        {/* Compass Visual */}
                        <div className="flex items-center justify-center mb-4">
                            <div className="relative w-24 h-24">
                                <div className="absolute inset-0 rounded-full border-4 border-gray-100" />
                                <div className="absolute inset-2 rounded-full border-2 border-gray-50" />
                                {/* Cardinal points */}
                                <span className="absolute top-1 left-1/2 -translate-x-1/2 text-xs font-bold text-[#2d3a3a]">N</span>
                                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs text-gray-400">S</span>
                                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-xs text-gray-400">W</span>
                                <span className="absolute right-1 top-1/2 -translate-y-1/2 text-xs text-gray-400">E</span>
                                {/* Needle */}
                                <div
                                    className="absolute inset-0 flex items-center justify-center"
                                    style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }}
                                >
                                    <div className="w-1 h-10 bg-gradient-to-t from-[#c4a962] to-[#2d3a3a] rounded-full origin-bottom -translate-y-1" />
                                </div>
                                {/* Center dot */}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-3 h-3 rounded-full bg-[#c4a962] shadow-sm" />
                                </div>
                            </div>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl font-bold text-[#2d3a3a]">
                                {flight.trueTrack ? `${Math.round(flight.trueTrack)}°` : '--'}
                            </div>
                            <div className="text-xs text-gray-400 uppercase">True Heading</div>
                        </div>
                    </div>

                    {/* Status & Position Card */}
                    <div className="bg-white rounded-2xl p-5 shadow-sm col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <Activity className="w-5 h-5 text-[#c4a962]" />
                            <h3 className="font-bold text-[#2d3a3a]">Status & Position</h3>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            {/* Status */}
                            <div className="text-center">
                                <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold
                              ${flight.onGround
                                        ? 'bg-amber-100 text-amber-700'
                                        : 'bg-green-100 text-green-700'}`}>
                                    <div className={`w-2 h-2 rounded-full ${flight.onGround ? 'bg-amber-500' : 'bg-green-500 animate-pulse'}`} />
                                    {flight.onGround ? 'Ground' : 'Airborne'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Status</div>
                            </div>

                            {/* Last Update */}
                            <div className="text-center">
                                <div className="flex items-center justify-center gap-1 text-[#2d3a3a] font-medium">
                                    <Clock className="w-4 h-4 text-gray-400" />
                                    {getLastSeen()}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">Last Update</div>
                            </div>

                            {/* Geo Altitude */}
                            <div className="text-center">
                                <div className="font-medium text-[#2d3a3a]">
                                    {flight.geoAltitude ? `${metersToFeet(flight.geoAltitude).toLocaleString()} ft` : '--'}
                                </div>
                                <div className="text-xs text-gray-400 mt-1">GPS Altitude</div>
                            </div>
                        </div>

                        {/* Coordinates */}
                        <div className="mt-4 pt-4 border-t border-gray-100">
                            <div className="flex items-center justify-between bg-gray-50 rounded-xl p-3">
                                <div className="flex items-center gap-2">
                                    <Globe className="w-4 h-4 text-[#5a7a6b]" />
                                    <span className="text-sm text-gray-500">Position</span>
                                </div>
                                <div className="font-mono text-sm text-[#2d3a3a]">
                                    {flight.latitude.toFixed(5)}° N, {flight.longitude.toFixed(5)}° E
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Airline Info (if available) */}
                    {flight.airline && (
                        <div className="bg-[#2d3a3a] rounded-2xl p-5 shadow-sm col-span-2">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-xl bg-[#c4a962] flex items-center justify-center">
                                    <Building2 className="w-6 h-6 text-[#2d3a3a]" />
                                </div>
                                <div className="flex-1">
                                    <div className="text-white font-bold text-lg">{flight.airline}</div>
                                    <div className="text-[#c4a962] text-sm">
                                        {flight.airlineCountry && `Based in ${flight.airlineCountry}`}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-white font-mono font-bold">{flight.callsign}</div>
                                    <div className="text-gray-400 text-xs">Flight Number</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}

export default FlightDetail;
