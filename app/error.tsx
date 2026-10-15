'use client';

import React from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="flex justify-center">
          <div className="size-20 rounded-3xl bg-destructive/10 border border-destructive/20 flex items-center justify-center">
            <AlertTriangle className="size-10 text-destructive" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Something Went Wrong
          </h1>
          <p className="text-sm text-muted-foreground max-w-sm mx-auto">
            An unexpected error occurred. We&apos;ve been notified and are working to fix it.
          </p>

          {/* Error Details (Development) */}
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-4 p-4 rounded-xl bg-muted/50 border border-border/80 text-left">
              <div className="flex items-center gap-2 text-xs font-semibold text-destructive mb-2">
                <Bug className="size-3.5" />
                Error Details
              </div>
              <p className="text-xs text-muted-foreground font-mono break-all">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-[10px] text-muted-foreground mt-2 font-mono">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            onClick={reset}
            className="w-full sm:w-auto h-11 text-xs font-semibold rounded-xl gap-2"
          >
            <RefreshCw className="size-4" />
            Try Again
          </Button>
          <Link href="/">
            <Button variant="outline" className="w-full sm:w-auto h-11 text-xs font-semibold rounded-xl gap-2">
              <Home className="size-4" />
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support Link */}
        <p className="text-xs text-muted-foreground">
          If this problem persists, please{' '}
          <Link href="/support" className="text-primary hover:underline font-medium">
            contact our support team
          </Link>
        </p>
      </div>
    </div>
  );
}
