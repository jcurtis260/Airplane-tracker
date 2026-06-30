'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ATCFrequency } from '@/lib/types';
import { Radio, Play, Pause, Volume2, VolumeX, X, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface ATCPlayerProps {
  icao?: string;
  onClose?: () => void;
}

const FREQUENCY_TYPE_COLORS = {
  tower: 'bg-blue-500',
  ground: 'bg-green-500',
  approach: 'bg-purple-500',
  departure: 'bg-orange-500',
  center: 'bg-red-500',
  atis: 'bg-gray-500',
  other: 'bg-gray-400',
};

const FREQUENCY_TYPE_LABELS = {
  tower: 'Tower',
  ground: 'Ground',
  approach: 'Approach',
  departure: 'Departure',
  center: 'Center',
  atis: 'ATIS',
  other: 'Other',
};

export function ATCPlayer({ icao, onClose }: ATCPlayerProps) {
  const [frequencies, setFrequencies] = useState<ATCFrequency[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [selectedFrequency, setSelectedFrequency] = useState<ATCFrequency | null>(null);

  useEffect(() => {
    if (!icao) {
      setLoading(false);
      return;
    }

    const fetchFrequencies = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(`/api/atc?icao=${encodeURIComponent(icao)}`);
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to fetch ATC frequencies');
        }

        const data = await response.json();
        setFrequencies(data);
        
        // Auto-select tower frequency if available
        const towerFreq = data.find((f: ATCFrequency) => f.type === 'tower');
        if (towerFreq) {
          setSelectedFrequency(towerFreq);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Unknown error');
        console.error('[CLIENT][ATC] Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFrequencies();
  }, [icao]);

  if (!icao) {
    return null;
  }

  return (
    <Card 
      className="absolute right-4 bottom-4 w-80 max-h-[500px] overflow-hidden z-10 shadow-lg"
      onClick={(e) => e.stopPropagation()}
    >
      <CardHeader className="pb-3 cursor-pointer" onClick={() => setExpanded(!expanded)}>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <Radio className="h-5 w-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                Live ATC Radio
                {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-1">
                {icao} • {frequencies.length} feeds available
              </p>
            </div>
          </div>
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation();
                onClose();
              }}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      {expanded && (
        <CardContent className="space-y-3 max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
              <p className="text-sm text-muted-foreground">Loading frequencies...</p>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-3">
              <p className="text-sm text-destructive font-medium mb-2">⚠️ No Coverage</p>
              <p className="text-xs text-muted-foreground mb-3">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={() => window.open('https://www.liveatc.net/', '_blank')}
              >
                <ExternalLink className="h-3 w-3 mr-1" />
                Browse LiveATC.net
              </Button>
            </div>
          )}

          {!loading && !error && frequencies.length === 0 && (
            <div className="text-center py-8">
              <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No frequencies available</p>
            </div>
          )}

          {!loading && !error && frequencies.length > 0 && (
            <>
              <div className="space-y-2">
                {frequencies.map((freq) => (
                  <div
                    key={freq.id}
                    className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-primary ${
                      selectedFrequency?.id === freq.id ? 'border-primary bg-primary/5' : ''
                    }`}
                    onClick={() => setSelectedFrequency(freq)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${FREQUENCY_TYPE_COLORS[freq.type]}`} />
                        <span className="font-medium text-sm">{freq.name}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {FREQUENCY_TYPE_LABELS[freq.type]}
                      </Badge>
                    </div>
                    {freq.frequency && (
                      <p className="text-xs text-muted-foreground font-mono">{freq.frequency}</p>
                    )}
                  </div>
                ))}
              </div>

              {selectedFrequency && (
                <div className="border-t pt-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Now Listening:</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(`https://www.liveatc.net/search/?icao=${icao}`, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Open in LiveATC
                    </Button>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs font-medium mb-1">{selectedFrequency.name}</p>
                    <p className="text-xs text-muted-foreground">
                      Click "Open in LiveATC" to listen to live radio communications
                    </p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-2">
                    <p className="text-xs text-blue-700 dark:text-blue-400">
                      💡 <strong>Tip:</strong> LiveATC requires a web player. Click the button above to open the stream in your browser.
                    </p>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="border-t pt-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Powered by <a href="https://www.liveatc.net" target="_blank" rel="noopener" className="underline">LiveATC.net</a>
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
