'use client';

import { useEffect, useRef, useState } from 'react';
import Map, { MapRef, Source, Layer } from 'react-map-gl/maplibre';
import DeckGL from '@deck.gl/react';
import { IconLayer } from '@deck.gl/layers';
import { MapboxOverlay } from '@deck.gl/mapbox';
import { Airplane, UserLocation } from '@/lib/types';
import { getAltitudeColor } from '@/lib/airplane-api';
import 'maplibre-gl/dist/maplibre-gl.css';

interface Map3DProps {
  userLocation: UserLocation;
  airplanes: Airplane[];
  selectedAirplane: Airplane | null;
  onAirplaneClick: (airplane: Airplane) => void;
  radius: number;
}

export function Map3D({
  userLocation,
  airplanes,
  selectedAirplane,
  onAirplaneClick,
  radius,
}: Map3DProps) {
  const mapRef = useRef<MapRef>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Create icon layer for airplanes
  const airplaneLayer = new IconLayer({
    id: 'airplanes',
    data: airplanes.filter(a => a.lat !== undefined && a.lon !== undefined),
    getPosition: (d: Airplane) => [d.lon!, d.lat!, (d.alt_baro || 0) * 0.1], // Elevate based on altitude
    getIcon: () => ({
      url: 'data:image/svg+xml;base64,' + btoa(`
        <svg width="48" height="48" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <g transform="translate(24, 24)">
            <path d="M 0,-20 L 3,-15 L 3,10 L 8,15 L 8,17 L 3,15 L 3,18 L 5,20 L 0,19 L -5,20 L -3,18 L -3,15 L -8,17 L -8,15 L -3,10 L -3,-15 Z" 
                  fill="currentColor" stroke="white" stroke-width="1"/>
          </g>
        </svg>
      `),
      width: 48,
      height: 48,
    }),
    getSize: (d: Airplane) => (selectedAirplane?.hex === d.hex ? 48 : 32),
    getColor: (d: Airplane) => {
      const color = getAltitudeColor(d.alt_baro);
      const rgb = hexToRgb(color);
      return [...rgb, 255];
    },
    getAngle: (d: Airplane) => 360 - (d.track || 0),
    pickable: true,
    onClick: (info: any) => {
      if (info.object) {
        onAirplaneClick(info.object);
      }
    },
    updateTriggers: {
      getSize: [selectedAirplane?.hex],
      getColor: [selectedAirplane?.hex],
    },
  });

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
        <p className="text-muted-foreground">Loading 3D map...</p>
      </div>
    );
  }

  return (
    <DeckGL
      initialViewState={{
        latitude: userLocation.lat,
        longitude: userLocation.lon,
        zoom: 9,
        pitch: 45,
        bearing: 0,
      }}
      controller={true}
      layers={[airplaneLayer]}
      style={{ width: '100%', height: '100%' }}
    >
      <Map
        ref={mapRef}
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
        <Source
          id="user-location"
          type="geojson"
          data={{
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'Point',
              coordinates: [userLocation.lon, userLocation.lat],
            },
          }}
        >
          <Layer
            id="user-location-circle"
            type="circle"
            paint={{
              'circle-radius': 8,
              'circle-color': '#3b82f6',
              'circle-stroke-width': 2,
              'circle-stroke-color': '#ffffff',
            }}
          />
        </Source>
      </Map>
    </DeckGL>
  );
}

function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16),
      ]
    : [156, 163, 175]; // Default gray
}
