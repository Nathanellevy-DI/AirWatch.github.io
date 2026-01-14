import { useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Navigation } from 'lucide-react';
import { formatDistance, metersToFeet, msToKnots } from '../utils/geo';

// Custom hook to handle map view changes
function ChangeMapView({ center, zoom }) {
    const map = useMap();

    useEffect(() => {
        if (center) {
            map.setView(center, zoom);
        }
    }, [center, zoom, map]);

    return null;
}

// Focus on searched flight
function FocusOnFlight({ flight }) {
    const map = useMap();

    useEffect(() => {
        if (flight?.latitude && flight?.longitude) {
            map.setView([flight.latitude, flight.longitude], 12, { animate: true });
        }
    }, [flight, map]);

    return null;
}

// Create user location icon
const createUserIcon = () => {
    return L.divIcon({
        className: 'user-marker',
        html: `
      <div class="relative">
        <div style="
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #38bdf8, #22d3ee);
          border: 4px solid white;
          border-radius: 50%;
          box-shadow: 0 0 24px rgba(56, 189, 248, 0.7), 0 2px 8px rgba(0,0,0,0.3);
        "></div>
      </div>
    `,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
    });
};

// Create plane icon with rotation
const createPlaneIcon = (heading, isSelected = false, isSearchResult = false) => {
    const rotation = heading || 0;
    let color = '#38bdf8';
    let size = 28;
    let glow = 'filter: drop-shadow(0 2px 6px rgba(56, 189, 248, 0.5));';

    if (isSearchResult) {
        color = '#22c55e';
        size = 36;
        glow = 'filter: drop-shadow(0 0 12px rgba(34, 197, 94, 0.8));';
    } else if (isSelected) {
        color = '#fbbf24';
        size = 32;
        glow = 'filter: drop-shadow(0 0 10px rgba(251, 191, 36, 0.8));';
    }

    return L.divIcon({
        className: 'plane-marker',
        html: `
      <div style="transform: rotate(${rotation}deg); ${glow} transition: all 0.3s ease;">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

function MapComponent({ userLocation, flights, onFlightSelect, selectedFlight, searchResult }) {
    const userIcon = useMemo(() => createUserIcon(), []);

    const mapCenter = useMemo(() => {
        return [userLocation.lat, userLocation.lon];
    }, [userLocation]);

    return (
        <div className="fixed inset-0 pt-16 pb-20">
            <MapContainer
                center={mapCenter}
                zoom={10}
                className="w-full h-full"
                zoomControl={false}
                attributionControl={false}
            >
                {/* Dark themed map tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                <ChangeMapView center={mapCenter} zoom={10} />

                {/* Focus on search result */}
                {searchResult && <FocusOnFlight flight={searchResult} />}

                {/* Range circles */}
                <Circle
                    center={mapCenter}
                    radius={50000}
                    pathOptions={{
                        color: '#38bdf8',
                        weight: 1,
                        opacity: 0.2,
                        fillOpacity: 0.02,
                        dashArray: '5, 10'
                    }}
                />
                <Circle
                    center={mapCenter}
                    radius={100000}
                    pathOptions={{
                        color: '#38bdf8',
                        weight: 1,
                        opacity: 0.15,
                        fillOpacity: 0.01,
                        dashArray: '5, 10'
                    }}
                />
                <Circle
                    center={mapCenter}
                    radius={150000}
                    pathOptions={{
                        color: '#38bdf8',
                        weight: 1,
                        opacity: 0.1,
                        fillOpacity: 0,
                        dashArray: '5, 10'
                    }}
                />

                {/* User location marker */}
                <Marker position={mapCenter} icon={userIcon}>
                    <Popup className="custom-popup">
                        <div className="bg-aviation-slate rounded-xl p-3 text-center shadow-lg border border-white/10">
                            <div className="font-bold text-white">Your Location</div>
                            <div className="text-xs text-gray-400 mt-1 font-mono">
                                {userLocation.lat.toFixed(4)}°, {userLocation.lon.toFixed(4)}°
                            </div>
                        </div>
                    </Popup>
                </Marker>

                {/* Flight markers */}
                {flights.map((flight) => {
                    const isSelected = selectedFlight?.icao24 === flight.icao24;
                    const isSearched = searchResult?.icao24 === flight.icao24;
                    const planeIcon = createPlaneIcon(flight.trueTrack, isSelected, isSearched);

                    return (
                        <Marker
                            key={flight.icao24}
                            position={[flight.latitude, flight.longitude]}
                            icon={planeIcon}
                            eventHandlers={{
                                click: () => onFlightSelect(flight)
                            }}
                        >
                            <Popup className="flight-popup">
                                <div className="bg-aviation-slate rounded-xl p-4 min-w-[200px] shadow-xl border border-white/10">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-aviation-accent/20 flex items-center justify-center">
                                            <Navigation className="w-4 h-4 text-aviation-accent"
                                                style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }} />
                                        </div>
                                        <div>
                                            <span className="font-bold text-white text-lg">{flight.callsign}</span>
                                            {flight.airline && (
                                                <div className="text-xs text-aviation-glow">{flight.airline}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between py-1 border-b border-white/5">
                                            <span className="text-gray-400">Altitude</span>
                                            <span className="text-white font-semibold">
                                                {flight.baroAltitude ? `${metersToFeet(flight.baroAltitude).toLocaleString()} ft` : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1 border-b border-white/5">
                                            <span className="text-gray-400">Speed</span>
                                            <span className="text-white font-semibold">
                                                {flight.velocity ? `${msToKnots(flight.velocity)} kts` : 'N/A'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between py-1">
                                            <span className="text-gray-400">Distance</span>
                                            <span className="text-aviation-glow font-bold">
                                                {formatDistance(flight.distance)}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onFlightSelect(flight)}
                                        className="w-full mt-4 py-2.5 bg-gradient-to-r from-aviation-accent to-aviation-glow
                             text-aviation-dark font-bold rounded-lg transition-all hover:shadow-glow
                             active:scale-95"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Range indicator legend */}
            <div className="absolute bottom-24 left-4 z-[400] bg-aviation-slate/80 backdrop-blur-lg 
                      rounded-xl p-3 border border-white/10 text-xs">
                <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-3 h-3 rounded-full border border-aviation-accent/50"></div>
                    <span>50km</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <div className="w-3 h-3 rounded-full border border-aviation-accent/30"></div>
                    <span>100km</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400 mt-1">
                    <div className="w-3 h-3 rounded-full border border-aviation-accent/20"></div>
                    <span>150km</span>
                </div>
            </div>
        </div>
    );
}

export default MapComponent;
