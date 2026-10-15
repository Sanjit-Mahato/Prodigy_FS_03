'use client';

import React from 'react';
import Image from 'next/image';
import {
  PackageCheck,
  MapPin,
  CreditCard,
  Building,
  Banknote,
  FileText,
  Truck,
} from 'lucide-react';
import { ICartItem } from '@/types';
import { formatPrice } from '@/lib/utils';
import { ShippingAddressData } from './AddressForm';
import { PaymentData } from './PaymentForm';

interface OrderReviewProps {
  items: ICartItem[];
  shippingAddress: ShippingAddressData;
  payment: PaymentData;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  notes: string;
  onNotesChange: (notes: string) => void;
}

export function OrderReview({
  items,
  shippingAddress,
  payment,
  subtotal,
  tax,
  shipping,
  total,
  notes,
  onNotesChange,
}: OrderReviewProps) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-base font-bold text-foreground flex items-center gap-2">
          <PackageCheck className="size-4.5 text-primary" />
          Review Order Details
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Please review your items, delivery destination, and payment preference before submitting.
        </p>
      </div>

      {/* Items Summary */}
      <div className="rounded-2xl border border-border/80 bg-muted/20 p-5 space-y-4">
        <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
          Items in this Order ({items.reduce((acc, i) => acc + i.quantity, 0)})
        </h4>

        <div className="divide-y divide-border/60">
          {items.map((item) => (
            <div key={item.productId} className="py-3 flex items-center gap-3">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-lg border border-border/80 bg-muted/20 flex items-center justify-center p-1.5">
                {item.image ? (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="48px"
                    className="object-contain"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                    No img
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Qty: {item.quantity} × {formatPrice(item.price)}
                </p>
              </div>
              <span className="text-xs font-bold font-mono text-foreground">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Address & Payment Two-Column Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            {shippingAddress.deliveryMethod === 'pickup' ? (
              <>
                <Building className="size-4 text-primary" />
                <span>Store Pickup Location</span>
              </>
            ) : (
              <>
                <MapPin className="size-4 text-primary" />
                <span>Delivery Address</span>
              </>
            )}
          </div>
          <div className="text-muted-foreground space-y-0.5">
            <p className="font-semibold text-foreground">{shippingAddress.name}</p>
            <p>{shippingAddress.street}</p>
            <p>
              {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zip}
            </p>
            <p className="pt-1 text-[11px]">Phone: {shippingAddress.phone}</p>
          </div>
        </div>

        <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-2 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-foreground">
            {payment.method === 'card' && <CreditCard className="size-4 text-primary" />}
            {payment.method === 'store_pickup' && (
              <Building className="size-4 text-emerald-600 dark:text-emerald-400" />
            )}
            {payment.method === 'cod' && (
              <Banknote className="size-4 text-amber-600 dark:text-amber-400" />
            )}
            <span>Payment Method</span>
          </div>
          <div className="text-muted-foreground space-y-0.5">
            {payment.method === 'card' && (
              <>
                <p className="font-semibold text-foreground">Credit / Debit Card</p>
                <p className="font-mono text-[11px]">
                  Card ending in •••• {payment.cardNumber.slice(-4) || '8892'}
                </p>
                <p className="text-[11px]">Holder: {payment.cardName || shippingAddress.name}</p>
              </>
            )}
            {payment.method === 'store_pickup' && (
              <>
                <p className="font-semibold text-emerald-600 dark:text-emerald-400">
                  Pay at Store (Nehru Place)
                </p>
                <p className="text-[11px]">Payment will be processed at counter collection.</p>
              </>
            )}
            {payment.method === 'cod' && (
              <>
                <p className="font-semibold text-amber-600 dark:text-amber-400">
                  Cash on Delivery
                </p>
                <p className="text-[11px]">Payment due in person upon courier delivery.</p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Delivery Notes */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-foreground flex items-center gap-1.5">
          <FileText className="size-3.5 text-muted-foreground" />
          Special Delivery Instructions or Pickup Notes (Optional)
        </label>
        <textarea
          rows={2}
          placeholder="e.g., Gate code #4321, please leave with building concierge if not home..."
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          className="w-full rounded-xl border border-border bg-background p-3 text-xs placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary resize-none"
        />
      </div>

      {/* Breakdown */}
      <div className="rounded-xl border border-border/80 bg-muted/30 p-4 space-y-2 text-xs">
        <div className="flex justify-between text-muted-foreground">
          <span>Subtotal</span>
          <span className="font-mono text-foreground">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>GST (18%)</span>
          <span className="font-mono text-foreground">{formatPrice(tax)}</span>
        </div>
        <div className="flex justify-between text-muted-foreground">
          <span>Shipping & Handling</span>
          <span className="font-mono text-foreground">
            {shipping === 0 ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">FREE</span>
            ) : (
              formatPrice(shipping)
            )}
          </span>
        </div>
        <div className="pt-2 border-t border-border flex justify-between items-baseline font-bold text-foreground">
          <span className="text-sm">Total Due</span>
          <span className="text-base font-mono text-primary">{formatPrice(total)}</span>
        </div>
      </div>
    </div>
  );
}
