// Flight Data API with Multiple Sources
// Primary: ADSB.lol (no rate limits)
// Fallback: OpenSky Network

// OpenSky Network API response indices
const STATE_INDICES = {
    ICAO24: 0,
    CALLSIGN: 1,
    ORIGIN_COUNTRY: 2,
    TIME_POSITION: 3,
    LAST_CONTACT: 4,
    LONGITUDE: 5,
    LATITUDE: 6,
    BARO_ALTITUDE: 7,
    ON_GROUND: 8,
    VELOCITY: 9,
    TRUE_TRACK: 10,
    VERTICAL_RATE: 11,
    SENSORS: 12,
    GEO_ALTITUDE: 13,
    SQUAWK: 14,
    SPI: 15,
    POSITION_SOURCE: 16,
    CATEGORY: 17
};

// Aircraft category mapping based on OpenSky categories
const CATEGORY_LABELS = {
    0: 'Unknown',
    1: 'Light Aircraft',
    2: 'Small Aircraft',
    3: 'Large Aircraft',
    4: 'High Vortex Large',
    5: 'Heavy Aircraft',
    6: 'High Performance',
    7: 'Rotorcraft',
    8: 'Glider',
    9: 'Lighter than Air',
    10: 'Parachutist',
    11: 'Ultralight',
    12: 'Reserved',
    13: 'UAV',
    14: 'Space Vehicle',
    15: 'Emergency Vehicle',
    16: 'Service Vehicle',
    17: 'Ground Obstruction'
};

// Airline ICAO codes to names (common airlines)
const AIRLINE_CODES = {
    'AAL': { name: 'American Airlines', country: 'USA' },
    'DAL': { name: 'Delta Air Lines', country: 'USA' },
    'UAL': { name: 'United Airlines', country: 'USA' },
    'SWA': { name: 'Southwest Airlines', country: 'USA' },
    'JBU': { name: 'JetBlue Airways', country: 'USA' },
    'BAW': { name: 'British Airways', country: 'UK' },
    'DLH': { name: 'Lufthansa', country: 'Germany' },
    'AFR': { name: 'Air France', country: 'France' },
    'KLM': { name: 'KLM Royal Dutch', country: 'Netherlands' },
    'UAE': { name: 'Emirates', country: 'UAE' },
    'QTR': { name: 'Qatar Airways', country: 'Qatar' },
    'ETD': { name: 'Etihad Airways', country: 'UAE' },
    'SIA': { name: 'Singapore Airlines', country: 'Singapore' },
    'CPA': { name: 'Cathay Pacific', country: 'Hong Kong' },
    'ANA': { name: 'All Nippon Airways', country: 'Japan' },
    'JAL': { name: 'Japan Airlines', country: 'Japan' },
    'QFA': { name: 'Qantas', country: 'Australia' },
    'THY': { name: 'Turkish Airlines', country: 'Turkey' },
    'ELY': { name: 'El Al', country: 'Israel' },
    'RYR': { name: 'Ryanair', country: 'Ireland' },
    'EZY': { name: 'easyJet', country: 'UK' },
    'VIR': { name: 'Virgin Atlantic', country: 'UK' },
    'ACA': { name: 'Air Canada', country: 'Canada' },
    'TAM': { name: 'LATAM Airlines', country: 'Brazil' },
    'IBE': { name: 'Iberia', country: 'Spain' },
    'AZA': { name: 'ITA Airways', country: 'Italy' },
    'SAS': { name: 'Scandinavian Airlines', country: 'Scandinavia' },
    'FIN': { name: 'Finnair', country: 'Finland' },
    'AUA': { name: 'Austrian Airlines', country: 'Austria' },
    'SWR': { name: 'Swiss International', country: 'Switzerland' },
    'TAP': { name: 'TAP Air Portugal', country: 'Portugal' },
    'LOT': { name: 'LOT Polish Airlines', country: 'Poland' },
    'CSN': { name: 'China Southern', country: 'China' },
    'CES': { name: 'China Eastern', country: 'China' },
    'CCA': { name: 'Air China', country: 'China' },
    'KAL': { name: 'Korean Air', country: 'South Korea' },
    'AAR': { name: 'Asiana Airlines', country: 'South Korea' },
    'EVA': { name: 'EVA Air', country: 'Taiwan' },
    'MAS': { name: 'Malaysia Airlines', country: 'Malaysia' },
    'THA': { name: 'Thai Airways', country: 'Thailand' },
    'GIA': { name: 'Garuda Indonesia', country: 'Indonesia' },
    'VNL': { name: 'VietJet Air', country: 'Vietnam' },
    'HVN': { name: 'Vietnam Airlines', country: 'Vietnam' },
    'AIC': { name: 'Air India', country: 'India' },
    'IGO': { name: 'IndiGo', country: 'India' },
    'ETH': { name: 'Ethiopian Airlines', country: 'Ethiopia' },
    'SAA': { name: 'South African Airways', country: 'South Africa' },
    'RAM': { name: 'Royal Air Maroc', country: 'Morocco' },
    'MSR': { name: 'EgyptAir', country: 'Egypt' },
    'FDX': { name: 'FedEx Express', country: 'USA' },
    'UPS': { name: 'UPS Airlines', country: 'USA' },
    'GTI': { name: 'Atlas Air', country: 'USA' },
};

