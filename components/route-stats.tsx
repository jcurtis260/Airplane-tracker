'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { MapPin } from 'lucide-react';

interface RouteStatsProps {
  totalAirplanes: number;
  airplanesWithRoutes: number;
}

export function RouteStats({ totalAirplanes, airplanesWithRoutes }: RouteStatsProps) {
  const percentage = totalAirplanes > 0 
    ? Math.round((airplanesWithRoutes / totalAirplanes) * 100)
    : 0;

  if (totalAirplanes === 0) return null;

  return (
    <div className="absolute top-16 left-1/2 -translate-x-1/2 z-10">
      <Badge 
        variant="secondary" 
        className="px-3 py-1.5 text-xs shadow-md bg-purple-600/90 text-white border-purple-400 hover:bg-purple-700/90"
      >
        <MapPin className="h-3 w-3 mr-1.5" />
        {airplanesWithRoutes}/{totalAirplanes} flights with routes ({percentage}%)
      </Badge>
    </div>
  );
}
