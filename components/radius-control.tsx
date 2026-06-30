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
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="secondary"
          size="sm"
          className="shadow-lg"
          onClick={() => setExpanded(true)}
        >
          <CircleDot className="h-4 w-4 mr-2" />
          {radius}km
        </Button>
      </div>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 bg-background/95 backdrop-blur-sm border rounded-lg shadow-xl p-4 min-w-[280px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <CircleDot className="h-4 w-4" />
          <span className="text-sm font-semibold">Search Radius</span>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={() => setExpanded(false)}
        >
          <span className="text-xs">✕</span>
        </Button>
      </div>

      <div className="space-y-4">
        {/* Current Value */}
        <div className="text-center">
          <Badge variant="default" className="text-lg font-bold px-4 py-1.5">
            {radius} km
          </Badge>
        </div>

        {/* Slider */}
        <div className="px-2">
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
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground mt-1">
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
              size="sm"
              className="text-xs"
              onClick={() => onRadiusChange(preset.value)}
            >
              {preset.label}
            </Button>
          ))}
        </div>

        {/* Info */}
        <p className="text-[10px] text-muted-foreground text-center">
          Larger radius = more airplanes but slower updates
        </p>
      </div>
    </div>
  );
}
