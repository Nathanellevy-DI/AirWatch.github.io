// Flight Simulation Engine
// Generates realistic flight data with moving aircraft

// Major world airports with coordinates
const AIRPORTS = {
    // North America
    JFK: { lat: 40.6413, lon: -73.7781, name: 'New York JFK', country: 'United States' },
    LAX: { lat: 33.9425, lon: -118.4081, name: 'Los Angeles', country: 'United States' },
    ORD: { lat: 41.9742, lon: -87.9073, name: 'Chicago O\'Hare', country: 'United States' },
    ATL: { lat: 33.6407, lon: -84.4277, name: 'Atlanta', country: 'United States' },
    DFW: { lat: 32.8998, lon: -97.0403, name: 'Dallas', country: 'United States' },
    MIA: { lat: 25.7959, lon: -80.2870, name: 'Miami', country: 'United States' },
    SFO: { lat: 37.6213, lon: -122.3790, name: 'San Francisco', country: 'United States' },
    YYZ: { lat: 43.6777, lon: -79.6248, name: 'Toronto', country: 'Canada' },
    MEX: { lat: 19.4363, lon: -99.0721, name: 'Mexico City', country: 'Mexico' },

    // Europe
    LHR: { lat: 51.4700, lon: -0.4543, name: 'London Heathrow', country: 'United Kingdom' },
    CDG: { lat: 49.0097, lon: 2.5479, name: 'Paris CDG', country: 'France' },
    FRA: { lat: 50.0379, lon: 8.5622, name: 'Frankfurt', country: 'Germany' },
    AMS: { lat: 52.3105, lon: 4.7683, name: 'Amsterdam', country: 'Netherlands' },
    MAD: { lat: 40.4983, lon: -3.5676, name: 'Madrid', country: 'Spain' },
    FCO: { lat: 41.8003, lon: 12.2389, name: 'Rome', country: 'Italy' },
    IST: { lat: 41.2753, lon: 28.7519, name: 'Istanbul', country: 'Turkey' },
    ZRH: { lat: 47.4647, lon: 8.5492, name: 'Zurich', country: 'Switzerland' },
    MUC: { lat: 48.3537, lon: 11.7750, name: 'Munich', country: 'Germany' },

    // Middle East
    DXB: { lat: 25.2532, lon: 55.3657, name: 'Dubai', country: 'UAE' },
    DOH: { lat: 25.2609, lon: 51.6138, name: 'Doha', country: 'Qatar' },
    AUH: { lat: 24.4330, lon: 54.6511, name: 'Abu Dhabi', country: 'UAE' },
    TLV: { lat: 32.0055, lon: 34.8854, name: 'Tel Aviv', country: 'Israel' },
    RUH: { lat: 24.9576, lon: 46.6988, name: 'Riyadh', country: 'Saudi Arabia' },

    // Asia
    HND: { lat: 35.5494, lon: 139.7798, name: 'Tokyo Haneda', country: 'Japan' },
    NRT: { lat: 35.7720, lon: 140.3929, name: 'Tokyo Narita', country: 'Japan' },
    PEK: { lat: 40.0799, lon: 116.6031, name: 'Beijing', country: 'China' },
    PVG: { lat: 31.1443, lon: 121.8083, name: 'Shanghai', country: 'China' },
    HKG: { lat: 22.3080, lon: 113.9185, name: 'Hong Kong', country: 'Hong Kong' },
    SIN: { lat: 1.3644, lon: 103.9915, name: 'Singapore', country: 'Singapore' },
    ICN: { lat: 37.4602, lon: 126.4407, name: 'Seoul Incheon', country: 'South Korea' },
    BKK: { lat: 13.6900, lon: 100.7501, name: 'Bangkok', country: 'Thailand' },
    DEL: { lat: 28.5562, lon: 77.1000, name: 'Delhi', country: 'India' },
    BOM: { lat: 19.0896, lon: 72.8656, name: 'Mumbai', country: 'India' },

    // Oceania
    SYD: { lat: -33.9399, lon: 151.1753, name: 'Sydney', country: 'Australia' },
    MEL: { lat: -37.6690, lon: 144.8410, name: 'Melbourne', country: 'Australia' },
    AKL: { lat: -37.0082, lon: 174.7850, name: 'Auckland', country: 'New Zealand' },

    // South America
    GRU: { lat: -23.4356, lon: -46.4731, name: 'São Paulo', country: 'Brazil' },
    EZE: { lat: -34.8222, lon: -58.5358, name: 'Buenos Aires', country: 'Argentina' },
    BOG: { lat: 4.7016, lon: -74.1469, name: 'Bogotá', country: 'Colombia' },
    SCL: { lat: -33.3930, lon: -70.7858, name: 'Santiago', country: 'Chile' },

    // Africa
    JNB: { lat: -26.1392, lon: 28.2460, name: 'Johannesburg', country: 'South Africa' },
    CAI: { lat: 30.1219, lon: 31.4056, name: 'Cairo', country: 'Egypt' },
    ADD: { lat: 8.9779, lon: 38.7993, name: 'Addis Ababa', country: 'Ethiopia' },
    CMN: { lat: 33.3675, lon: -7.5898, name: 'Casablanca', country: 'Morocco' },
};

