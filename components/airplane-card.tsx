'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Airplane, FlightRoute } from '@/lib/types';
import {
  formatSpeed,
  formatAltitude,
  formatVerticalRate,
  getCardinalDirection,
  getCountryFromICAO,
  getAltitudeColor,
  getAirplaneRoute,
} from '@/lib/airplane-api';
import { formatAirport } from '@/lib/route-api';
import { X, Plane, MapPin, Loader2, PlaneTakeoff, PlaneLanding } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AirplaneCardProps {
  airplane: Airplane;
  onClose: () => void;
}

export function AirplaneCard({ airplane, onClose }: AirplaneCardProps) {
  const altitudeColor = getAltitudeColor(airplane.alt_baro);
  const [route, setRoute] = useState<FlightRoute | null | undefined>(undefined);
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    // Fetch route information when airplane changes
    if (airplane.flight) {
      setLoadingRoute(true);
      getAirplaneRoute(airplane.flight)
        .then(setRoute)
        .finally(() => setLoadingRoute(false));
    } else {
      setRoute(null);
    }
  }, [airplane.flight, airplane.hex]);

  // Reset image error when airplane changes
  useEffect(() => {
    setImageError(false);
  }, [airplane.hex]);

  return (
    <Card 
      className="absolute left-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 shadow-lg"
      onClick={(e) => e.stopPropagation()} // Prevent click from closing
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Plane className="h-5 w-5" style={{ color: altitudeColor }} />
            <CardTitle className="text-lg">
              {airplane.flight?.trim() || airplane.r || airplane.hex}
            </CardTitle>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Aircraft Image */}
        {!imageError && (
          <div className="relative w-full h-32 bg-secondary/30 rounded-lg overflow-hidden">
            <img
              src={`https://hexdb.io/hex-image-thumb?hex=${airplane.hex}`}
              alt={`Aircraft ${airplane.hex}`}
              className="w-full h-full object-cover"
              onError={() => setImageError(true)}
              loading="lazy"
            />
          </div>
        )}

        {/* Basic Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Identification</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Callsign:</span>
              <span className="font-semibold text-base">{airplane.flight?.trim() || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Registration:</span>
              <span className="font-medium">{airplane.r || airplane.registration || 'N/A'}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">ICAO Hex:</span>
              <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">{airplane.hex.toUpperCase()}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Country:</span>
              <span className="font-medium">{getCountryFromICAO(airplane.hex)}</span>
            </div>
          </div>
        </div>

        {/* Flight Route */}
        {airplane.flight && (
          <div className="space-y-2 p-3 bg-secondary/50 rounded-lg">
            <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Flight Route
            </h3>
            {loadingRoute ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-3 w-3 animate-spin" />
                Loading route...
              </div>
            ) : route?.origin || route?.destination ? (
              <div className="space-y-2 text-sm">
                {route.origin && (
                  <div className="flex items-start gap-2">
                    <PlaneTakeoff className="h-4 w-4 mt-1 text-green-600 dark:text-green-400 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Departure</span>
                      <span className="font-semibold text-base" title={formatAirport(route.origin)}>
                        {formatAirport(route.origin)}
                      </span>
                    </div>
                  </div>
                )}
                {route.origin && route.destination && (
                  <div className="flex items-center gap-2 text-muted-foreground pl-6">
                    <div className="flex-1 border-t border-dashed" />
                  </div>
                )}
                {route.destination && (
                  <div className="flex items-start gap-2">
                    <PlaneLanding className="h-4 w-4 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                    <div className="flex flex-col gap-1">
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">Arrival</span>
                      <span className="font-semibold text-base" title={formatAirport(route.destination)}>
                        {formatAirport(route.destination)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ) : route === null ? (
              <p className="text-xs text-muted-foreground italic">Route information not available for this flight</p>
            ) : null}
          </div>
        )}

        {/* Aircraft Type */}
        {(airplane.t || airplane.type) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Aircraft</h3>
            <div className="text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Type:</span>
                <Badge variant="secondary">{airplane.t || airplane.type}</Badge>
              </div>
            </div>
          </div>
        )}

        {/* Position */}
        {(airplane.lat !== undefined && airplane.lon !== undefined) && (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground">Position</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Latitude:</span>
                <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">{airplane.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Longitude:</span>
                <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">{airplane.lon.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Altitude:</span>
                <span className="font-semibold text-base px-2 py-0.5 rounded" style={{ color: altitudeColor, backgroundColor: `${altitudeColor}20` }}>
                  {formatAltitude(airplane.alt_baro)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Motion */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Motion</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Speed:</span>
              <span className="font-semibold">{formatSpeed(airplane.gs)}</span>
            </div>
            <div className="flex justify-between items-center gap-2">
              <span className="text-muted-foreground">Heading:</span>
              <span className="font-semibold">
                {airplane.track !== undefined 
                  ? `${Math.round(airplane.track)}° ${getCardinalDirection(airplane.track)}`
                  : 'N/A'}
              </span>
            </div>
            {airplane.baro_rate !== undefined && airplane.baro_rate !== 0 && (
              <div className="flex justify-between items-center gap-2">
                <span className="text-muted-foreground">Vertical:</span>
                <span className={`font-semibold ${airplane.baro_rate > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {formatVerticalRate(airplane.baro_rate)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Status</h3>
          <div className="space-y-1 text-sm">
            {airplane.squawk && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Squawk:</span>
                <Badge variant="outline" className="font-mono">
                  {airplane.squawk}
                </Badge>
              </div>
            )}
            {airplane.seen !== undefined && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last Seen:</span>
                <span className="font-medium">
                  {airplane.seen < 60 
                    ? `${Math.round(airplane.seen)}s ago`
                    : formatDistanceToNow(new Date(Date.now() - airplane.seen * 1000), { addSuffix: true })}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
