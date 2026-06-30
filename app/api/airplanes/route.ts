import { NextRequest, NextResponse } from 'next/server';

const AIRPLANES_LIVE_API = 'https://api.airplanes.live/v2';
const MAX_RADIUS_NM = 250;

// Simple in-memory rate limiting
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 1000; // 1 second

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');
    const radiusKm = searchParams.get('radius') || '100';

    if (!lat || !lon) {
      return NextResponse.json(
        { error: 'Missing lat or lon parameter' },
        { status: 400 }
      );
    }

    // Validate coordinates
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    
    if (isNaN(latitude) || isNaN(longitude)) {
      return NextResponse.json(
        { error: 'Invalid coordinates' },
        { status: 400 }
      );
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return NextResponse.json(
        { error: 'Coordinates out of range' },
        { status: 400 }
      );
    }

    // Convert km to nautical miles and enforce max
    const radiusNm = Math.min(
      Math.round(parseFloat(radiusKm) * 0.539957),
      MAX_RADIUS_NM
    );

    // Simple rate limiting
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      const waitTime = MIN_REQUEST_INTERVAL - timeSinceLastRequest;
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }

    lastRequestTime = Date.now();

    // Fetch from airplanes.live API
    const apiUrl = `${AIRPLANES_LIVE_API}/point/${latitude}/${longitude}/${radiusNm}`;
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': 'application/json',
      },
      next: { revalidate: 0 }, // Don't cache
    });

    if (!response.ok) {
      console.error('Airplanes API error:', response.status, response.statusText);
      return NextResponse.json(
        { error: 'Failed to fetch airplane data' },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });
  } catch (error) {
    console.error('Error fetching airplanes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
