// High-Fidelity "Air Watch" Simulation Engine
// Implements OOOI Model (Out, Off, On, In) with realistic industry metrics
// 2026 Aviation Data Standards

import { interpolatePosition, getDistance, calculateBearing } from './geo';

// --- DATA: GLOBAL AVIATION NODES ---
const AIRPORTS = {
    // --- ASIA-PACIFIC (35% Volume) ---
    HND: { lat: 35.5494, lon: 139.7798, name: 'Tokyo Haneda', region: 'ASIA', country: 'Japan' },
    NRT: { lat: 35.7720, lon: 140.3929, name: 'Tokyo Narita', region: 'ASIA', country: 'Japan' },
    KIX: { lat: 34.4347, lon: 135.2441, name: 'Osaka', region: 'ASIA', country: 'Japan' },
    PEK: { lat: 40.0799, lon: 116.6031, name: 'Beijing Capital', region: 'ASIA', country: 'China' },
    PVG: { lat: 31.1443, lon: 121.8083, name: 'Shanghai Pudong', region: 'ASIA', country: 'China' },
    CAN: { lat: 23.3924, lon: 113.2988, name: 'Guangzhou', region: 'ASIA', country: 'China' },
    HKG: { lat: 22.3080, lon: 113.9185, name: 'Hong Kong', region: 'ASIA', country: 'Hong Kong' },
    SIN: { lat: 1.3644, lon: 103.9915, name: 'Singapore Changi', region: 'ASIA', country: 'Singapore' },
    ICN: { lat: 37.4602, lon: 126.4407, name: 'Seoul Incheon', region: 'ASIA', country: 'South Korea' },
    BKK: { lat: 13.6900, lon: 100.7501, name: 'Bangkok Suvarnabhumi', region: 'ASIA', country: 'Thailand' },
    DEL: { lat: 28.5562, lon: 77.1000, name: 'Delhi Indira Gandhi', region: 'ASIA', country: 'India' },
    BOM: { lat: 19.0896, lon: 72.8656, name: 'Mumbai', region: 'ASIA', country: 'India' },
    BLR: { lat: 13.1986, lon: 77.7066, name: 'Bangalore', region: 'ASIA', country: 'India' },
    KUL: { lat: 2.7456, lon: 101.7072, name: 'Kuala Lumpur', region: 'ASIA', country: 'Malaysia' },
    CGK: { lat: -6.1256, lon: 106.6558, name: 'Jakarta', region: 'ASIA', country: 'Indonesia' },
    MNL: { lat: 14.5086, lon: 121.0198, name: 'Manila', region: 'ASIA', country: 'Philippines' },
    SGN: { lat: 10.8188, lon: 106.6519, name: 'Ho Chi Minh', region: 'ASIA', country: 'Vietnam' },
    TPE: { lat: 25.0797, lon: 121.2342, name: 'Taipei', region: 'ASIA', country: 'Taiwan' },
    SYD: { lat: -33.9399, lon: 151.1753, name: 'Sydney', region: 'ASIA', country: 'Australia' },
    MEL: { lat: -37.6690, lon: 144.8410, name: 'Melbourne', region: 'ASIA', country: 'Australia' },

    // --- EUROPE (27% Volume) ---
    LHR: { lat: 51.4700, lon: -0.4543, name: 'London Heathrow', region: 'EU', country: 'United Kingdom' },
    CDG: { lat: 49.0097, lon: 2.5479, name: 'Paris CDG', region: 'EU', country: 'France' },
    AMS: { lat: 52.3105, lon: 4.7683, name: 'Amsterdam Schiphol', region: 'EU', country: 'Netherlands' },
    FRA: { lat: 50.0379, lon: 8.5622, name: 'Frankfurt', region: 'EU', country: 'Germany' },
    IST: { lat: 41.2753, lon: 28.7519, name: 'Istanbul', region: 'EU', country: 'Turkey' }, // Trans-continental hub
    MAD: { lat: 40.4983, lon: -3.5676, name: 'Madrid Barajas', region: 'EU', country: 'Spain' },
    BCN: { lat: 41.2974, lon: 2.0833, name: 'Barcelona', region: 'EU', country: 'Spain' },
    MUC: { lat: 48.3537, lon: 11.7750, name: 'Munich', region: 'EU', country: 'Germany' },
    FCO: { lat: 41.8003, lon: 12.2389, name: 'Rome Fiumicino', region: 'EU', country: 'Italy' },
    LGW: { lat: 51.1537, lon: -0.1821, name: 'London Gatwick', region: 'EU', country: 'United Kingdom' },
    ZRH: { lat: 47.4647, lon: 8.5492, name: 'Zurich', region: 'EU', country: 'Switzerland' },
    DUB: { lat: 53.4264, lon: -6.2499, name: 'Dublin', region: 'EU', country: 'Ireland' },
    CPH: { lat: 55.6180, lon: 12.6561, name: 'Copenhagen', region: 'EU', country: 'Denmark' },
    VIE: { lat: 48.1103, lon: 16.5697, name: 'Vienna', region: 'EU', country: 'Austria' },
    LIS: { lat: 38.7756, lon: -9.1354, name: 'Lisbon', region: 'EU', country: 'Portugal' },
    ATH: { lat: 37.9364, lon: 23.9445, name: 'Athens', region: 'EU', country: 'Greece' },

    // --- NORTH AMERICA (22% Volume) ---
    ATL: { lat: 33.6407, lon: -84.4277, name: 'Atlanta Hartsfield', region: 'NA', country: 'United States' },
    DFW: { lat: 32.8998, lon: -97.0403, name: 'Dallas/Fort Worth', region: 'NA', country: 'United States' },
    DEN: { lat: 39.8561, lon: -104.6737, name: 'Denver', region: 'NA', country: 'United States' },
    ORD: { lat: 41.9742, lon: -87.9073, name: 'Chicago O\'Hare', region: 'NA', country: 'United States' },
    LAX: { lat: 33.9425, lon: -118.4081, name: 'Los Angeles', region: 'NA', country: 'United States' },
    JFK: { lat: 40.6413, lon: -73.7781, name: 'New York JFK', region: 'NA', country: 'United States' },
    MCO: { lat: 28.4312, lon: -81.3081, name: 'Orlando', region: 'NA', country: 'United States' },
    MIA: { lat: 25.7959, lon: -80.2870, name: 'Miami', region: 'NA', country: 'United States' },
    LAS: { lat: 36.0840, lon: -115.1537, name: 'Las Vegas', region: 'NA', country: 'United States' },
    SEA: { lat: 47.4502, lon: -122.3088, name: 'Seattle Tacoma', region: 'NA', country: 'United States' },
    SFO: { lat: 37.6213, lon: -122.3790, name: 'San Francisco', region: 'NA', country: 'United States' },
    EWR: { lat: 40.6895, lon: -74.1745, name: 'Newark', region: 'NA', country: 'United States' },
    YYZ: { lat: 43.6777, lon: -79.6248, name: 'Toronto Pearson', region: 'NA', country: 'Canada' },
    YVR: { lat: 49.1967, lon: -123.1815, name: 'Vancouver', region: 'NA', country: 'Canada' },
    MEX: { lat: 19.4363, lon: -99.0721, name: 'Mexico City', region: 'NA', country: 'Mexico' },

    // --- MIDDLE EAST (9% Volume) ---
    DXB: { lat: 25.2532, lon: 55.3657, name: 'Dubai', region: 'ME', country: 'UAE' },
    DOH: { lat: 25.2609, lon: 51.6138, name: 'Doha Hamad', region: 'ME', country: 'Qatar' },
    AUH: { lat: 24.4330, lon: 54.6511, name: 'Abu Dhabi', region: 'ME', country: 'UAE' },
    RUH: { lat: 24.9576, lon: 46.6988, name: 'Riyadh', region: 'ME', country: 'Saudi Arabia' },
    TLV: { lat: 32.0055, lon: 34.8854, name: 'Tel Aviv', region: 'ME', country: 'Israel' },

    // --- LATAM & AFRICA (7% Volume) ---
    GRU: { lat: -23.4356, lon: -46.4731, name: 'São Paulo Guarulhos', region: 'ROW', country: 'Brazil' },
    BOG: { lat: 4.7016, lon: -74.1469, name: 'Bogotá', region: 'ROW', country: 'Colombia' },
    JNB: { lat: -26.1392, lon: 28.2460, name: 'Johannesburg', region: 'ROW', country: 'South Africa' },
    CAI: { lat: 30.1219, lon: 31.4056, name: 'Cairo', region: 'ROW', country: 'Egypt' },
    ADD: { lat: 8.9779, lon: 38.7993, name: 'Addis Ababa', region: 'ROW', country: 'Ethiopia' },
};

