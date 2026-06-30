'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Airplane } from '@/lib/types';
import {
  formatSpeed,
  formatAltitude,
  formatVerticalRate,
  getCardinalDirection,
  getCountryFromICAO,
  getAltitudeColor,
} from '@/lib/airplane-api';
import { X, Plane } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface AirplaneCardProps {
  airplane: Airplane;
  onClose: () => void;
}

export function AirplaneCard({ airplane, onClose }: AirplaneCardProps) {
  const altitudeColor = getAltitudeColor(airplane.alt_baro);

  return (
    <Card className="absolute left-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 shadow-lg">
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
        {/* Basic Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Identification</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Callsign:</span>
              <span className="font-medium">{airplane.flight?.trim() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Registration:</span>
              <span className="font-medium">{airplane.r || airplane.registration || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">ICAO Hex:</span>
              <span className="font-mono text-xs">{airplane.hex.toUpperCase()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Country:</span>
              <span className="font-medium">{getCountryFromICAO(airplane.hex)}</span>
            </div>
          </div>
        </div>

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
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Latitude:</span>
                <span className="font-mono text-xs">{airplane.lat.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Longitude:</span>
                <span className="font-mono text-xs">{airplane.lon.toFixed(4)}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Altitude:</span>
                <span className="font-medium" style={{ color: altitudeColor }}>
                  {formatAltitude(airplane.alt_baro)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Motion */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Motion</h3>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ground Speed:</span>
              <span className="font-medium">{formatSpeed(airplane.gs)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Heading:</span>
              <span className="font-medium">
                {airplane.track !== undefined 
                  ? `${Math.round(airplane.track)}° (${getCardinalDirection(airplane.track)})`
                  : 'N/A'}
              </span>
            </div>
            {airplane.baro_rate !== undefined && airplane.baro_rate !== 0 && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Vertical Rate:</span>
                <span className="font-medium">{formatVerticalRate(airplane.baro_rate)}</span>
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
