'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserLocation } from '@/lib/types';
import { MapPinned } from 'lucide-react';

interface ManualLocationProps {
  onLocationSet: (location: UserLocation) => void;
}

export function ManualLocation({ onLocationSet }: ManualLocationProps) {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      setError('Please enter valid numbers for latitude and longitude');
      return;
    }

    if (latitude < -90 || latitude > 90) {
      setError('Latitude must be between -90 and 90');
      return;
    }

    if (longitude < -180 || longitude > 180) {
      setError('Longitude must be between -180 and 180');
      return;
    }

    const location: UserLocation = { latitude, longitude };
    localStorage.setItem('userLocation', JSON.stringify(location));
    onLocationSet(location);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPinned className="h-5 w-5" />
          Enter Location Manually
        </CardTitle>
        <CardDescription>
          Enter your coordinates to find nearby airplanes
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="text"
              placeholder="e.g., 40.7128"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Value between -90 and 90
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="text"
              placeholder="e.g., -74.0060"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground">
              Value between -180 and 180
            </p>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <Button type="submit" className="w-full">
            Find Airplanes
          </Button>

          <div className="mt-4 pt-4 border-t">
            <p className="text-xs text-muted-foreground mb-2">Popular locations:</p>
            <div className="space-y-1">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => { setLat('40.7128'); setLon('-74.0060'); }}
              >
                New York: 40.7128, -74.0060
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => { setLat('51.5074'); setLon('-0.1278'); }}
              >
                London: 51.5074, -0.1278
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full justify-start text-xs"
                onClick={() => { setLat('35.6762'); setLon('139.6503'); }}
              >
                Tokyo: 35.6762, 139.6503
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