// Track current API source
let currentApiSource = 'adsb.lol';

/**
 * Get current API source name
 */
export const getCurrentApiSource = () => currentApiSource;

/**
 * Extract airline info from callsign
 */
const getAirlineInfo = (callsign) => {
    if (!callsign || callsign.length < 3) return null;
    const icaoCode = callsign.substring(0, 3).toUpperCase();
    return AIRLINE_CODES[icaoCode] || null;
};

/**
 * Parse ADSB.lol aircraft data into our standard format
 */
const parseADSBLolAircraft = (ac) => {
    const callsign = ac.flight?.trim() || ac.r || 'N/A';
    const airlineInfo = getAirlineInfo(callsign);

    // Map ADSB.lol category to our format
    const categoryMap = {
        'A0': 0, 'A1': 1, 'A2': 2, 'A3': 3, 'A4': 4, 'A5': 5, 'A6': 6, 'A7': 7,
        'B0': 0, 'B1': 8, 'B2': 9, 'B3': 10, 'B4': 11, 'B5': 12, 'B6': 13, 'B7': 14,
        'C0': 15, 'C1': 16, 'C2': 17, 'C3': 0
    };

    const category = categoryMap[ac.category] || 0;

    return {
        icao24: ac.hex?.toLowerCase() || '',
        callsign: callsign,
        flightNumber: callsign,
        originCountry: ac.r ? getCountryFromRegistration(ac.r) : 'Unknown',
        longitude: ac.lon,
        latitude: ac.lat,
        baroAltitude: ac.alt_baro ? ac.alt_baro * 0.3048 : null, // feet to meters
        geoAltitude: ac.alt_geom ? ac.alt_geom * 0.3048 : null,
        onGround: ac.alt_baro === 'ground' || ac.alt_baro === 0,
        velocity: ac.gs ? ac.gs * 0.514444 : null, // knots to m/s
        trueTrack: ac.track,
        verticalRate: ac.baro_rate ? ac.baro_rate * 0.00508 : null, // fpm to m/s
        squawk: ac.squawk,
        category: category,
        categoryLabel: CATEGORY_LABELS[category] || 'Unknown',
        lastContact: Math.floor(Date.now() / 1000),
        timePosition: Math.floor(Date.now() / 1000),
        airline: airlineInfo?.name || null,
        airlineCountry: airlineInfo?.country || null,
        // Extra ADSB.lol fields
        registration: ac.r || null,
        aircraftType: ac.t || null,
    };
};

/**
 * Get country from aircraft registration prefix
 */
