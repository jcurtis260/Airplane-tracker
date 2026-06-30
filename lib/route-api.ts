import { FlightRoute } from './types';

/**
 * Fetch flight route information via server-side API proxy
 * This avoids CORS issues by routing through our Next.js API
 */
export async function fetchFlightRoute(callsign: string): Promise<FlightRoute | null> {
  if (!callsign || callsign.trim().length === 0) {
    console.log('[CLIENT][ROUTE] No callsign provided');
    return null;
  }

  const cleanCallsign = callsign.trim().toUpperCase();
  console.log(`[CLIENT][ROUTE] Fetching route for: ${cleanCallsign}`);
  
  try {
    const response = await fetch(`/api/route?callsign=${encodeURIComponent(cleanCallsign)}`);
    
    if (!response.ok) {
      console.error(`[CLIENT][ROUTE] API error: ${response.status}`);
      return null;
    }

    const route = await response.json();
    console.log(`[CLIENT][ROUTE] Received route for ${cleanCallsign}:`, route);
    
    return route;
  } catch (error) {
    console.error(`[CLIENT][ROUTE] Error fetching route for ${cleanCallsign}:`, error);
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
