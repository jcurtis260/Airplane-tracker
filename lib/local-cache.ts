/**
 * Local browser cache for flight data that doesn't change frequently
 * Reduces API load significantly while keeping real-time tracking accurate
 */

const CACHE_KEYS = {
  ROUTES: 'airplane-tracker-routes',
  AIRCRAFT: 'airplane-tracker-aircraft',
};

const CACHE_DURATION = {
  ROUTES: 24 * 60 * 60 * 1000, // 24 hours - routes rarely change
  AIRCRAFT: 7 * 24 * 60 * 60 * 1000, // 7 days - aircraft details rarely change
};

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresAt: number;
}

/**
 * Get item from cache if not expired
 */
function getCacheItem<T>(key: string): T | null {
  if (typeof window === 'undefined') return null;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;

    const entry: CacheEntry<T> = JSON.parse(item);
    
    // Check if expired
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(key);
      return null;
    }

    return entry.data;
  } catch (error) {
    console.error('Cache read error:', error);
    return null;
  }
}

/**
 * Set item in cache with expiration
 */
function setCacheItem<T>(key: string, data: T, ttl: number): void {
  if (typeof window === 'undefined') return;
  
  try {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      expiresAt: Date.now() + ttl,
    };

    localStorage.setItem(key, JSON.stringify(entry));
  } catch (error) {
    console.error('Cache write error:', error);
    // Ignore quota errors - cache is optional
  }
}

/**
 * Get all cached routes
 */
export function getCachedRoutes(): Map<string, any> {
  const cached = getCacheItem<Record<string, any>>(CACHE_KEYS.ROUTES);
  return cached ? new Map(Object.entries(cached)) : new Map();
}

/**
 * Cache a flight route
 */
export function cacheRoute(callsign: string, route: any): void {
  const routes = getCachedRoutes();
  routes.set(callsign.toUpperCase(), route);
  
  // Convert Map to object for storage
  const routesObj = Object.fromEntries(routes);
  setCacheItem(CACHE_KEYS.ROUTES, routesObj, CACHE_DURATION.ROUTES);
}

/**
 * Get a specific cached route
 */
export function getCachedRoute(callsign: string): any | null {
  const routes = getCachedRoutes();
  return routes.get(callsign.toUpperCase()) || null;
}

/**
 * Get all cached aircraft metadata
 */
export function getCachedAircraft(): Map<string, any> {
  const cached = getCacheItem<Record<string, any>>(CACHE_KEYS.AIRCRAFT);
  return cached ? new Map(Object.entries(cached)) : new Map();
}

/**
 * Cache aircraft metadata (registration, type, etc.)
 */
export function cacheAircraft(hex: string, metadata: any): void {
  const aircraft = getCachedAircraft();
  aircraft.set(hex.toUpperCase(), metadata);
  
  // Convert Map to object for storage
  const aircraftObj = Object.fromEntries(aircraft);
  setCacheItem(CACHE_KEYS.AIRCRAFT, aircraftObj, CACHE_DURATION.AIRCRAFT);
}

/**
 * Get cached aircraft metadata
 */
export function getCachedAircraftMetadata(hex: string): any | null {
  const aircraft = getCachedAircraft();
  return aircraft.get(hex.toUpperCase()) || null;
}

/**
 * Clear all caches (useful for debugging)
 */
export function clearAllCaches(): void {
  if (typeof window === 'undefined') return;
  
  Object.values(CACHE_KEYS).forEach(key => {
    localStorage.removeItem(key);
  });
  
  console.log('All caches cleared');
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  const routes = getCachedRoutes();
  const aircraft = getCachedAircraft();
  
  return {
    routes: {
      count: routes.size,
      ttl: '24 hours',
    },
    aircraft: {
      count: aircraft.size,
      ttl: '7 days',
    },
    totalSize: routes.size + aircraft.size,
  };
}

/**
 * Get cache size in approximate bytes
 */
export function getCacheSizeEstimate(): string {
  try {
    let totalSize = 0;
    for (const key of Object.values(CACHE_KEYS)) {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length * 2; // 2 bytes per char in UTF-16
      }
    }
    
    if (totalSize < 1024) return `${totalSize} bytes`;
    if (totalSize < 1024 * 1024) return `${Math.round(totalSize / 1024)} KB`;
    return `${(totalSize / (1024 * 1024)).toFixed(2)} MB`;
  } catch {
    return 'Unknown';
  }
}