// Realistic airline routes with actual flight numbers
const ROUTES = [
    // Transatlantic
    { from: 'JFK', to: 'LHR', airline: 'BAW', flightNum: '178', aircraft: 'A380', duration: 420 },
    { from: 'LHR', to: 'JFK', airline: 'BAW', flightNum: '115', aircraft: 'B777', duration: 480 },
    { from: 'JFK', to: 'CDG', airline: 'AFR', flightNum: '007', aircraft: 'A350', duration: 435 },
    { from: 'CDG', to: 'JFK', airline: 'AFR', flightNum: '006', aircraft: 'A350', duration: 510 },
    { from: 'LAX', to: 'LHR', airline: 'BAW', flightNum: '268', aircraft: 'A380', duration: 600 },
    { from: 'ORD', to: 'FRA', airline: 'DLH', flightNum: '431', aircraft: 'A340', duration: 510 },
    { from: 'FRA', to: 'ORD', airline: 'DLH', flightNum: '430', aircraft: 'B747', duration: 570 },
    { from: 'MIA', to: 'MAD', airline: 'IBE', flightNum: '6123', aircraft: 'A330', duration: 510 },
    { from: 'ATL', to: 'AMS', airline: 'KLM', flightNum: '636', aircraft: 'B787', duration: 495 },

    // Transpacific
    { from: 'LAX', to: 'HND', airline: 'JAL', flightNum: '015', aircraft: 'B787', duration: 690 },
    { from: 'HND', to: 'LAX', airline: 'JAL', flightNum: '016', aircraft: 'B787', duration: 600 },
    { from: 'SFO', to: 'NRT', airline: 'ANA', flightNum: '008', aircraft: 'B777', duration: 660 },
    { from: 'NRT', to: 'SFO', airline: 'ANA', flightNum: '007', aircraft: 'B777', duration: 540 },
    { from: 'LAX', to: 'SIN', airline: 'SIA', flightNum: '037', aircraft: 'A350', duration: 1020 },
    { from: 'SIN', to: 'LAX', airline: 'SIA', flightNum: '036', aircraft: 'A350', duration: 930 },
    { from: 'LAX', to: 'SYD', airline: 'QFA', flightNum: '012', aircraft: 'A380', duration: 900 },
    { from: 'SYD', to: 'LAX', airline: 'QFA', flightNum: '011', aircraft: 'A380', duration: 810 },

    // Europe - Middle East
    { from: 'LHR', to: 'DXB', airline: 'UAE', flightNum: '002', aircraft: 'A380', duration: 420 },
    { from: 'DXB', to: 'LHR', airline: 'UAE', flightNum: '001', aircraft: 'A380', duration: 450 },
    { from: 'CDG', to: 'DXB', airline: 'UAE', flightNum: '076', aircraft: 'B777', duration: 390 },
    { from: 'FRA', to: 'DOH', airline: 'QTR', flightNum: '068', aircraft: 'A350', duration: 360 },
    { from: 'DOH', to: 'LHR', airline: 'QTR', flightNum: '001', aircraft: 'A380', duration: 420 },
    { from: 'IST', to: 'DXB', airline: 'THY', flightNum: '758', aircraft: 'B777', duration: 240 },
    { from: 'LHR', to: 'TLV', airline: 'ELY', flightNum: '316', aircraft: 'B787', duration: 285 },
    { from: 'TLV', to: 'LHR', airline: 'ELY', flightNum: '315', aircraft: 'B787', duration: 315 },

    // Asia routes
    { from: 'HKG', to: 'SIN', airline: 'CPA', flightNum: '715', aircraft: 'A350', duration: 225 },
    { from: 'SIN', to: 'HKG', airline: 'SIA', flightNum: '890', aircraft: 'A380', duration: 235 },
    { from: 'DXB', to: 'BKK', airline: 'UAE', flightNum: '418', aircraft: 'B777', duration: 375 },
    { from: 'BKK', to: 'HND', airline: 'THA', flightNum: '660', aircraft: 'B787', duration: 345 },
    { from: 'ICN', to: 'PVG', airline: 'KAL', flightNum: '893', aircraft: 'B777', duration: 120 },
    { from: 'NRT', to: 'HKG', airline: 'JAL', flightNum: '029', aircraft: 'B767', duration: 255 },
    { from: 'DEL', to: 'DXB', airline: 'UAE', flightNum: '511', aircraft: 'B777', duration: 210 },
    { from: 'BOM', to: 'LHR', airline: 'BAW', flightNum: '138', aircraft: 'B787', duration: 570 },

    // Americas
    { from: 'JFK', to: 'LAX', airline: 'AAL', flightNum: '001', aircraft: 'A321', duration: 330 },
    { from: 'LAX', to: 'JFK', airline: 'DAL', flightNum: '420', aircraft: 'A330', duration: 300 },
    { from: 'ORD', to: 'MIA', airline: 'UAL', flightNum: '1189', aircraft: 'B737', duration: 180 },
    { from: 'DFW', to: 'LAX', airline: 'AAL', flightNum: '2350', aircraft: 'A321', duration: 195 },
    { from: 'YYZ', to: 'LHR', airline: 'ACA', flightNum: '848', aircraft: 'B787', duration: 405 },
    { from: 'MIA', to: 'GRU', airline: 'TAM', flightNum: '8068', aircraft: 'B777', duration: 510 },
    { from: 'GRU', to: 'EZE', airline: 'TAM', flightNum: '3050', aircraft: 'A320', duration: 150 },
    { from: 'MEX', to: 'MAD', airline: 'IBE', flightNum: '6401', aircraft: 'A330', duration: 630 },

    // Africa
    { from: 'LHR', to: 'JNB', airline: 'BAW', flightNum: '055', aircraft: 'A380', duration: 660 },
    { from: 'JNB', to: 'LHR', airline: 'BAW', flightNum: '054', aircraft: 'A380', duration: 630 },
    { from: 'DXB', to: 'ADD', airline: 'ETH', flightNum: '601', aircraft: 'B787', duration: 210 },
    { from: 'CDG', to: 'CAI', airline: 'MSR', flightNum: '800', aircraft: 'B737', duration: 255 },
    { from: 'CMN', to: 'CDG', airline: 'RAM', flightNum: '750', aircraft: 'B787', duration: 165 },

    // Australia
    { from: 'SYD', to: 'SIN', airline: 'QFA', flightNum: '001', aircraft: 'A380', duration: 480 },
    { from: 'SIN', to: 'SYD', airline: 'SIA', flightNum: '231', aircraft: 'A350', duration: 465 },
    { from: 'MEL', to: 'AKL', airline: 'QFA', flightNum: '125', aircraft: 'A330', duration: 210 },
    { from: 'SYD', to: 'DXB', airline: 'UAE', flightNum: '415', aircraft: 'A380', duration: 855 },
];

