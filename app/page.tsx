'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocationPrompt } from '@/components/location-prompt';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plane, MapPin, Building2, Globe, Zap, Eye, Route } from 'lucide-react';

const POPULAR_CITIES = [
  { name: 'New York', lat: 40.7128, lon: -74.0060, country: 'USA', emoji: '🗽' },
  { name: 'London', lat: 51.5074, lon: -0.1278, country: 'UK', emoji: '🇬🇧' },
  { name: 'Paris', lat: 48.8566, lon: 2.3522, country: 'France', emoji: '🇫🇷' },
  { name: 'Tokyo', lat: 35.6762, lon: 139.6503, country: 'Japan', emoji: '🇯🇵' },
  { name: 'Dubai', lat: 25.2048, lon: 55.2708, country: 'UAE', emoji: '🇦🇪' },
  { name: 'Los Angeles', lat: 34.0522, lon: -118.2437, country: 'USA', emoji: '🌴' },
  { name: 'Singapore', lat: 1.3521, lon: 103.8198, country: 'Singapore', emoji: '🇸🇬' },
  { name: 'Sydney', lat: -33.8688, lon: 151.2093, country: 'Australia', emoji: '🇦🇺' },
  { name: 'Hong Kong', lat: 22.3193, lon: 114.1694, country: 'HK', emoji: '🇭🇰' },
  { name: 'Barcelona', lat: 41.3851, lon: 2.1734, country: 'Spain', emoji: '🇪🇸' },
  { name: 'Amsterdam', lat: 52.3676, lon: 4.9041, country: 'Netherlands', emoji: '🇳🇱' },
  { name: 'Istanbul', lat: 41.0082, lon: 28.9784, country: 'Turkey', emoji: '🇹🇷' },
];

export default function Home() {
  const router = useRouter();
  const [showLocationPrompt, setShowLocationPrompt] = useState(false);

  const handleCitySelect = (city: typeof POPULAR_CITIES[0]) => {
    router.push(`/tracker?lat=${city.lat}&lon=${city.lon}`);
  };

  const handleLocationDetected = (location: { lat: number; lon: number }) => {
    router.push(`/tracker?lat=${location.lat}&lon=${location.lon}`);
  };

  const handleLocationError = (error: string) => {
    console.error('Location error:', error);
    setShowLocationPrompt(false);
  };

  if (showLocationPrompt) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <LocationPrompt
          onLocationDetected={handleLocationDetected}
          onError={handleLocationError}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 animate-float">
            <Plane className="h-8 w-8 text-blue-300 dark:text-blue-700 opacity-20" />
          </div>
          <div className="absolute top-40 right-20 animate-float-delayed">
            <Plane className="h-6 w-6 text-purple-300 dark:text-purple-700 opacity-20" />
          </div>
          <div className="absolute bottom-40 left-1/4 animate-float">
            <Plane className="h-10 w-10 text-blue-200 dark:text-blue-800 opacity-15" />
          </div>
        </div>

        <div className="container mx-auto px-4 py-12 sm:py-20">
          {/* Header */}
          <div className="text-center mb-12 sm:mb-16 animate-fade-in">
            <div className="flex items-center justify-center mb-6">
              <div className="relative">
                <Plane className="h-16 w-16 sm:h-20 sm:w-20 text-blue-600 dark:text-blue-400 animate-bounce-slow" />
                <div className="absolute inset-0 bg-blue-500 blur-xl opacity-20 animate-pulse"></div>
              </div>
            </div>
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-4 animate-slide-up">
              Track Flights
              <br />
              <span className="text-3xl sm:text-5xl md:text-6xl">Around the World</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-slide-up-delayed">
              Real-time airplane tracking with live routes, airport information, and flight details
            </p>

            {/* Main CTA Button */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up-delayed-2">
              <Button
                size="lg"
                className="text-lg px-8 py-6 h-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 group"
                onClick={() => setShowLocationPrompt(true)}
              >
                <MapPin className="mr-2 h-5 w-5 group-hover:animate-bounce" />
                Use My Location
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-6 h-auto border-2 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950 transition-all duration-300"
                onClick={() => {
                  const element = document.getElementById('cities');
                  element?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                <Globe className="mr-2 h-5 w-5" />
                Browse Cities
              </Button>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-16 animate-fade-in-delayed">
            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-blue-300 dark:hover:border-blue-700">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Real-Time Tracking</h3>
                <p className="text-muted-foreground">
                  Live airplane positions updated every 30 seconds with accurate altitude and speed data
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-purple-300 dark:hover:border-purple-700">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Route className="h-8 w-8 text-purple-600 dark:text-purple-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Flight Routes</h3>
                <p className="text-muted-foreground">
                  See departure and arrival airports with complete route information
                </p>
              </CardContent>
            </Card>

            <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-green-300 dark:hover:border-green-700">
              <CardContent className="p-6 text-center">
                <div className="mb-4 flex justify-center">
                  <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full group-hover:scale-110 transition-transform duration-300">
                    <Building2 className="h-8 w-8 text-green-600 dark:text-green-400" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-2">Airport Details</h3>
                <p className="text-muted-foreground">
                  Explore 130+ major airports worldwide with detailed information
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Popular Cities Section */}
          <div id="cities" className="animate-fade-in-delayed-2">
            <div className="text-center mb-8">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">
                Explore Popular Locations
              </h2>
              <p className="text-lg text-muted-foreground">
                Jump right in and see flights around major cities
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-6xl mx-auto">
              {POPULAR_CITIES.map((city, index) => (
                <Card
                  key={city.name}
                  className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-blue-400 dark:hover:border-blue-600 overflow-hidden"
                  style={{
                    animationDelay: `${index * 50}ms`,
                  }}
                  onClick={() => handleCitySelect(city)}
                >
                  <CardContent className="p-4 sm:p-6">
                    <div className="text-center">
                      <div className="text-4xl sm:text-5xl mb-2 group-hover:scale-125 transition-transform duration-300">
                        {city.emoji}
                      </div>
                      <h3 className="font-bold text-base sm:text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {city.name}
                      </h3>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        {city.country}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-3xl mx-auto text-center animate-fade-in-delayed-3">
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400 mb-1">250km</div>
              <div className="text-sm sm:text-base text-muted-foreground">Default Range</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-purple-600 dark:text-purple-400 mb-1">30s</div>
              <div className="text-sm sm:text-base text-muted-foreground">Update Interval</div>
            </div>
            <div>
              <div className="text-3xl sm:text-4xl font-bold text-green-600 dark:text-green-400 mb-1">130+</div>
              <div className="text-sm sm:text-base text-muted-foreground">Airports</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t mt-20 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>Real-time flight data powered by airplanes.live • Route data from adsbdb.com & hexdb.io</p>
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-15px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { 
            opacity: 0;
            transform: translateY(30px);
          }
          to { 
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out;
        }
        .animate-fade-in-delayed {
          animation: fade-in 1s ease-out 0.2s backwards;
        }
        .animate-fade-in-delayed-2 {
          animation: fade-in 1s ease-out 0.4s backwards;
        }
        .animate-fade-in-delayed-3 {
          animation: fade-in 1s ease-out 0.6s backwards;
        }
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        .animate-slide-up-delayed {
          animation: slide-up 0.8s ease-out 0.2s backwards;
        }
        .animate-slide-up-delayed-2 {
          animation: slide-up 0.8s ease-out 0.4s backwards;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
