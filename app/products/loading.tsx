'use client';

import React from 'react';

function ProductCardSkeleton() {
  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 overflow-hidden">
      {/* Image Skeleton */}
      <div className="aspect-square bg-muted/40 animate-pulse" />

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Category Badge */}
        <div className="h-5 w-20 bg-muted/40 rounded-full animate-pulse" />

        {/* Product Name */}
        <div className="h-5 w-3/4 bg-muted/40 rounded-lg animate-pulse" />

        {/* Price Row */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-24 bg-muted/40 rounded-lg animate-pulse" />
          <div className="h-4 w-16 bg-muted/40 rounded-lg animate-pulse" />
        </div>

        {/* Rating */}
        <div className="h-4 w-32 bg-muted/40 rounded-lg animate-pulse" />

        {/* Add to Cart Button */}
        <div className="h-9 w-full bg-muted/40 rounded-xl animate-pulse" />
      </div>
    </div>
  );
}

export default function ProductsLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Header Skeleton */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-48 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-muted/40 rounded-lg animate-pulse mt-3" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar Skeleton */}
          <div className="lg:w-64 shrink-0 space-y-6">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
              <div className="h-6 w-24 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-muted/40 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 space-y-4">
              <div className="h-6 w-20 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-4 w-full bg-muted/40 rounded-lg animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1 space-y-6">
            {/* Sort Bar */}
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-muted/40 rounded-lg animate-pulse" />
              <div className="h-9 w-40 bg-muted/40 rounded-xl animate-pulse" />
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(9)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