// Aircraft types with typical cruise speeds (knots)
const AIRCRAFT_SPEEDS = {
    'A380': 490,
    'B777': 490,
    'B787': 490,
    'A350': 490,
    'A340': 475,
    'B747': 490,
    'A330': 470,
    'B767': 460,
    'A321': 450,
    'A320': 450,
    'B737': 450,
};

// Aircraft categories
const AIRCRAFT_CATEGORIES = {
    'A380': 5, // Heavy
    'B777': 5,
    'B787': 3,
    'A350': 3,
    'A340': 4,
    'B747': 5,
    'A330': 3,
    'B767': 3,
    'A321': 2,
    'A320': 2,
    'B737': 2,
};

const CATEGORY_LABELS = {
    0: 'Unknown',
    1: 'Light Aircraft',
    2: 'Small Aircraft',
    3: 'Large Aircraft',
    4: 'High Vortex Large',
    5: 'Heavy Aircraft',
    6: 'High Performance',
    7: 'Rotorcraft',
};

// Airline info lookup
const AIRLINE_INFO = {
    'BAW': { name: 'British Airways', country: 'United Kingdom' },
    'AFR': { name: 'Air France', country: 'France' },
    'DLH': { name: 'Lufthansa', country: 'Germany' },
    'KLM': { name: 'KLM Royal Dutch', country: 'Netherlands' },
    'IBE': { name: 'Iberia', country: 'Spain' },
    'JAL': { name: 'Japan Airlines', country: 'Japan' },
    'ANA': { name: 'All Nippon Airways', country: 'Japan' },
    'SIA': { name: 'Singapore Airlines', country: 'Singapore' },
    'QFA': { name: 'Qantas', country: 'Australia' },
    'UAE': { name: 'Emirates', country: 'UAE' },
    'QTR': { name: 'Qatar Airways', country: 'Qatar' },
    'THY': { name: 'Turkish Airlines', country: 'Turkey' },
    'ELY': { name: 'El Al', country: 'Israel' },
    'CPA': { name: 'Cathay Pacific', country: 'Hong Kong' },
    'THA': { name: 'Thai Airways', country: 'Thailand' },
    'KAL': { name: 'Korean Air', country: 'South Korea' },
    'AAL': { name: 'American Airlines', country: 'United States' },
    'DAL': { name: 'Delta Air Lines', country: 'United States' },
    'UAL': { name: 'United Airlines', country: 'United States' },
    'ACA': { name: 'Air Canada', country: 'Canada' },
    'TAM': { name: 'LATAM Airlines', country: 'Brazil' },
    'ETH': { name: 'Ethiopian Airlines', country: 'Ethiopia' },
    'MSR': { name: 'EgyptAir', country: 'Egypt' },
    'RAM': { name: 'Royal Air Maroc', country: 'Morocco' },
};

