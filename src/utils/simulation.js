// Flight Simulation Engine - HIGH DENSITY VERSION
// Generates realistic flight data with ~500+ moving aircraft

// Major world airports with coordinates
const AIRPORTS = {
    // North America - Major
    JFK: { lat: 40.6413, lon: -73.7781, name: 'New York JFK', country: 'United States' },
    LAX: { lat: 33.9425, lon: -118.4081, name: 'Los Angeles', country: 'United States' },
    ORD: { lat: 41.9742, lon: -87.9073, name: 'Chicago O\'Hare', country: 'United States' },
    ATL: { lat: 33.6407, lon: -84.4277, name: 'Atlanta', country: 'United States' },
    DFW: { lat: 32.8998, lon: -97.0403, name: 'Dallas', country: 'United States' },
    DEN: { lat: 39.8561, lon: -104.6737, name: 'Denver', country: 'United States' },
    SFO: { lat: 37.6213, lon: -122.3790, name: 'San Francisco', country: 'United States' },
    SEA: { lat: 47.4502, lon: -122.3088, name: 'Seattle', country: 'United States' },
    MIA: { lat: 25.7959, lon: -80.2870, name: 'Miami', country: 'United States' },
    BOS: { lat: 42.3656, lon: -71.0096, name: 'Boston', country: 'United States' },
    PHX: { lat: 33.4373, lon: -112.0078, name: 'Phoenix', country: 'United States' },
    LAS: { lat: 36.0840, lon: -115.1537, name: 'Las Vegas', country: 'United States' },
    MCO: { lat: 28.4312, lon: -81.3081, name: 'Orlando', country: 'United States' },
    EWR: { lat: 40.6895, lon: -74.1745, name: 'Newark', country: 'United States' },
    MSP: { lat: 44.8848, lon: -93.2223, name: 'Minneapolis', country: 'United States' },
    DTW: { lat: 42.2162, lon: -83.3554, name: 'Detroit', country: 'United States' },
    PHL: { lat: 39.8744, lon: -75.2424, name: 'Philadelphia', country: 'United States' },
    CLT: { lat: 35.2140, lon: -80.9431, name: 'Charlotte', country: 'United States' },
    IAH: { lat: 29.9902, lon: -95.3368, name: 'Houston', country: 'United States' },
    SLC: { lat: 40.7899, lon: -111.9791, name: 'Salt Lake City', country: 'United States' },
    DCA: { lat: 38.8512, lon: -77.0402, name: 'Washington Reagan', country: 'United States' },
    SAN: { lat: 32.7338, lon: -117.1933, name: 'San Diego', country: 'United States' },
    TPA: { lat: 27.9755, lon: -82.5332, name: 'Tampa', country: 'United States' },
    PDX: { lat: 45.5898, lon: -122.5951, name: 'Portland', country: 'United States' },
    YYZ: { lat: 43.6777, lon: -79.6248, name: 'Toronto', country: 'Canada' },
    YVR: { lat: 49.1967, lon: -123.1815, name: 'Vancouver', country: 'Canada' },
    YUL: { lat: 45.4706, lon: -73.7408, name: 'Montreal', country: 'Canada' },
    MEX: { lat: 19.4363, lon: -99.0721, name: 'Mexico City', country: 'Mexico' },
    CUN: { lat: 21.0365, lon: -86.8771, name: 'Cancun', country: 'Mexico' },

    // Europe - Major
    LHR: { lat: 51.4700, lon: -0.4543, name: 'London Heathrow', country: 'United Kingdom' },
    LGW: { lat: 51.1537, lon: -0.1821, name: 'London Gatwick', country: 'United Kingdom' },
    CDG: { lat: 49.0097, lon: 2.5479, name: 'Paris CDG', country: 'France' },
    ORY: { lat: 48.7262, lon: 2.3652, name: 'Paris Orly', country: 'France' },
    FRA: { lat: 50.0379, lon: 8.5622, name: 'Frankfurt', country: 'Germany' },
    MUC: { lat: 48.3537, lon: 11.7750, name: 'Munich', country: 'Germany' },
    AMS: { lat: 52.3105, lon: 4.7683, name: 'Amsterdam', country: 'Netherlands' },
    MAD: { lat: 40.4983, lon: -3.5676, name: 'Madrid', country: 'Spain' },
    BCN: { lat: 41.2974, lon: 2.0833, name: 'Barcelona', country: 'Spain' },
    FCO: { lat: 41.8003, lon: 12.2389, name: 'Rome', country: 'Italy' },
    MXP: { lat: 45.6306, lon: 8.7281, name: 'Milan', country: 'Italy' },
    IST: { lat: 41.2753, lon: 28.7519, name: 'Istanbul', country: 'Turkey' },
    ZRH: { lat: 47.4647, lon: 8.5492, name: 'Zurich', country: 'Switzerland' },
    VIE: { lat: 48.1103, lon: 16.5697, name: 'Vienna', country: 'Austria' },
    CPH: { lat: 55.6180, lon: 12.6561, name: 'Copenhagen', country: 'Denmark' },
    OSL: { lat: 60.1976, lon: 11.0004, name: 'Oslo', country: 'Norway' },
    ARN: { lat: 59.6519, lon: 17.9186, name: 'Stockholm', country: 'Sweden' },
    HEL: { lat: 60.3172, lon: 24.9633, name: 'Helsinki', country: 'Finland' },
    DUB: { lat: 53.4264, lon: -6.2499, name: 'Dublin', country: 'Ireland' },
    LIS: { lat: 38.7756, lon: -9.1354, name: 'Lisbon', country: 'Portugal' },
    BRU: { lat: 50.9014, lon: 4.4844, name: 'Brussels', country: 'Belgium' },
    WAW: { lat: 52.1657, lon: 20.9671, name: 'Warsaw', country: 'Poland' },
    PRG: { lat: 50.1008, lon: 14.2600, name: 'Prague', country: 'Czech Republic' },
    ATH: { lat: 37.9364, lon: 23.9445, name: 'Athens', country: 'Greece' },

    // Middle East
    DXB: { lat: 25.2532, lon: 55.3657, name: 'Dubai', country: 'UAE' },
    AUH: { lat: 24.4330, lon: 54.6511, name: 'Abu Dhabi', country: 'UAE' },
    DOH: { lat: 25.2609, lon: 51.6138, name: 'Doha', country: 'Qatar' },
    TLV: { lat: 32.0055, lon: 34.8854, name: 'Tel Aviv', country: 'Israel' },
    RUH: { lat: 24.9576, lon: 46.6988, name: 'Riyadh', country: 'Saudi Arabia' },
    JED: { lat: 21.6796, lon: 39.1565, name: 'Jeddah', country: 'Saudi Arabia' },
    AMM: { lat: 31.7226, lon: 35.9932, name: 'Amman', country: 'Jordan' },
    KWI: { lat: 29.2266, lon: 47.9689, name: 'Kuwait', country: 'Kuwait' },
    BAH: { lat: 26.2708, lon: 50.6336, name: 'Bahrain', country: 'Bahrain' },
    MCT: { lat: 23.5933, lon: 58.2844, name: 'Muscat', country: 'Oman' },

    // Asia
    HND: { lat: 35.5494, lon: 139.7798, name: 'Tokyo Haneda', country: 'Japan' },
    NRT: { lat: 35.7720, lon: 140.3929, name: 'Tokyo Narita', country: 'Japan' },
    KIX: { lat: 34.4347, lon: 135.2441, name: 'Osaka', country: 'Japan' },
    PEK: { lat: 40.0799, lon: 116.6031, name: 'Beijing', country: 'China' },
    PVG: { lat: 31.1443, lon: 121.8083, name: 'Shanghai', country: 'China' },
    CAN: { lat: 23.3924, lon: 113.2988, name: 'Guangzhou', country: 'China' },
    HKG: { lat: 22.3080, lon: 113.9185, name: 'Hong Kong', country: 'Hong Kong' },
    SIN: { lat: 1.3644, lon: 103.9915, name: 'Singapore', country: 'Singapore' },
    ICN: { lat: 37.4602, lon: 126.4407, name: 'Seoul Incheon', country: 'South Korea' },
    BKK: { lat: 13.6900, lon: 100.7501, name: 'Bangkok', country: 'Thailand' },
    KUL: { lat: 2.7456, lon: 101.7072, name: 'Kuala Lumpur', country: 'Malaysia' },
    CGK: { lat: -6.1256, lon: 106.6558, name: 'Jakarta', country: 'Indonesia' },
    MNL: { lat: 14.5086, lon: 121.0198, name: 'Manila', country: 'Philippines' },
    DEL: { lat: 28.5562, lon: 77.1000, name: 'Delhi', country: 'India' },
    BOM: { lat: 19.0896, lon: 72.8656, name: 'Mumbai', country: 'India' },
    BLR: { lat: 13.1986, lon: 77.7066, name: 'Bangalore', country: 'India' },
    HAN: { lat: 21.2212, lon: 105.8072, name: 'Hanoi', country: 'Vietnam' },
    SGN: { lat: 10.8188, lon: 106.6519, name: 'Ho Chi Minh', country: 'Vietnam' },
    TPE: { lat: 25.0797, lon: 121.2342, name: 'Taipei', country: 'Taiwan' },

    // Oceania
    SYD: { lat: -33.9399, lon: 151.1753, name: 'Sydney', country: 'Australia' },
    MEL: { lat: -37.6690, lon: 144.8410, name: 'Melbourne', country: 'Australia' },
    BNE: { lat: -27.3842, lon: 153.1175, name: 'Brisbane', country: 'Australia' },
    PER: { lat: -31.9403, lon: 115.9670, name: 'Perth', country: 'Australia' },
    AKL: { lat: -37.0082, lon: 174.7850, name: 'Auckland', country: 'New Zealand' },

    // South America
    GRU: { lat: -23.4356, lon: -46.4731, name: 'São Paulo', country: 'Brazil' },
    GIG: { lat: -22.8090, lon: -43.2506, name: 'Rio de Janeiro', country: 'Brazil' },
    EZE: { lat: -34.8222, lon: -58.5358, name: 'Buenos Aires', country: 'Argentina' },
    SCL: { lat: -33.3930, lon: -70.7858, name: 'Santiago', country: 'Chile' },
    BOG: { lat: 4.7016, lon: -74.1469, name: 'Bogotá', country: 'Colombia' },
    LIM: { lat: -12.0219, lon: -77.1143, name: 'Lima', country: 'Peru' },

    // Africa
    JNB: { lat: -26.1392, lon: 28.2460, name: 'Johannesburg', country: 'South Africa' },
    CPT: { lat: -33.9715, lon: 18.6021, name: 'Cape Town', country: 'South Africa' },
    CAI: { lat: 30.1219, lon: 31.4056, name: 'Cairo', country: 'Egypt' },
    ADD: { lat: 8.9779, lon: 38.7993, name: 'Addis Ababa', country: 'Ethiopia' },
    NBO: { lat: -1.3192, lon: 36.9278, name: 'Nairobi', country: 'Kenya' },
    LOS: { lat: 6.5774, lon: 3.3212, name: 'Lagos', country: 'Nigeria' },
    CMN: { lat: 33.3675, lon: -7.5898, name: 'Casablanca', country: 'Morocco' },
    ALG: { lat: 36.6910, lon: 3.2154, name: 'Algiers', country: 'Algeria' },
};

