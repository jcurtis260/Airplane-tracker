import { NextRequest, NextResponse } from 'next/server';
import { getATCFrequencies, hasATCData } from '@/lib/atc-frequencies';

/**
 * ATC Frequency API - Returns real-world VHF frequencies and streaming links
 * 
 * Data sources:
 * - Real VHF frequencies for physical/SDR listening
 * - LiveATC.net streams (mainly US coverage)
 * - ATC-Live.com streams (UK/European coverage)
 * - Broadcastify feeds
 */

// Cache for ATC frequency lookups
const atcCache = new Map<string, { data: any; timestamp: number }>();
const CACHE_TTL = 3600000; // 1 hour (frequencies rarely change)


export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const icao = searchParams.get('icao');

    if (!icao) {
      return NextResponse.json({
        error: 'ICAO parameter required',
        message: 'Provide ?icao=EGLL to get frequencies for a specific airport',
      }, { status: 400 });
    }

    const cleanIcao = icao.toUpperCase();
    
    // Check cache
    const cacheKey = `icao:${cleanIcao}`;
    const cached = atcCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[SERVER][ATC] 💾 Cache hit for: ${cleanIcao}`);
      return NextResponse.json(cached.data, {
        headers: {
          'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
          'X-Cache-Status': 'HIT',
        },
      });
    }

    // Get frequency data
    const atcData = getATCFrequencies(cleanIcao);
    
    if (!atcData) {
      return NextResponse.json({
        error: 'No ATC data available',
        message: `No frequency data for ${cleanIcao}`,
        available: hasATCData(cleanIcao),
      }, { status: 404 });
    }

    // Cache the result
    atcCache.set(cacheKey, { data: atcData, timestamp: Date.now() });

    console.log(`[SERVER][ATC] ✓ Returned ${atcData.frequencies.length} frequencies for ${cleanIcao}`);

    return NextResponse.json(atcData, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
        'X-Cache-Status': 'MISS',
      },
    });

  } catch (error) {
    console.error('[SERVER][ATC] Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch ATC frequencies' },
      { status: 500 }
    );
  }
}
