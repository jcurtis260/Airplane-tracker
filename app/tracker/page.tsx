'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Map2D } from '@/components/map-2d';
import { AirplaneCard } from '@/components/airplane-card';
import { AirportCard } from '@/components/airport-card';
import { AirplaneList } from '@/components/airplane-list';
import { CacheStats } from '@/components/cache-stats';
import { RadiusControl } from '@/components/radius-control';
import { ATCPlayer } from '@/components/atc-player';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useAirplanes } from '@/lib/airplane-api';
import { AirportData } from '@/lib/airports';
import { Airplane, UserLocation } from '@/lib/types';
import { Plane, AlertCircle, List, Map } from 'lucide-react';

function TrackerContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedAirplane, setSelectedAirplane] = useState<Airplane | null>(null);
  const [selectedAirport, setSelectedAirport] = useState<AirportData | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [radius, setRadius] = useState(250); // km - default 250km
  const [showATC, setShowATC] = useState(false);
  const [atcIcao, setAtcIcao] = useState<string | null>(null);

  // Initialize location from URL params or localStorage
  useEffect(() => {
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (lat && lon) {
      const location: UserLocation = {
        latitude: parseFloat(lat),
        longitude: parseFloat(lon),
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
      {/* View Toggle and Count - Mobile Optimized */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 flex flex-col sm:flex-row items-center gap-2">
        <Badge variant="secondary" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base shadow-lg">
          <Plane className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2" />
          <span className="hidden sm:inline">{isLoading ? 'Loading...' : `${total} airplane${total !== 1 ? 's' : ''} nearby`}</span>
          <span className="sm:hidden">{isLoading ? '...' : total}</span>
        </Badge>
        
        <Button
          variant="secondary"
          size="sm"
          className="shadow-lg h-8 sm:h-9 px-3 sm:px-4 text-sm"
          onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
        >
          {viewMode === 'map' ? (
            <>
              <List className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">List</span>
            </>
          ) : (
            <>
              <Map className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">Map</span>
            </>
          )}
        </Button>
      </div>

      {/* Radius Control - Mobile Optimized */}
      <div className="absolute bottom-20 sm:bottom-4 right-4 z-10">
        <RadiusControl radius={radius} onRadiusChange={setRadius} />
      </div>

      {/* Map or List View */}
      {viewMode === 'map' ? (
        <div 
          className="absolute inset-0"
          onClick={() => {
            setSelectedAirplane(null);
            setSelectedAirport(null);
          }}
        >
          <Map2D
            userLocation={userLocation}
            airplanes={airplanes}
            selectedAirplane={selectedAirplane}
            onAirplaneClick={(airplane) => {
              setSelectedAirplane(airplane);
              setSelectedAirport(null);
            }}
            onAirportClick={(airport) => {
              setSelectedAirport(airport);
              setSelectedAirplane(null);
              setAtcIcao(airport.icao);
              setShowATC(true);
            }}
            radius={radius}
          />
        </div>
      ) : (
        <div className="absolute inset-0 bg-background">
          <AirplaneList
            airplanes={airplanes}
            selectedAirplane={selectedAirplane}
            onAirplaneClick={setSelectedAirplane}
          />
        </div>
      )}

      {/* Airport Details - shows only in map view */}
      {selectedAirport && viewMode === 'map' && (
        <AirportCard
          airport={selectedAirport}
          onClose={() => setSelectedAirport(null)}
        />
      )}

      {/* ATC Radio Player - shows when airport is selected */}
      {showATC && atcIcao && viewMode === 'map' && (
        <ATCPlayer
          icao={atcIcao}
          onClose={() => setShowATC(false)}
        />
      )}

      {/* Airplane Details - shows in both views */}
      {selectedAirplane && viewMode === 'map' && !selectedAirport && (
        <AirplaneCard
          airplane={selectedAirplane}
          onClose={() => setSelectedAirplane(null)}
        />
      )}
      
      {/* Airplane Details - bottom sheet for list view */}
      {selectedAirplane && viewMode === 'list' && (
        <div className="absolute bottom-0 left-0 right-0 z-20 max-h-[70vh] overflow-hidden">
          <AirplaneCard
            airplane={selectedAirplane}
            onClose={() => setSelectedAirplane(null)}
          />
        </div>
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

      {/* Cache Statistics - Mobile Optimized */}
      <div className="absolute bottom-4 left-4 z-10">
        <CacheStats />
      </div>
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