// All airlines for variety
const ALL_AIRLINES = [
    { code: 'AAL', name: 'American Airlines', country: 'United States' },
    { code: 'DAL', name: 'Delta Air Lines', country: 'United States' },
    { code: 'UAL', name: 'United Airlines', country: 'United States' },
    { code: 'SWA', name: 'Southwest Airlines', country: 'United States' },
    { code: 'JBU', name: 'JetBlue Airways', country: 'United States' },
    { code: 'AAY', name: 'Allegiant Air', country: 'United States' },
    { code: 'FFT', name: 'Frontier Airlines', country: 'United States' },
    { code: 'NKS', name: 'Spirit Airlines', country: 'United States' },
    { code: 'ASA', name: 'Alaska Airlines', country: 'United States' },
    { code: 'BAW', name: 'British Airways', country: 'United Kingdom' },
    { code: 'VIR', name: 'Virgin Atlantic', country: 'United Kingdom' },
    { code: 'EZY', name: 'easyJet', country: 'United Kingdom' },
    { code: 'AFR', name: 'Air France', country: 'France' },
    { code: 'DLH', name: 'Lufthansa', country: 'Germany' },
    { code: 'EWG', name: 'Eurowings', country: 'Germany' },
    { code: 'KLM', name: 'KLM Royal Dutch', country: 'Netherlands' },
    { code: 'IBE', name: 'Iberia', country: 'Spain' },
    { code: 'VLG', name: 'Vueling', country: 'Spain' },
    { code: 'AZA', name: 'ITA Airways', country: 'Italy' },
    { code: 'RYR', name: 'Ryanair', country: 'Ireland' },
    { code: 'THY', name: 'Turkish Airlines', country: 'Turkey' },
    { code: 'SWR', name: 'Swiss International', country: 'Switzerland' },
    { code: 'AUA', name: 'Austrian Airlines', country: 'Austria' },
    { code: 'SAS', name: 'Scandinavian Airlines', country: 'Scandinavia' },
    { code: 'FIN', name: 'Finnair', country: 'Finland' },
    { code: 'TAP', name: 'TAP Portugal', country: 'Portugal' },
    { code: 'UAE', name: 'Emirates', country: 'UAE' },
    { code: 'ETD', name: 'Etihad Airways', country: 'UAE' },
    { code: 'QTR', name: 'Qatar Airways', country: 'Qatar' },
    { code: 'ELY', name: 'El Al', country: 'Israel' },
    { code: 'SVA', name: 'Saudia', country: 'Saudi Arabia' },
    { code: 'GFA', name: 'Gulf Air', country: 'Bahrain' },
    { code: 'JAL', name: 'Japan Airlines', country: 'Japan' },
    { code: 'ANA', name: 'All Nippon Airways', country: 'Japan' },
    { code: 'CCA', name: 'Air China', country: 'China' },
    { code: 'CES', name: 'China Eastern', country: 'China' },
    { code: 'CSN', name: 'China Southern', country: 'China' },
    { code: 'CPA', name: 'Cathay Pacific', country: 'Hong Kong' },
    { code: 'SIA', name: 'Singapore Airlines', country: 'Singapore' },
    { code: 'KAL', name: 'Korean Air', country: 'South Korea' },
    { code: 'THA', name: 'Thai Airways', country: 'Thailand' },
    { code: 'MAS', name: 'Malaysia Airlines', country: 'Malaysia' },
    { code: 'GIA', name: 'Garuda Indonesia', country: 'Indonesia' },
    { code: 'PAL', name: 'Philippine Airlines', country: 'Philippines' },
    { code: 'AIC', name: 'Air India', country: 'India' },
    { code: 'IGO', name: 'IndiGo', country: 'India' },
    { code: 'HVN', name: 'Vietnam Airlines', country: 'Vietnam' },
    { code: 'EVA', name: 'EVA Air', country: 'Taiwan' },
    { code: 'QFA', name: 'Qantas', country: 'Australia' },
    { code: 'VOZ', name: 'Virgin Australia', country: 'Australia' },
    { code: 'ANZ', name: 'Air New Zealand', country: 'New Zealand' },
    { code: 'TAM', name: 'LATAM Airlines', country: 'Brazil' },
    { code: 'AVA', name: 'Avianca', country: 'Colombia' },
    { code: 'ARG', name: 'Aerolíneas Argentinas', country: 'Argentina' },
    { code: 'ACA', name: 'Air Canada', country: 'Canada' },
    { code: 'WJA', name: 'WestJet', country: 'Canada' },
    { code: 'AMX', name: 'Aeroméxico', country: 'Mexico' },
    { code: 'SAA', name: 'South African Airways', country: 'South Africa' },
    { code: 'ETH', name: 'Ethiopian Airlines', country: 'Ethiopia' },
    { code: 'KQA', name: 'Kenya Airways', country: 'Kenya' },
    { code: 'MSR', name: 'EgyptAir', country: 'Egypt' },
    { code: 'RAM', name: 'Royal Air Maroc', country: 'Morocco' },
];

