import { FlightRoute } from './types';

// Cache for route lookups to avoid repeated API calls
const routeCache = new Map<string, { route: FlightRoute | null; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour in milliseconds

/**
 * Fetch flight route information from hexdb.io
 * Free API, no authentication required
 */
export async function fetchFlightRoute(callsign: string): Promise<FlightRoute | null> {
  if (!callsign || callsign.trim().length === 0) {
    return null;
  }

  const cleanCallsign = callsign.trim().toUpperCase();
  
  // Check cache
  const cached = routeCache.get(cleanCallsign);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.route;
  }

  try {
    // Use hexdb.io - free, no auth required
    const response = await fetch(
      `https://hexdb.io/api/v1/aircraft/${cleanCallsign}`,
      {
        headers: { 'Accept': 'application/json' },
        next: { revalidate: 3600 }, // Cache for 1 hour
      }
    );

    if (!response.ok) {
      routeCache.set(cleanCallsign, { route: null, timestamp: Date.now() });
      return null;
    }

    const data = await response.json();

    // Extract route information from hexdb response
    const route: FlightRoute = {
      callsign: cleanCallsign,
      origin: data.route?.origin ? {
        icao: data.route.origin.icao,
        iata: data.route.origin.iata,
        name: data.route.origin.name,
        city: data.route.origin.city,
        country: data.route.origin.country,
      } : undefined,
      destination: data.route?.destination ? {
        icao: data.route.destination.icao,
        iata: data.route.destination.iata,
        name: data.route.destination.name,
        city: data.route.destination.city,
        country: data.route.destination.country,
      } : undefined,
    };

    // Cache the result
    routeCache.set(cleanCallsign, { route, timestamp: Date.now() });

    return route;
  } catch (error) {
    console.error(`Error fetching route for ${cleanCallsign}:`, error);
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
