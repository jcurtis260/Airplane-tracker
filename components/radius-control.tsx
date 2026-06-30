'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { CircleDot } from 'lucide-react';

interface RadiusControlProps {
  radius: number;
  onRadiusChange: (radius: number) => void;
}

export function RadiusControl({ radius, onRadiusChange }: RadiusControlProps) {
  const [expanded, setExpanded] = useState(false);

  const presets = [
    { label: '50km', value: 50 },
    { label: '100km', value: 100 },
    { label: '250km', value: 250 },
    { label: '500km', value: 500 },
  ];

  if (!expanded) {
    return (
      <Button
        variant="secondary"
        size="lg"
        className="shadow-lg h-12 w-12 sm:h-auto sm:w-auto sm:px-4 rounded-full sm:rounded-md p-0 sm:p-2"
        onClick={() => setExpanded(true)}
      >
        <CircleDot className="h-5 w-5 sm:h-4 sm:w-4 sm:mr-2" />
        <span className="hidden sm:inline">{radius}km</span>
      </Button>
    );
  }

  return (
    <div className="bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl p-4 w-[calc(100vw-2rem)] sm:w-auto sm:min-w-[280px] max-w-[320px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDot className="h-4 w-4" />
          <span className="text-sm sm:text-base font-semibold">Search Radius</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 sm:h-6 sm:w-6"
          onClick={() => setExpanded(false)}
        >
          <span className="text-sm sm:text-xs">✕</span>
        </Button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {/* Current Value */}
        <div className="text-center">
          <Badge variant="default" className="text-xl sm:text-lg font-bold px-5 sm:px-4 py-2 sm:py-1.5">
            {radius} km
          </Badge>
        </div>

        {/* Slider */}
        <div className="px-2 py-2">
          <Slider
            value={[radius]}
            onValueChange={(value) => {
              const newRadius = Array.isArray(value) ? value[0] : value;
              if (typeof newRadius === 'number') {
                onRadiusChange(newRadius);
              }
            }}
            min={25}
            max={500}
            step={25}
            className="w-full touch-none"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-2">
            <span>25km</span>
            <span>500km</span>
          </div>
        </div>

        {/* Preset Buttons */}
        <div className="grid grid-cols-4 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.value}
              variant={radius === preset.value ? 'default' : 'outline'}
              size="lg"
              className="text-sm sm:text-xs h-11 sm:h-9"
              onClick={() => onRadiusChange(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Info */}
        <p className="text-xs sm:text-[10px] text-muted-foreground text-center">
          Larger radius = more airplanes but slower updates
        </p>
      </div>
    </div>
  );
}
