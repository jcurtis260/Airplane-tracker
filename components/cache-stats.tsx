'use client';

import { useEffect, useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getCacheStats, clearAllCaches } from '@/lib/local-cache';
import { Database, Trash2 } from 'lucide-react';

export function CacheStats() {
  const [stats, setStats] = useState({ routes: { count: 0, ttl: '24 hours' }, aircraft: { count: 0, ttl: '7 days' } });
  const [show, setShow] = useState(false);

  const updateStats = () => {
    setStats(getCacheStats());
  };

  useEffect(() => {
    updateStats();
    // Update stats periodically
    const interval = setInterval(updateStats, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!show) {
    return (
      <button
        onClick={() => setShow(true)}
        className="absolute bottom-4 right-4 z-10 p-2 bg-secondary/80 backdrop-blur-sm rounded-full shadow-lg hover:bg-secondary transition-colors"
        title="Show cache stats"
      >
        <Database className="h-4 w-4" />
      </button>
    );
  }

  return (
    <div className="absolute bottom-4 right-4 z-10 bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl p-3 min-w-[200px]">
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
          <span className="text-muted-foreground">Routes:</span>
          <Badge variant="secondary" className="text-xs">
            {stats.routes.count}
          </Badge>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Aircraft:</span>
          <Badge variant="secondary" className="text-xs">
            {stats.aircraft.count}
          </Badge>
        </div>
      </div>

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-3 text-xs h-7"
        onClick={() => {
          clearAllCaches();
          updateStats();
        }}
      >
        <Trash2 className="h-3 w-3 mr-1" />
        Clear Cache
      </Button>

      <p className="text-[10px] text-muted-foreground mt-2 text-center">
        Routes cached for 24h
      </p>
    </div>
  );
}
