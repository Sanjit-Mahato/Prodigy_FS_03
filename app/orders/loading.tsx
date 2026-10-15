'use client';

import React from 'react';

function OrderCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-40 bg-muted/40 rounded-lg animate-pulse" />
          <div className="h-4 w-32 bg-muted/40 rounded-lg animate-pulse" />
        </div>
        <div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse" />
      </div>
      <div className="flex items-center gap-4">
        <div className="size-16 rounded-xl bg-muted/40 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-3/4 bg-muted/40 rounded-lg animate-pulse" />
          <div className="h-3 w-1/2 bg-muted/40 rounded-lg animate-pulse" />
        </div>
        <div className="h-5 w-20 bg-muted/40 rounded-lg animate-pulse" />
      </div>
    </div>
  );
}

export default function OrdersLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-48 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-muted/40 rounded-lg animate-pulse mt-3" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {[...Array(4)].map((_, i) => (
            <OrderCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}
