# ✈️ Airplane Tracker

A real-time airplane tracking application that uses your GPS location to display and track airplanes flying overhead. Built with Next.js 15, featuring both 2D and 3D interactive map visualizations.

![Airplane Tracker](https://img.shields.io/badge/Next.js-15-black?style=flat&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat&logo=typescript)
![MapLibre](https://img.shields.io/badge/MapLibre-GL-green?style=flat)
![Deck.gl](https://img.shields.io/badge/Deck.gl-WebGL-orange?style=flat)

## Features

- 🌍 **Real-Time Tracking**: Live airplane data updated every 30 seconds
- ✈️ **Flight Routes**: View origin and destination airports for each flight
- 📊 **Detailed Information**: View callsign, altitude, speed, heading, aircraft type, and more
- 📍 **Location-Based**: Automatically detects your location or allows manual input
- 🎨 **Altitude Color Coding**: Visual distinction between low, medium, and high-altitude aircraft
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
- **Route Data**: [hexdb.io API](https://hexdb.io/)

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
2. **Or Enter Manually**: Input your coordinates or select a popular location
3. **View Airplanes**: See all nearby aircraft within 100km radius on an interactive map
4. **Get Details**: Click any airplane marker to view detailed flight information including routes

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

## API Rate Limits

The app uses the [airplanes.live API](https://airplanes.live/) which has the following limits:
- **Rate**: 1 request per second
- **Access**: Free, no authentication required
- **Data**: Live ADS-B flight data from thousands of aircraft globally

The app implements automatic rate limiting and caching to stay within these limits.

## Project Structure

```
airplane-tracker/
├── app/
│   ├── api/airplanes/     # API proxy endpoint
│   ├── tracker/           # Main tracking page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── ui/                # shadcn/ui components
│   ├── airplane-card.tsx  # Flight details panel
│   ├── location-prompt.tsx # Geolocation UI
│   ├── manual-location.tsx # Manual coordinate entry
│   ├── map-2d.tsx         # 2D MapLibre map
│   ├── map-3d.tsx         # 3D Deck.gl map
│   └── view-toggle.tsx    # 2D/3D toggle button
├── lib/
│   ├── airplane-api.ts    # API client and utilities
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
- **2D Mode**: MapLibre GL JS with vector tiles
- **3D Mode**: Deck.gl with WebGL rendering
- Custom airplane markers with heading indicators
- Altitude-based color coding (cyan → amber → red)
- Interactive click-to-select functionality

### Flight Data
- ICAO24 hex identifier
- Callsign and registration
- Aircraft type
- Real-time position (lat/lon)
- Barometric altitude
- Ground speed and heading
- Vertical rate
- Last update timestamp

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for any purpose.

## Acknowledgments

- Flight data provided by [airplanes.live](https://airplanes.live/)
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
