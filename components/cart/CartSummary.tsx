'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ShieldCheck,
  Truck,
  ArrowRight,
  Tag,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface CartSummaryProps {
  showCheckoutButton?: boolean;
  onCheckoutClick?: () => void;
}

export function CartSummary({
  showCheckoutButton = true,
  onCheckoutClick,
}: CartSummaryProps) {
  const { subtotal, tax, shipping, total, items } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null);
  const [promoError, setPromoError] = useState('');

  const freeShippingThreshold = 50;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const discountAmount = appliedPromo ? Math.round(subtotal * 0.1 * 100) / 100 : 0;
  const finalTotal = Math.max(0, Math.round((total - discountAmount) * 100) / 100);

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    setPromoError('');
    const code = promoCode.trim().toUpperCase();

    if (code === 'ELECTRO10') {
      setAppliedPromo('ELECTRO10 (10% OFF)');
      setPromoCode('');
    } else if (code) {
      setPromoError('Invalid promo code. Try "ELECTRO10"');
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card/70 p-6 space-y-6 shadow-xs backdrop-blur-xs">
      <h3 className="text-base font-bold text-foreground">Order Summary</h3>

      {/* Free Shipping Progress Indicator */}
      {subtotal > 0 && (
        <div className="rounded-xl border border-border/60 bg-muted/30 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between font-medium">
            <span className="flex items-center gap-1.5 text-foreground">
              <Truck className="size-3.5 text-primary" />
              {amountToFreeShipping === 0
                ? 'You qualify for Free Delivery!'
                : `Add ${formatPrice(amountToFreeShipping)} more for Free Shipping`}
            </span>
            <span className="font-semibold text-primary">
              {Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100))}%
            </span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-500"
              style={{
                width: `${Math.min(100, (subtotal / freeShippingThreshold) * 100)}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* Financial Breakdown */}
      <div className="space-y-3 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-semibold text-foreground font-mono">
            {formatPrice(subtotal)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>GST (18%)</span>
          <span className="font-semibold text-foreground font-mono">
            {formatPrice(tax)}
          </span>
        </div>

        <div className="flex justify-between text-muted-foreground">
          <span>Shipping & Delivery</span>
          <span className="font-semibold text-foreground font-mono">
            {shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                FREE
              </span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>

        {appliedPromo && (
          <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-medium">
            <span className="flex items-center gap-1">
              <Tag className="size-3" /> Promo: {appliedPromo}
            </span>
            <span className="font-mono font-bold">-{formatPrice(discountAmount)}</span>
          </div>
        )}

        <div className="pt-3 border-t border-border flex justify-between items-baseline">
          <span className="text-sm font-bold text-foreground">Total</span>
          <div className="text-right">
            <div className="text-xl font-extrabold text-foreground tracking-tight font-mono">
              {formatPrice(finalTotal)}
            </div>
            <span className="text-[10px] text-muted-foreground">
              Includes all local taxes & store warranty
            </span>
          </div>
        </div>
      </div>

      {/* Promo Code Input Form */}
      <form onSubmit={handleApplyPromo} className="space-y-1.5">
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Promo code (try ELECTRO10)"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value)}
            className="text-xs h-9 bg-background uppercase font-mono tracking-wide"
          />
          <Button
            type="submit"
            variant="outline"
            size="sm"
            disabled={!promoCode.trim()}
            className="h-9 px-3 text-xs font-semibold shrink-0 cursor-pointer"
          >
            Apply
          </Button>
        </div>
        {promoError && (
          <p className="text-[11px] text-destructive font-medium">{promoError}</p>
        )}
      </form>

      {/* Primary Action Button */}
      {showCheckoutButton && (
        <div className="space-y-3">
          {items.length > 0 ? (
            <Button
              asChild
              className="w-full h-11 text-sm font-bold gap-2 shadow-sm rounded-xl cursor-pointer"
              onClick={onCheckoutClick}
            >
              <Link href="/checkout">
                <span>Proceed to Secure Checkout</span>
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              className="w-full h-11 text-sm font-bold rounded-xl opacity-50 cursor-not-allowed"
            >
              Your Cart is Empty
            </Button>
          )}

          <div className="pt-2 flex flex-col gap-2 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-primary shrink-0" />
              <span>256-Bit SSL Encrypted Checkout & Privacy Protection</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Free 2-Hour In-Store Pickup Option at Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
