import useSWR from 'swr';
import { AirplanesResponse, UserLocation, Airplane, FlightRoute } from './types';
import { fetchFlightRoute } from './route-api';

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error('Failed to fetch airplane data');
  }
  return res.json();
};

export interface AirplaneWithRoute extends Airplane {
  route?: FlightRoute | null;
}

export function useAirplanes(location: UserLocation | null, radius: number = 100) {
  const shouldFetch = location !== null;
  
  const url = shouldFetch
    ? `/api/airplanes?lat=${location.latitude}&lon=${location.longitude}&radius=${radius}`
    : null;

  const { data, error, isLoading, mutate } = useSWR<AirplanesResponse>(
    url,
    fetcher,
    {
      refreshInterval: 30000, // Refresh every 30 seconds
      revalidateOnFocus: false,
      dedupingInterval: 5000, // Dedupe requests within 5 seconds
    }
  );

  return {
    airplanes: data?.ac || [],
    total: data?.total || 0,
    isLoading,
    isError: error,
    mutate,
  };
}

/**
 * Fetch route information for a specific airplane
 * Called on-demand when user clicks on an airplane
 */
export async function getAirplaneRoute(callsign?: string): Promise<FlightRoute | null> {
  if (!callsign) return null;
  return fetchFlightRoute(callsign);
}

export function getAltitudeColor(altitude?: number): string {
  if (!altitude) return '#9CA3AF'; // gray
  
  if (altitude < 10000) return '#06B6D4'; // cyan - low
  if (altitude < 25000) return '#F59E0B'; // amber - medium
  return '#EF4444'; // red - high
}

export function getCardinalDirection(heading?: number): string {
  if (heading === undefined) return 'N/A';
  
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
  const index = Math.round(((heading % 360) / 45)) % 8;
  return directions[index];
}

export function formatSpeed(knots?: number): string {
  if (knots === undefined) return 'N/A';
  const kmh = Math.round(knots * 1.852);
  return `${Math.round(knots)} kts (${kmh} km/h)`;
}

export function formatAltitude(feet?: number): string {
  if (feet === undefined) return 'N/A';
  const meters = Math.round(feet * 0.3048);
  return `${feet.toLocaleString()} ft (${meters.toLocaleString()} m)`;
}

export function formatVerticalRate(feetPerMin?: number): string {
  if (feetPerMin === undefined) return 'N/A';
  const metersPerSec = Math.round((feetPerMin * 0.3048) / 60);
  return `${feetPerMin > 0 ? '+' : ''}${feetPerMin} ft/min (${metersPerSec > 0 ? '+' : ''}${metersPerSec} m/s)`;
}

export function getCountryFromICAO(hex: string): string {
  if (!hex) return 'Unknown';
  
  const icaoPrefix = hex.substring(0, 2).toUpperCase();
  const countries: Record<string, string> = {
    '00': 'Unknown',
    'A0': 'USA', 'A1': 'USA', 'A2': 'USA', 'A3': 'USA', 'A4': 'USA',
    'A5': 'USA', 'A6': 'USA', 'A7': 'USA', 'A8': 'USA', 'A9': 'USA',
    'AA': 'USA', 'AB': 'USA', 'AC': 'USA', 'AD': 'USA', 'AE': 'USA',
    'AF': 'USA',
    'C0': 'Canada', 'C1': 'Canada', 'C2': 'Canada', 'C3': 'Canada',
    'C4': 'Canada', 'C5': 'Canada', 'C6': 'Canada', 'C7': 'Canada',
    '38': 'France', '39': 'France', '3A': 'France', '3B': 'France',
    '40': 'UK', '41': 'UK', '42': 'UK', '43': 'UK',
    '3C': 'Germany', '3D': 'Germany', '3E': 'Germany', '3F': 'Germany',
    '70': 'Australia', '71': 'Australia', '72': 'Australia', '73': 'Australia',
    '74': 'Australia', '75': 'Australia', '76': 'Australia', '77': 'Australia',
    '48': 'Netherlands', '49': 'Netherlands',
    '44': 'Austria', '45': 'Belgium',
    '46': 'Luxembourg',
    '47': 'Switzerland',
    '4A': 'Spain', '4B': 'Spain', '4C': 'Spain',
    '50': 'Italy', '51': 'Italy',
    '06': 'Mexico', '0A': 'Mexico', '0B': 'Mexico', '0C': 'Mexico',
    'E0': 'Brazil', 'E1': 'Brazil', 'E2': 'Brazil', 'E3': 'Brazil',
    '78': 'China', '79': 'China', '7A': 'China', '7B': 'China', '7C': 'China',
    '80': 'India', '81': 'India', '82': 'India', '83': 'India',
    '88': 'South Korea', '89': 'South Korea',
    '84': 'Japan', '85': 'Japan', '86': 'Japan', '87': 'Japan',
  };
  
  return countries[icaoPrefix] || 'Unknown';
}