/**
 * Calculate great circle distance between two points
 */
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3440.065; // Earth radius in nautical miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

/**
 * Calculate bearing between two points
 */
const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) -
        Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
};

/**
 * Interpolate position along great circle
 */
const interpolatePosition = (lat1, lon1, lat2, lon2, fraction) => {
    const d = haversineDistance(lat1, lon1, lat2, lon2) / 3440.065; // angular distance
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const a = Math.sin((1 - fraction) * d) / Math.sin(d);
    const b = Math.sin(fraction * d) / Math.sin(d);

    const x = a * Math.cos(lat1Rad) * Math.cos(lon1Rad) + b * Math.cos(lat2Rad) * Math.cos(lon2Rad);
    const y = a * Math.cos(lat1Rad) * Math.sin(lon1Rad) + b * Math.cos(lat2Rad) * Math.sin(lon2Rad);
    const z = a * Math.sin(lat1Rad) + b * Math.sin(lat2Rad);

    return {
        lat: Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180 / Math.PI,
        lon: Math.atan2(y, x) * 180 / Math.PI
    };
};

// Store active flights
let activeFlights = [];
let lastUpdateTime = Date.now();

/**
 * Initialize simulation with flights at various stages
 */
const initializeFlights = () => {
    activeFlights = [];
    const now = Date.now();

    // Create multiple instances of each route at different progress stages
    ROUTES.forEach((route, routeIndex) => {
        // Create 2-3 flights per route at different stages
        const flightCount = 2 + Math.floor(Math.random() * 2);

        for (let i = 0; i < flightCount; i++) {
            const origin = AIRPORTS[route.from];
            const destination = AIRPORTS[route.to];
            const progress = Math.random(); // 0-1 progress through flight

            // Skip if near endpoints (on ground)
            if (progress < 0.05 || progress > 0.95) continue;

            const flightDurationMs = route.duration * 60 * 1000;
            const departureTime = now - (progress * flightDurationMs);

            const icao24 = `SIM${routeIndex.toString(16).padStart(2, '0')}${i}${Math.random().toString(16).substr(2, 2)}`;
            const callsign = `${route.airline}${route.flightNum}`;

            // Calculate current position
            const pos = interpolatePosition(
                origin.lat, origin.lon,
                destination.lat, destination.lon,
                progress
            );

            // Calculate altitude (climb/cruise/descent profile)
            let altitude;
            const cruiseAlt = 35000 + Math.floor(Math.random() * 6000); // 35000-41000 ft
            if (progress < 0.15) {
                altitude = (progress / 0.15) * cruiseAlt;
            } else if (progress > 0.85) {
                altitude = ((1 - progress) / 0.15) * cruiseAlt;
            } else {
                altitude = cruiseAlt;
            }

            // Calculate heading
            const bearing = calculateBearing(origin.lat, origin.lon, destination.lat, destination.lon);

            // Speed in knots
            const speed = AIRCRAFT_SPEEDS[route.aircraft] || 450;

            // Vertical rate (ft/min)
            let verticalRate = 0;
            if (progress < 0.15) {
                verticalRate = 1500 + Math.random() * 500;
            } else if (progress > 0.85) {
                verticalRate = -(1200 + Math.random() * 400);
            }

            activeFlights.push({
                icao24,
                callsign,
                route,
                origin,
                destination,
                departureTime,
                progress,
                latitude: pos.lat,
                longitude: pos.lon,
                baroAltitude: altitude * 0.3048, // Convert to meters
                geoAltitude: altitude * 0.3048,
                velocity: speed * 0.514444, // Convert knots to m/s
                trueTrack: bearing,
                verticalRate: verticalRate * 0.00508, // Convert fpm to m/s
                onGround: false,
                originCountry: origin.country,
                squawk: (1200 + Math.floor(Math.random() * 6000)).toString().padStart(4, '0'),
                category: AIRCRAFT_CATEGORIES[route.aircraft] || 3,
                categoryLabel: CATEGORY_LABELS[AIRCRAFT_CATEGORIES[route.aircraft]] || 'Large Aircraft',
                lastContact: Math.floor(now / 1000),
                timePosition: Math.floor(now / 1000),
                airline: AIRLINE_INFO[route.airline]?.name || null,
                airlineCountry: AIRLINE_INFO[route.airline]?.country || null,
                aircraftType: route.aircraft,
                registration: `SIM-${callsign.substring(0, 4)}`,
            });
        }
    });

    lastUpdateTime = now;
    return activeFlights;
};

