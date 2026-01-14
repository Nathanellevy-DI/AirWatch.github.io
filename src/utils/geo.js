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
