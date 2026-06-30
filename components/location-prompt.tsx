'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { UserLocation } from '@/lib/types';
import { Loader2, MapPin } from 'lucide-react';

interface LocationPromptProps {
  onLocationDetected: (location: UserLocation) => void;
  onError: (error: string) => void;
}

export function LocationPrompt({ onLocationDetected, onError }: LocationPromptProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestLocation = () => {
    if (!navigator.geolocation) {
      onError('Geolocation is not supported by your browser');
      return;
    }

    setIsLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location: UserLocation = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('userLocation', JSON.stringify(location));
        
        onLocationDetected(location);
        setIsLoading(false);
      },
      (error) => {
        setIsLoading(false);
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            onError('Location permission denied. Please enable location access or enter coordinates manually.');
            break;
          case error.POSITION_UNAVAILABLE:
            onError('Location information is unavailable. Please try again or enter coordinates manually.');
            break;
          case error.TIMEOUT:
            onError('Location request timed out. Please try again.');
            break;
          default:
            onError('An unknown error occurred while getting your location.');
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutes
      }
    );
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-center space-y-2 mb-4">
        <h2 className="text-2xl font-bold">Find Airplanes Near You</h2>
        <p className="text-muted-foreground max-w-md">
          We need your location to show airplanes flying overhead. Your location is only used 
          to find nearby aircraft and is never stored on our servers.
        </p>
      </div>
      
      <Button 
        onClick={requestLocation} 
        disabled={isLoading}
        size="lg"
        className="gap-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Getting your location...
          </>
        ) : (
          <>
            <MapPin className="h-5 w-5" />
            Find Airplanes Near Me
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center max-w-sm">
        Click the button above to grant location permission. 
        If you prefer not to share your location, you can enter coordinates manually below.
      </p>
    </div>
  );
}
