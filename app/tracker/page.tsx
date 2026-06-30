'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Map2D } from '@/components/map-2d';
import { AirplaneCard } from '@/components/airplane-card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useAirplanes } from '@/lib/airplane-api';
import { Airplane, UserLocation } from '@/lib/types';
import { Plane, AlertCircle } from 'lucide-react';

function TrackerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  const [radius] = useState(100); // km

  // Initialize location from URL params or localStorage
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
      const location = {
        lat: parseFloat(lat),
        lon: parseFloat(lon),
      };
      setUserLocation(location);
      localStorage.setItem('userLocation', JSON.stringify(location));
    } else {
      // Try to load from localStorage
      const saved = localStorage.getItem('userLocation');
      if (saved) {
        try {
          setUserLocation(JSON.parse(saved));
        } catch (e) {
          router.push('/');
        }
      } else {
        router.push('/');
      }
    }
  }, [searchParams, router]);

  const { airplanes, total, isLoading, isError } = useAirplanes(userLocation, radius);

  if (!userLocation) {
    return (
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-96" />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-screen h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
        <div className="text-center space-y-4 p-8">
          <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
          <h2 className="text-2xl font-bold">Failed to load airplane data</h2>
          <p className="text-muted-foreground">
            There was an error fetching airplane data. Please try again later.
          </p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Map - clicking on it closes the detail card */}
      <div 
        className="absolute inset-0"
        onClick={() => setSelectedAirplane(null)}
      >
        <Map2D
          userLocation={userLocation}
          airplanes={airplanes}
          selectedAirplane={selectedAirplane}
          onAirplaneClick={setSelectedAirplane}
          radius={radius}
        />
      </div>

      {/* Airplane Count Badge */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10">
        <Badge variant="secondary" className="px-4 py-2 text-base shadow-lg">
          <Plane className="h-4 w-4 mr-2" />
          {isLoading ? (
            'Loading...'
          ) : (
            <>
              {total} airplane{total !== 1 ? 's' : ''} nearby
            </>
          )}
        </Badge>
      </div>

      {/* Airplane Details */}
      {selectedAirplane && (
        <AirplaneCard
          airplane={selectedAirplane}
          onClose={() => setSelectedAirplane(null)}
        />
      )}

      {/* Empty State */}
      {!isLoading && airplanes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-background/90 backdrop-blur-sm p-8 rounded-lg shadow-lg text-center max-w-md">
            <Plane className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-xl font-semibold mb-2">No airplanes found</h3>
            <p className="text-muted-foreground">
              There are no airplanes within {radius} km of your location right now.
              Try again in a few moments or check a different location.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function TrackerPage() {
  return (
    <Suspense fallback={
      <div className="w-screen h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-64 w-96" />
        </div>
      </div>
    }>
      <TrackerContent />
    </Suspense>
  );
}
