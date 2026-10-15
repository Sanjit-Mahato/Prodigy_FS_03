'use client';

import React from 'react';

export default function SupportLoading() {
  return (
    <div className="min-h-screen bg-background pb-16">
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-10 w-48 bg-muted/40 rounded-xl animate-pulse" />
          <div className="h-4 w-64 bg-muted/40 rounded-lg animate-pulse mt-3" />
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* FAQ Section */}
          <div className="lg:col-span-2 space-y-4">
            <div className="h-6 w-24 bg-muted/40 rounded-lg animate-pulse" />
            {[...Array(5)].map((_, i) => (
              <div key={i} className="rounded-2xl border border-border/80 bg-card/60 p-5">
                <div className="h-5 w-3/4 bg-muted/40 rounded-lg animate-pulse" />
              </div>
            ))}
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-4 sticky top-24">
              <div className="h-6 w-32 bg-muted/40 rounded-lg animate-pulse" />
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-9 w-full bg-muted/40 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-9 w-full bg-muted/40 rounded-xl animate-pulse" />
                </div>
                <div className="space-y-1.5">
                  <div className="h-3 w-20 bg-muted/40 rounded-lg animate-pulse" />
                  <div className="h-24 w-full bg-muted/40 rounded-xl animate-pulse" />
                </div>
                <div className="h-10 w-full bg-muted/40 rounded-xl animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
