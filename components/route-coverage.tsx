'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Route, TrendingUp } from 'lucide-react';

interface RouteCoverageProps {
  totalFlights: number;
  flightsWithRoutes: number;
}

export function RouteCoverage({ totalFlights, flightsWithRoutes }: RouteCoverageProps) {
  const percentage = totalFlights > 0 
    ? Math.round((flightsWithRoutes / totalFlights) * 100)
    : 0;

  const getColor = (pct: number) => {
    if (pct >= 50) return 'bg-green-500 dark:bg-green-600';
    if (pct >= 30) return 'bg-yellow-500 dark:bg-yellow-600';
    return 'bg-orange-500 dark:bg-orange-600';
  };

  const getTextColor = (pct: number) => {
    if (pct >= 50) return 'text-green-600 dark:text-green-400';
    if (pct >= 30) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-orange-600 dark:text-orange-400';
  };

  if (totalFlights === 0) return null;

  return (
    <div className="absolute top-20 sm:top-16 left-1/2 -translate-x-1/2 z-10">
      <Badge 
        variant="secondary" 
        className="px-3 py-1.5 text-xs shadow-md bg-background/95 backdrop-blur-sm border"
      >
        <Route className="h-3 w-3 mr-1.5" />
        <span className={getTextColor(percentage)}>
          {flightsWithRoutes}/{totalFlights} routes
        </span>
        <span className="mx-1">•</span>
        <span className={`font-bold ${getTextColor(percentage)}`}>
          {percentage}%
        </span>
        {percentage >= 40 && (
          <TrendingUp className="h-3 w-3 ml-1.5 text-green-600 dark:text-green-400" />
        )}
      </Badge>
    </div>
  );
}
