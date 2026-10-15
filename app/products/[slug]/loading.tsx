'use client';

import React from 'react';

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Breadcrumb Skeleton */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="h-4 w-64 bg-muted/40 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <div className="aspect-square rounded-2xl bg-muted/40 animate-pulse" />
            <div className="flex gap-3">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="size-20 rounded-xl bg-muted/40 animate-pulse" />
              ))}
            </div>
          </div>

          {/* Product Info Skeleton */}
          <div className="space-y-6">
            {/* Category & Stock */}
            <div className="flex items-center gap-3">
              <div className="h-6 w-20 bg-muted/40 rounded-full animate-pulse" />
              <div className="h-5 w-24 bg-muted/40 rounded-lg animate-pulse" />
            </div>

            {/* Title */}
            <div className="h-10 w-3/4 bg-muted/40 rounded-xl animate-pulse" />

            {/* Rating */}
            <div className="h-5 w-32 bg-muted/40 rounded-lg animate-pulse" />

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <div className="h-10 w-32 bg-muted/40 rounded-xl animate-pulse" />
              <div className="h-5 w-20 bg-muted/40 rounded-lg animate-pulse" />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <div className="h-4 w-full bg-muted/40 rounded-lg animate-pulse" />
              <div className="h-4 w-full bg-muted/40 rounded-lg animate-pulse" />
              <div className="h-4 w-2/3 bg-muted/40 rounded-lg animate-pulse" />
            </div>

            {/* Quantity & Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="h-11 w-32 bg-muted/40 rounded-xl animate-pulse" />
              <div className="h-11 flex-1 bg-muted/40 rounded-xl animate-pulse" />
            </div>

            {/* Specs Skeleton */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4">
              <div className="h-6 w-32 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-24 bg-muted/40 rounded-lg animate-pulse" />
                    <div className="h-4 w-32 bg-muted/40 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
