'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AirportData } from '@/lib/airports';
import { X, Building2, MapPin, Globe } from 'lucide-react';

interface AirportCardProps {
  airport: AirportData;
  onClose: () => void;
}

export function AirportCard({ airport, onClose }: AirportCardProps) {
  return (
    <Card 
      className="absolute left-4 top-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto z-10 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-purple-600" />
            <CardTitle className="text-lg">
              {airport.name}
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
        {/* Airport Codes */}
        <div className="flex items-center gap-2">
          <Badge variant="default" className="text-base font-bold px-3 py-1">
            {airport.iata}
          </Badge>
          <Badge variant="secondary" className="text-sm font-mono">
            {airport.icao}
          </Badge>
        </div>

        {/* Location Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-muted-foreground">Location</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="font-medium">{airport.city}</div>
                <div className="text-xs text-muted-foreground">{airport.country}</div>
              </div>
            </div>
            
            <div className="flex items-start gap-2">
              <Globe className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
              <div>
                <div className="text-xs text-muted-foreground">Coordinates</div>
                <div className="font-mono text-xs">
                  {airport.lat.toFixed(4)}°, {airport.lon.toFixed(4)}°
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Airport Info */}
        <div className="space-y-2 pt-2 border-t">
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-secondary/50 rounded p-2">
              <div className="text-muted-foreground mb-1">IATA Code</div>
              <div className="font-bold text-base">{airport.iata}</div>
            </div>
            <div className="bg-secondary/50 rounded p-2">
              <div className="text-muted-foreground mb-1">ICAO Code</div>
              <div className="font-bold text-base">{airport.icao}</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-2 pt-2 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground">Quick Links</h3>
          <div className="flex flex-col gap-2">
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => {
                window.open(
                  `https://www.google.com/maps/search/?api=1&query=${airport.lat},${airport.lon}`,
                  '_blank'
                );
              }}
            >
              <MapPin className="h-3 w-3 mr-2" />
              View on Google Maps
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start text-xs"
              onClick={() => {
                window.open(
                  `https://www.flightradar24.com/airport/${airport.iata.toLowerCase()}`,
                  '_blank'
                );
              }}
            >
              <Building2 className="h-3 w-3 mr-2" />
              View on FlightRadar24
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
