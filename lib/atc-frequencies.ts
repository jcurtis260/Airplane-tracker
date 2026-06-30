/**
 * Real-world ATC VHF frequencies for major airports
 * These can be listened to using:
 * - Physical aviation radio
 * - SDR (Software Defined Radio) with RTL-SDR dongle
 * - Online SDR receivers (websdr.org)
 * - ATC streaming services
 */

export interface ATCFrequencyData {
  icao: string;
  iata: string;
  name: string;
  country: string;
  frequencies: {
    type: 'tower' | 'ground' | 'approach' | 'departure' | 'atis' | 'clearance';
    name: string;
    frequency: string; // MHz
  }[];
  streams?: {
    source: 'liveatc' | 'atclive' | 'broadcastify';
    url: string;
  }[];
}

export const ATC_FREQUENCIES: Record<string, ATCFrequencyData> = {
  // United Kingdom
  'EGLL': {
    icao: 'EGLL',
    iata: 'LHR',
    name: 'London Heathrow',
    country: 'United Kingdom',
    frequencies: [
      { type: 'tower', name: 'Tower North', frequency: '118.500' },
      { type: 'tower', name: 'Tower South', frequency: '118.700' },
      { type: 'ground', name: 'Ground', frequency: '121.700' },
      { type: 'approach', name: 'Director', frequency: '119.200' },
      { type: 'atis', name: 'ATIS', frequency: '113.750' },
    ],
    streams: [
      { source: 'atclive', url: 'https://www.atc-live.com/feed/heathrow' },
    ],
  },
  'EGKK': {
    icao: 'EGKK',
    iata: 'LGW',
    name: 'London Gatwick',
    country: 'United Kingdom',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '124.225' },
      { type: 'ground', name: 'Ground', frequency: '121.800' },
      { type: 'approach', name: 'Approach', frequency: '126.825' },
      { type: 'atis', name: 'ATIS', frequency: '136.525' },
    ],
    streams: [
      { source: 'atclive', url: 'https://www.atc-live.com/feed/gatwick' },
    ],
  },
  'EGSS': {
    icao: 'EGSS',
    iata: 'STN',
    name: 'London Stansted',
    country: 'United Kingdom',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '123.800' },
      { type: 'ground', name: 'Ground', frequency: '121.725' },
      { type: 'approach', name: 'Approach', frequency: '120.625' },
      { type: 'atis', name: 'ATIS', frequency: '127.175' },
    ],
  },
  'EGCC': {
    icao: 'EGCC',
    iata: 'MAN',
    name: 'Manchester',
    country: 'United Kingdom',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.625' },
      { type: 'ground', name: 'Ground', frequency: '121.700' },
      { type: 'approach', name: 'Approach', frequency: '119.400' },
      { type: 'atis', name: 'ATIS', frequency: '128.175' },
    ],
  },
  'EIDW': {
    icao: 'EIDW',
    iata: 'DUB',
    name: 'Dublin',
    country: 'Ireland',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.600' },
      { type: 'ground', name: 'Ground', frequency: '121.800' },
      { type: 'approach', name: 'Approach', frequency: '119.550' },
      { type: 'atis', name: 'ATIS', frequency: '135.325' },
    ],
  },

  // Spain
  'LEMD': {
    icao: 'LEMD',
    iata: 'MAD',
    name: 'Madrid Barajas',
    country: 'Spain',
    frequencies: [
      { type: 'tower', name: 'Tower North', frequency: '118.300' },
      { type: 'tower', name: 'Tower South', frequency: '118.850' },
      { type: 'ground', name: 'Ground', frequency: '121.900' },
      { type: 'approach', name: 'Approach', frequency: '119.200' },
      { type: 'atis', name: 'ATIS', frequency: '128.300' },
    ],
  },
  'LEBL': {
    icao: 'LEBL',
    iata: 'BCN',
    name: 'Barcelona El Prat',
    country: 'Spain',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.100' },
      { type: 'ground', name: 'Ground', frequency: '121.700' },
      { type: 'approach', name: 'Approach', frequency: '120.300' },
      { type: 'atis', name: 'ATIS', frequency: '125.725' },
    ],
  },
  'LEMG': {
    icao: 'LEMG',
    iata: 'AGP',
    name: 'Málaga Costa del Sol',
    country: 'Spain',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.300' },
      { type: 'ground', name: 'Ground', frequency: '121.750' },
      { type: 'approach', name: 'Approach', frequency: '119.200' },
      { type: 'atis', name: 'ATIS', frequency: '126.175' },
    ],
  },
  'LEBB': {
    icao: 'LEBB',
    iata: 'BIO',
    name: 'Bilbao',
    country: 'Spain',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.100' },
      { type: 'ground', name: 'Ground', frequency: '121.750' },
      { type: 'approach', name: 'Approach', frequency: '119.200' },
      { type: 'atis', name: 'ATIS', frequency: '126.450' },
    ],
  },

  // France
  'LFPG': {
    icao: 'LFPG',
    iata: 'CDG',
    name: 'Paris Charles de Gaulle',
    country: 'France',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.275' },
      { type: 'ground', name: 'Ground', frequency: '121.650' },
      { type: 'approach', name: 'Approach', frequency: '119.250' },
      { type: 'atis', name: 'ATIS', frequency: '126.425' },
    ],
  },
  'LFPO': {
    icao: 'LFPO',
    iata: 'ORY',
    name: 'Paris Orly',
    country: 'France',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.700' },
      { type: 'ground', name: 'Ground', frequency: '121.750' },
      { type: 'approach', name: 'Approach', frequency: '119.025' },
      { type: 'atis', name: 'ATIS', frequency: '130.050' },
    ],
  },

  // Germany
  'EDDF': {
    icao: 'EDDF',
    iata: 'FRA',
    name: 'Frankfurt',
    country: 'Germany',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.500' },
      { type: 'ground', name: 'Ground', frequency: '121.900' },
      { type: 'approach', name: 'Approach', frequency: '119.025' },
      { type: 'atis', name: 'ATIS', frequency: '118.025' },
    ],
  },
  'EDDM': {
    icao: 'EDDM',
    iata: 'MUC',
    name: 'Munich',
    country: 'Germany',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.700' },
      { type: 'ground', name: 'Ground', frequency: '121.700' },
      { type: 'approach', name: 'Approach', frequency: '120.775' },
      { type: 'atis', name: 'ATIS', frequency: '123.125' },
    ],
  },

  // Netherlands
  'EHAM': {
    icao: 'EHAM',
    iata: 'AMS',
    name: 'Amsterdam Schiphol',
    country: 'Netherlands',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '118.400' },
      { type: 'ground', name: 'Ground', frequency: '121.700' },
      { type: 'approach', name: 'Approach', frequency: '118.275' },
      { type: 'atis', name: 'ATIS', frequency: '125.325' },
    ],
  },

  // USA (with LiveATC coverage)
  'KJFK': {
    icao: 'KJFK',
    iata: 'JFK',
    name: 'New York JFK',
    country: 'United States',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '123.900' },
      { type: 'ground', name: 'Ground', frequency: '121.900' },
      { type: 'approach', name: 'Approach', frequency: '125.250' },
      { type: 'atis', name: 'ATIS', frequency: '128.725' },
    ],
    streams: [
      { source: 'liveatc', url: 'https://www.liveatc.net/search/?icao=kjfk' },
    ],
  },
  'KLAX': {
    icao: 'KLAX',
    iata: 'LAX',
    name: 'Los Angeles',
    country: 'United States',
    frequencies: [
      { type: 'tower', name: 'Tower North', frequency: '133.900' },
      { type: 'tower', name: 'Tower South', frequency: '120.950' },
      { type: 'ground', name: 'Ground', frequency: '121.750' },
      { type: 'approach', name: 'Approach', frequency: '124.500' },
      { type: 'atis', name: 'ATIS', frequency: '133.800' },
    ],
    streams: [
      { source: 'liveatc', url: 'https://www.liveatc.net/search/?icao=klax' },
    ],
  },
  'KORD': {
    icao: 'KORD',
    iata: 'ORD',
    name: 'Chicago O\'Hare',
    country: 'United States',
    frequencies: [
      { type: 'tower', name: 'Tower', frequency: '120.750' },
      { type: 'ground', name: 'Ground', frequency: '121.900' },
      { type: 'approach', name: 'Approach', frequency: '125.000' },
      { type: 'atis', name: 'ATIS', frequency: '135.400' },
    ],
    streams: [
      { source: 'liveatc', url: 'https://www.liveatc.net/search/?icao=kord' },
    ],
  },
};

export function getATCFrequencies(icao: string): ATCFrequencyData | null {
  return ATC_FREQUENCIES[icao.toUpperCase()] || null;
}

export function hasATCData(icao: string): boolean {
  return icao.toUpperCase() in ATC_FREQUENCIES;
}