const getCountryFromRegistration = (reg) => {
    if (!reg) return 'Unknown';
    const prefix = reg.substring(0, 2).toUpperCase();
    const countryMap = {
        'N': 'United States', '4X': 'Israel', 'G-': 'United Kingdom', 'D-': 'Germany',
        'F-': 'France', 'I-': 'Italy', 'EC': 'Spain', 'HB': 'Switzerland',
        'OE': 'Austria', 'PH': 'Netherlands', 'OO': 'Belgium', 'SE': 'Sweden',
        'LN': 'Norway', 'OH': 'Finland', 'OY': 'Denmark', 'SP': 'Poland',
        'OK': 'Czech Republic', 'HA': 'Hungary', 'YR': 'Romania', 'LZ': 'Bulgaria',
        'TC': 'Turkey', 'SX': 'Greece', 'CS': 'Portugal', 'EI': 'Ireland',
        'C-': 'Canada', 'XA': 'Mexico', 'PP': 'Brazil', 'LV': 'Argentina',
        'CC': 'Chile', 'VH': 'Australia', 'ZK': 'New Zealand', 'JA': 'Japan',
        'HL': 'South Korea', 'B-': 'China', '9V': 'Singapore', 'HS': 'Thailand',
        'PK': 'Indonesia', '9M': 'Malaysia', 'RP': 'Philippines', 'VT': 'India',
        'A6': 'UAE', 'A7': 'Qatar', 'HZ': 'Saudi Arabia', 'EP': 'Iran',
        'SU': 'Egypt', 'CN': 'Morocco', 'ZS': 'South Africa', 'ET': 'Ethiopia',
        '5N': 'Nigeria', '5H': 'Tanzania', '5Y': 'Kenya', 'VP': 'British Overseas',
        'A4': 'Oman', 'A9': 'Bahrain', '9K': 'Kuwait', 'JY': 'Jordan'
    };
    // Check 2-char prefixes first
    if (countryMap[prefix]) return countryMap[prefix];
    // Check 1-char prefix
    if (countryMap[reg[0]]) return countryMap[reg[0]];
    return 'Unknown';
};

/**
 * Parse raw OpenSky state array into readable object
 */
const parseFlightState = (state) => {
    const callsign = state[STATE_INDICES.CALLSIGN]?.trim() || 'N/A';
    const airlineInfo = getAirlineInfo(callsign);

    return {
        icao24: state[STATE_INDICES.ICAO24],
        callsign: callsign,
        flightNumber: callsign,
        originCountry: state[STATE_INDICES.ORIGIN_COUNTRY],
        longitude: state[STATE_INDICES.LONGITUDE],
        latitude: state[STATE_INDICES.LATITUDE],
        baroAltitude: state[STATE_INDICES.BARO_ALTITUDE],
        geoAltitude: state[STATE_INDICES.GEO_ALTITUDE],
        onGround: state[STATE_INDICES.ON_GROUND],
        velocity: state[STATE_INDICES.VELOCITY],
        trueTrack: state[STATE_INDICES.TRUE_TRACK],
        verticalRate: state[STATE_INDICES.VERTICAL_RATE],
        squawk: state[STATE_INDICES.SQUAWK],
        category: state[STATE_INDICES.CATEGORY],
        categoryLabel: CATEGORY_LABELS[state[STATE_INDICES.CATEGORY]] || 'Unknown',
        lastContact: state[STATE_INDICES.LAST_CONTACT],
        timePosition: state[STATE_INDICES.TIME_POSITION],
        airline: airlineInfo?.name || null,
        airlineCountry: airlineInfo?.country || null,
    };
};

/**
 * Fetch with timeout wrapper
 */
const fetchWithTimeout = async (url, options = {}, timeout = 10000) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal
        });
        clearTimeout(id);
        return response;
    } catch (error) {
        clearTimeout(id);
        throw error;
    }
};

/**
 * Fetch flights from ADSB.lol API (NO RATE LIMITS!)
 */
