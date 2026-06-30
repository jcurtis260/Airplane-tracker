// Major airports worldwide for map display
export interface AirportData {
  icao: string;
  iata: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
}

// 200+ major and regional airports worldwide for comprehensive coverage
export const MAJOR_AIRPORTS: AirportData[] = [
  // North America
  { icao: 'KATL', iata: 'ATL', name: 'Hartsfield-Jackson Atlanta', city: 'Atlanta', country: 'US', lat: 33.6367, lon: -84.4281 },
  { icao: 'KLAX', iata: 'LAX', name: 'Los Angeles Intl', city: 'Los Angeles', country: 'US', lat: 33.9425, lon: -118.408 },
  { icao: 'KORD', iata: 'ORD', name: "O'Hare Intl", city: 'Chicago', country: 'US', lat: 41.9786, lon: -87.9048 },
  { icao: 'KDFW', iata: 'DFW', name: 'Dallas/Fort Worth', city: 'Dallas', country: 'US', lat: 32.8968, lon: -97.038 },
  { icao: 'KDEN', iata: 'DEN', name: 'Denver Intl', city: 'Denver', country: 'US', lat: 39.8561, lon: -104.6737 },
  { icao: 'KJFK', iata: 'JFK', name: 'John F Kennedy Intl', city: 'New York', country: 'US', lat: 40.6398, lon: -73.7789 },
  { icao: 'KSFO', iata: 'SFO', name: 'San Francisco Intl', city: 'San Francisco', country: 'US', lat: 37.6213, lon: -122.379 },
  { icao: 'KLAS', iata: 'LAS', name: 'Las Vegas McCarran', city: 'Las Vegas', country: 'US', lat: 36.0840, lon: -115.1537 },
  { icao: 'KSEA', iata: 'SEA', name: 'Seattle-Tacoma Intl', city: 'Seattle', country: 'US', lat: 47.4502, lon: -122.3088 },
  { icao: 'KMIA', iata: 'MIA', name: 'Miami Intl', city: 'Miami', country: 'US', lat: 25.7932, lon: -80.2906 },
  { icao: 'CYYZ', iata: 'YYZ', name: 'Toronto Pearson', city: 'Toronto', country: 'CA', lat: 43.6777, lon: -79.6248 },
  { icao: 'CYVR', iata: 'YVR', name: 'Vancouver Intl', city: 'Vancouver', country: 'CA', lat: 49.1947, lon: -123.1839 },
  { icao: 'MMMX', iata: 'MEX', name: 'Mexico City Intl', city: 'Mexico City', country: 'MX', lat: 19.4363, lon: -99.0721 },
  
  // Europe - UK & Ireland
  { icao: 'EGLL', iata: 'LHR', name: 'London Heathrow', city: 'London', country: 'GB', lat: 51.4700, lon: -0.4543 },
  { icao: 'EGKK', iata: 'LGW', name: 'London Gatwick', city: 'London', country: 'GB', lat: 51.1481, lon: -0.1903 },
  { icao: 'EGSS', iata: 'STN', name: 'London Stansted', city: 'London', country: 'GB', lat: 51.8850, lon: 0.2350 },
  { icao: 'EGCC', iata: 'MAN', name: 'Manchester', city: 'Manchester', country: 'GB', lat: 53.3537, lon: -2.2750 },
  { icao: 'EIDW', iata: 'DUB', name: 'Dublin', city: 'Dublin', country: 'IE', lat: 53.4213, lon: -6.2701 },
  
  // Europe - Western Europe
  { icao: 'LFPG', iata: 'CDG', name: 'Paris Charles de Gaulle', city: 'Paris', country: 'FR', lat: 49.0097, lon: 2.5479 },
  { icao: 'LFPO', iata: 'ORY', name: 'Paris Orly', city: 'Paris', country: 'FR', lat: 48.7233, lon: 2.3794 },
  { icao: 'EHAM', iata: 'AMS', name: 'Amsterdam Schiphol', city: 'Amsterdam', country: 'NL', lat: 52.3086, lon: 4.7639 },
  { icao: 'EBBR', iata: 'BRU', name: 'Brussels', city: 'Brussels', country: 'BE', lat: 50.9014, lon: 4.4844 },
  { icao: 'ELLX', iata: 'LUX', name: 'Luxembourg', city: 'Luxembourg', country: 'LU', lat: 49.6233, lon: 6.2044 },
  
  // Europe - Germany
  { icao: 'EDDF', iata: 'FRA', name: 'Frankfurt', city: 'Frankfurt', country: 'DE', lat: 50.0379, lon: 8.5622 },
  { icao: 'EDDM', iata: 'MUC', name: 'Munich', city: 'Munich', country: 'DE', lat: 48.3538, lon: 11.7861 },
  { icao: 'EDDB', iata: 'BER', name: 'Berlin Brandenburg', city: 'Berlin', country: 'DE', lat: 52.3667, lon: 13.5033 },
  { icao: 'EDDH', iata: 'HAM', name: 'Hamburg', city: 'Hamburg', country: 'DE', lat: 53.6304, lon: 9.9882 },
  
  // Europe - Spain & Portugal
  { icao: 'LEMD', iata: 'MAD', name: 'Madrid Barajas', city: 'Madrid', country: 'ES', lat: 40.4839, lon: -3.5680 },
  { icao: 'LEBL', iata: 'BCN', name: 'Barcelona El Prat', city: 'Barcelona', country: 'ES', lat: 41.2971, lon: 2.0785 },
  { icao: 'LEMG', iata: 'AGP', name: 'Málaga Costa del Sol', city: 'Málaga', country: 'ES', lat: 36.6749, lon: -4.4991 },
  { icao: 'LEZL', iata: 'SVQ', name: 'Sevilla', city: 'Seville', country: 'ES', lat: 37.4180, lon: -5.8931 },
  { icao: 'LEVC', iata: 'VLC', name: 'Valencia', city: 'Valencia', country: 'ES', lat: 39.4893, lon: -0.4817 },
  { icao: 'LEAL', iata: 'ALC', name: 'Alicante', city: 'Alicante', country: 'ES', lat: 38.2822, lon: -0.5581 },
  { icao: 'LPPT', iata: 'LIS', name: 'Lisbon Portela', city: 'Lisbon', country: 'PT', lat: 38.7813, lon: -9.1359 },
  { icao: 'LPPR', iata: 'OPO', name: 'Porto', city: 'Porto', country: 'PT', lat: 41.2481, lon: -8.6814 },
  { icao: 'LPFR', iata: 'FAO', name: 'Faro', city: 'Faro', country: 'PT', lat: 37.0144, lon: -7.9659 },
  { icao: 'LXGB', iata: 'GIB', name: 'Gibraltar', city: 'Gibraltar', country: 'GI', lat: 36.1512, lon: -5.3497 },
  
  // Europe - Italy
  { icao: 'LIRF', iata: 'FCO', name: 'Rome Fiumicino', city: 'Rome', country: 'IT', lat: 41.8003, lon: 12.2389 },
  { icao: 'LIMC', iata: 'MXP', name: 'Milan Malpensa', city: 'Milan', country: 'IT', lat: 45.6306, lon: 8.7281 },
  { icao: 'LIPZ', iata: 'VCE', name: 'Venice Marco Polo', city: 'Venice', country: 'IT', lat: 45.5053, lon: 12.3519 },
  
  // Europe - Austria & Switzerland
  { icao: 'LOWW', iata: 'VIE', name: 'Vienna Intl', city: 'Vienna', country: 'AT', lat: 48.1103, lon: 16.5697 },
  { icao: 'LSZH', iata: 'ZRH', name: 'Zurich', city: 'Zurich', country: 'CH', lat: 47.4647, lon: 8.5492 },
  { icao: 'LSGG', iata: 'GVA', name: 'Geneva', city: 'Geneva', country: 'CH', lat: 46.2381, lon: 6.1090 },
  
  // Europe - Eastern Europe
  { icao: 'UUEE', iata: 'SVO', name: 'Moscow Sheremetyevo', city: 'Moscow', country: 'RU', lat: 55.9726, lon: 37.4146 },
  { icao: 'EPWA', iata: 'WAW', name: 'Warsaw Chopin', city: 'Warsaw', country: 'PL', lat: 52.1657, lon: 20.9671 },
  { icao: 'LKPR', iata: 'PRG', name: 'Prague Václav Havel', city: 'Prague', country: 'CZ', lat: 50.1008, lon: 14.2600 },
  { icao: 'LHBP', iata: 'BUD', name: 'Budapest Ferenc Liszt', city: 'Budapest', country: 'HU', lat: 47.4297, lon: 19.2611 },
  
  // Europe - Nordic
  { icao: 'ESSA', iata: 'ARN', name: 'Stockholm Arlanda', city: 'Stockholm', country: 'SE', lat: 59.6519, lon: 17.9186 },
  { icao: 'EKCH', iata: 'CPH', name: 'Copenhagen', city: 'Copenhagen', country: 'DK', lat: 55.6180, lon: 12.6506 },
  { icao: 'ENGM', iata: 'OSL', name: 'Oslo Gardermoen', city: 'Oslo', country: 'NO', lat: 60.1939, lon: 11.1004 },
  { icao: 'EFHK', iata: 'HEL', name: 'Helsinki Vantaa', city: 'Helsinki', country: 'FI', lat: 60.3172, lon: 24.9633 },
  
  // Europe - Turkey & Greece
  { icao: 'LTFM', iata: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'TR', lat: 41.2753, lon: 28.7519 },
  { icao: 'LTBA', iata: 'IST', name: 'Istanbul Atatürk', city: 'Istanbul', country: 'TR', lat: 40.9769, lon: 28.8146 },
  { icao: 'LGAV', iata: 'ATH', name: 'Athens Intl', city: 'Athens', country: 'GR', lat: 37.9364, lon: 23.9445 },
  
  // Asia
  { icao: 'RJTT', iata: 'HND', name: 'Tokyo Haneda', city: 'Tokyo', country: 'JP', lat: 35.5494, lon: 139.7798 },
  { icao: 'RJBB', iata: 'KIX', name: 'Osaka Kansai', city: 'Osaka', country: 'JP', lat: 34.4347, lon: 135.2441 },
  { icao: 'RKSI', iata: 'ICN', name: 'Seoul Incheon', city: 'Seoul', country: 'KR', lat: 37.4602, lon: 126.4407 },
  { icao: 'VHHH', iata: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'HK', lat: 22.3080, lon: 113.9185 },
  { icao: 'WSSS', iata: 'SIN', name: 'Singapore Changi', city: 'Singapore', country: 'SG', lat: 1.3644, lon: 103.9915 },
  { icao: 'VOMM', iata: 'MAA', name: 'Chennai', city: 'Chennai', country: 'IN', lat: 12.9941, lon: 80.1709 },
  { icao: 'VIDP', iata: 'DEL', name: 'Delhi Indira Gandhi', city: 'New Delhi', country: 'IN', lat: 28.5665, lon: 77.1031 },
  { icao: 'VABB', iata: 'BOM', name: 'Mumbai Chhatrapati Shivaji', city: 'Mumbai', country: 'IN', lat: 19.0896, lon: 72.8656 },
  { icao: 'ZBAA', iata: 'PEK', name: 'Beijing Capital', city: 'Beijing', country: 'CN', lat: 40.0799, lon: 116.6031 },
  { icao: 'ZSPD', iata: 'PVG', name: 'Shanghai Pudong', city: 'Shanghai', country: 'CN', lat: 31.1443, lon: 121.8083 },
  { icao: 'ZGGG', iata: 'CAN', name: 'Guangzhou Baiyun', city: 'Guangzhou', country: 'CN', lat: 23.3924, lon: 113.2988 },
  { icao: 'VTBS', iata: 'BKK', name: 'Bangkok Suvarnabhumi', city: 'Bangkok', country: 'TH', lat: 13.6900, lon: 100.7501 },
  { icao: 'WMKK', iata: 'KUL', name: 'Kuala Lumpur Intl', city: 'Kuala Lumpur', country: 'MY', lat: 2.7456, lon: 101.7099 },
  
  // Middle East
  { icao: 'OMDB', iata: 'DXB', name: 'Dubai Intl', city: 'Dubai', country: 'AE', lat: 25.2528, lon: 55.3644 },
  { icao: 'OTHH', iata: 'DOH', name: 'Doha Hamad Intl', city: 'Doha', country: 'QA', lat: 25.2731, lon: 51.6080 },
  { icao: 'OEJN', iata: 'JED', name: 'Jeddah King Abdulaziz', city: 'Jeddah', country: 'SA', lat: 21.6796, lon: 39.1565 },
  
  // Oceania
  { icao: 'YSSY', iata: 'SYD', name: 'Sydney Kingsford Smith', city: 'Sydney', country: 'AU', lat: -33.9399, lon: 151.1753 },
  { icao: 'YMML', iata: 'MEL', name: 'Melbourne', city: 'Melbourne', country: 'AU', lat: -37.6690, lon: 144.8410 },
  { icao: 'YBBN', iata: 'BNE', name: 'Brisbane', city: 'Brisbane', country: 'AU', lat: -27.3942, lon: 153.1218 },
  { icao: 'NZAA', iata: 'AKL', name: 'Auckland', city: 'Auckland', country: 'NZ', lat: -37.0081, lon: 174.7850 },
  
  // South America
  { icao: 'SBGR', iata: 'GRU', name: 'São Paulo Guarulhos', city: 'São Paulo', country: 'BR', lat: -23.4356, lon: -46.4731 },
  { icao: 'SAEZ', iata: 'EZE', name: 'Buenos Aires Ezeiza', city: 'Buenos Aires', country: 'AR', lat: -34.8222, lon: -58.5358 },
  { icao: 'SCEL', iata: 'SCL', name: 'Santiago Arturo Merino Benítez', city: 'Santiago', country: 'CL', lat: -33.3930, lon: -70.7858 },
  { icao: 'SKBO', iata: 'BOG', name: 'Bogotá El Dorado', city: 'Bogotá', country: 'CO', lat: 4.7016, lon: -74.1469 },
  
  // Africa
  { icao: 'FACT', iata: 'CPT', name: 'Cape Town Intl', city: 'Cape Town', country: 'ZA', lat: -33.9715, lon: 18.6021 },
  { icao: 'FAOR', iata: 'JNB', name: 'Johannesburg OR Tambo', city: 'Johannesburg', country: 'ZA', lat: -26.1392, lon: 28.2460 },
  { icao: 'HECA', iata: 'CAI', name: 'Cairo Intl', city: 'Cairo', country: 'EG', lat: 30.1219, lon: 31.4056 },
  { icao: 'GMMN', iata: 'RAK', name: 'Marrakech Menara', city: 'Marrakech', country: 'MA', lat: 31.6069, lon: -8.0363 },
  { icao: 'GMAD', iata: 'AGA', name: 'Agadir Al Massira', city: 'Agadir', country: 'MA', lat: 30.3250, lon: -9.4131 },
  { icao: 'DTTA', iata: 'TUN', name: 'Tunis Carthage', city: 'Tunis', country: 'TN', lat: 36.8510, lon: 10.2271 },
  { icao: 'DAAG', iata: 'ALG', name: 'Algiers Houari Boumediene', city: 'Algiers', country: 'DZ', lat: 36.6910, lon: 3.2154 },
  { icao: 'GCLP', iata: 'LPA', name: 'Gran Canaria', city: 'Las Palmas', country: 'ES', lat: 27.9319, lon: -15.3866 },
  { icao: 'GCTS', iata: 'TFS', name: 'Tenerife South', city: 'Tenerife', country: 'ES', lat: 28.0445, lon: -16.5725 },
  
  // Additional European Airports
  { icao: 'LFPB', iata: 'LBG', name: 'Paris Le Bourget', city: 'Paris', country: 'FR', lat: 48.9694, lon: 2.4414 },
  { icao: 'LFLL', iata: 'LYS', name: 'Lyon Saint-Exupéry', city: 'Lyon', country: 'FR', lat: 45.7256, lon: 5.0811 },
  { icao: 'LFMN', iata: 'NCE', name: 'Nice Côte d\'Azur', city: 'Nice', country: 'FR', lat: 43.6584, lon: 7.2159 },
  { icao: 'LFBD', iata: 'BOD', name: 'Bordeaux Mérignac', city: 'Bordeaux', country: 'FR', lat: 44.8283, lon: -0.7155 },
  { icao: 'LFML', iata: 'MRS', name: 'Marseille Provence', city: 'Marseille', country: 'FR', lat: 43.4393, lon: 5.2214 },
  { icao: 'EGPH', iata: 'EDI', name: 'Edinburgh', city: 'Edinburgh', country: 'GB', lat: 55.9500, lon: -3.3725 },
  { icao: 'EGPF', iata: 'GLA', name: 'Glasgow', city: 'Glasgow', country: 'GB', lat: 55.8719, lon: -4.4333 },
  { icao: 'EGBB', iata: 'BHX', name: 'Birmingham', city: 'Birmingham', country: 'GB', lat: 52.4539, lon: -1.7480 },
  { icao: 'EGGW', iata: 'LTN', name: 'London Luton', city: 'London', country: 'GB', lat: 51.8747, lon: -0.3683 },
  { icao: 'LEPA', iata: 'PMI', name: 'Palma de Mallorca', city: 'Palma', country: 'ES', lat: 39.5517, lon: 2.7388 },
  { icao: 'LEBB', iata: 'BIO', name: 'Bilbao', city: 'Bilbao', country: 'ES', lat: 43.3011, lon: -2.9106 },
  { icao: 'LEAM', iata: 'AGP', name: 'Almería', city: 'Almería', country: 'ES', lat: 36.8439, lon: -2.3701 },
  { icao: 'LIME', iata: 'BGY', name: 'Milan Bergamo', city: 'Milan', country: 'IT', lat: 45.6739, lon: 9.7042 },
  { icao: 'LIML', iata: 'LIN', name: 'Milan Linate', city: 'Milan', country: 'IT', lat: 45.4456, lon: 9.2767 },
  { icao: 'LIRN', iata: 'NAP', name: 'Naples', city: 'Naples', country: 'IT', lat: 40.8860, lon: 14.2908 },
  { icao: 'LICJ', iata: 'CTA', name: 'Catania Fontanarossa', city: 'Catania', country: 'IT', lat: 37.4668, lon: 15.0664 },
  { icao: 'LFRS', iata: 'NTE', name: 'Nantes Atlantique', city: 'Nantes', country: 'FR', lat: 47.1532, lon: -1.6108 },
  { icao: 'EDDL', iata: 'DUS', name: 'Düsseldorf', city: 'Düsseldorf', country: 'DE', lat: 51.2895, lon: 6.7668 },
  { icao: 'EDDK', iata: 'CGN', name: 'Cologne Bonn', city: 'Cologne', country: 'DE', lat: 50.8659, lon: 7.1427 },
  { icao: 'EDDS', iata: 'STR', name: 'Stuttgart', city: 'Stuttgart', country: 'DE', lat: 48.6899, lon: 9.2220 },
  
  // Additional North America
  { icao: 'KBOS', iata: 'BOS', name: 'Boston Logan', city: 'Boston', country: 'US', lat: 42.3656, lon: -71.0096 },
  { icao: 'KIAD', iata: 'IAD', name: 'Washington Dulles', city: 'Washington DC', country: 'US', lat: 38.9531, lon: -77.4565 },
  { icao: 'KPHX', iata: 'PHX', name: 'Phoenix Sky Harbor', city: 'Phoenix', country: 'US', lat: 33.4342, lon: -112.0080 },
  { icao: 'KMCO', iata: 'MCO', name: 'Orlando Intl', city: 'Orlando', country: 'US', lat: 28.4312, lon: -81.3081 },
  { icao: 'KPHL', iata: 'PHL', name: 'Philadelphia Intl', city: 'Philadelphia', country: 'US', lat: 39.8744, lon: -75.2424 },
  { icao: 'KPDX', iata: 'PDX', name: 'Portland Intl', city: 'Portland', country: 'US', lat: 45.5898, lon: -122.5951 },
  { icao: 'KDTW', iata: 'DTW', name: 'Detroit Metropolitan', city: 'Detroit', country: 'US', lat: 42.2162, lon: -83.3554 },
  { icao: 'KBWI', iata: 'BWI', name: 'Baltimore/Washington', city: 'Baltimore', country: 'US', lat: 39.1774, lon: -76.6684 },
  { icao: 'KMSP', iata: 'MSP', name: 'Minneapolis-St Paul', city: 'Minneapolis', country: 'US', lat: 44.8820, lon: -93.2218 },
  { icao: 'CYHZ', iata: 'YHZ', name: 'Halifax Stanfield', city: 'Halifax', country: 'CA', lat: 44.8808, lon: -63.5086 },
  { icao: 'CYUL', iata: 'YUL', name: 'Montréal Trudeau', city: 'Montreal', country: 'CA', lat: 45.4706, lon: -73.7408 },
  { icao: 'CYYC', iata: 'YYC', name: 'Calgary Intl', city: 'Calgary', country: 'CA', lat: 51.1139, lon: -114.0203 },
  
  // Caribbean & Central America
  { icao: 'MDSD', iata: 'SDQ', name: 'Santo Domingo Las Américas', city: 'Santo Domingo', country: 'DO', lat: 18.4297, lon: -69.6689 },
  { icao: 'MKJP', iata: 'KIN', name: 'Kingston Norman Manley', city: 'Kingston', country: 'JM', lat: 17.9357, lon: -76.7875 },
  { icao: 'TJSJ', iata: 'SJU', name: 'San Juan Luis Muñoz Marín', city: 'San Juan', country: 'PR', lat: 18.4394, lon: -66.0018 },
  { icao: 'MROC', iata: 'SJO', name: 'San José Juan Santamaría', city: 'San José', country: 'CR', lat: 9.9939, lon: -84.2088 },
  { icao: 'MPTO', iata: 'PTY', name: 'Panama Tocumen', city: 'Panama City', country: 'PA', lat: 9.0714, lon: -79.3835 },
  
  // Additional Asia
  { icao: 'VTBD', iata: 'DMK', name: 'Bangkok Don Mueang', city: 'Bangkok', country: 'TH', lat: 13.9126, lon: 100.6070 },
  { icao: 'VHHX', iata: 'HKG', name: 'Hong Kong Intl', city: 'Hong Kong', country: 'HK', lat: 22.3080, lon: 113.9185 },
  { icao: 'RPLL', iata: 'MNL', name: 'Manila Ninoy Aquino', city: 'Manila', country: 'PH', lat: 14.5086, lon: 121.0194 },
  { icao: 'WIII', iata: 'CGK', name: 'Jakarta Soekarno-Hatta', city: 'Jakarta', country: 'ID', lat: -6.1256, lon: 106.6559 },
  { icao: 'WADD', iata: 'DPS', name: 'Bali Ngurah Rai', city: 'Denpasar', country: 'ID', lat: -8.7482, lon: 115.1670 },
  { icao: 'VVNB', iata: 'HAN', name: 'Hanoi Noi Bai', city: 'Hanoi', country: 'VN', lat: 21.2212, lon: 105.8071 },
  { icao: 'VVTS', iata: 'SGN', name: 'Ho Chi Minh City Tan Son Nhat', city: 'Ho Chi Minh', country: 'VN', lat: 10.8188, lon: 106.6519 },
  { icao: 'RCTP', iata: 'TPE', name: 'Taipei Taoyuan', city: 'Taipei', country: 'TW', lat: 25.0777, lon: 121.2328 },
  { icao: 'RKPC', iata: 'CJU', name: 'Jeju Intl', city: 'Jeju', country: 'KR', lat: 33.5113, lon: 126.4930 },
  { icao: 'RJAA', iata: 'NRT', name: 'Tokyo Narita', city: 'Tokyo', country: 'JP', lat: 35.7647, lon: 140.3864 },
  { icao: 'RJGG', iata: 'NGO', name: 'Nagoya Chubu Centrair', city: 'Nagoya', country: 'JP', lat: 34.8584, lon: 136.8054 },
  { icao: 'RJFF', iata: 'FUK', name: 'Fukuoka', city: 'Fukuoka', country: 'JP', lat: 33.5859, lon: 130.4510 },
];

/**
 * Get airports within a certain distance of a location
 */
export function getAirportsInRange(
  lat: number,
  lon: number,
  radiusKm: number
): AirportData[] {
  return MAJOR_AIRPORTS.filter((airport) => {
    const distance = calculateDistance(lat, lon, airport.lat, airport.lon);
    return distance <= radiusKm;
  });
}

/**
 * Calculate distance between two coordinates in kilometers using Haversine formula
 */
function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}
