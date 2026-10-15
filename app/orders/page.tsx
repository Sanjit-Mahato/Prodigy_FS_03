'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Package,
  Clock,
  Truck,
  CheckCircle2,
  ChevronRight,
  Search,
  ShoppingBag,
  ArrowRight,
  LogIn,
  RefreshCw,
  ExternalLink,
} from 'lucide-react';
import { IOrder } from '@/types';
import { OrderCard } from '@/components/orders/OrderCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { formatPrice } from '@/lib/utils';

export default function OrdersPage() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const [orders, setOrders] = useState<IOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters & Search
  const [activeTab, setActiveTab] = useState<'all' | 'active' | 'delivered'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [guestLookupId, setGuestLookupId] = useState('');

  const fetchOrders = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/orders');
      if (res.status === 401) {
        setOrders([]);
        setIsLoading(false);
        return;
      }
      if (!res.ok) {
        throw new Error('Failed to load orders');
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || 'Unable to retrieve order history');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (status !== 'loading') {
      if (session?.user) {
        fetchOrders();
      } else {
        setIsLoading(false);
      }
    }
  }, [session, status]);

  const handleGuestLookup = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = guestLookupId.trim();
    if (cleanId) {
      router.push(`/orders/${cleanId}`);
    }
  };

  // Filter logic
  const filteredOrders = orders.filter((order) => {
    // Tab filter
    if (activeTab === 'active' && !['pending', 'processing', 'shipped'].includes(order.status)) {
      return false;
    }
    if (activeTab === 'delivered' && order.status !== 'delivered') {
      return false;
    }

    // Search query filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchOrderNum = order.orderNumber.toLowerCase().includes(query);
      const matchItems = order.items.some((item) =>
        item.name.toLowerCase().includes(query)
      );
      return matchOrderNum || matchItems;
    }

    return true;
  });

  // Calculate high-level stats
  const activeOrdersCount = orders.filter((o) =>
    ['pending', 'processing', 'shipped'].includes(o.status)
  ).length;
  const deliveredOrdersCount = orders.filter((o) => o.status === 'delivered').length;
  const totalSpent = orders.reduce((acc, o) => acc + o.total, 0);

  return (
    <div className="min-h-screen bg-background pb-16">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium">Orders & Tracking</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Page Title & Direct Lookup Bar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-border/80">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                Customer Portal
              </span>
              <span className="text-xs text-muted-foreground">Live Fulfillment Feed</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Orders & Tracking
            </h1>
            <p className="text-sm text-muted-foreground mt-1 max-w-xl">
              Track packages in real-time, view past receipts, verify local warehouse pickup, or
              simulate status updates.
            </p>
          </div>

          {/* Direct Track Lookup Box */}
          <form
            onSubmit={handleGuestLookup}
            className="flex items-center gap-2 w-full md:w-auto max-w-md bg-card/60 p-2 rounded-2xl border border-border/80 shadow-xs"
          >
            <div className="relative flex-1">
              <Search className="size-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
              <Input
                type="text"
                placeholder="Track by Order # (e.g. EM-2026...)"
                value={guestLookupId}
                onChange={(e) => setGuestLookupId(e.target.value)}
                className="pl-9 pr-3 h-9 text-xs font-mono bg-background border-border/80 rounded-xl w-full"
              />
            </div>
            <Button type="submit" size="sm" className="h-9 px-4 text-xs font-semibold rounded-xl">
              Track
            </Button>
          </form>
        </div>

        {/* Unauthenticated State Banner */}
        {status !== 'loading' && !session && (
          <div className="rounded-3xl border border-border/80 bg-gradient-to-br from-card/80 to-muted/30 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 text-xs font-bold text-primary">
                  <LogIn className="size-4" />
                  <span>Account Required For Order History</span>
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  Sign in to view all your past orders and saved receipts
                </h3>
                <p className="text-xs text-muted-foreground max-w-2xl">
                  Guest orders can always be tracked directly using the Order ID from your confirmation email in the search box above.
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Button asChild size="sm" className="text-xs font-bold px-5 h-9 rounded-xl">
                  <Link href="/auth/login?callbackUrl=/orders">Sign In</Link>
                </Button>
                <Button asChild variant="outline" size="sm" className="text-xs font-semibold px-4 h-9 rounded-xl">
                  <Link href="/auth/register">Create Account</Link>
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated Metrics Row */}
        {session && orders.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Orders</span>
                <Package className="size-4 text-primary" />
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{orders.length}</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">In Transit / Active</span>
                <Truck className="size-4 text-indigo-500" />
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{activeOrdersCount}</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Delivered</span>
                <CheckCircle2 className="size-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">{deliveredOrdersCount}</p>
            </div>

            <div className="rounded-2xl border border-border/80 bg-card/60 p-5 shadow-xs space-y-2">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Volume</span>
                <span className="text-xs font-mono font-bold text-muted-foreground">INR</span>
              </div>
              <p className="text-2xl font-bold font-mono text-foreground">
                {formatPrice(totalSpent)}
              </p>
            </div>
          </div>
        )}

        {/* Filters, Search & Refresh controls */}
        {session && orders.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-muted/30 border border-border/80 rounded-xl overflow-x-auto">
              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                All ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('active')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'active'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                In Progress ({activeOrdersCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('delivered')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'delivered'
                    ? 'bg-background text-foreground shadow-xs'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Completed ({deliveredOrdersCount})
              </button>
            </div>

            {/* In-page search + Refresh */}
            <div className="flex items-center gap-2.5">
              <div className="relative w-full sm:w-64">
                <Search className="size-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <Input
                  type="text"
                  placeholder="Filter by item or ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 h-8 text-xs bg-background border-border/80 rounded-lg"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                onClick={fetchOrders}
                disabled={isLoading}
                className="h-8 px-2.5 rounded-lg text-xs shrink-0 cursor-pointer"
                title="Refresh order status"
              >
                <RefreshCw className={`size-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              </Button>
            </div>
          </div>
        )}

        {/* Loading state skeleton */}
        {isLoading && (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-40 rounded-2xl border border-border/80 bg-muted/10 animate-pulse p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <div className="h-4 w-40 bg-muted rounded" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
                <div className="h-16 w-full bg-muted/40 rounded-xl" />
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-5 text-center space-y-2">
            <p className="text-xs font-semibold text-destructive">{error}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={fetchOrders}
              className="text-xs h-8 px-4 rounded-lg"
            >
              Retry Loading
            </Button>
          </div>
        )}

        {/* Order List */}
        {!isLoading && !error && session && (
          <div className="space-y-4">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order) => (
                <OrderCard key={order._id || order.orderNumber} order={order} />
              ))
            ) : orders.length > 0 ? (
              <div className="rounded-3xl border border-dashed border-border/80 bg-card/30 p-12 text-center space-y-3">
                <Search className="size-8 text-muted-foreground mx-auto" />
                <h3 className="text-sm font-bold text-foreground">No matching orders found</h3>
                <p className="text-xs text-muted-foreground">
                  Try adjusting your filter or search query.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setActiveTab('all');
                    setSearchQuery('');
                  }}
                  className="text-xs h-8 px-4 rounded-lg"
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-border/80 bg-card/40 p-12 text-center space-y-5">
                <div className="size-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
                  <ShoppingBag className="size-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-foreground">No orders placed yet</h3>
                  <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                    When you order hardware or accessories from ElectroMart, your order tracking,
                    invoices, and delivery status will appear here.
                  </p>
                </div>
                <Button asChild className="text-xs font-bold px-6 h-9 rounded-xl">
                  <Link href="/products">
                    Explore Catalog
                    <ArrowRight className="size-3.5 ml-2" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
