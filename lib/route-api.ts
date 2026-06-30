import { FlightRoute } from './types';

// Cache for route lookups to avoid repeated API calls
const routeCache = new Map<string, { route: FlightRoute | null; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch flight route from adsbdb.com (primary source)
 */
async function fetchFromAdsbdb(callsign: string): Promise<FlightRoute | null> {
  try {
    console.log(`[ADSBDB] Fetching route for: ${callsign}`);
    const response = await fetch(
      `https://api.adsbdb.com/v0/callsign/${callsign}`,
      {
        headers: { 'Accept': 'application/json' },
        cache: 'force-cache',
      }
    );

    console.log(`[ADSBDB] Response status: ${response.status}`);
    if (!response.ok) {
      console.log(`[ADSBDB] Failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`[ADSBDB] Response data:`, data);
    
    if (!data.response) {
      console.log(`[ADSBDB] No response field in data`);
      return null;
    }

    const route: FlightRoute = {
      callsign,
      origin: data.response.route?.origin ? {
        icao: data.response.route.origin.icao_code,
        iata: data.response.route.origin.iata_code,
        name: data.response.route.origin.name,
        city: data.response.route.origin.municipality,
        country: data.response.route.origin.country_name,
      } : undefined,
      destination: data.response.route?.destination ? {
        icao: data.response.route.destination.icao_code,
        iata: data.response.route.destination.iata_code,
        name: data.response.route.destination.name,
        city: data.response.route.destination.municipality,
        country: data.response.route.destination.country_name,
      } : undefined,
    };

    const hasRoute = route.origin || route.destination;
    console.log(`[ADSBDB] Route found: ${hasRoute}`, route);
    return hasRoute ? route : null;
  } catch (error) {
    console.error(`[ADSBDB] Error for ${callsign}:`, error);
    return null;
  }
}

/**
 * Fetch flight route from hexdb.io (fallback)
 */
async function fetchFromHexdb(callsign: string): Promise<FlightRoute | null> {
  try {
    console.log(`[HEXDB] Fetching route for: ${callsign}`);
    const response = await fetch(
      `https://hexdb.io/api/v1/route/${callsign}`,
      {
        headers: { 'Accept': 'application/json' },
        cache: 'force-cache',
      }
    );

    console.log(`[HEXDB] Response status: ${response.status}`);
    if (!response.ok) {
      console.log(`[HEXDB] Failed with status: ${response.status}`);
      return null;
    }

    const data = await response.json();
    console.log(`[HEXDB] Response data:`, data);

    const route: FlightRoute = {
      callsign,
      origin: data.origin ? {
        icao: data.origin.icao,
        iata: data.origin.iata,
        name: data.origin.name,
        city: data.origin.city,
        country: data.origin.country,
      } : undefined,
      destination: data.destination ? {
        icao: data.destination.icao,
        iata: data.destination.iata,
        name: data.destination.name,
        city: data.destination.city,
        country: data.destination.country,
      } : undefined,
    };

    const hasRoute = route.origin || route.destination;
    console.log(`[HEXDB] Route found: ${hasRoute}`, route);
    return hasRoute ? route : null;
  } catch (error) {
    console.error(`[HEXDB] Error for ${callsign}:`, error);
    return null;
  }
}

/**
 * Fetch flight route information with fallback sources
 * Tries adsbdb.com first (better data), then hexdb.io
 * Free APIs, no authentication required
 */
export async function fetchFlightRoute(callsign: string): Promise<FlightRoute | null> {
  if (!callsign || callsign.trim().length === 0) {
    console.log('[ROUTE] No callsign provided');
    return null;
  }

  const cleanCallsign = callsign.trim().toUpperCase();
  console.log(`[ROUTE] Looking up route for: ${cleanCallsign}`);
  
  // Check cache
  const cached = routeCache.get(cleanCallsign);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    console.log(`[ROUTE] Using cached route for: ${cleanCallsign}`, cached.route);
    return cached.route;
  }

  try {
    // Try adsbdb.com first (primary source - better data)
    let route = await fetchFromAdsbdb(cleanCallsign);
    
    // Fallback to hexdb.io if adsbdb has no data
    if (!route) {
      console.log(`[ROUTE] ADSBDB had no data, trying HEXDB...`);
      route = await fetchFromHexdb(cleanCallsign);
    }

    // Cache the result (even if null)
    routeCache.set(cleanCallsign, { 
      route: route || null, 
      timestamp: Date.now() 
    });

    console.log(`[ROUTE] Final route for ${cleanCallsign}:`, route);
    return route;
  } catch (error) {
    console.error(`[ROUTE] Error fetching route for ${cleanCallsign}:`, error);
    routeCache.set(cleanCallsign, { route: null, timestamp: Date.now() });
    return null;
  }
}

/**
 * Format airport for display
 */
export function formatAirport(airport?: { icao?: string; iata?: string; name?: string; city?: string }): string {
  if (!airport) return 'Unknown';
  
  const code = airport.iata || airport.icao || '';
  const location = airport.city || airport.name || '';
  
  if (code && location) {
    return `${code} (${location})`;
  }
  if (code) {
    return code;
  }
  if (location) {
    return location;
  }
  return 'Unknown';
}