// --- CONSTANTS ---
const REGIONAL_WEIGHTS = {
    ASIA: 0.35,
    EU: 0.27,
    NA: 0.22,
    ME: 0.09,
    ROW: 0.07
};

// Flight Phases
const PHASE = {
    TURNAROUND: 'TURNAROUND', // At gate
    TAXI_OUT: 'TAXI_OUT',     // Pushing back / Taxiing to runway
    EN_ROUTE: 'EN_ROUTE',     // Airborne
    TAXI_IN: 'TAXI_IN'        // Landing roll / Taxiing to gate
};

const SIM_SPEED_MULTIPLIER = 1; // 1x Real Time

// --- AIRLINES & AIRCRAFT ---
const AIRLINES = [
    { code: 'AAL', name: 'American', country: 'United States' }, { code: 'DAL', name: 'Delta', country: 'United States' },
    { code: 'UAL', name: 'United', country: 'United States' }, { code: 'BAW', name: 'British Airways', country: 'UK' },
    { code: 'UAE', name: 'Emirates', country: 'UAE' }, { code: 'QTR', name: 'Qatar Airways', country: 'Qatar' },
    { code: 'AFR', name: 'Air France', country: 'France' }, { code: 'DLH', name: 'Lufthansa', country: 'Germany' },
    { code: 'JAL', name: 'Japan Airlines', country: 'Japan' }, { code: 'ANA', name: 'ANA', country: 'Japan' },
    { code: 'CPA', name: 'Cathay Pacific', country: 'Hong Kong' }, { code: 'SIA', name: 'Singapore Airlines', country: 'Singapore' },
    { code: 'KAL', name: 'Korean Air', country: 'Korea' }, { code: 'CES', name: 'China Eastern', country: 'China' },
    { code: 'CCA', name: 'Air China', country: 'China' }, { code: 'CSN', name: 'China Southern', country: 'China' },
    { code: 'AIC', name: 'Air India', country: 'India' }, { code: 'IGO', name: 'IndiGo', country: 'India' },
    { code: 'RYR', name: 'Ryanair', country: 'Ireland' }, { code: 'EZY', name: 'easyJet', country: 'UK' },
    { code: 'QFA', name: 'Qantas', country: 'Australia' }, { code: 'ETH', name: 'Ethiopian', country: 'Ethiopia' },
    { code: 'TAM', name: 'LATAM', country: 'Brazil' }, { code: 'KLM', name: 'KLM', country: 'Netherlands' }
];

