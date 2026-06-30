'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCacheStats } from '@/lib/local-cache';
import { Database } from 'lucide-react';

export function CacheStats() {
  const [stats, setStats] = useState({ routes: { count: 0, ttl: '24 hours' } });
  const [show, setShow] = useState(false);

  const updateStats = () => {
    const fullStats = getCacheStats();
    // Only show routes cache (aircraft cache not used yet)
    setStats({ routes: fullStats.routes });
  };

  useEffect(() => {
    updateStats();
    // Update stats periodically
    const interval = setInterval(updateStats, 10000); // Reduced update frequency
    return () => clearInterval(interval);
  }, []);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="p-3 sm:p-2 bg-secondary/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-secondary transition-colors touch-manipulation"
        title="Show cache stats"
      >
        <Database className="h-5 w-5 sm:h-4 sm:w-4" />
      </button>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl p-3 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[200px] max-w-[250px]">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4" />
          <span className="text-sm font-semibold">Cache Stats</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setShow(false)}
        >
          <span className="text-xs">✕</span>
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Cached Routes:</span>
          <Badge variant="secondary" className="text-xs">
            {stats.routes.count}
          </Badge>
        </div>
        <div className="flex justify-between items-center pt-1 border-t">
          <span className="text-muted-foreground text-[10px]">Cache Duration:</span>
          <span className="text-[10px]">{stats.routes.ttl}</span>
        </div>
      </div>

      <div className="mt-3 p-2 bg-muted/50 rounded text-center">
        <p className="text-[10px] text-muted-foreground">
          💾 Routes cached automatically
        </p>
        <p className="text-[9px] text-muted-foreground mt-1">
          Reduces API calls by ~90%
        </p>
      </div>
    </div>
  );
}
