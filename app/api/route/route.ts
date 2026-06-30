import { NextRequest, NextResponse } from 'next/server';
import { FlightRoute } from '@/lib/types';

// In-memory cache for route lookups
const routeCache = new Map<string, { route: FlightRoute | null; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Fetch flight route from adsbdb.com (primary source)
 * Also tries registration-based lookup as fallback
 */
async function fetchFromAdsbdb(callsign: string, registration?: string): Promise<FlightRoute | null> {
  try {
    console.log(`[SERVER][ADSBDB] Fetching route for: ${callsign}`);
    const response = await fetch(
      `https://api.adsbdb.com/v0/callsign/${callsign}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Airplane-Tracker/1.0'
        },
      }
    );

    console.log(`[SERVER][ADSBDB] Response status: ${response.status}`);
    if (!response.ok) {
      const text = await response.text();
      console.log(`[SERVER][ADSBDB] Failed response:`, text);
      return null;
    }

    let data = await response.json();
    console.log(`[SERVER][ADSBDB] Response data:`, JSON.stringify(data, null, 2));
    
    if (!data.response || !data.response.flightroute) {
      console.log(`[SERVER][ADSBDB] No flightroute in response`);
      
      // Try registration-based lookup if available
      if (registration && registration !== callsign) {
        console.log(`[SERVER][ADSBDB] Trying registration lookup: ${registration}`);
        try {
          const regResponse = await fetch(
            `https://api.adsbdb.com/v0/callsign/${registration}`,
            {
              headers: { 
                'Accept': 'application/json',
                'User-Agent': 'Airplane-Tracker/1.0'
              },
            }
          );
          if (regResponse.ok) {
            const regData = await regResponse.json();
            if (regData.response?.flightroute) {
              data = regData;
              console.log(`[SERVER][ADSBDB] Found via registration!`);
            }
          }
        } catch (e) {
          console.log(`[SERVER][ADSBDB] Registration lookup failed`);
        }
      }
      
      if (!data.response?.flightroute) {
        return null;
      }
    }

    const route: FlightRoute = {
      callsign,
      origin: data.response.flightroute?.origin ? {
        icao: data.response.flightroute.origin.icao_code,
        iata: data.response.flightroute.origin.iata_code,
        name: data.response.flightroute.origin.name,
        city: data.response.flightroute.origin.municipality,
        country: data.response.flightroute.origin.country_name,
      } : undefined,
      destination: data.response.flightroute?.destination ? {
        icao: data.response.flightroute.destination.icao_code,
        iata: data.response.flightroute.destination.iata_code,
        name: data.response.flightroute.destination.name,
        city: data.response.flightroute.destination.municipality,
        country: data.response.flightroute.destination.country_name,
      } : undefined,
    };

    const hasRoute = route.origin || route.destination;
    console.log(`[SERVER][ADSBDB] Route found: ${hasRoute}`, route);
    return hasRoute ? route : null;
  } catch (error) {
    console.error(`[SERVER][ADSBDB] Error for ${callsign}:`, error);
    return null;
  }
}

/**
 * Fetch airport details from hexdb.io
 */
