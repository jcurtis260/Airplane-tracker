import { NextRequest, NextResponse } from 'next/server';
import { FlightRoute } from '@/lib/types';

// Enhanced in-memory cache for route lookups with statistics
const routeCache = new Map<string, { route: FlightRoute | null; timestamp: number; hits: number }>();
const CACHE_TTL = 86400000; // 24 hours (routes don't change often)
const NEGATIVE_CACHE_TTL = 3600000; // 1 hour for failed lookups (retry sooner)

// Cache statistics for monitoring
let cacheStats = {
  hits: 0,
  misses: 0,
  writes: 0,
  size: 0,
};

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
      origin: data.response.flightroute?.origin ? {
        icao: data.response.flightroute.origin.icao_code,
        iata: data.response.flightroute.origin.iata_code,
        name: data.response.flightroute.origin.name,
        city: data.response.flightroute.origin.municipality,
        country: data.response.flightroute.origin.country_name,
        lat: data.response.flightroute.origin.latitude,
        lon: data.response.flightroute.origin.longitude,
        elevation: data.response.flightroute.origin.elevation,
      } : undefined,
      destination: data.response.flightroute?.destination ? {
        icao: data.response.flightroute.destination.icao_code,
        iata: data.response.flightroute.destination.iata_code,
        name: data.response.flightroute.destination.name,
        city: data.response.flightroute.destination.municipality,
        country: data.response.flightroute.destination.country_name,
        lat: data.response.flightroute.destination.latitude,
        lon: data.response.flightroute.destination.longitude,
        elevation: data.response.flightroute.destination.elevation,
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
      origin: originData ? {
        icao: originData.icao,
        iata: originData.iata,
        name: originData.airport,
        city: originData.region_name,
        country: originData.country_code,
        lat: originData.lat || originData.latitude || 0,
        lon: originData.lon || originData.longitude || 0,
      } : undefined,
      destination: destData ? {
        icao: destData.icao,
        iata: destData.iata,
        name: destData.airport,
        city: destData.region_name,
        country: destData.country_code,
        lat: destData.lat || destData.latitude || 0,
        lon: destData.lon || destData.longitude || 0,
      } : undefined,
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

    // Check cache with appropriate TTL
    const cached = routeCache.get(cleanCallsign);
    if (cached) {
      const ttl = cached.route ? CACHE_TTL : NEGATIVE_CACHE_TTL;
      const age = Date.now() - cached.timestamp;
      
      if (age < ttl) {
        // Cache hit!
        cached.hits = (cached.hits || 0) + 1;
        cacheStats.hits++;
        cacheStats.size = routeCache.size;
        
        console.log(`[SERVER][ROUTE] 💾 CACHE HIT for: ${cleanCallsign} (age: ${Math.round(age/1000)}s, hits: ${cached.hits})`);
        
        return NextResponse.json(cached.route, {
          headers: {
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            'X-Cache-Status': 'HIT',
            'X-Cache-Age': Math.round(age / 1000).toString(),
            'X-Cache-Hits': cached.hits.toString(),
          },
        });
      } else {
        console.log(`[SERVER][ROUTE] Cache expired for: ${cleanCallsign} (age: ${Math.round(age/1000)}s)`);
        routeCache.delete(cleanCallsign);
      }
    }
    
    cacheStats.misses++;
    console.log(`[SERVER][ROUTE] ❌ CACHE MISS for: ${cleanCallsign}`);

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
      timestamp: Date.now(),
      hits: 0,
    });
    cacheStats.writes++;
    cacheStats.size = routeCache.size;

    if (route) {
      console.log(`[SERVER][ROUTE] ✓ SUCCESS for ${cleanCallsign}: ${route.origin?.icao || '?'} -> ${route.destination?.icao || '?'}`);
    } else {
      console.log(`[SERVER][ROUTE] ✗ FAILED for ${cleanCallsign}: No route data found from any source`);
    }
    
    console.log(`[SERVER][ROUTE] 📊 Cache stats: ${cacheStats.hits} hits, ${cacheStats.misses} misses, ${cacheStats.size} entries (${Math.round(cacheStats.hits/(cacheStats.hits + cacheStats.misses)*100)}% hit rate)`);

    return NextResponse.json(route, {
      headers: {
        // Cache successful route lookups for 24 hours, failed lookups for 1 hour
        'Cache-Control': route 
          ? 'public, s-maxage=86400, stale-while-revalidate=604800' 
          : 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache-Status': 'MISS',
        'X-Cache-Size': cacheStats.size.toString(),
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
