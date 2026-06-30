import { FlightRoute } from './types';
import { getCachedRoute, cacheRoute } from './local-cache';

/**
 * Fetch flight route information via server-side API proxy
 * Uses local browser cache (24h TTL) to reduce API load
 */
export async function fetchFlightRoute(callsign: string): Promise<FlightRoute | null> {
  if (!callsign || callsign.trim().length === 0) {
    console.log('[CLIENT][ROUTE] No callsign provided');
    return null;
  }

  const cleanCallsign = callsign.trim().toUpperCase().replace(/\s+/g, '');
  
  // Check local cache first (24 hour TTL)
  const cachedRoute = getCachedRoute(cleanCallsign);
  if (cachedRoute !== null) {
    console.log(`[CLIENT][ROUTE] 💾 Using cached route for: ${cleanCallsign}`);
    return cachedRoute;
  }
  
  console.log(`[CLIENT][ROUTE] 🔍 Fetching route for: ${cleanCallsign}`);
  
  try {
    const response = await fetch(`/api/route?callsign=${encodeURIComponent(cleanCallsign)}`, {
      headers: {
        'Accept': 'application/json',
      },
    });
    
    if (!response.ok) {
      console.warn(`[CLIENT][ROUTE] ⚠️  API returned ${response.status} for ${cleanCallsign}`);
      // Cache null result to avoid repeated failed lookups
      cacheRoute(cleanCallsign, null);
      return null;
    }

    const route = await response.json();
    
    // Cache the result (even if null)
    cacheRoute(cleanCallsign, route);
    
    if (route && (route.origin || route.destination)) {
      console.log(`[CLIENT][ROUTE] ✅ Route found for ${cleanCallsign}:`, 
        `${route.origin?.iata || route.origin?.icao || '?'} → ${route.destination?.iata || route.destination?.icao || '?'}`);
      return route;
    } else {
      console.log(`[CLIENT][ROUTE] ❌ No route data available for ${cleanCallsign}`);
      return null;
    }
  } catch (error) {
    console.error(`[CLIENT][ROUTE] ❌ Error fetching route for ${cleanCallsign}:`, error);
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
