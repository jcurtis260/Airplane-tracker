'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Airplane } from '@/lib/types';
import { getAltitudeColor, getCountryFromICAO, formatAltitude, formatSpeed } from '@/lib/airplane-api';
import { Plane, MapPin } from 'lucide-react';

interface AirplaneListProps {
  airplanes: Airplane[];
  selectedAirplane: Airplane | null;
  onAirplaneClick: (airplane: Airplane) => void;
}

export function AirplaneList({ airplanes, selectedAirplane, onAirplaneClick }: AirplaneListProps) {
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

  return (
    <div className="h-full overflow-y-auto p-4 space-y-3">
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-1">Nearby Aircraft</h2>
        <p className="text-sm text-muted-foreground">
          {airplanes.length} airplane{airplanes.length !== 1 ? 's' : ''} in range
        </p>
      </div>

      {airplanes.map((airplane) => {
        const altitudeColor = getAltitudeColor(airplane.alt_baro);
        const isSelected = selectedAirplane?.hex === airplane.hex;
        const hasPosition = airplane.lat !== undefined && airplane.lon !== undefined;

        return (
          <Card
            key={airplane.hex}
            className={`cursor-pointer transition-all hover:shadow-md ${
              isSelected ? 'ring-2 ring-primary shadow-lg' : ''
            }`}
            onClick={() => onAirplaneClick(airplane)}
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
      })}
    </div>
  );
}