const AIRCRAFT_TYPES = {
    SHORT: ['A320', 'B737', 'B738', 'E190', 'A220'],
    MEDIUM: ['A321', 'B752', 'B739', 'A321neo'],
    LONG: ['B777', 'B787', 'A350', 'A380', 'A330']
};

const AIRCRAFT_SPEEDS = {
    'A320': 450, 'B737': 450, 'B738': 450, 'E190': 430, 'A220': 440,
    'A321': 450, 'B752': 460, 'B739': 450, 'A321neo': 460,
    'B777': 490, 'B787': 490, 'A350': 495, 'A380': 490, 'A330': 470
};

// --- STATE ---
let activeFlights = [];
let allRoutes = [];
let lastUpdateTime = Date.now();

// --- LOGIC ---

// Generate weighted routes
const generateRoutes = () => {
    const routes = [];
    const airports = Object.values(AIRPORTS);
    const regionGroups = { ASIA: [], EU: [], NA: [], ME: [], ROW: [] };
    airports.forEach(a => regionGroups[a.region].push(a));

    // Helper: Create route pair
    const createRoute = (from, to, type) => {
        const dist = getDistance(from.lat, from.lon, to.lat, to.lon);
        const airline = AIRLINES[Math.floor(Math.random() * AIRLINES.length)];
        const aircraft = AIRCRAFT_TYPES[type][Math.floor(Math.random() * AIRCRAFT_TYPES[type].length)];
        const durationMins = Math.round((dist / (AIRCRAFT_SPEEDS[aircraft] * 1.852 / 60)) * 60) + 30; // Cruise speed + Climb/Descent buffer

        return { from: from.name, to: to.name, fromCode: Object.keys(AIRPORTS).find(key => AIRPORTS[key] === from), toCode: Object.keys(AIRPORTS).find(key => AIRPORTS[key] === to), airline, aircraft, duration: durationMins, fromLoc: from, toLoc: to };
    };

    // 1. INTRA-REGIONAL (Short/Medium Haul) - 65% + 25% bias
    Object.keys(regionGroups).forEach(region => {
        const group = regionGroups[region];
        const count = Math.ceil(group.length * 6 * REGIONAL_WEIGHTS[region]); // Scale by density

        for (let i = 0; i < count; i++) {
            const a1 = group[Math.floor(Math.random() * group.length)];
            const a2 = group[Math.floor(Math.random() * group.length)];
            if (a1 === a2) continue;

            const dist = getDistance(a1.lat, a1.lon, a2.lat, a2.lon);
            let type = 'SHORT';
            if (dist > 2700) type = 'MEDIUM'; // 1500nm approx 2700km

            routes.push(createRoute(a1, a2, type));
            routes.push(createRoute(a2, a1, type));
        }
    });

    // 2. INTER-REGIONAL (Long Haul) - 10% bias
    // Connect major hubs
    const hubs = ['LHR', 'JFK', 'DXB', 'HND', 'HKG', 'SIN', 'FRA', 'LAX', 'SYD', 'GRU', 'JNB'];
    const hubAirports = hubs.map(h => AIRPORTS[h]);

    for (let i = 0; i < hubAirports.length; i++) {
        for (let j = i + 1; j < hubAirports.length; j++) {
            if (Math.random() > 0.3) { // 70% connection rate between major hubs
                const r1 = createRoute(hubAirports[i], hubAirports[j], 'LONG');
                const r2 = createRoute(hubAirports[j], hubAirports[i], 'LONG');
                routes.push(r1, r2);
            }
        }
    }

    // 3. BUSY CORRIDORS (Seeding)
    const corridors = [
        ['MEX', 'JFK'], ['ICN', 'HND'], ['LHR', 'JFK'], ['DXB', 'RUH'],
        ['HND', 'CTS'], ['HKG', 'TPE'], ['MEL', 'SYD'], ['BOM', 'DEL']
    ];
    corridors.forEach(pair => {
        const a1 = AIRPORTS[pair[0]];
        const a2 = AIRPORTS[pair[1]];
        if (a1 && a2) {
            // Add extra density
            for (let k = 0; k < 5; k++) {
                routes.push(createRoute(a1, a2, 'SHORT')); // Or medium
                routes.push(createRoute(a2, a1, 'SHORT'));
            }
        }
    });

    return routes;
};