// Aircraft types
const AIRCRAFT_TYPES = ['A320', 'A321', 'A330', 'A350', 'A380', 'B737', 'B738', 'B739', 'B752', 'B763', 'B772', 'B777', 'B788', 'B789', 'E190', 'E195', 'CRJ9'];
const AIRCRAFT_SPEEDS = { 'A320': 450, 'A321': 450, 'A330': 470, 'A350': 490, 'A380': 490, 'B737': 450, 'B738': 450, 'B739': 450, 'B752': 460, 'B763': 460, 'B772': 490, 'B777': 490, 'B788': 490, 'B789': 490, 'E190': 440, 'E195': 440, 'CRJ9': 430 };
const AIRCRAFT_CATEGORIES = { 'A320': 2, 'A321': 2, 'A330': 3, 'A350': 3, 'A380': 5, 'B737': 2, 'B738': 2, 'B739': 2, 'B752': 3, 'B763': 3, 'B772': 5, 'B777': 5, 'B788': 3, 'B789': 3, 'E190': 2, 'E195': 2, 'CRJ9': 1 };
const CATEGORY_LABELS = { 0: 'Unknown', 1: 'Regional Jet', 2: 'Narrow-body', 3: 'Wide-body', 4: 'High Vortex', 5: 'Heavy Aircraft' };

