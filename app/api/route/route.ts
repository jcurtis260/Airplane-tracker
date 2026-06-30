import { NextRequest, NextResponse } from 'next/server';
import { FlightRoute } from '@/lib/types';

// In-memory cache for route lookups
const routeCache = new Map<string, { route: FlightRoute | null; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour

/**
 * Fetch flight route from adsbdb.com (primary source)
 */
async function fetchFromAdsbdb(callsign: string): Promise<FlightRoute | null> {
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

    const data = await response.json();
    console.log(`[SERVER][ADSBDB] Response data:`, JSON.stringify(data, null, 2));
    
    if (!data.response) {
      console.log(`[SERVER][ADSBDB] No response field in data`);
      return null;
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
 * Fetch flight route from hexdb.io (fallback)
 */
async function fetchFromHexdb(callsign: string): Promise<FlightRoute | null> {
  try {
    console.log(`[SERVER][HEXDB] Fetching route for: ${callsign}`);
    const response = await fetch(
      `https://hexdb.io/api/v1/route/${callsign}`,
      {
        headers: { 
          'Accept': 'application/json',
          'User-Agent': 'Airplane-Tracker/1.0'
        },
      }
    );

    console.log(`[SERVER][HEXDB] Response status: ${response.status}`);
    if (!response.ok) {
      const text = await response.text();
      console.log(`[SERVER][HEXDB] Failed response:`, text);
      return null;
    }

    const data = await response.json();
    console.log(`[SERVER][HEXDB] Response data:`, JSON.stringify(data, null, 2));

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
    console.log(`[SERVER][HEXDB] Route found: ${hasRoute}`, route);
    return hasRoute ? route : null;
  } catch (error) {
    console.error(`[SERVER][HEXDB] Error for ${callsign}:`, error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const callsign = searchParams.get('callsign');

    if (!callsign || callsign.trim().length === 0) {
      return NextResponse.json(
        { error: 'Callsign parameter is required' },
        { status: 400 }
      );
    }

    const cleanCallsign = callsign.trim().toUpperCase();
    console.log(`[SERVER][ROUTE] Request for: ${cleanCallsign}`);

    // Check cache
    const cached = routeCache.get(cleanCallsign);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[SERVER][ROUTE] Using cached route for: ${cleanCallsign}`);
      return NextResponse.json(cached.route);
    }

    // Try adsbdb.com first (primary source)
    let route = await fetchFromAdsbdb(cleanCallsign);
    
    // Fallback to hexdb.io if adsbdb has no data
    if (!route) {
      console.log(`[SERVER][ROUTE] ADSBDB had no data, trying HEXDB...`);
      route = await fetchFromHexdb(cleanCallsign);
    }

    // Cache the result (even if null)
    routeCache.set(cleanCallsign, { 
      route: route || null, 
      timestamp: Date.now() 
    });

    console.log(`[SERVER][ROUTE] Final route for ${cleanCallsign}:`, route);

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