const fetchFromADSBLol = async (bbox) => {
    const { lamin, lomin, lamax, lomax } = bbox;

    // Calculate center and radius for ADSB.lol API
    const centerLat = (lamin + lamax) / 2;
    const centerLon = (lomin + lomax) / 2;

    // Calculate approximate radius in nautical miles (max 250nm)
    const latDiff = Math.abs(lamax - lamin);
    const lonDiff = Math.abs(lomax - lomin);
    const maxDiff = Math.max(latDiff, lonDiff);
    const radiusNm = Math.min(Math.round(maxDiff * 60 / 2), 250);

    const url = `https://api.adsb.lol/v2/lat/${centerLat.toFixed(4)}/lon/${centerLon.toFixed(4)}/dist/${radiusNm}`;

    const response = await fetchWithTimeout(url, {}, 10000);

    if (!response.ok) {
        throw new Error(`ADSB.lol API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.ac || data.ac.length === 0) {
        return [];
    }

    // Parse and filter valid flights
    const flights = data.ac
        .map(parseADSBLolAircraft)
        .filter(flight => flight.latitude !== null && flight.longitude !== null);

    currentApiSource = 'adsb.lol';
    return flights;
};

/**
 * Fetch flights from OpenSky Network API (FALLBACK)
 */
const fetchFromOpenSky = async (bbox) => {
    const { lamin, lomin, lamax, lomax } = bbox;
    const url = `https://opensky-network.org/api/states/all?lamin=${lamin}&lomin=${lomin}&lamax=${lamax}&lomax=${lomax}`;

    const response = await fetchWithTimeout(url, {}, 10000);

    if (!response.ok) {
        if (response.status === 429) {
            throw new Error('OpenSky rate limited');
        }
        throw new Error(`OpenSky API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.states || data.states.length === 0) {
        return [];
    }

    const flights = data.states
        .map(parseFlightState)
        .filter(flight => flight.latitude !== null && flight.longitude !== null);

    currentApiSource = 'opensky';
    return flights;
};

/**
 * Fetch flights with automatic failover
 * Primary: ADSB.lol (no rate limits)
 * Fallback: OpenSky Network
 */
export const fetchFlights = async (bbox) => {
    try {
        // Try ADSB.lol first (no rate limits!)
        return await fetchFromADSBLol(bbox);
    } catch (adsbError) {
        console.warn('ADSB.lol failed, trying OpenSky:', adsbError.message);

        try {
            // Fallback to OpenSky
            return await fetchFromOpenSky(bbox);
        } catch (openskyError) {
            console.error('All APIs failed:', openskyError.message);
            throw new Error('Unable to fetch flight data. Please try again later.');
        }
    }
};

/**
 * Search for a specific flight by callsign globally
 */
export const searchFlightByCallsign = async (callsign) => {
    const searchTerm = callsign.toUpperCase().trim();

    try {
        // Try ADSB.lol first - search globally
        const url = `https://api.adsb.lol/v2/callsign/${searchTerm}`;
        const response = await fetch(url);

        if (response.ok) {
            const data = await response.json();
            if (data.ac && data.ac.length > 0) {
                const flight = parseADSBLolAircraft(data.ac[0]);
                if (flight.latitude && flight.longitude) {
                    currentApiSource = 'adsb.lol';
                    return flight;
                }
            }
        }
    } catch (error) {
        console.warn('ADSB.lol search failed:', error.message);
    }

    // Fallback to OpenSky
    try {
        const url = `https://opensky-network.org/api/states/all`;
        const response = await fetch(url);

        if (!response.ok) {
            if (response.status === 429) {
                throw new Error('Rate limited. Please wait before searching.');
            }
            throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        if (!data.states || data.states.length === 0) {
            return null;
        }

        const matchingState = data.states.find(state => {
            const flightCallsign = state[STATE_INDICES.CALLSIGN]?.trim().toUpperCase() || '';
            return flightCallsign.includes(searchTerm) || searchTerm.includes(flightCallsign);
        });

        if (matchingState) {
            const flight = parseFlightState(matchingState);
            if (flight.latitude && flight.longitude) {
                currentApiSource = 'opensky';
                return flight;
            }
        }

        return null;
    } catch (error) {
        console.error('Error searching flight:', error);
        throw error;
    }
};

/**
 * Fetch aircraft metadata from OpenSky
 */
export const fetchAircraftMetadata = async (icao24) => {
    try {
        const response = await fetch(`https://opensky-network.org/api/metadata/aircraft/icao/${icao24}`);

        if (!response.ok) {
            return null;
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching aircraft metadata:', error);
        return null;
    }
};

export { CATEGORY_LABELS, AIRLINE_CODES, getAirlineInfo };