async function fetchAirportDetails(icaoCode: string): Promise<any> {
  try {
    const response = await fetch(
      `https://hexdb.io/api/v1/airport/icao/${icaoCode}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Airplane-Tracker/1.0'
        },
      }
    );

    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error(`[SERVER][HEXDB] Airport lookup error for ${icaoCode}:`, error);
    return null;
  }
}

/**
 * Fetch flight route from hexdb.io (fallback)
 * Returns simple route string like "EIDW-EGLL" that needs parsing
 * Tries both ICAO and IATA callsign formats
 */
async function fetchFromHexdb(callsign: string, registration?: string): Promise<FlightRoute | null> {
  try {
    console.log(`[SERVER][HEXDB] Fetching route for: ${callsign}`);
    
    // Try ICAO route first
    let response = await fetch(
      `https://hexdb.io/api/v1/route/icao/${callsign}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Airplane-Tracker/1.0'
        },
      }
    );

    // If ICAO fails, try IATA
    if (!response.ok) {
      console.log(`[SERVER][HEXDB] ICAO route failed, trying IATA...`);
      response = await fetch(
        `https://hexdb.io/api/v1/route/iata/${callsign}`,
        {
          headers: { 
            'Accept': 'application/json',
            'User-Agent': 'Airplane-Tracker/1.0'
          },
        }
      );
    }

    console.log(`[SERVER][HEXDB] Response status: ${response.status}`);
    if (!response.ok) {
      const text = await response.text();
      console.log(`[SERVER][HEXDB] Failed response:`, text);
      return null;
    }

    let data = await response.json();
    console.log(`[SERVER][HEXDB] Response data:`, JSON.stringify(data, null, 2));

    // Parse route string like "EIDW-EGLL"
    if (!data.route || typeof data.route !== 'string') {
      console.log(`[SERVER][HEXDB] No route string found`);
      
      // Try registration if available
      if (registration && registration !== callsign) {
        console.log(`[SERVER][HEXDB] Trying registration: ${registration}`);
        try {
          const regResponse = await fetch(
            `https://hexdb.io/api/v1/route/icao/${registration}`,
            {
              headers: { 
                'Accept': 'application/json',
                'User-Agent': 'Airplane-Tracker/1.0'
              },
            }
          );
          if (regResponse.ok) {
            const regData = await regResponse.json();
            if (regData.route) {
              data = regData;
              console.log(`[SERVER][HEXDB] Found via registration!`);
            }
          }
        } catch (e) {
          console.log(`[SERVER][HEXDB] Registration lookup failed`);
        }
      }
      
      if (!data.route) {
        return null;
      }
    }

    const routeParts = data.route.split('-');
    if (routeParts.length !== 2) {
      console.log(`[SERVER][HEXDB] Invalid route format: ${data.route}`);
      return null;
    }

    const [originIcao, destIcao] = routeParts;
    console.log(`[SERVER][HEXDB] Parsed route: ${originIcao} -> ${destIcao}`);

    // Fetch airport details for both
    const [originData, destData] = await Promise.all([
      fetchAirportDetails(originIcao),
      fetchAirportDetails(destIcao)
    ]);

    const route: FlightRoute = {
      callsign,
      origin: originData ? {
        icao: originData.icao,
        iata: originData.iata,
        name: originData.airport,
        city: originData.region_name,
        country: originData.country_code,
      } : { icao: originIcao },
      destination: destData ? {
        icao: destData.icao,
        iata: destData.iata,
        name: destData.airport,
        city: destData.region_name,
        country: destData.country_code,
      } : { icao: destIcao },
    };

    console.log(`[SERVER][HEXDB] Route constructed:`, route);
    return route;
  } catch (error) {
    console.error(`[SERVER][HEXDB] Error for ${callsign}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callsign = searchParams.get('callsign');
    const registration = searchParams.get('registration'); // Optional registration for better lookup

    if (!callsign || callsign.trim().length === 0) {
      return NextResponse.json(
        { error: 'Callsign parameter is required' },
        { status: 400 }
      );
    }

    // Clean callsign: remove spaces, convert to uppercase
    const cleanCallsign = callsign.trim().toUpperCase().replace(/\s+/g, '');
    const cleanRegistration = registration?.trim().toUpperCase().replace(/\s+/g, '');
    console.log(`[SERVER][ROUTE] ===== Request for: ${cleanCallsign}${cleanRegistration ? ` (reg: ${cleanRegistration})` : ''} =====`);

    // Check cache
    const cached = routeCache.get(cleanCallsign);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[SERVER][ROUTE] Using cached route for: ${cleanCallsign}`, cached.route ? 'HAS DATA' : 'NULL');
      return NextResponse.json(cached.route);
    }

    // Try adsbdb.com first (primary source) - with registration fallback
    console.log(`[SERVER][ROUTE] Trying ADSBDB for: ${cleanCallsign}`);
    let route = await fetchFromAdsbdb(cleanCallsign, cleanRegistration);
    
    // Fallback to hexdb.io if adsbdb has no data
    if (!route) {
      console.log(`[SERVER][ROUTE] ADSBDB returned null, trying HEXDB...`);
      route = await fetchFromHexdb(cleanCallsign, cleanRegistration);
    } else {
      console.log(`[SERVER][ROUTE] ADSBDB succeeded for: ${cleanCallsign}`);
    }

    // Cache the result (even if null) to avoid repeated failed lookups
    routeCache.set(cleanCallsign, { 
      route: route || null, 
      timestamp: Date.now() 
    });

    if (route) {
      console.log(`[SERVER][ROUTE] ✓ SUCCESS for ${cleanCallsign}: ${route.origin?.icao || '?'} -> ${route.destination?.icao || '?'}`);
    } else {
      console.log(`[SERVER][ROUTE] ✗ FAILED for ${cleanCallsign}: No route data found from any source`);
    }

    return NextResponse.json(route, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    console.error('[SERVER][ROUTE] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch route information' },
      { status: 500 }
    );
  }
}
