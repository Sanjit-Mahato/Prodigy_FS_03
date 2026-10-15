'use client';

import React from 'react';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  AlertCircle,
  Calendar,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export interface TrackingEvent {
  status: string;
  timestamp: string | Date;
  note: string;
}

interface TrackingTimelineProps {
  currentStatus: 'pending' | 'processing' | 'shipped' | 'delivered';
  updates: TrackingEvent[];
}

const STEPS = [
  {
    key: 'pending',
    label: 'Order Placed',
    sublabel: 'Received & queued',
    icon: Clock,
  },
  {
    key: 'processing',
    label: 'Processing',
    sublabel: 'QC & packaging',
    icon: Package,
  },
  {
    key: 'shipped',
    label: 'Dispatched',
    sublabel: 'With courier',
    icon: Truck,
  },
  {
    key: 'delivered',
    label: 'Delivered',
    sublabel: 'Signed & complete',
    icon: CheckCircle2,
  },
] as const;

export function TrackingTimeline({ currentStatus, updates }: TrackingTimelineProps) {
  const statusRank: Record<string, number> = {
    pending: 0,
    processing: 1,
    shipped: 2,
    delivered: 3,
  };

  const currentRank = statusRank[currentStatus] ?? 0;

  return (
    <div className="space-y-6">
      {/* Visual Stepper Bar */}
      <div className="relative py-4">
        {/* Progress connecting line */}
        <div className="absolute top-8 left-8 right-8 h-1 bg-muted -z-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${(currentRank / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {/* Step Nodes */}
        <div className="flex justify-between items-start relative z-10">
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentRank;
            const isCurrent = idx === currentRank;
            const isPending = idx > currentRank;
            const Icon = step.icon;

            return (
              <div key={step.key} className="flex flex-col items-center text-center max-w-[80px] sm:max-w-[120px]">
                <div
                  className={`size-10 sm:size-11 rounded-full flex items-center justify-center transition-all ${
                    isCurrent
                      ? 'bg-primary text-primary-foreground ring-4 ring-primary/20 shadow-md scale-110'
                      : isCompleted
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground border-2 border-border/80'
                  }`}
                >
                  <Icon className="size-4 sm:size-5" />
                </div>
                <div className="mt-2.5">
                  <p
                    className={`text-xs font-bold leading-tight ${
                      isCurrent
                        ? 'text-primary'
                        : isCompleted
                        ? 'text-foreground'
                        : 'text-muted-foreground'
                    }`}
                  >
                    {step.label}
                  </p>
                  <p className="text-[10px] text-muted-foreground hidden sm:block mt-0.5">
                    {step.sublabel}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Chronological Activity Log */}
      <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-border/60">
          <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="size-3.5 text-primary" />
            Tracking Activity Log
          </h4>
          <span className="text-[11px] font-mono text-muted-foreground">
            {updates.length} updates logged
          </span>
        </div>

        <div className="space-y-4 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-border/80">
          {updates
            .slice()
            .reverse()
            .map((update, idx) => (
              <div key={idx} className="relative flex items-start gap-3 pl-7">
                <div className="absolute left-1.5 top-1 size-3 -translate-x-1/2 rounded-full border-2 border-background bg-primary ring-2 ring-primary/20" />
                <div className="flex-1 space-y-1">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <p className="text-xs font-bold text-foreground">{update.status}</p>
                    <time className="text-[11px] text-muted-foreground font-mono">
                      {formatDate(update.timestamp)}
                    </time>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{update.note}</p>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
