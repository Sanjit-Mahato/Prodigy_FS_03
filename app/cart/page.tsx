'use client';

import React from 'react';
import Link from 'next/link';
import {
  ShoppingBag,
  ArrowLeft,
  Trash2,
  ShieldCheck,
  RotateCcw,
  Store,
  ChevronRight,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { CartItem } from '@/components/cart/CartItem';
import { CartSummary } from '@/components/cart/CartSummary';
import { Button } from '@/components/ui/button';

export default function CartPage() {
  const { items, clearCart, itemCount, isLoading } = useCart();

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Loading your shopping cart...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/products" className="hover:text-foreground transition-colors">
              Catalog
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Shopping Cart</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
              <ShoppingBag className="size-7 text-primary" />
              <span>Shopping Cart</span>
              <span className="text-sm font-semibold px-2.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </span>
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Review your selected electronics before proceeding to secure payment.
            </p>
          </div>

          {items.length > 0 && (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={clearCart}
                className="text-xs text-muted-foreground hover:text-destructive hover:border-destructive/40 gap-1.5 h-8 cursor-pointer"
              >
                <Trash2 className="size-3.5" />
                Empty Cart
              </Button>
            </div>
          )}
        </div>

        {/* Cart Contents */}
        {items.length === 0 ? (
          <div className="py-16 px-4 text-center rounded-3xl border border-dashed border-border/80 bg-card/40 space-y-5 max-w-2xl mx-auto shadow-2xs">
            <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
              <ShoppingBag className="size-8" />
            </div>
            <div className="space-y-1.5">
              <h2 className="text-lg font-bold text-foreground">Your cart is currently empty</h2>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Looks like you haven&apos;t added any electronics to your bag yet. Explore our latest laptops, smartphones, and audio gear.
              </p>
            </div>
            <Button asChild className="gap-2 text-xs font-bold px-6 h-10 rounded-xl">
              <Link href="/products">
                <ArrowLeft className="size-3.5" />
                Browse Electronics Catalog
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Items List (8 cols) */}
            <div className="lg:col-span-8 rounded-2xl border border-border/80 bg-card/60 p-6 space-y-2 shadow-xs">
              <div className="flex items-center justify-between pb-3 border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <span>Product Item</span>
                <span>Subtotal</span>
              </div>

              <div className="divide-y divide-border/60">
                {items.map((item) => (
                  <CartItem key={item.productId} item={item} />
                ))}
              </div>

              <div className="pt-4 flex items-center justify-between">
                <Button
                  asChild
                  variant="ghost"
                  size="sm"
                  className="text-xs text-muted-foreground hover:text-foreground gap-1.5 p-0"
                >
                  <Link href="/products">
                    <ArrowLeft className="size-3.5" />
                    Continue Shopping
                  </Link>
                </Button>
              </div>
            </div>

            {/* Summary Sidebar (4 cols) */}
            <div className="lg:col-span-4 lg:sticky lg:top-24 space-y-6">
              <CartSummary />

              {/* Store Guarantees */}
              <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-3.5 text-xs text-muted-foreground">
                <div className="flex items-start gap-3">
                  <Store className="size-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">
                      Local Nehru Place Store Support
                    </span>
                    <span>
                      Order online and pick up at our Nehru Place store in 2 hours with priority checkout.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">
                      1-Year Store Warranty
                    </span>
                    <span>
                      Full repair or swap coverage on all certified manufacturer electronics.
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <RotateCcw className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-foreground block">
                      30-Day Easy Returns
                    </span>
                    <span>
                      Instant refund in-store or complimentary return mailing labels.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
