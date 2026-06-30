# ✈️ Airplane Tracker

A real-time airplane tracking application that uses your GPS location to display and track airplanes flying overhead. Built with Next.js 15, featuring interactive 2D map visualization, airport markers, and aircraft images.

![Airplane Tracker](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![MapLibre](https://img.shields.io/badge/MapLibre-GL-green?style=flat)

## Features

- 🌍 **Real-Time Tracking**: Live airplane data updated every 30 seconds
- ✈️ **Flight Routes**: View origin and destination airports with takeoff/landing icons
- 🛫 **Airport Markers**: Major airports displayed on map with hover details
- 📡 **Live ATC Radio**: Listen to real-time Air Traffic Control communications (Tower, Ground, Approach, Departure)
- 📷 **Aircraft Images**: Thumbnail photos of tracked aircraft (when available)
- 📋 **List View**: Toggle between map and list views for easier testing and browsing
- 📊 **Detailed Information**: View callsign, altitude, speed, heading, aircraft type, and more
- 📍 **Location-Based**: Automatically detects your location or allows manual input
- 🎨 **Altitude Color Coding**: Visual distinction between low, medium, and high-altitude aircraft
- 💾 **Smart Caching**: Multi-layer caching (24h TTL) reduces API calls by 90%
- 🌙 **Dark Mode**: Automatic system preference detection
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices

## Technology Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Maps**: [MapLibre GL JS](https://maplibre.org/)
- **Data Fetching**: [SWR](https://swr.vercel.app/)
- **Flight Data**: [airplanes.live API](https://airplanes.live/)
- **Route Data**: [adsbdb.com API](https://adsbdb.com/) (primary), [hexdb.io API](https://hexdb.io/) (fallback)
- **Aircraft Images**: [hexdb.io](https://hexdb.io/)
- **ATC Audio**: [LiveATC.net](https://www.liveatc.net/) (40+ airports)

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- A modern web browser with geolocation support

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/airplane-tracker.git
cd airplane-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Grant Location Permission**: Click "Find Airplanes Near Me" and allow location access
2. **Or Select a City**: Choose from popular cities or enter your coordinates manually
3. **Adjust Search Radius**: Use the radius control (25km - 500km, default 250km)
4. **View Airplanes**: See all nearby aircraft on an interactive map with real-time updates
5. **Toggle View**: Switch between map and list views using the toggle button at the top
6. **Click Airport Icons**: Tap any purple airport marker to:
   - View airport details (ICAO, IATA, location)
   - Access live ATC radio frequencies (Tower, Ground, Approach, Departure)
   - Open LiveATC.net player for live audio streaming
7. **Get Flight Details**: Click any airplane marker to view detailed flight information including routes and images
8. **Monitor Cache Stats**: Check the cache indicator to see how many routes are cached locally

## Deployment

### Deploy to Vercel

The easiest way to deploy this app is using [Vercel](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/airplane-tracker)

Or manually:

```bash
npm run build
vercel deploy
```

### Environment Variables

No environment variables are required! The app uses free APIs:
- **airplanes.live**: Free ADS-B data API (no authentication needed)
- **MapLibre**: Open-source map renderer
- **Free map tiles**: CartoDB basemaps

## API Sources & Rate Limits

### Flight Data
- **[airplanes.live](https://airplanes.live/)**: Real-time ADS-B flight positions
  - Rate: 1 request per second
  - Free, no authentication required
  
### Route Information
- **[adsbdb.com](https://adsbdb.com/)** (primary): Flight routes, aircraft details
- **[hexdb.io](https://hexdb.io/)** (fallback): Route data and airport information

### ATC Radio
- **Real VHF Frequencies**: Actual frequencies for physical/SDR listening
- **[LiveATC.net](https://www.liveatc.net/)**: Live streams (mainly US)
- **[ATC-Live.com](https://www.atc-live.com/)**: Live streams (UK/Europe)
  - Coverage: UK (Heathrow, Gatwick, Stansted, Manchester), Spain (Madrid, Barcelona, Málaga, Bilbao), France, Germany, Netherlands, Ireland, and major US airports

### Performance Optimizations
The app implements multi-layer caching to reduce API calls:
- **Client-side cache**: 24h TTL for routes, 7d for aircraft metadata
- **Server-side cache**: 24h TTL (success), 1h TTL (failures)
- **CDN caching**: Edge caching with stale-while-revalidate
- **Result**: ~90% reduction in external API calls

## Project Structure

```
airplane-tracker/
├── app/
│   ├── api/
│   │   ├── airplanes/     # Airplane data proxy endpoint
│   │   └── route/         # Flight route proxy endpoint
│   ├── tracker/           # Main tracking page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── airplane-card.tsx  # Flight details panel with images
│   ├── airplane-list.tsx  # List view of all airplanes
│   ├── location-prompt.tsx # Geolocation UI
│   ├── manual-location.tsx # Manual coordinate entry
│   └── map-2d.tsx         # 2D MapLibre map with airports
├── lib/
│   ├── airplane-api.ts    # API client and utilities
│   ├── route-api.ts       # Route fetching client
│   ├── airports.ts        # Major airports database
│   ├── types.ts           # TypeScript interfaces
│   └── utils.ts           # Helper functions
└── public/                # Static assets
```

## Features in Detail

### Geolocation
- Modern browser Geolocation API
- User-initiated permission request (best practice)
- Fallback to manual coordinate entry
- Location persistence in localStorage

### Map Rendering
- **2D Map**: MapLibre GL JS with vector tiles
- **List View**: Scrollable list of all aircraft with key details
- Custom airplane markers with heading indicators
- Airport markers (50+ major airports worldwide)
- Altitude-based color coding (cyan → amber → red)
- Interactive click-to-select functionality
- Hover tooltips for airports

### Flight Data
- ICAO24 hex identifier
- Callsign and registration
- Aircraft type and thumbnail image
- Real-time position (lat/lon)
- Barometric altitude
- Ground speed and heading
- Vertical rate
- Flight route (origin/destination airports)
- Last update timestamp

### Route Information
- Dual API source strategy for maximum coverage:
  - **Primary**: adsbdb.com (comprehensive route database)
  - **Fallback**: hexdb.io (additional route coverage)
- Airport details including ICAO/IATA codes, city, country
- Visual takeoff 🛫 and landing 🛬 icons

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Flight data provided by [airplanes.live](https://airplanes.live/)
- Route data from [adsbdb.com](https://adsbdb.com/) and [hexdb.io](https://hexdb.io/)
- Aircraft images from [hexdb.io](https://hexdb.io/)
- Map tiles by [CartoDB](https://carto.com/basemaps/)
- Built with [Next.js](https://nextjs.org/) and [Vercel](https://vercel.com/)

## Support

If you find this project helpful, please consider:
- ⭐ Starring the repository
- 🐛 Reporting bugs and issues
- 💡 Suggesting new features
- 📖 Improving documentation

---

Made with ✈️ by the community
