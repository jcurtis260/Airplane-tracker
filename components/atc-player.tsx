'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { ATCFrequencyData } from '@/lib/atc-frequencies';
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
  clearance: 'bg-yellow-500',
  other: 'bg-gray-400',
};

const FREQUENCY_TYPE_LABELS = {
  tower: 'Tower',
  ground: 'Ground',
  approach: 'Approach',
  departure: 'Departure',
  center: 'Center',
  atis: 'ATIS',
  clearance: 'Clearance',
  other: 'Other',
};

export function ATCPlayer({ icao, onClose }: ATCPlayerProps) {
  const [atcData, setAtcData] = useState<ATCFrequencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false); // Start minimized for mobile
  const [selectedFrequency, setSelectedFrequency] = useState<any>(null);

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
          throw new Error(errorData.message || 'No ATC data available');
        }

        const data: ATCFrequencyData = await response.json();
        setAtcData(data);
        
        // Auto-select tower frequency if available
        const towerFreq = data.frequencies.find((f) => f.type === 'tower');
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
                {icao} • {atcData?.name || 'Loading...'}
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
              <p className="text-sm text-destructive font-medium mb-2">⚠️ No Data</p>
              <p className="text-xs text-muted-foreground mb-3">{error}</p>
              <p className="text-xs text-muted-foreground">
                This airport may not be in our frequency database yet.
              </p>
            </div>
          )}

          {!loading && !error && (!atcData || atcData.frequencies.length === 0) && (
            <div className="text-center py-8">
              <Radio className="h-12 w-12 text-muted-foreground mx-auto mb-2 opacity-50" />
              <p className="text-sm text-muted-foreground">No frequencies available</p>
            </div>
          )}

          {!loading && !error && atcData && atcData.frequencies.length > 0 && (
            <>
              <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-2 mb-3">
                <p className="text-xs text-blue-700 dark:text-blue-400">
                  📻 <strong>Real VHF Frequencies</strong> - Listen with aviation radio or SDR
                </p>
              </div>

              <div className="space-y-2">
                {atcData.frequencies.map((freq, idx) => (
                  <div
                    key={`${freq.type}-${idx}`}
                    className={`border rounded-lg p-3 cursor-pointer transition-all hover:border-primary ${
                      selectedFrequency === freq ? 'border-primary bg-primary/5' : ''
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
                    <p className="text-sm text-muted-foreground font-mono font-bold">
                      {freq.frequency} MHz
                    </p>
                  </div>
                ))}
              </div>

              {selectedFrequency && (
                <div className="border-t pt-3 space-y-2">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-xs font-medium mb-1">{selectedFrequency.name}</p>
                    <p className="text-lg font-mono font-bold text-primary mb-2">
                      {selectedFrequency.frequency} MHz
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Tune your aviation radio or SDR to this frequency
                    </p>
                  </div>
                  
                  {atcData.streams && atcData.streams.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-xs font-medium">🎧 Online Streams:</p>
                      {atcData.streams.map((stream, idx) => (
                        <Button
                          key={idx}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={() => window.open(stream.url, '_blank')}
                        >
                          <ExternalLink className="h-3 w-3 mr-2" />
                          {stream.source === 'liveatc' && 'Listen on LiveATC'}
                          {stream.source === 'atclive' && 'Listen on ATC-Live'}
                          {stream.source === 'broadcastify' && 'Listen on Broadcastify'}
                        </Button>
                      ))}
                    </div>
                  )}

                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900 rounded-lg p-2">
                    <p className="text-xs text-blue-700 dark:text-blue-400 mb-2">
                      💡 <strong>How to Listen:</strong>
                    </p>
                    <ul className="text-xs text-blue-600 dark:text-blue-400 space-y-1">
                      <li>• Aviation radio tuned to frequency</li>
                      <li>• RTL-SDR dongle + SDR software</li>
                      <li>• WebSDR online receivers</li>
                      <li>• Streaming services (if available)</li>
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          <div className="border-t pt-3">
            <p className="text-[10px] text-muted-foreground text-center">
              Real VHF frequencies • Streams from LiveATC & ATC-Live
            </p>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
