'use client';

import React from 'react';

export default function ProfileLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <div className="h-4 w-48 bg-muted/40 rounded-lg animate-pulse" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Profile Hero */}
        <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="size-16 rounded-2xl bg-muted/40 animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-muted/40 rounded-lg animate-pulse" />
              <div className="h-4 w-48 bg-muted/40 rounded-lg animate-pulse" />
            </div>
          </div>
          <div className="h-10 w-40 bg-muted/40 rounded-xl animate-pulse" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Personal Info */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 space-y-5">
              <div className="h-5 w-40 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-9 w-full bg-muted/40 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-24 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-9 w-full bg-muted/40 rounded-xl animate-pulse" />
                </div>
                <div className="h-9 w-full bg-muted/40 rounded-xl animate-pulse" />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 space-y-4">
              <div className="h-5 w-32 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-2.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-16 w-full bg-muted/40 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Addresses */}
          <div className="lg:col-span-2">
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="h-5 w-48 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-3 w-64 bg-muted/40 rounded-lg animate-pulse" />
                </div>
                <div className="h-9 w-28 bg-muted/40 rounded-xl animate-pulse" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="h-36 w-full bg-muted/40 rounded-2xl animate-pulse" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
