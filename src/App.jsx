import { useState, useEffect, useCallback } from 'react';
import {
    Plane, Search, Globe, BarChart3, Radio, RefreshCw,
    MapPin, TrendingUp, Users, Clock, X, Menu,
    ChevronRight, Zap, Activity, ToggleLeft, ToggleRight
} from 'lucide-react';
import GlobalMap from './components/GlobalMap';
import FlightDashboard from './components/FlightDashboard';
import FlightList from './components/FlightList';
import StatsPanel from './components/StatsPanel';
import SearchBar from './components/SearchBar';
import { getBBox, getDistance } from './utils/geo';
import { fetchFlights, searchFlightByCallsign, isSimulationMode, setSimulationMode } from './utils/api';

const REFRESH_INTERVAL = 15000;

// Regions for quick navigation
const REGIONS = [
    { name: 'North America', lat: 39.8283, lon: -98.5795, zoom: 4 },
    { name: 'Europe', lat: 50.1109, lon: 10.4515, zoom: 4 },
    { name: 'Asia', lat: 34.0479, lon: 100.6197, zoom: 3 },
    { name: 'Middle East', lat: 29.3759, lon: 47.9774, zoom: 5 },
    { name: 'Australia', lat: -25.2744, lon: 133.7751, zoom: 4 },
];

