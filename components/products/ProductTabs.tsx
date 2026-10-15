'use client';

import React from 'react';
import {
  FileText,
  Sliders,
  MessageSquare,
  Truck,
  CheckCircle,
  Shield,
  RotateCcw,
  Store,
} from 'lucide-react';
import { IProduct, IReview } from '@/types';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ReviewList } from '@/components/reviews/ReviewList';

interface ProductTabsProps {
  product: IProduct;
  reviews: IReview[];
}

export function ProductTabs({ product, reviews }: ProductTabsProps) {
  const specsEntries = Object.entries(product.specs || {});

  return (
    <div className="w-full">
      <Tabs defaultValue="specs" className="w-full space-y-6">
        <TabsList
          variant="default"
          className="w-full justify-start overflow-x-auto h-auto p-1.5 bg-muted/50 border border-border/80 rounded-xl scrollbar-none"
        >
          <TabsTrigger
            value="specs"
            className="gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg data-active:bg-background data-active:shadow-xs cursor-pointer"
          >
            <Sliders className="size-4" />
            <span>Technical Specs</span>
          </TabsTrigger>

          <TabsTrigger
            value="description"
            className="gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg data-active:bg-background data-active:shadow-xs cursor-pointer"
          >
            <FileText className="size-4" />
            <span>Product Overview</span>
          </TabsTrigger>

          <TabsTrigger
            value="reviews"
            className="gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg data-active:bg-background data-active:shadow-xs cursor-pointer"
          >
            <MessageSquare className="size-4" />
            <span>Customer Reviews</span>
            <span className="ml-1 px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary">
              {reviews.length}
            </span>
          </TabsTrigger>

          <TabsTrigger
            value="shipping"
            className="gap-2 px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg data-active:bg-background data-active:shadow-xs cursor-pointer"
          >
            <Truck className="size-4" />
            <span>Store Pickup & Delivery</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Technical Specs */}
        <TabsContent value="specs" className="pt-2">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 shadow-xs">
            <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
              <Sliders className="size-4.5 text-primary" />
              Detailed Technical Specifications
            </h3>

            {specsEntries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                {specsEntries.map(([key, value]) => (
                  <div
                    key={key}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg border-b border-border/40 hover:bg-muted/30 transition-colors"
                  >
                    <span className="text-xs font-medium text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className="text-xs font-semibold text-foreground text-right font-mono">
                      {String(value)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Standard retail electronics specifications apply.
              </p>
            )}

            <div className="mt-6 pt-4 border-t border-border/60 flex items-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="size-3.5 text-emerald-500" />
              <span>
                All specifications are verified directly against official manufacturer documentation.
              </span>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Product Overview */}
        <TabsContent value="description" className="pt-2">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-6 shadow-xs">
            <div>
              <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
                <FileText className="size-4.5 text-primary" />
                About the {product.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {product.description}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-border/60">
              <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  100% Authentic Brand
                </span>
                <p className="text-xs text-muted-foreground">
                  Direct official distributor stock from {product.brand}.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  In The Box
                </span>
                <p className="text-xs text-muted-foreground">
                  Device, original power cable/charger, documentation & warranty card.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-muted/30 border border-border/60 space-y-1">
                <span className="text-xs font-semibold text-foreground block">
                  Local Store Support
                </span>
                <p className="text-xs text-muted-foreground">
                  Walk in anytime for technical assistance and setup advice.
                </p>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Tab 3: Customer Reviews */}
        <TabsContent value="reviews" className="pt-2">
          <ReviewList
            productId={product._id}
            initialReviews={reviews}
            averageRating={product.rating}
            totalReviews={product.reviewCount}
          />
        </TabsContent>

        {/* Tab 4: Store Pickup & Delivery */}
        <TabsContent value="shipping" className="pt-2">
          <div className="rounded-2xl border border-border/80 bg-card/60 p-6 space-y-6 shadow-xs">
            <h3 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
              <Store className="size-4.5 text-primary" />
              Local Store Pickup & Delivery Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                <div className="size-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                  <Store className="size-5" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">
                  Free 2-Hour Store Pickup
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Choose local pickup at checkout. Orders placed before 5:00 PM IST are prepared and ready at our Nehru Place store (Plot 18, Commercial Complex) in 2 hours.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                <div className="size-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Truck className="size-5" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">
                  Express Local Delivery
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Complimentary delivery on all orders over $50. Standard orders arrive in 1-2 business days with real-time GPS courier tracking and signature verification.
                </p>
              </div>

              <div className="p-5 rounded-xl border border-border/80 bg-muted/20 space-y-3">
                <div className="size-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <RotateCcw className="size-5" />
                </div>
                <h4 className="font-semibold text-sm text-foreground">
                  30-Day Hassle-Free Returns
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Not completely satisfied? Bring the item back to our store or request a prepaid return label within 30 days for an instant full refund or replacement.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <Shield className="size-5 text-primary shrink-0" />
              <p className="text-xs text-foreground">
                <span className="font-semibold">ElectroMart Peace of Mind:</span> All devices include our 1-year store warranty covering defects, with on-site diagnostics at our store repair bar.
              </p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
