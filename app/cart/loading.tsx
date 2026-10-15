'use client';

import React from 'react';

function CartItemSkeleton() {
  return (
    <div className="flex gap-4 p-4 rounded-2xl border border-border/80 bg-card/60">
      <div className="size-20 rounded-xl bg-muted/40 animate-pulse shrink-0" />
      <div className="flex-1 space-y-3">
        <div className="h-5 w-3/4 bg-muted/40 rounded-lg animate-pulse" />
        <div className="h-4 w-1/2 bg-muted/40 rounded-lg animate-pulse" />
        <div className="flex items-center gap-4">
          <div className="h-9 w-28 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-5 w-16 bg-muted/40 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export default function CartLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-32 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-4 w-48 bg-muted/40 rounded-lg animate-pulse mt-3" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <CartItemSkeleton key={i} />
            ))}
          </div>

          {/* Summary Skeleton */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 sticky top-24">
              <div className="h-6 w-32 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-muted/40 rounded-lg animate-pulse" />
                    <div className="h-4 w-16 bg-muted/40 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="border-t border-border/80 pt-4">
                <div className="flex justify-between">
                  <div className="h-5 w-24 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-5 w-20 bg-muted/40 rounded-lg animate-pulse" />
                </div>
              </div>
              <div className="h-11 w-full bg-muted/40 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
