/**
 * Client-side Rate Limiter
 * Prevents the application from spamming external APIs
 * Token Bucket implementation
 */

export class RateLimiter {
    /**
     * @param {number} maxRequests - Max requests allowed in the time window
     * @param {number} windowMs - Time window in milliseconds
     */
    constructor(maxRequests, windowMs) {
        this.maxRequests = maxRequests;
        this.windowMs = windowMs;
        this.tokens = maxRequests;
        this.lastRefill = Date.now();
    }

    refill() {
        const now = Date.now();
        const timePassed = now - this.lastRefill;
        const tokensToAdd = (timePassed / this.windowMs) * this.maxRequests;

        if (tokensToAdd > 0) {
            this.tokens = Math.min(this.maxRequests, this.tokens + tokensToAdd);
            this.lastRefill = now;
        }
    }

    /**
     * Attempt to consume a token
     * @returns {boolean} - True if allowed, false if rate limited
     */
    tryAcquire() {
        this.refill();
        if (this.tokens >= 1) {
            this.tokens -= 1;
            return true;
        }
        return false;
    }

    /**
     * Returns time to wait in ms
     */
    getTimeToWait() {
        this.refill();
        if (this.tokens >= 1) return 0;

        const tokensNeeded = 1 - this.tokens;
        // rate = maxRequests / windowMs
        // time = tokens / rate
        return (tokensNeeded / (this.maxRequests / this.windowMs));
    }
}

// Global limiters for different APIs
// OpenSky: Free is ~400 req/day for anon, more for auth. Safe default: 1 req per 5s (anon)
export const openSkyLimiter = new RateLimiter(1, 5000);

// ADSB.lol: "No rate limits" but let's be polite to avoid IP ban. 5 req per 1s.
export const adsbLimiter = new RateLimiter(5, 1000);
