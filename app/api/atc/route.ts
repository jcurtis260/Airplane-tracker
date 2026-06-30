import { NextRequest, NextResponse } from 'next/server';
import { ATCFrequency } from '@/lib/types';

/**
 * LiveATC.net API proxy for fetching nearby ATC frequencies
 * 
 * Note: LiveATC.net doesn't have a public REST API, so we'll use a combination of:
 * 1. Known airport ICAO codes to construct LiveATC URLs
 * 2. Manual mapping of major airports to their LiveATC feeds
 * 
 * In production, you could scrape LiveATC or use their RSS feeds
 */

// Cache for ATC frequency lookups
const atcCache = new Map<string, { frequencies: ATCFrequency[]; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour (frequencies rarely change)

/**
 * Manual mapping of major airports to their LiveATC feed codes
 * Format: ICAO -> LiveATC code
 */
const LIVEATC_CODES: Record<string, string> = {
  // United States
  'KJFK': 'kjfk',
  'KLAX': 'klax',
  'KORD': 'kord',
  'KATL': 'katl',
  'KDFW': 'kdfw',
  'KDEN': 'kden',
  'KSFO': 'ksfo',
  'KLAS': 'klas',
  'KMIA': 'kmia',
  'KBOS': 'kbos',
  'KEWR': 'kewr',
  'KSEA': 'ksea',
  'KPHX': 'kphx',
  'KIAD': 'kiad',
  'KJAX': 'kjax',
  
  // Europe
  'EGLL': 'egll', // London Heathrow
  'EGKK': 'egkk', // London Gatwick
  'EHAM': 'eham', // Amsterdam Schiphol
  'LFPG': 'lfpg', // Paris CDG
  'EDDF': 'eddf', // Frankfurt
  'LEMD': 'lemd', // Madrid
  'LIRF': 'lirf', // Rome Fiumicino
  'EIDW': 'eidw', // Dublin
  'EKCH': 'ekch', // Copenhagen
  
  // Asia Pacific
  'RJTT': 'rjtt', // Tokyo Haneda
  'VHHH': 'vhhh', // Hong Kong
  'WSSS': 'wsss', // Singapore Changi
  'YSSY': 'yssy', // Sydney
  'NZAA': 'nzaa', // Auckland
  
  // Canada
  'CYYZ': 'cyyz', // Toronto Pearson
  'CYVR': 'cyvr', // Vancouver
};

/**
 * Get common ATC frequency types for an airport
 */
function getAirportFrequencies(icao: string): ATCFrequency[] {
  const liveAtcCode = LIVEATC_CODES[icao.toUpperCase()];
  
  if (!liveAtcCode) {
    return [];
  }

  const baseUrl = `https://www.liveatc.net/play/${liveAtcCode}`;
  
  // Common frequency types for most airports
  const frequencies: ATCFrequency[] = [
    {
      id: `${icao}-tower`,
      name: `${icao} Tower`,
      type: 'tower',
      streamUrl: `${baseUrl}_twr.pls`,
      airport: icao,
      icao: icao,
    },
    {
      id: `${icao}-ground`,
      name: `${icao} Ground`,
      type: 'ground',
      streamUrl: `${baseUrl}_gnd.pls`,
      airport: icao,
      icao: icao,
    },
    {
      id: `${icao}-approach`,
      name: `${icao} Approach`,
      type: 'approach',
      streamUrl: `${baseUrl}_app.pls`,
      airport: icao,
      icao: icao,
    },
    {
      id: `${icao}-departure`,
      name: `${icao} Departure`,
      type: 'departure',
      streamUrl: `${baseUrl}_dep.pls`,
      airport: icao,
      icao: icao,
    },
  ];

  return frequencies;
}

/**
 * Get ATC frequencies for nearby airports
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const icao = searchParams.get('icao');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');

    // If specific airport requested
    if (icao) {
      const cacheKey = `icao:${icao.toUpperCase()}`;
      const cached = atcCache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
        console.log(`[SERVER][ATC] 💾 Cache hit for: ${icao}`);
        return NextResponse.json(cached.frequencies, {
          headers: {
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          },
        });
      }

      const frequencies = getAirportFrequencies(icao.toUpperCase());
      
      if (frequencies.length === 0) {
        return NextResponse.json({
          error: 'Airport not found or no LiveATC coverage',
          message: `No ATC feeds available for ${icao.toUpperCase()}`,
          availableAirports: Object.keys(LIVEATC_CODES),
        }, { status: 404 });
      }

      atcCache.set(cacheKey, { frequencies, timestamp: Date.now() });

      return NextResponse.json(frequencies, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // If location provided, find nearby airports with LiveATC coverage
    if (lat && lon) {
      // Calculate distance and return closest airports
      const nearbyAirports = Object.keys(LIVEATC_CODES)
        .map(icao => {
          // You would normally look up actual airport coordinates here
          // For now, just return all available airports
          return getAirportFrequencies(icao);
        })
        .flat()
        .slice(0, 10); // Limit to 10 feeds

      return NextResponse.json(nearbyAirports, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        },
      });
    }

    // Return list of available airports
    return NextResponse.json({
      availableAirports: Object.keys(LIVEATC_CODES).sort(),
      message: 'Provide ?icao=KJFK to get frequencies for a specific airport',
      totalCoverage: Object.keys(LIVEATC_CODES).length,
    });

  } catch (error) {
    console.error('[SERVER][ATC] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ATC frequencies' },
      { status: 500 }
    );
  }
}
