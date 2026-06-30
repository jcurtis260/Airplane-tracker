'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Airplane, FlightRoute } from '@/lib/types';
import { getAltitudeColor, getCountryFromICAO, formatAltitude, formatSpeed, getAirplaneRoute } from '@/lib/airplane-api';
import { formatAirport } from '@/lib/route-api';
import { Plane, MapPin, PlaneTakeoff, PlaneLanding, Loader2 } from 'lucide-react';

interface AirplaneListProps {
  airplanes: Airplane[];
  selectedAirplane: Airplane | null;
  onAirplaneClick: (airplane: Airplane) => void;
}

interface AirplaneWithRoute {
  airplane: Airplane;
  route: FlightRoute | null | undefined;
  loading: boolean;
}

function AirplaneListItem({ 
  airplane, 
  isSelected,
  route,
  loading,
  onClick 
}: { 
  airplane: Airplane; 
  isSelected: boolean;
  route: FlightRoute | null | undefined;
  loading: boolean;
  onClick: () => void;
}) {
  const altitudeColor = getAltitudeColor(airplane.alt_baro);
  const hasPosition = airplane.lat !== undefined && airplane.lon !== undefined;

  return (
    <Card
      className={`cursor-pointer transition-all hover:shadow-md ${
        isSelected ? 'ring-2 ring-primary shadow-lg' : ''
      }`}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {/* Callsign and Country */}
            <div className="flex items-center gap-2 mb-2">
              <Plane 
                className="h-5 w-5 flex-shrink-0" 
                style={{ color: altitudeColor }}
              />
              <h3 className="font-semibold text-lg truncate">
                {airplane.flight?.trim() || airplane.r || airplane.hex.toUpperCase()}
              </h3>
            </div>

            {/* Route Information */}
            {airplane.flight && (
              <div className="mb-2 text-xs">
                {loading ? (
                  <div className="flex items-center gap-1.5 text-muted-foreground">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    <span>Loading route...</span>
                  </div>
                ) : route?.origin || route?.destination ? (
                  <div className="flex items-center gap-1.5 text-muted-foreground bg-secondary/30 rounded px-2 py-1">
                    {route.origin && (
                      <>
                        <PlaneTakeoff className="h-3 w-3 text-green-600 dark:text-green-400 flex-shrink-0" />
                        <span className="font-medium text-foreground">
                          {route.origin.iata || route.origin.icao}
                        </span>
                      </>
                    )}
                    {route.origin && route.destination && (
                      <span className="mx-0.5">→</span>
                    )}
                    {route.destination && (
                      <>
                        <PlaneLanding className="h-3 w-3 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                        <span className="font-medium text-foreground">
                          {route.destination.iata || route.destination.icao}
                        </span>
                      </>
                    )}
                  </div>
                ) : null}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
              {airplane.r && (
                <div>
                  <span className="text-muted-foreground">Reg:</span>{' '}
                  <span className="font-medium">{airplane.r}</span>
                </div>
              )}
              {airplane.t && (
                <div>
                  <span className="text-muted-foreground">Type:</span>{' '}
                  <span className="font-medium">{airplane.t}</span>
                </div>
              )}
              <div>
                <span className="text-muted-foreground">Country:</span>{' '}
                <span className="font-medium">{getCountryFromICAO(airplane.hex)}</span>
              </div>
              {airplane.alt_baro !== undefined && (
                <div>
                  <span className="text-muted-foreground">Alt:</span>{' '}
                  <span className="font-medium" style={{ color: altitudeColor }}>
                    {formatAltitude(airplane.alt_baro)}
                  </span>
                </div>
              )}
              {airplane.gs !== undefined && (
                <div>
                  <span className="text-muted-foreground">Speed:</span>{' '}
                  <span className="font-medium">{formatSpeed(airplane.gs)}</span>
                </div>
              )}
              {hasPosition && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    {airplane.lat?.toFixed(2)}, {airplane.lon?.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex flex-col items-end gap-1">
            {airplane.flight && (
              <Badge variant="secondary" className="text-xs">
                {airplane.flight.trim()}
              </Badge>
            )}
            {airplane.squawk && (
              <Badge variant="outline" className="text-xs font-mono">
                {airplane.squawk}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function AirplaneList({ airplanes, selectedAirplane, onAirplaneClick }: AirplaneListProps) {
  const [airplanesWithRoutes, setAirplanesWithRoutes] = useState<AirplaneWithRoute[]>([]);

  useEffect(() => {
    // Initialize state for all airplanes
    const initialState: AirplaneWithRoute[] = airplanes.map(airplane => ({
      airplane,
      route: undefined,
      loading: false,
    }));
    setAirplanesWithRoutes(initialState);

    // Fetch routes for airplanes with callsigns
    airplanes.forEach((airplane, index) => {
      if (airplane.flight && airplane.flight.trim().length > 0) {
        setAirplanesWithRoutes(prev => {
          const newState = [...prev];
          if (newState[index]) {
            newState[index].loading = true;
          }
          return newState;
        });

        getAirplaneRoute(airplane.flight).then(route => {
          setAirplanesWithRoutes(prev => {
            const newState = [...prev];
            if (newState[index]) {
              newState[index].route = route;
              newState[index].loading = false;
            }
            return newState;
          });
        }).catch(() => {
          setAirplanesWithRoutes(prev => {
            const newState = [...prev];
            if (newState[index]) {
              newState[index].route = null;
              newState[index].loading = false;
            }
            return newState;
          });
        });
      }
    });
  }, [airplanes]);

  if (airplanes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <Plane className="h-12 w-12 text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No Airplanes Found</h3>
        <p className="text-sm text-muted-foreground">
          There are no aircraft in range at the moment.
        </p>
      </div>
    );
  }

  const routeCount = airplanesWithRoutes.filter(
    item => item.route?.origin || item.route?.destination
  ).length;

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Nearby Aircraft</h2>
        <p className="text-sm text-muted-foreground">
          {airplanes.length} airplane{airplanes.length !== 1 ? 's' : ''} in range
          {routeCount > 0 && ` • ${routeCount} with routes`}
        </p>
      </div>

      {airplanesWithRoutes.map((item, index) => (
        <AirplaneListItem
          key={item.airplane.hex}
          airplane={item.airplane}
          isSelected={selectedAirplane?.hex === item.airplane.hex}
          route={item.route}
          loading={item.loading}
          onClick={() => onAirplaneClick(item.airplane)}
        />
      ))}
    </div>
  );
}