// Initialize Flights in Random States
const initializeFlights = () => {
    activeFlights = [];
    allRoutes = generateRoutes();
    const now = Date.now();

    // Target Total: ~2500 flights
    const TARGET_FLIGHTS = 2500;

    // Distribute flights among routes weighted by region
    for (let i = 0; i < TARGET_FLIGHTS; i++) {
        const route = allRoutes[Math.floor(Math.random() * allRoutes.length)];

        // Determine Random Logic State
        // Probability: 80% Airborne, 10% Taxi Out, 10% Taxi In (Simplified snapshot)
        const rand = Math.random();
        let phase, progress = 0;
        let startTime = now;

        if (rand < 0.10) {
            phase = PHASE.TAXI_OUT;
            // Started taxi 0-20 mins ago
            startTime = now - (Math.random() * 20 * 60000);
        } else if (rand > 0.90) {
            phase = PHASE.TAXI_IN;
            // Started taxi in 0-10 mins ago
            startTime = now - (Math.random() * 10 * 60000);
            progress = 1;
        } else {
            phase = PHASE.EN_ROUTE;
            progress = Math.random();
            const flightDurationMs = route.duration * 60 * 1000;
            startTime = now - (progress * flightDurationMs);
        }

        const icao24 = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0');
        const flightNum = Math.floor(Math.random() * 9000) + 100;

        activeFlights.push({
            icao24,
            callsign: `${route.airline.code}${flightNum}`,
            route,
            phase,
            startTime, // Time current phase started (or flight departure time for EN_ROUTE)
            progress,
            lastUpdate: now,

            // Computed props
            lat: route.fromLoc.lat,
            lon: route.fromLoc.lon,
            alt: 0,
            spd: 0,
            hdg: 0,
            trueTrack: 0,

            // Static
            airline: route.airline.name,
            aircraft: route.aircraft,
            category: AIRCRAFT_TYPES.LONG.includes(route.aircraft) ? 3 : 2,
        });
    }
};

