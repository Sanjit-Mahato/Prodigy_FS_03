'use client';

import React from 'react';

export default function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-40 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-muted/40 rounded-lg animate-pulse mt-3" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Address */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4">
              <div className="h-6 w-40 bg-muted/40 rounded-lg animate-pulse" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
              </div>
              <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
              <div className="grid grid-cols-3 gap-4">
                <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
                <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Payment Method */}
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4">
              <div className="h-6 w-36 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-12 w-full bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 sticky top-24">
              <div className="h-6 w-32 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="size-16 rounded-xl bg-muted/40 animate-pulse" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-3/4 bg-muted/40 rounded-lg animate-pulse" />
                      <div className="h-3 w-1/2 bg-muted/40 rounded-lg animate-pulse" />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border/80 pt-4 space-y-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="flex justify-between">
                    <div className="h-4 w-20 bg-muted/40 rounded-lg animate-pulse" />
                    <div className="h-4 w-16 bg-muted/40 rounded-lg animate-pulse" />
                  </div>
                ))}
              </div>
              <div className="h-11 w-full bg-muted/40 rounded-xl animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
