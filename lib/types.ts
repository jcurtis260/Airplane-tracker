export interface Airplane {
  hex: string;
  type?: string;
  flight?: string;
  r?: string;
  t?: string;
  alt_baro?: number;
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  squawk?: string;
  emergency?: string;
  category?: string;
  nav_qnh?: number;
  nav_altitude_mcp?: number;
  lat?: number;
  lon?: number;
  nic?: number;
  rc?: number;
  seen_pos?: number;
  version?: number;
  nic_baro?: number;
  nac_p?: number;
  nac_v?: number;
  sil?: number;
  sil_type?: string;
  gva?: number;
  sda?: number;
  mlat?: string[];
  tisb?: string[];
  messages?: number;
  seen?: number;
  rssi?: number;
}

export interface AirplanesResponse {
  ac: Airplane[];
  total: number;
  ctime: number;
  ptime: number;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
}

export interface AirplaneWithHistory extends Airplane {
  positions: Array<{
    lat: number;
    lon: number;
    alt: number;
    timestamp: number;
  }>;
}

export interface Airport {
  icao: string;
  iata?: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  elevation?: number;
}

export interface FlightRoute {
  origin?: Airport;
  destination?: Airport;
  airline?: {
    name: string;
    icao: string;
    iata: string;
    country: string;
    callsign: string;
  };
}

export interface ATCFrequency {
  id: string;
  name: string;
  type: 'tower' | 'ground' | 'approach' | 'departure' | 'center' | 'atis' | 'other';
  frequency?: string;
  streamUrl?: string;
  listeners?: number;
  airport?: string;
  icao?: string;
}