// Main Update Loop
const updateFlights = () => {
    const now = Date.now();
    const dt = (now - lastUpdateTime);
    lastUpdateTime = now;

    activeFlights.forEach(f => {
        // --- PHASE LOGIC ---

        if (f.phase === PHASE.TAXI_OUT) {
            // Duration: 15-27 mins
            const taxiDuration = 20 * 60000; // 20 mins avg
            const elapsed = now - f.startTime;

            f.alt = 0;
            f.spd = 15; // Knots
            f.lat = f.route.fromLoc.lat;
            f.lon = f.route.fromLoc.lon;
            f.progress = 0;
            f.onGround = true;
            f.trueTrack = 0; // Point north or random?

            if (elapsed > taxiDuration) {
                // TAKEOFF
                f.phase = PHASE.EN_ROUTE;
                f.startTime = now; // Reset timer for flight duration
            }
        }
        else if (f.phase === PHASE.EN_ROUTE) {
            const flightDuration = f.route.duration * 60000;
            const elapsed = now - f.startTime;
            f.progress = elapsed / flightDuration;

            if (f.progress >= 1) {
                // LANDING
                f.phase = PHASE.TAXI_IN;
                f.startTime = now;
                f.progress = 1;
            } else {
                const prevLat = f.lat;
                const prevLon = f.lon;

                // Interpolate
                const pos = interpolatePosition(
                    f.route.fromLoc.lat, f.route.fromLoc.lon,
                    f.route.toLoc.lat, f.route.toLoc.lon,
                    f.progress
                );
                f.lat = pos.lat;
                f.lon = pos.lon;

                // Update bearing based on movement or simple Great Circle bearing at point
                if (Math.abs(f.lat - prevLat) > 0.0001 || Math.abs(f.lon - prevLon) > 0.0001) {
                    f.trueTrack = calculateBearing(prevLat, prevLon, f.lat, f.lon);
                }

                // Altitude (Climb/Cruise/Descent)
                const cruiseAlt = 35000;
                if (f.progress < 0.1) f.alt = (f.progress / 0.1) * cruiseAlt;
                else if (f.progress > 0.9) f.alt = ((1 - f.progress) / 0.1) * cruiseAlt;
                else f.alt = cruiseAlt;

                f.spd = AIRCRAFT_SPEEDS[f.route.aircraft] || 450;
                f.onGround = false;
            }
        }
        else if (f.phase === PHASE.TAXI_IN) {
            // Duration: 5-14 mins
            const taxiDuration = 10 * 60000;
            const elapsed = now - f.startTime;

            f.alt = 0;
            f.spd = 15;
            f.lat = f.route.toLoc.lat;
            f.lon = f.route.toLoc.lon;
            f.onGround = true;

            if (elapsed > taxiDuration) {
                // PARKED / TURNAROUND
                f.phase = PHASE.TURNAROUND;
                f.startTime = now;
            }
        }
        else if (f.phase === PHASE.TURNAROUND) {
            // Duration: 30-60 mins
            const turnDuration = 45 * 60000;
            const elapsed = now - f.startTime;

            f.alt = 0;
            f.spd = 0;
            f.onGround = true;

            if (elapsed > turnDuration) {
                // NEW FLIGHT
                // Swap origin/dest
                const oldRoute = f.route;
                f.route = {
                    ...oldRoute,
                    from: oldRoute.to, to: oldRoute.from,
                    fromLoc: oldRoute.toLoc, toLoc: oldRoute.fromLoc,
                    fromCode: oldRoute.toCode, toCode: oldRoute.fromCode
                };
                f.phase = PHASE.TAXI_OUT;
                f.startTime = now;
            }
        }
    });

    return activeFlights; // Mapped for MapView
};

