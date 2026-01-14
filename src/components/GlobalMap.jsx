import { useEffect, useMemo, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Plane } from 'lucide-react';
import { formatDistance, metersToFeet, msToKnots } from '../utils/geo';

// Map event handler
function MapEvents({ onViewChange }) {
    const map = useMapEvents({
        moveend: () => {
            const center = map.getCenter();
            const zoom = map.getZoom();
            onViewChange({ lat: center.lat, lon: center.lng }, zoom);
        },
    });
    return null;
}

// View updater
function ViewUpdater({ center, zoom }) {
    const map = useMap();
    const initialRef = useRef(true);

    useEffect(() => {
        if (initialRef.current) {
            initialRef.current = false;
            map.setView([center.lat, center.lon], zoom);
        }
    }, [center, zoom, map]);

    return null;
}

// Create user location icon
const createUserIcon = () => {
    return L.divIcon({
        className: 'user-marker',
        html: `
      <div style="position: relative;">
        <div style="
          width: 20px; height: 20px;
          background: linear-gradient(135deg, #8b5cf6, #a855f7);
          border: 3px solid white;
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(139, 92, 246, 0.6);
        "></div>
        <div style="
          position: absolute; top: 50%; left: 50%;
          transform: translate(-50%, -50%);
          width: 40px; height: 40px;
          border: 2px solid rgba(139, 92, 246, 0.3);
          border-radius: 50%;
          animation: pulse 2s infinite;
        "></div>
      </div>
    `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
    });
};

// Create plane icon
const createPlaneIcon = (heading, isSelected = false) => {
    const rotation = heading || 0;
    const color = isSelected ? '#fbbf24' : '#a855f7';
    const size = isSelected ? 28 : 20;

    return L.divIcon({
        className: 'plane-marker',
        html: `
      <div style="
        transform: rotate(${rotation}deg);
        filter: drop-shadow(0 2px 4px rgba(0,0,0,0.3));
        transition: all 0.3s;
      ">
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="${color}">
          <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z"/>
        </svg>
      </div>
    `,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2]
    });
};

function GlobalMap({ center, zoom, flights, userLocation, onFlightSelect, selectedFlight, onViewChange }) {
    const userIcon = useMemo(() => createUserIcon(), []);

    return (
        <div className="fixed inset-0 pt-16 lg:pl-72 pb-16 lg:pb-0">
            <MapContainer
                center={[center.lat, center.lon]}
                zoom={zoom}
                className="w-full h-full"
                zoomControl={false}
                attributionControl={false}
                minZoom={2}
                maxZoom={18}
                worldCopyJump={true}
            >
                {/* Dark themed tiles */}
                <TileLayer
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    attribution='&copy; CARTO'
                />

                <ViewUpdater center={center} zoom={zoom} />
                <MapEvents onViewChange={onViewChange} />

                {/* User location */}
                {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lon]} icon={userIcon}>
                        <Popup>
                            <div className="bg-[#161b22] rounded-xl p-3 text-center">
                                <div className="font-bold text-white">Your Location</div>
                            </div>
                        </Popup>
                    </Marker>
                )}

                {/* Flight markers */}
                {flights.map((flight) => {
                    const isSelected = selectedFlight?.icao24 === flight.icao24;
                    const planeIcon = createPlaneIcon(flight.trueTrack, isSelected);

                    return (
                        <Marker
                            key={flight.icao24}
                            position={[flight.latitude, flight.longitude]}
                            icon={planeIcon}
                            eventHandlers={{ click: () => onFlightSelect(flight) }}
                        >
                            <Popup>
                                <div className="bg-[#161b22] rounded-xl p-4 min-w-[200px]">
                                    <div className="flex items-center gap-2 mb-3">
                                        <div className="w-8 h-8 rounded-lg bg-violet-500/20 flex items-center justify-center">
                                            <Navigation className="w-4 h-4 text-violet-400"
                                                style={{ transform: `rotate(${flight.trueTrack || 0}deg)` }} />
                                        </div>
                                        <div>
                                            <div className="font-bold text-white">{flight.callsign}</div>
                                            {flight.airline && (
                                                <div className="text-xs text-violet-400">{flight.airline}</div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Altitude</span>
                                            <span className="text-white font-medium">
                                                {flight.baroAltitude ? `${metersToFeet(flight.baroAltitude).toLocaleString()} ft` : '--'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-400">Speed</span>
                                            <span className="text-white font-medium">
                                                {flight.velocity ? `${msToKnots(flight.velocity)} kts` : '--'}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => onFlightSelect(flight)}
                                        className="w-full mt-3 py-2 bg-violet-500 hover:bg-violet-400
                             text-white font-semibold rounded-lg transition-colors"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </Popup>
                        </Marker>
                    );
                })}
            </MapContainer>

            {/* Zoom controls */}
            <div className="absolute bottom-20 lg:bottom-4 right-4 z-[400] flex flex-col gap-2">
                <button
                    onClick={() => onViewChange(center, Math.min(zoom + 1, 18))}
                    className="w-10 h-10 rounded-xl bg-[#161b22]/90 backdrop-blur-lg border border-white/10
                   text-white hover:bg-white/10 transition-colors flex items-center justify-center text-lg font-bold"
                >
                    +
                </button>
                <button
                    onClick={() => onViewChange(center, Math.max(zoom - 1, 2))}
                    className="w-10 h-10 rounded-xl bg-[#161b22]/90 backdrop-blur-lg border border-white/10
                   text-white hover:bg-white/10 transition-colors flex items-center justify-center text-lg font-bold"
                >
                    −
                </button>
            </div>
        </div>
    );
}

export default GlobalMap;
