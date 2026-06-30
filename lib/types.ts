export interface Airplane {
  hex: string;
  type?: string;
  flight?: string;
  registration?: string;
  lat?: number;
  lon?: number;
  alt_baro?: number;
  alt_geom?: number;
  gs?: number;
  track?: number;
  baro_rate?: number;
  squawk?: string;
  category?: string;
  nav_altitude_mcp?: number;
  nav_heading?: number;
  seen?: number;
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
  rssi?: number;
  alert?: number;
  spi?: number;
  t?: string;
  r?: string;
}

export interface AirplanesResponse {
  ac: Airplane[];
  total: number;
  ctime: number;
  ptime: number;
}

export interface UserLocation {
  lat: number;
  lon: number;
}

export interface ViewMode {
  mode: '2d' | '3d';
}

export interface AirplaneWithHistory extends Airplane {
  history?: Array<{ lat: number; lon: number; timestamp: number }>;
}