// Helper functions
const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 3440.065;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * Math.sin(dLon / 2) ** 2;
    return 2 * R * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const calculateBearing = (lat1, lon1, lat2, lon2) => {
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const lat1Rad = lat1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const y = Math.sin(dLon) * Math.cos(lat2Rad);
    const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
    return ((Math.atan2(y, x) * 180 / Math.PI) + 360) % 360;
};

const interpolatePosition = (lat1, lon1, lat2, lon2, fraction) => {
    const d = haversineDistance(lat1, lon1, lat2, lon2) / 3440.065;
    if (d < 0.0001) return { lat: lat1, lon: lon1 };
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;
    const a = Math.sin((1 - fraction) * d) / Math.sin(d);
    const b = Math.sin(fraction * d) / Math.sin(d);
    const x = a * Math.cos(lat1Rad) * Math.cos(lon1Rad) + b * Math.cos(lat2Rad) * Math.cos(lon2Rad);
    const y = a * Math.cos(lat1Rad) * Math.sin(lon1Rad) + b * Math.cos(lat2Rad) * Math.sin(lon2Rad);
    const z = a * Math.sin(lat1Rad) + b * Math.sin(lat2Rad);
    return { lat: Math.atan2(z, Math.sqrt(x ** 2 + y ** 2)) * 180 / Math.PI, lon: Math.atan2(y, x) * 180 / Math.PI };
};