function App() {
    // Location state
    const [userLocation, setUserLocation] = useState(null);
    const [viewCenter, setViewCenter] = useState({ lat: 30, lon: 0 });
    const [mapZoom, setMapZoom] = useState(3);

    // Flight data state
    const [flights, setFlights] = useState([]);
    const [globalStats, setGlobalStats] = useState({
        totalFlights: 0,
        airborne: 0,
        onGround: 0,
        countries: new Set()
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(null);

    // Search state
    const [isSearching, setIsSearching] = useState(false);
    const [showSearch, setShowSearch] = useState(false);

    // UI state
    const [selectedFlight, setSelectedFlight] = useState(null);
    const [showDashboard, setShowDashboard] = useState(false);
    const [activePanel, setActivePanel] = useState('map'); // 'map' | 'list' | 'stats'
    const [showSidebar, setShowSidebar] = useState(true);

    // Simulation mode state
    const [simulationEnabled, setSimulationEnabled] = useState(isSimulationMode());

    const toggleSimulation = () => {
        const newValue = !simulationEnabled;
        setSimulationEnabled(newValue);
        setSimulationMode(newValue);
        // Clear current flights before loading new ones
        setFlights([]);
        setGlobalStats({ totalFlights: 0, airborne: 0, onGround: 0, countries: new Set() });
        setError(null);
        // Small delay to ensure state is updated before fetching
        setTimeout(() => loadFlights(), 100);
    };

    // Route Preview Mode
    const [previewFlights, setPreviewFlights] = useState([]);

    const togglePreview = useCallback((flight) => {
        setPreviewFlights(prev => {
            const exists = prev.find(f => f.icao24 === flight.icao24);
            if (exists) return prev.filter(f => f.icao24 !== flight.icao24);
            if (prev.length >= 5) return prev; // Max 5 limit
            return [...prev, flight];
        });
    }, []);

    // Get user's location on mount
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const loc = {
                        lat: position.coords.latitude,
                        lon: position.coords.longitude
                    };
                    setUserLocation(loc);
                    setViewCenter(loc);
                    setMapZoom(8);
                },
                () => {
                    // Default to world view if location denied
                    setViewCenter({ lat: 30, lon: 0 });
                }
            );
        }
    }, []);

    // Fetch flights for current view
    const loadFlights = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            // Calculate bounding box based on current view and zoom
            const radius = Math.max(200, 2000 / mapZoom); // Larger radius for zoomed out
            const bbox = getBBox(viewCenter.lat, viewCenter.lon, radius);
            const flightData = await fetchFlights(bbox);

            // Calculate distance for each flight if we have user location
            const flightsWithDistance = flightData.map(flight => ({
                ...flight,
                distance: userLocation
                    ? getDistance(userLocation.lat, userLocation.lon, flight.latitude, flight.longitude)
                    : getDistance(viewCenter.lat, viewCenter.lon, flight.latitude, flight.longitude)
            })).sort((a, b) => a.distance - b.distance);

            setFlights(flightsWithDistance);

            // Update global stats
            const countries = new Set(flightData.map(f => f.originCountry));
            setGlobalStats({
                totalFlights: flightData.length,
                airborne: flightData.filter(f => !f.onGround).length,
                onGround: flightData.filter(f => f.onGround).length,
                countries
            });

            setLastUpdated(new Date());
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [viewCenter, mapZoom, userLocation]);

    // Load flights on view change
    useEffect(() => {
        loadFlights();
        // Dynamic interval: 1s for simulation (smooth), 15s for API (safe)
        const intervalMs = simulationEnabled ? 1000 : REFRESH_INTERVAL;
        const interval = setInterval(loadFlights, intervalMs);
        return () => clearInterval(interval);
    }, [loadFlights, simulationEnabled]);

    // Search for flight
    const handleSearch = async (callsign) => {
        setIsSearching(true);
        setError(null);

        try {
            const result = await searchFlightByCallsign(callsign);

            if (result) {
                if (userLocation) {
                    result.distance = getDistance(
                        userLocation.lat, userLocation.lon,
                        result.latitude, result.longitude
                    );
                }
                setSelectedFlight(result);
                setShowDashboard(true);
                setViewCenter({ lat: result.latitude, lon: result.longitude });
                setMapZoom(10);
                setShowSearch(false);
            } else {
                setError(`Flight "${callsign}" not found or not currently airborne.`);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle flight selection
    const handleFlightSelect = (flight) => {
        setSelectedFlight(flight);
        setShowDashboard(true);
    };

    // Navigate to region
    const navigateToRegion = (region) => {
        setViewCenter({ lat: region.lat, lon: region.lon });
        setMapZoom(region.zoom);
    };

    return (
        <div className="min-h-screen bg-[#0d1117] text-white overflow-hidden">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-[#161b22]/95 backdrop-blur-xl border-b border-white/5"
                style={{ paddingTop: 'max(0.75rem, env(safe-area-inset-top))' }}>
                <div className="flex items-center justify-between px-4 pb-3">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSidebar(!showSidebar)}
                            className="md:hidden w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center"
                        >
                            <Menu className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-2">
                            <img
                                src="/AirWatch.github.io/logo.png"
                                alt="AirWatch"
                                className="w-10 h-10 rounded-xl shadow-lg shadow-purple-500/20"
                            />
                            <div>
                                <h1 className="text-lg font-bold">AirWatch</h1>
                                <div className="text-[10px] text-gray-500 uppercase tracking-wider">Global Flight Tracker</div>
                            </div>
                        </div>
                    </div>

                    {/* Center Nav */}
                    <nav className="hidden md:flex items-center gap-1 bg-white/5 rounded-xl p-1">
                        {[
                            { id: 'map', icon: Globe, label: 'Live Map' },
                            { id: 'list', icon: Radio, label: 'Flights' },
                            { id: 'stats', icon: BarChart3, label: 'Statistics' },
                        ].map(item => (
                            <button
                                key={item.id}
                                onClick={() => setActivePanel(item.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                          ${activePanel === item.id
                                        ? 'bg-violet-500 text-white shadow-lg shadow-violet-500/30'
                                        : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                            >
                                <item.icon className="w-4 h-4" />
                                {item.label}
                            </button>
                        ))}
                    </nav>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all
                        ${showSearch ? 'bg-violet-500 text-white' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                        >
                            {showSearch ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
                        </button>
                        <button
                            onClick={loadFlights}
                            disabled={isLoading}
                            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center
                       text-gray-400 hover:text-white hover:bg-white/10 transition-all disabled:opacity-50"
                        >
                            <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                        <div className="hidden sm:block pl-3 border-l border-white/10">
                            <div className="text-sm font-bold text-violet-400">{globalStats.totalFlights.toLocaleString()}</div>
                            <div className="text-[10px] text-gray-500">flights tracked</div>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Expandable */}
                {showSearch && (
                    <div className="px-4 pb-4 animate-fade-in">
                        <SearchBar onSearch={handleSearch} isSearching={isSearching} />
                    </div>
                )}
            </header>

            {/* Main Layout */}
            <div className="flex" style={{ paddingTop: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
                {/* Left Sidebar */}
                <aside className={`fixed left-0 bottom-0 w-72 bg-[#161b22]/95 backdrop-blur-xl
                          border-r border-white/5 z-40 transform transition-transform duration-300
                          ${showSidebar ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
                    style={{ top: 'calc(4rem + env(safe-area-inset-top, 0px))' }}>
                    <div className="p-4 h-full overflow-y-auto hide-scrollbar">
                        {/* Quick Stats */}
                        <div className="grid grid-cols-2 gap-2 mb-6">
                            <div className="bg-gradient-to-br from-violet-500/20 to-purple-600/10 rounded-xl p-3 border border-violet-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <Plane className="w-4 h-4 text-violet-400" />
                                    <span className="text-xs text-gray-400">Airborne</span>
                                </div>
                                <div className="text-xl font-bold text-white">{globalStats.airborne.toLocaleString()}</div>
                            </div>
                            <div className="bg-gradient-to-br from-amber-500/20 to-orange-600/10 rounded-xl p-3 border border-amber-500/20">
                                <div className="flex items-center gap-2 mb-1">
                                    <MapPin className="w-4 h-4 text-amber-400" />
                                    <span className="text-xs text-gray-400">On Ground</span>
                                </div>
                                <div className="text-xl font-bold text-white">{globalStats.onGround.toLocaleString()}</div>
                            </div>
                        </div>

                        {/* Regions */}
                        <div className="mb-6">
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Quick Navigation</h3>
                            <div className="space-y-1">
                                {REGIONS.map(region => (
                                    <button
                                        key={region.name}
                                        onClick={() => navigateToRegion(region)}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                             text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <Globe className="w-4 h-4 text-gray-500 group-hover:text-violet-400" />
                                            {region.name}
                                        </div>
                                        <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-gray-400" />
                                    </button>
                                ))}
                                {userLocation && (
                                    <button
                                        onClick={() => {
                                            setViewCenter(userLocation);
                                            setMapZoom(10);
                                        }}
                                        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg
                             text-sm text-violet-400 hover:text-violet-300 bg-violet-500/10 
                             hover:bg-violet-500/20 transition-all group"
                                    >
                                        <div className="flex items-center gap-2">
                                            <MapPin className="w-4 h-4" />
                                            My Location
                                        </div>
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Live Flight Feed */}
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Live Flights</h3>
                                <div className="flex items-center gap-1">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                    <span className="text-[10px] text-gray-500">LIVE</span>
                                </div>
                            </div>
                            <div className="space-y-2 max-h-[400px] overflow-y-auto hide-scrollbar">
                                {flights.slice(0, 15).map((flight, i) => (
                                    <button
                                        key={flight.icao24}
                                        onClick={() => handleFlightSelect(flight)}
                                        className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-white/5 
                             hover:bg-white/10 transition-all text-left group"
                                        style={{ animationDelay: `${i * 50}ms` }}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center shrink-0">
                                            <Plane
                                                className="w-4 h-4 text-violet-400"
                                                style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }}
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="font-semibold text-sm text-white truncate">{flight.callsign}</div>
                                            <div className="text-xs text-gray-500 truncate">
                                                {flight.airline || flight.originCountry}
                                            </div>
                                        </div>
                                        <div className="text-right shrink-0">
                                            <div className="text-xs font-medium text-violet-400">
                                                {flight.baroAltitude ? `${(flight.baroAltitude / 1000 * 3.28084).toFixed(0)}k ft` : '--'}
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Simulation Mode Toggle */}
                        <div className="mt-6 pt-4 border-t border-white/5">
                            <button
                                onClick={toggleSimulation}
                                className="w-full flex items-center justify-between px-3 py-3 rounded-xl
                                    bg-white/5 hover:bg-white/10 transition-all"
                            >
                                <div className="flex items-center gap-2">
                                    {simulationEnabled ? (
                                        <ToggleRight className="w-5 h-5 text-green-400" />
                                    ) : (
                                        <ToggleLeft className="w-5 h-5 text-gray-500" />
                                    )}
                                    <span className="text-sm text-gray-300">Demo Mode</span>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full ${simulationEnabled
                                    ? 'bg-green-500/20 text-green-400'
                                    : 'bg-gray-500/20 text-gray-400'
                                    }`}>
                                    {simulationEnabled ? 'ON' : 'OFF'}
                                </span>
                            </button>
                            <p className="text-[10px] text-gray-600 mt-2 px-1">
                                {simulationEnabled
                                    ? 'Showing simulated flight data'
                                    : 'Showing live flight data'}
                            </p>
                        </div>

                        {/* Last Updated */}
                        {lastUpdated && (
                            <div className="mt-4 pt-4 border-t border-white/5 text-center">
                                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                                    <Clock className="w-3 h-3" />
                                    Updated {lastUpdated.toLocaleTimeString()}
                                </div>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 md:ml-72">
                    {/* Error Banner */}
                    {error && (
                        <div className="mx-4 mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-xl 
                          flex items-center justify-between animate-fade-in">
                            <p className="text-sm text-red-400">{error}</p>
                            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-300">
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    )}

                    {/* Map View */}
                    {activePanel === 'map' && (
                        <GlobalMap
                            center={viewCenter}
                            zoom={mapZoom}
                            flights={flights}
                            userLocation={userLocation}
                            onFlightSelect={handleFlightSelect}
                            selectedFlight={selectedFlight}
                            onViewChange={(center, zoom) => {
                                setViewCenter(center);
                                setMapZoom(zoom);
                            }}
                            previewFlights={previewFlights}
                            onTogglePreview={togglePreview}
                        />
                    )}

                    {/* List View */}
                    {activePanel === 'list' && (
                        <FlightList
                            flights={flights}
                            onFlightSelect={handleFlightSelect}
                            isLoading={isLoading}
                        />
                    )}

                    {/* Stats View */}
                    {activePanel === 'stats' && (
                        <StatsPanel
                            flights={flights}
                            globalStats={globalStats}
                        />
                    )}
                </main>
            </div>

            {/* Flight Dashboard Modal */}
            {selectedFlight && (
                <FlightDashboard
                    flight={selectedFlight}
                    isVisible={showDashboard}
                    onClose={() => {
                        setShowDashboard(false);
                        setTimeout(() => setSelectedFlight(null), 300);
                    }}
                />
            )}

            {/* Mobile Bottom Nav */}
            <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-[#161b22]/95 backdrop-blur-xl 
                      border-t border-white/5 px-4 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
                <div className="flex items-center justify-around">
                    {[
                        { id: 'map', icon: Globe, label: 'Map' },
                        { id: 'list', icon: Radio, label: 'Flights' },
                        { id: 'stats', icon: BarChart3, label: 'Stats' },
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActivePanel(item.id)}
                            className={`flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all
                        ${activePanel === item.id ? 'text-violet-400' : 'text-gray-500'}`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>
            </nav>
        </div>
    );
}

export default App;
