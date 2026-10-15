'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Clock,
  Package,
  Truck,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Building,
  CreditCard,
} from 'lucide-react';
import { IOrder } from '@/types';
import { formatPrice, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface OrderCardProps {
  order: IOrder;
}

export function OrderCard({ order }: OrderCardProps) {
  const statusConfig = {
    pending: {
      label: 'Order Placed',
      color: 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30',
      icon: Clock,
    },
    processing: {
      label: 'Preparing Order',
      color: 'bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30',
      icon: Package,
    },
    shipped: {
      label: 'Out for Delivery',
      color: 'bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
      icon: Truck,
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
      icon: CheckCircle2,
    },
  }[order.status] || {
    label: order.status,
    color: 'bg-muted text-muted-foreground border-border',
    icon: Clock,
  };

  const StatusIcon = statusConfig.icon;
  const isPickup = order.paymentMethod?.toLowerCase().includes('pickup') || order.paymentMethod?.toLowerCase().includes('store');

  return (
    <div className="rounded-2xl border border-border/80 bg-card/60 p-5 sm:p-6 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all space-y-4">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border/60">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <span className="text-sm font-bold font-mono text-foreground tracking-tight">
              {order.orderNumber}
            </span>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${statusConfig.color}`}
            >
              <StatusIcon className="size-3" />
              {statusConfig.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Placed on {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right">
            <span className="text-[11px] text-muted-foreground block">Total Amount</span>
            <span className="text-base font-bold font-mono text-foreground">
              {formatPrice(order.total)}
            </span>
          </div>
          <Button asChild size="sm" className="text-xs font-semibold h-9 px-4 rounded-xl">
            <Link href={`/orders/${order._id || order.orderNumber}`}>
              <span>Track Order</span>
              <ChevronRight className="size-3.5 ml-1" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Items preview row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 overflow-x-auto pb-1 sm:pb-0">
          {order.items.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="relative size-12 shrink-0 overflow-hidden rounded-xl border border-border/80 bg-background"
              title={`${item.name} (${item.quantity}x)`}
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-[10px] text-muted-foreground">
                  No img
                </div>
              )}
              {item.quantity > 1 && (
                <span className="absolute bottom-0 right-0 rounded-tl-md bg-foreground/80 px-1 py-0.2 text-[9px] font-bold text-background font-mono">
                  ×{item.quantity}
                </span>
              )}
            </div>
          ))}

          {order.items.length > 4 && (
            <div className="size-12 shrink-0 rounded-xl border border-dashed border-border flex items-center justify-center text-xs font-bold text-muted-foreground bg-muted/20">
              +{order.items.length - 4}
            </div>
          )}

          <div className="text-xs text-muted-foreground pl-1">
            <span className="font-semibold text-foreground">
              {order.items.reduce((acc, i) => acc + i.quantity, 0)} item
              {order.items.reduce((acc, i) => acc + i.quantity, 0) > 1 ? 's' : ''}
            </span>
          </div>
        </div>

        {/* Fulfillment Tag */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isPickup ? (
            <div className="flex items-center gap-1.5">
              <Building className="size-3.5 text-primary" />
              <span>Nehru Place Store Pickup</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 truncate max-w-[220px]">
              <MapPin className="size-3.5 text-primary shrink-0" />
              <span className="truncate">
                {order.shippingAddress.city}, {order.shippingAddress.state}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