// Generate all possible route pairs between airports
const generateAllRoutes = () => {
    const routes = [];
    const airportCodes = Object.keys(AIRPORTS);

    // Define regional groups for more realistic routing
    const regions = {
        northAmerica: ['JFK', 'LAX', 'ORD', 'ATL', 'DFW', 'DEN', 'SFO', 'SEA', 'MIA', 'BOS', 'PHX', 'LAS', 'MCO', 'EWR', 'MSP', 'DTW', 'PHL', 'CLT', 'IAH', 'SLC', 'DCA', 'SAN', 'TPA', 'PDX', 'YYZ', 'YVR', 'YUL', 'MEX', 'CUN'],
        europe: ['LHR', 'LGW', 'CDG', 'ORY', 'FRA', 'MUC', 'AMS', 'MAD', 'BCN', 'FCO', 'MXP', 'IST', 'ZRH', 'VIE', 'CPH', 'OSL', 'ARN', 'HEL', 'DUB', 'LIS', 'BRU', 'WAW', 'PRG', 'ATH'],
        middleEast: ['DXB', 'AUH', 'DOH', 'TLV', 'RUH', 'JED', 'AMM', 'KWI', 'BAH', 'MCT'],
        asia: ['HND', 'NRT', 'KIX', 'PEK', 'PVG', 'CAN', 'HKG', 'SIN', 'ICN', 'BKK', 'KUL', 'CGK', 'MNL', 'DEL', 'BOM', 'BLR', 'HAN', 'SGN', 'TPE'],
        oceania: ['SYD', 'MEL', 'BNE', 'PER', 'AKL'],
        southAmerica: ['GRU', 'GIG', 'EZE', 'SCL', 'BOG', 'LIM'],
        africa: ['JNB', 'CPT', 'CAI', 'ADD', 'NBO', 'LOS', 'CMN', 'ALG'],
    };

    // Helper to pick random airline
    const pickAirline = () => ALL_AIRLINES[Math.floor(Math.random() * ALL_AIRLINES.length)];
    const pickAircraft = () => AIRCRAFT_TYPES[Math.floor(Math.random() * AIRCRAFT_TYPES.length)];

    // Generate intra-regional routes (high density)
    Object.values(regions).forEach(region => {
        for (let i = 0; i < region.length; i++) {
            for (let j = i + 1; j < region.length; j++) {
                if (Math.random() < 0.6) { // 60% chance of route existing
                    const from = region[i];
                    const to = region[j];
                    const dist = haversineDistance(AIRPORTS[from].lat, AIRPORTS[from].lon, AIRPORTS[to].lat, AIRPORTS[to].lon);
                    const duration = Math.round((dist / 450) * 60); // minutes
                    if (duration > 30 && duration < 400) {
                        const airline = pickAirline();
                        routes.push({ from, to, airline: airline.code, airlineName: airline.name, aircraft: pickAircraft(), duration });
                        routes.push({ from: to, to: from, airline: airline.code, airlineName: airline.name, aircraft: pickAircraft(), duration });
                    }
                }
            }
        }
    });

    // Generate inter-regional routes (major hubs)
    const majorHubs = {
        northAmerica: ['JFK', 'LAX', 'ORD', 'ATL', 'MIA', 'SFO', 'YYZ'],
        europe: ['LHR', 'CDG', 'FRA', 'AMS', 'MAD', 'IST'],
        middleEast: ['DXB', 'DOH', 'AUH'],
        asia: ['HND', 'PEK', 'HKG', 'SIN', 'ICN', 'BKK', 'DEL'],
        oceania: ['SYD', 'MEL'],
        southAmerica: ['GRU', 'EZE', 'BOG'],
        africa: ['JNB', 'CAI', 'ADD'],
    };

    const regionNames = Object.keys(majorHubs);
    for (let r1 = 0; r1 < regionNames.length; r1++) {
        for (let r2 = r1 + 1; r2 < regionNames.length; r2++) {
            const hubs1 = majorHubs[regionNames[r1]];
            const hubs2 = majorHubs[regionNames[r2]];
            hubs1.forEach(h1 => {
                hubs2.forEach(h2 => {
                    if (Math.random() < 0.4) {
                        const dist = haversineDistance(AIRPORTS[h1].lat, AIRPORTS[h1].lon, AIRPORTS[h2].lat, AIRPORTS[h2].lon);
                        const duration = Math.round((dist / 480) * 60);
                        if (duration > 120) {
                            const airline = pickAirline();
                            routes.push({ from: h1, to: h2, airline: airline.code, airlineName: airline.name, aircraft: pickAircraft(), duration });
                            routes.push({ from: h2, to: h1, airline: airline.code, airlineName: airline.name, aircraft: pickAircraft(), duration });
                        }
                    }
                });
            });
        }
    }

    return routes;
};

