'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Map, Box } from 'lucide-react';

interface ViewToggleProps {
  onChange: (mode: '2d' | '3d') => void;
}

export function ViewToggle({ onChange }: ViewToggleProps) {
  const [mode, setMode] = useState<'2d' | '3d'>('2d');

  useEffect(() => {
    // Load saved preference
    const saved = localStorage.getItem('viewMode') as '2d' | '3d' | null;
    if (saved) {
      setMode(saved);
      onChange(saved);
    }
  }, [onChange]);

  const toggleMode = () => {
    const newMode = mode === '2d' ? '3d' : '2d';
    setMode(newMode);
    localStorage.setItem('viewMode', newMode);
    onChange(newMode);
  };

  return (
    <div className="absolute top-4 right-4 z-10">
      <Button
        onClick={toggleMode}
        variant="secondary"
        size="lg"
        className="gap-2 shadow-lg"
      >
        {mode === '2d' ? (
          <>
            <Box className="h-5 w-5" />
            Switch to 3D
          </>
        ) : (
          <>
            <Map className="h-5 w-5" />
            Switch to 2D
          </>
        )}
      </Button>
    </div>
  );
}