/**
 * Update flight positions based on elapsed time
 */
const updateFlights = () => {
    const now = Date.now();
    const elapsed = (now - lastUpdateTime) / 1000; // seconds
    lastUpdateTime = now;

    activeFlights = activeFlights.map(flight => {
        const flightDurationMs = flight.route.duration * 60 * 1000;
        const newProgress = (now - flight.departureTime) / flightDurationMs;

        // If flight completed, restart with new departure time
        if (newProgress >= 1) {
            const newDepartureTime = now - (Math.random() * 0.1 * flightDurationMs);
            return {
                ...flight,
                departureTime: newDepartureTime,
                progress: 0.05,
            };
        }

        // Update position
        const pos = interpolatePosition(
            flight.origin.lat, flight.origin.lon,
            flight.destination.lat, flight.destination.lon,
            newProgress
        );

        // Update altitude
        let altitude;
        const cruiseAltFt = (flight.baroAltitude / 0.3048) > 30000 ?
            (flight.baroAltitude / 0.3048) : 36000;

        if (newProgress < 0.15) {
            altitude = (newProgress / 0.15) * cruiseAltFt;
        } else if (newProgress > 0.85) {
            altitude = ((1 - newProgress) / 0.15) * cruiseAltFt;
        } else {
            altitude = cruiseAltFt;
        }

        // Vertical rate
        let verticalRate = 0;
        if (newProgress < 0.15) {
            verticalRate = 1500 + Math.random() * 500;
        } else if (newProgress > 0.85) {
            verticalRate = -(1200 + Math.random() * 400);
        }

        // Update bearing based on current and next position
        const nextProgress = Math.min(newProgress + 0.01, 1);
        const nextPos = interpolatePosition(
            flight.origin.lat, flight.origin.lon,
            flight.destination.lat, flight.destination.lon,
            nextProgress
        );
        const bearing = calculateBearing(pos.lat, pos.lon, nextPos.lat, nextPos.lon);

        return {
            ...flight,
            progress: newProgress,
            latitude: pos.lat,
            longitude: pos.lon,
            baroAltitude: altitude * 0.3048,
            geoAltitude: altitude * 0.3048,
            trueTrack: bearing,
            verticalRate: verticalRate * 0.00508,
            lastContact: Math.floor(now / 1000),
            timePosition: Math.floor(now / 1000),
        };
    });

    return activeFlights;
};

/**
 * Get flights within a bounding box
 */
export const getSimulatedFlights = (bbox) => {
    if (activeFlights.length === 0) {
        initializeFlights();
    } else {
        updateFlights();
    }

    const { lamin, lomin, lamax, lomax } = bbox;

    // Filter flights within bounding box (with some margin)
    const margin = 5;
    return activeFlights.filter(flight =>
        flight.latitude >= (lamin - margin) &&
        flight.latitude <= (lamax + margin) &&
        flight.longitude >= (lomin - margin) &&
        flight.longitude <= (lomax + margin)
    );
};

/**
 * Search for a simulated flight by callsign
 */
export const searchSimulatedFlight = (callsign) => {
    if (activeFlights.length === 0) {
        initializeFlights();
    }

    const searchTerm = callsign.toUpperCase().trim();
    return activeFlights.find(f =>
        f.callsign.toUpperCase().includes(searchTerm)
    ) || null;
};

/**
 * Get all simulated flights (for stats)
 */
export const getAllSimulatedFlights = () => {
    if (activeFlights.length === 0) {
        initializeFlights();
    } else {
        updateFlights();
    }
    return [...activeFlights];
};

// Initialize on module load
initializeFlights();

export { AIRPORTS, ROUTES, AIRLINE_INFO };
