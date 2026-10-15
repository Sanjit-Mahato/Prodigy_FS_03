'use client';

import React from 'react';
import { SessionProvider } from '@/components/providers/SessionProvider';
import { CartProvider } from '@/context/cart-context';
import { Toaster } from '@/components/ui/toast';

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <Toaster />
      </CartProvider>
    </SessionProvider>
  );
}
