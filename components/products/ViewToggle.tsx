'use client';

import React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  className?: string;
}

export function ViewToggle({
  viewMode,
  onViewChange,
  className,
}: ViewToggleProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded-lg border border-border p-0.5 bg-muted/40',
        className
      )}
      role="group"
      aria-label="View layout switch"
    >
      <Button
        type="button"
        variant={viewMode === 'grid' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn(
          'size-8 p-0 rounded-md transition-all',
          viewMode === 'grid'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="Grid view"
        aria-pressed={viewMode === 'grid'}
      >
        <LayoutGrid className="size-4" />
      </Button>
      <Button
        type="button"
        variant={viewMode === 'list' ? 'secondary' : 'ghost'}
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn(
          'size-8 p-0 rounded-md transition-all',
          viewMode === 'list'
            ? 'bg-background text-foreground shadow-xs'
            : 'text-muted-foreground hover:text-foreground'
        )}
        aria-label="List view"
        aria-pressed={viewMode === 'list'}
      >
        <List className="size-4" />
      </Button>
    </div>
  );
}
