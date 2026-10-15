'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  Building,
  CreditCard,
  Phone,
  Printer,
  ArrowLeft,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  Sparkles,
  ShoppingBag,
  RotateCw,
} from 'lucide-react';
import { IOrder } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { STORE_DETAILS } from '@/lib/constants';
import { TrackingTimeline } from '@/components/orders/TrackingTimeline';
import { Button } from '@/components/ui/button';

interface OrderDetailPageProps {
  params: Promise<{ id: string }>;
}

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const searchParams = useSearchParams();
  const isJustPlaced = searchParams.get('placed') === 'true';

  const [order, setOrder] = useState<IOrder | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const fetchOrder = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        if (res.status === 404) {
          throw new Error('Order not found. Check the order number and try again.');
        }
        if (res.status === 401) {
          throw new Error('Please sign in to view this order details.');
        }
        throw new Error('Failed to load order');
      }
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      setError(err.message || 'Something went wrong fetching order');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  // Simulate updating order status (for demonstration & evaluation)
  const handleAdvanceStatus = async (
    newStatus: 'pending' | 'processing' | 'shipped' | 'delivered'
  ) => {
    if (!order) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Status update simulation failed');
      const data = await res.json();
      setOrder(data.order);
    } catch (err: any) {
      alert(err.message || 'Failed to advance status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="size-9 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-xs text-muted-foreground font-medium">Fetching real-time order tracking...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center container mx-auto px-4">
        <div className="max-w-md w-full text-center space-y-5 rounded-3xl border border-destructive/20 bg-card/60 p-8 shadow-xs">
          <div className="size-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
            <AlertCircle className="size-7" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-lg font-bold text-foreground">Order Tracking Unavailable</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">{error}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Button asChild variant="outline" size="sm" className="text-xs h-9 rounded-xl">
              <Link href="/orders">
                <ArrowLeft className="size-3.5 mr-1.5" />
                View All Orders
              </Link>
            </Button>
            <Button size="sm" onClick={fetchOrder} className="text-xs h-9 rounded-xl">
              Retry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isPickup =
    order.paymentMethod?.toLowerCase().includes('pickup') ||
    order.paymentMethod?.toLowerCase().includes('store');

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/80 bg-muted/20 print:hidden">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link href="/orders" className="hover:text-foreground transition-colors">
              Orders
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-mono font-medium">{order.orderNumber}</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Just Placed Celebration Banner */}
        {isJustPlaced && (
          <div className="rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 sm:p-8 space-y-3 shadow-xs">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shrink-0 shadow-sm">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                  Thank you! Your order has been placed.
                  <Sparkles className="size-4 text-amber-500" />
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  A confirmation receipt and courier notification have been registered for{' '}
                  <span className="font-semibold text-foreground">{order.shippingAddress.name}</span>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Top Header Row with Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/80">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-bold font-mono text-foreground tracking-tight">
                {order.orderNumber}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize bg-primary/10 text-primary border border-primary/20">
                {order.status}
              </span>
            </div>
            <p className="text-xs text-muted-foreground">
              Placed on {formatDate(order.createdAt)} • Paid via {order.paymentMethod}
            </p>
          </div>

          <div className="flex items-center gap-3 print:hidden">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.print()}
              className="text-xs font-semibold h-9 px-3.5 rounded-xl gap-1.5 cursor-pointer"
            >
              <Printer className="size-3.5" />
              <span>Print Invoice</span>
            </Button>
            <Button asChild size="sm" className="text-xs font-semibold h-9 px-4 rounded-xl">
              <Link href="/products">
                <ShoppingBag className="size-3.5 mr-1.5" />
                <span>Shop More</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Live Stepper & Chronological Event Log */}
        <div className="rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border/60">
            <div>
              <h3 className="text-sm font-bold text-foreground">Package Dispatch & Journey</h3>
              <p className="text-xs text-muted-foreground">
                Live carrier updates from ElectroMart distribution hub to destination.
              </p>
            </div>

            {/* Status Simulation Controls (Demo/Evaluation feature) */}
            <div className="flex items-center gap-2 p-1 bg-muted/40 border border-border/80 rounded-xl print:hidden">
              <span className="text-[10px] font-bold text-muted-foreground uppercase px-2">
                Simulate Status:
              </span>
              {(['pending', 'processing', 'shipped', 'delivered'] as const).map((st) => (
                <button
                  key={st}
                  disabled={isUpdatingStatus}
                  onClick={() => handleAdvanceStatus(st)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg capitalize transition-all cursor-pointer ${
                    order.status === st
                      ? 'bg-primary text-primary-foreground shadow-xs'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          <TrackingTimeline
            currentStatus={order.status}
            updates={order.trackingUpdates as any}
          />
        </div>

        {/* Two-Column Details: Items on Left, Address & Financials on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Items Summary (7 cols) */}
          <div className="lg:col-span-7 rounded-3xl border border-border/80 bg-card/60 p-6 sm:p-8 space-y-6 shadow-xs">
            <h3 className="text-sm font-bold text-foreground">
              Purchased Hardware ({order.items.reduce((acc, i) => acc + i.quantity, 0)} Items)
            </h3>

            <div className="divide-y divide-border/60">
              {order.items.map((item, idx) => (
                <div key={idx} className="py-4 first:pt-0 last:pb-0 flex items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl border border-border/80 bg-muted/20 flex items-center justify-center p-1.5">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="64px"
                        className="object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
                        No img
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <p className="text-xs font-bold text-foreground leading-snug truncate">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted-foreground font-mono">
                      {formatPrice(item.price)} × {item.quantity}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold font-mono text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fulfillment & Payment Breakdown (5 cols) */}
          <div className="lg:col-span-5 space-y-6">
            {/* Delivery/Pickup Card */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 space-y-4 shadow-xs">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                {isPickup ? (
                  <>
                    <Building className="size-3.5 text-primary" />
                    Store Pickup Address
                  </>
                ) : (
                  <>
                    <MapPin className="size-3.5 text-primary" />
                    Delivery Destination
                  </>
                )}
              </h4>

              <div className="text-xs space-y-1 text-muted-foreground leading-relaxed">
                <p className="font-semibold text-foreground">{order.shippingAddress.name}</p>
                {isPickup ? (
                  <>
                    <p className="text-foreground font-medium">{STORE_DETAILS.name}</p>
                    <p>{STORE_DETAILS.address.street}</p>
                    <p>
                      {STORE_DETAILS.address.city}, {STORE_DETAILS.address.state}{' '}
                      {STORE_DETAILS.address.zip}
                    </p>
                    <p className="text-[11px] text-primary pt-1">
                      Ready for pickup within 2 hours of order confirmation.
                    </p>
                  </>
                ) : (
                  <>
                    <p>{order.shippingAddress.street}</p>
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                      {order.shippingAddress.zip}
                    </p>
                  </>
                )}
                {order.shippingAddress.phone && (
                  <p className="flex items-center gap-1.5 pt-1 text-foreground">
                    <Phone className="size-3 text-muted-foreground" />
                    <span>{order.shippingAddress.phone}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-3xl border border-border/80 bg-card/60 p-6 space-y-3 shadow-xs">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                Payment Summary
              </h4>

              <div className="space-y-2 text-xs divide-y divide-border/40">
                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="font-mono text-foreground">{formatPrice(order.subtotal)}</span>
                </div>
                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>GST (18%)</span>
                  <span className="font-mono text-foreground">{formatPrice(order.tax)}</span>
                </div>
                <div className="flex justify-between py-1 text-muted-foreground">
                  <span>Shipping Fee</span>
                  <span className="font-mono text-foreground">
                    {order.shipping === 0 ? (
                      <span className="text-emerald-600 font-bold">FREE</span>
                    ) : (
                      formatPrice(order.shipping)
                    )}
                  </span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold text-foreground">
                  <span>Total Amount Paid</span>
                  <span className="font-mono text-primary text-base">
                    {formatPrice(order.total)}
                  </span>
                </div>
              </div>

              <div className="pt-2 text-[11px] text-muted-foreground flex items-center gap-1.5 border-t border-border/60">
                <ShieldCheck className="size-3.5 text-emerald-500 shrink-0" />
                <span>Verified transaction. Official 18% GST tax invoice included.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
