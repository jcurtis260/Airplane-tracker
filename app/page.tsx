'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationPrompt } from '@/components/location-prompt';
import { ManualLocation } from '@/components/manual-location';
import { UserLocation } from '@/lib/types';
import { Plane, Globe, Eye, Zap } from 'lucide-react';

export default function Home() {
  const router = useRouter();
  const [error, setError] = useState<string>('');

  const handleLocationDetected = (location: UserLocation) => {
    router.push(`/tracker?lat=${location.lat}&lon=${location.lon}`);
  };

  const handleLocationError = (errorMessage: string) => {
    setError(errorMessage);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="relative">
              <Plane className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full animate-ping" />
            </div>
          </div>
          
          <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
            Airplane Tracker
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track airplanes flying overhead in real-time. View detailed flight information, 
            see aircraft on an interactive map, and switch between 2D and 3D views.
          </p>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border">
              <Globe className="h-8 w-8 mx-auto mb-3 text-blue-600 dark:text-blue-400" />
              <h3 className="font-semibold mb-2">Real-Time Tracking</h3>
              <p className="text-sm text-muted-foreground">
                Live airplane data updated every 30 seconds
              </p>
            </div>
            
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border">
              <Eye className="h-8 w-8 mx-auto mb-3 text-purple-600 dark:text-purple-400" />
              <h3 className="font-semibold mb-2">2D & 3D Views</h3>
              <p className="text-sm text-muted-foreground">
                Toggle between flat map and immersive 3D visualization
              </p>
            </div>
            
            <div className="p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-lg border">
              <Zap className="h-8 w-8 mx-auto mb-3 text-orange-600 dark:text-orange-400" />
              <h3 className="font-semibold mb-2">Detailed Info</h3>
              <p className="text-sm text-muted-foreground">
                View speed, altitude, heading, aircraft type, and more
              </p>
            </div>
          </div>
        </div>

        {/* Location Prompt */}
        <div className="max-w-2xl mx-auto space-y-8">
          <LocationPrompt
            onLocationDetected={handleLocationDetected}
            onError={handleLocationError}
          />

          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-center">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          )}

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-gradient-to-br from-blue-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 text-muted-foreground">
                Or enter your location manually
              </span>
            </div>
          </div>

          <ManualLocation onLocationSet={handleLocationDetected} />
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-sm text-muted-foreground">
          <p>
            Data provided by{' '}
            <a
              href="https://airplanes.live"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              airplanes.live
            </a>
            {' '}• Built with Next.js, MapLibre, and Deck.gl
          </p>
        </div>
      </div>
    </div>
  );
}
