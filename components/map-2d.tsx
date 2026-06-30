'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { Marker, Source, Layer, MapRef } from 'react-map-gl/maplibre';
import { Airplane, UserLocation } from '@/lib/types';
import { getAltitudeColor } from '@/lib/airplane-api';
import { Plane } from 'lucide-react';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Map2DProps {
  userLocation: UserLocation;
  airplanes: Airplane[];
  selectedAirplane: Airplane | null;
  onAirplaneClick: (airplane: Airplane) => void;
  radius: number;
}

export function Map2D({
  userLocation,
  airplanes,
  selectedAirplane,
  onAirplaneClick,
  radius,
}: Map2DProps) {
  const mapRef = useRef<MapRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create GeoJSON for the radius circle
  const radiusCircle = {
    type: 'Feature' as const,
    properties: {},
    geometry: {
      type: 'Point' as const,
      coordinates: [userLocation.lon, userLocation.lat],
    },
  };

  if (!mounted) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        latitude: userLocation.lat,
        longitude: userLocation.lon,
        zoom: 9,
      }}
      style={{ width: '100%', height: '100%' }}
      mapStyle="https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"
    >
      {/* Radius circle */}
      <Source id="radius" type="geojson" data={radiusCircle}>
        <Layer
          id="radius-circle"
          type="circle"
          paint={{
            'circle-radius': 200,
            'circle-color': '#3b82f6',
            'circle-opacity': 0.1,
            'circle-stroke-width': 2,
            'circle-stroke-color': '#3b82f6',
            'circle-stroke-opacity': 0.5,
          }}
        />
      </Source>

      {/* User location marker */}
      <Marker
        latitude={userLocation.lat}
        longitude={userLocation.lon}
        anchor="center"
      >
        <div className="relative flex items-center justify-center">
          <div className="absolute w-4 h-4 bg-blue-500 rounded-full animate-ping opacity-75" />
          <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-lg" />
        </div>
      </Marker>

      {/* Airplane markers */}
      {airplanes.map((airplane) => {
        if (airplane.lat === undefined || airplane.lon === undefined) return null;
        
        const color = getAltitudeColor(airplane.alt_baro);
        const isSelected = selectedAirplane?.hex === airplane.hex;
        
        return (
          <Marker
            key={airplane.hex}
            latitude={airplane.lat}
            longitude={airplane.lon}
            anchor="center"
            onClick={(e) => {
              e.originalEvent.stopPropagation();
              onAirplaneClick(airplane);
            }}
          >
            <button
              className={`relative transition-transform hover:scale-125 cursor-pointer ${
                isSelected ? 'scale-125 z-10' : ''
              }`}
              style={{
                transform: airplane.track !== undefined 
                  ? `rotate(${airplane.track}deg)` 
                  : undefined,
              }}
              onClick={(e) => {
                e.stopPropagation(); // Prevent map click from closing
              }}
            >
              <Plane
                className={`w-6 h-6 ${isSelected ? 'drop-shadow-lg' : ''}`}
                style={{ 
                  color,
                  fill: color,
                  strokeWidth: 0.5,
                  stroke: isSelected ? 'white' : color,
                }}
              />
              {isSelected && (
                <div className="absolute -inset-2 bg-white/20 rounded-full animate-pulse" />
              )}
            </button>
          </Marker>
        );
      })}
    </Map>
  );
}