// Store active flights
let activeFlights = [];
let lastUpdateTime = Date.now();
let allRoutes = [];

// Initialize with many flights
const initializeFlights = () => {
    activeFlights = [];
    allRoutes = generateAllRoutes();
    const now = Date.now();

    console.log(`Generated ${allRoutes.length} routes`);

    // Create 2-4 flights per route at different stages
    allRoutes.forEach((route, routeIndex) => {
        const flightCount = 2 + Math.floor(Math.random() * 3); // 2-4 flights per route

        for (let i = 0; i < flightCount; i++) {
            const origin = AIRPORTS[route.from];
            const destination = AIRPORTS[route.to];
            if (!origin || !destination) continue;

            // Allow full range of progress to populate ground states immediately
            const progress = Math.random();
            const flightDurationMs = route.duration * 60 * 1000;
            const departureTime = now - (progress * flightDurationMs);

            const icao24 = `${routeIndex.toString(16).padStart(4, '0')}${i.toString(16)}${Math.random().toString(16).substr(2, 2)}`;
            const flightNum = (100 + Math.floor(Math.random() * 9000)).toString();
            const callsign = `${route.airline}${flightNum}`;

            const pos = interpolatePosition(origin.lat, origin.lon, destination.lat, destination.lon, progress);

            // Altitude profile
            const cruiseAlt = 28000 + Math.floor(Math.random() * 13000);
            let altitude;
            if (progress < 0.15) altitude = (progress / 0.15) * cruiseAlt;
            else if (progress > 0.85) altitude = ((1 - progress) / 0.15) * cruiseAlt;
            else altitude = cruiseAlt;

            // Initial ground logic matching updateFlights
            const isTaxiing = progress < 0.02 || progress > 0.98;
            const onGround = isTaxiing || altitude < 100;
            if (onGround) altitude = 0;

            const bearing = calculateBearing(origin.lat, origin.lon, destination.lat, destination.lon);
            const speed = AIRCRAFT_SPEEDS[route.aircraft] || 450;

            let verticalRate = 0;
            if (!onGround) {
                if (progress < 0.15) verticalRate = 1500 + Math.random() * 500;
                else if (progress > 0.85) verticalRate = -(1200 + Math.random() * 400);
            }

            activeFlights.push({
                icao24,
                callsign,
                flightNumber: callsign,
                route,
                origin,
                destination,
                departureTime,
                progress,
                latitude: pos.lat,
                longitude: pos.lon,
                baroAltitude: altitude * 0.3048,
                geoAltitude: altitude * 0.3048,
                velocity: onGround ? 15 : speed * 0.514444,
                trueTrack: bearing,
                verticalRate: verticalRate * 0.00508,
                onGround: onGround,
                originCountry: origin.country,
                squawk: (1200 + Math.floor(Math.random() * 6000)).toString().padStart(4, '0'),
                category: AIRCRAFT_CATEGORIES[route.aircraft] || 2,
                categoryLabel: CATEGORY_LABELS[AIRCRAFT_CATEGORIES[route.aircraft]] || 'Narrow-body',
                lastContact: Math.floor(now / 1000),
                timePosition: Math.floor(now / 1000),
                airline: route.airlineName,
                airlineCountry: ALL_AIRLINES.find(a => a.code === route.airline)?.country || null,
                aircraftType: route.aircraft,
                registration: `SIM-${icao24.substring(0, 4).toUpperCase()}`,
            });
        }
    });

    console.log(`Initialized ${activeFlights.length} flights`);
    lastUpdateTime = now;
    return activeFlights;
};