// Interface for API
export const getSimulatedFlights = (bbox) => {
    if (activeFlights.length === 0) initializeFlights();
    else updateFlights();

    // Map to API format expected by App
    // Filter by BBox
    const { lamin, lomin, lamax, lomax } = bbox;
    const margin = 30;

    return activeFlights
        .filter(f =>
            f.lat >= (lamin - margin) && f.lat <= (lamax + margin) &&
            f.lon >= (lomin - margin) && f.lon <= (lomax + margin)
        )
        .map(f => ({
            icao24: f.icao24,
            callsign: f.callsign,
            origin_country: f.route.airline.country,
            time_position: Math.floor(Date.now() / 1000),
            last_contact: Math.floor(Date.now() / 1000),
            longitude: f.lon,
            latitude: f.lat,
            baro_altitude: f.alt * 0.3048, // ft to meters
            on_ground: f.onGround,
            velocity: f.spd * 0.514444, // knots to m/s
            true_track: f.trueTrack || 0,
            vertical_rate: 0,
            category: f.category,
            // Custom props
            airline: f.airline,
            route: { from: f.route.fromCode, to: f.route.toCode },
            phase: f.phase,

            // MapView expects:
            latitude: f.lat, longitude: f.lon,
            baroAltitude: f.alt * 0.3048,
            velocity: f.spd * 0.5144,
            trueTrack: f.trueTrack || 0,
            onGround: f.onGround,
            origin: f.route.fromLoc,
            destination: f.route.toLoc
        }));
};

export const searchSimulatedFlight = (callsign) => {
    if (activeFlights.length === 0) initializeFlights();
    // No update necessary if we assume it's called after getSimulatedFlights or we can just return current state

    const flight = activeFlights.find(f => f.callsign.toUpperCase() === callsign.toUpperCase());
    if (!flight) return null;

    // Return same format as getSimulatedFlights
    const f = flight;
    return {
        icao24: f.icao24,
        callsign: f.callsign,
        origin_country: f.route.airline.country,
        time_position: Math.floor(Date.now() / 1000),
        last_contact: Math.floor(Date.now() / 1000),
        longitude: f.lon,
        latitude: f.lat,
        baro_altitude: f.alt * 0.3048,
        on_ground: f.onGround,
        velocity: f.spd * 0.514444,
        true_track: f.trueTrack || 0,
        vertical_rate: 0,
        category: f.category,
        airline: f.airline,
        route: { from: f.route.fromCode, to: f.route.toCode },
        phase: f.phase,
        // MapView props
        latitude: f.lat, longitude: f.lon,
        baroAltitude: f.alt * 0.3048,
        velocity: f.spd * 0.5144,
        trueTrack: f.trueTrack || 0,
        onGround: f.onGround,
        origin: f.route.fromLoc,
        destination: f.route.toLoc
    };
};
