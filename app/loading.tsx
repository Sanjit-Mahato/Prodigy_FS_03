'use client';

import React from 'react';
import { Loader2 } from 'lucide-react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <div className="relative">
        <div className="size-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Loader2 className="size-8 text-primary animate-spin" />
        </div>
      </div>
      <div className="space-y-2 text-center">
        <p className="text-sm font-semibold text-foreground">Loading...</p>
        <p className="text-xs text-muted-foreground">
          Preparing your experience
        </p>
      </div>
    </div>
  );
}
