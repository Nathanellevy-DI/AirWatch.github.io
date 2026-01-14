/**
 * Generates a bounding box for OpenSky API
 * @param {number} lat - User latitude
 * @param {number} lon - User longitude
 * @param {number} distanceKm - Radius in kilometers (default 100)
 * @returns {Object} Bounding box with lamin, lomin, lamax, lomax
 */
export const getBBox = (lat, lon, distanceKm = 100) => {
    const earthRadius = 6371; // km

    // Latitude offset
    const latDelta = (distanceKm / earthRadius) * (180 / Math.PI);

    // Longitude offset (adjusts based on how far from the equator you are)
    const lonDelta = (distanceKm / (earthRadius * Math.cos(lat * Math.PI / 180))) * (180 / Math.PI);

    return {
        lamin: lat - latDelta,
        lomin: lon - lonDelta,
        lamax: lat + latDelta,
        lomax: lon + lonDelta
    };
};

/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - First point latitude
 * @param {number} lon1 - First point longitude
 * @param {number} lat2 - Second point latitude
 * @param {number} lon2 - Second point longitude
 * @returns {number} Distance in kilometers
 */
export const getDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
};

/**
 * Format distance for display
 * @param {number} km - Distance in kilometers
 * @returns {string} Formatted distance string
 */
export const formatDistance = (km) => {
    if (km < 1) {
        return `${Math.round(km * 1000)}m`;
    }
    return `${km.toFixed(1)}km`;
};

/**
 * Convert meters to feet
 * @param {number} meters - Altitude in meters
 * @returns {number} Altitude in feet
 */
export const metersToFeet = (meters) => {
    return Math.round(meters * 3.28084);
};

/**
 * Convert m/s to knots
 * @param {number} ms - Speed in meters per second
 * @returns {number} Speed in knots
 */
export const msToKnots = (ms) => {
    return Math.round(ms * 1.94384);
};

/**
 * Convert m/s to feet per minute (for vertical rate)
 * @param {number} ms - Vertical rate in meters per second
 * @returns {number} Vertical rate in feet per minute
 */
export const msToFpm = (ms) => {
    return Math.round(ms * 196.85);
};

/**
 * Calculate an intermediate point between two coordinates along a Great Circle path
 * @param {number} lat1 
 * @param {number} lon1 
 * @param {number} lat2 
 * @param {number} lon2 
 * @param {number} fraction (0 to 1)
 * @returns {Object} {lat, lon}
 */
export const calculateIntermediatePoint = (lat1, lon1, lat2, lon2, fraction) => {
    const lat1Rad = lat1 * Math.PI / 180;
    const lon1Rad = lon1 * Math.PI / 180;
    const lat2Rad = lat2 * Math.PI / 180;
    const lon2Rad = lon2 * Math.PI / 180;

    const dLon = lon2Rad - lon1Rad;
    const dLat = lat2Rad - lat1Rad;

    // Angular distance calculation
    const a = Math.sin(dLat / 2) ** 2 + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon / 2) ** 2;
    const d = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    // Handle coincident points
    if (d < 1e-6) return { lat: lat1, lon: lon1 };

    const A = Math.sin((1 - fraction) * d) / Math.sin(d);
    const B = Math.sin(fraction * d) / Math.sin(d);

    const x = A * Math.cos(lat1Rad) * Math.cos(lon1Rad) + B * Math.cos(lat2Rad) * Math.cos(lon2Rad);
    const y = A * Math.cos(lat1Rad) * Math.sin(lon1Rad) + B * Math.cos(lat2Rad) * Math.sin(lon2Rad);
    const z = A * Math.sin(lat1Rad) + B * Math.sin(lat2Rad);

    const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
    const lon = Math.atan2(y, x);

    return {
        lat: lat * 180 / Math.PI,
        lon: lon * 180 / Math.PI
    };
};

/**
 * Generate a set of points representing a geodesic path
 * @param {Object} start {lat, lon}
 * @param {Object} end {lat, lon}
 * @param {number} numPoints 
 * @returns {Array} Array of [lat, lon] arrays
 */
export const generateGeodesicPath = (start, end, numPoints = 100) => {
    const points = [];
    for (let i = 0; i <= numPoints; i++) {
        const p = calculateIntermediatePoint(
            start.lat, start.lon,
            end.lat, end.lon,
            i / numPoints
        );
        points.push([p.lat, p.lon]);
    }
    return points;
};