// Update flight positions
const updateFlights = () => {
    const now = Date.now();
    lastUpdateTime = now;

    activeFlights = activeFlights.map(flight => {
        // Handle fligts in turnaround (parked at gate)
        if (flight.nextDepartureTime) {
            if (now >= flight.nextDepartureTime) {
                // Depart on new route!
                const progress = 0.0;
                const flightDurationMs = flight.route.duration * 60 * 1000;
                const departureTime = now;

                return {
                    ...flight,
                    departureTime,
                    nextDepartureTime: null, // Clear turnaround
                    progress,
                    onGround: true, // Starting taxi
                    velocity: 15, // Taxi speed ~30kts
                    verticalRate: 0,
                    baroAltitude: 0,
                    geoAltitude: 0,
                };
            } else {
                // Still waiting at gate
                return {
                    ...flight,
                    onGround: true,
                    velocity: 0,
                    verticalRate: 0,
                    baroAltitude: 0,
                    geoAltitude: 0,
                };
            }
        }

        const flightDurationMs = flight.route.duration * 60 * 1000;
        const newProgress = (now - flight.departureTime) / flightDurationMs;

        // Valid flight progress
        if (newProgress >= 1) {
            // Flight arrived! Schedule turnaround (15-45 mins simulated)
            const turnaroundMs = (60 + Math.random() * 120) * 1000; // 1-3 mins real time for demo

            return {
                ...flight,
                nextDepartureTime: now + turnaroundMs,
                progress: 1,
                onGround: true,
                velocity: 0,
                baroAltitude: 0,
                geoAltitude: 0
            };
        }

        const pos = interpolatePosition(flight.origin.lat, flight.origin.lon, flight.destination.lat, flight.destination.lon, newProgress);

        const cruiseAltFt = (flight.baroAltitude / 0.3048) > 25000 ? (flight.baroAltitude / 0.3048) : 35000;
        let altitude;
        if (newProgress < 0.15) altitude = (newProgress / 0.15) * cruiseAltFt;
        else if (newProgress > 0.85) altitude = ((1 - newProgress) / 0.15) * cruiseAltFt;
        else altitude = cruiseAltFt;

        // Ground logic: Taxiing at start/end
        const isTaxiing = newProgress < 0.02 || newProgress > 0.98;
        const onGround = isTaxiing || altitude < 100;

        if (onGround) altitude = 0;

        let verticalRate = 0;
        if (!onGround) {
            if (newProgress < 0.15) verticalRate = 1500 + Math.random() * 500;
            else if (newProgress > 0.85) verticalRate = -(1200 + Math.random() * 400);
        }

        const nextProgress = Math.min(newProgress + 0.01, 1);
        const nextPos = interpolatePosition(flight.origin.lat, flight.origin.lon, flight.destination.lat, flight.destination.lon, nextProgress);
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
            onGround: onGround,
            velocity: onGround ? 15 : (flight.route.aircraft ? AIRCRAFT_SPEEDS[flight.route.aircraft] : 450) * 0.514,
            lastContact: Math.floor(now / 1000),
            timePosition: Math.floor(now / 1000),
        };
    });

    return activeFlights;
};

export const getSimulatedFlights = (bbox) => {
    if (activeFlights.length === 0) initializeFlights();
    else updateFlights();

    const { lamin, lomin, lamax, lomax } = bbox;
    const margin = 10;
    return activeFlights.filter(f =>
        f.latitude >= (lamin - margin) && f.latitude <= (lamax + margin) &&
        f.longitude >= (lomin - margin) && f.longitude <= (lomax + margin)
    );
};

export const searchSimulatedFlight = (callsign) => {
    if (activeFlights.length === 0) initializeFlights();
    const searchTerm = callsign.toUpperCase().trim();
    return activeFlights.find(f => f.callsign.toUpperCase().includes(searchTerm)) || null;
};

export const getAllSimulatedFlights = () => {
    if (activeFlights.length === 0) initializeFlights();
    else updateFlights();
    return [...activeFlights];
};

initializeFlights();

export { AIRPORTS, ALL_AIRLINES };
