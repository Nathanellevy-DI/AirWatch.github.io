/**
 * Input validation schemas and utilities
 * Follows OWASP recommendations for input strictness
 */

/**
 * Validates a bounding box object
 * @param {Object} bbox - { lamin, lomin, lamax, lomax }
 * @returns {boolean} - True if valid
 */
export const validateBBox = (bbox) => {
    if (!bbox || typeof bbox !== 'object') return false;

    const { lamin, lomin, lamax, lomax } = bbox;

    // Type check
    if (typeof lamin !== 'number' || typeof lomin !== 'number' ||
        typeof lamax !== 'number' || typeof lomax !== 'number') {
        return false;
    }

    // Range check
    if (lamin < -90 || lamin > 90 || lamax < -90 || lamax > 90) return false;
    if (lomin < -180 || lomin > 180 || lomax < -180 || lomax > 180) return false;

    // Logic check (min < max)
    if (lamin > lamax) return false;
    // Longitude can wrap, but for basic box it's usually min < max unless crossing anti-meridian
    // For simplicity validation we'll enforce min < max or handle logic elsewhere.
    // Let's just ensure they are valid coordinates for now.

    return true;
};

/**
 * Validates a callsign / flight number
 * @param {string} callsign - The callsign to search
 * @returns {boolean} - True if valid
 */
export const validateCallsign = (callsign) => {
    if (!callsign || typeof callsign !== 'string') return false;

    const trimmed = callsign.trim();

    // Length check (ICAO callsigns are usually 3-8 chars)
    if (trimmed.length < 2 || trimmed.length > 10) return false;

    // Alphanumeric check (prevent XSS/Injection vectors)
    // Only allow letters and numbers
    const callsignRegex = /^[A-Z0-9]+$/i;
    return callsignRegex.test(trimmed);
};

/**
 * Validates a standard ICAO24 hex code
 * @param {string} icao24 
 * @returns {boolean}
 */
export const validateICAO24 = (icao24) => {
    if (!icao24 || typeof icao24 !== 'string') return false;
    const trimmed = icao24.trim();
    if (trimmed.length !== 6) return false;
    const hexRegex = /^[0-9A-Fa-f]{6}$/;
    return hexRegex.test(trimmed);
};
