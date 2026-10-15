import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  Smartphone,
  Laptop,
  Headphones,
  Watch,
  Cable,
  CheckCircle2,
  Star,
  Clock,
  Store,
  ChevronRight,
} from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { IProduct } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/lib/constants';

// Map categories to distinct icons and visual accents
const CATEGORY_META: Record<
  string,
  {
    icon: React.ComponentType<{ className?: string }>;
    accentColor: string;
    bgGradient: string;
    itemCountText: string;
  }
> = {
  smartphones: {
    icon: Smartphone,
    accentColor: 'text-blue-500',
    bgGradient: 'from-blue-500/10 via-blue-500/5 to-transparent',
    itemCountText: 'Flagships & Essentials',
  },
  laptops: {
    icon: Laptop,
    accentColor: 'text-indigo-500',
    bgGradient: 'from-indigo-500/10 via-indigo-500/5 to-transparent',
    itemCountText: 'Workstations & Ultrabooks',
  },
  audio: {
    icon: Headphones,
    accentColor: 'text-violet-500',
    bgGradient: 'from-violet-500/10 via-violet-500/5 to-transparent',
    itemCountText: 'Hi-Fi Audio & Earbuds',
  },
  wearables: {
    icon: Watch,
    accentColor: 'text-emerald-500',
    bgGradient: 'from-emerald-500/10 via-emerald-500/5 to-transparent',
    itemCountText: 'Smartwatches & Fitness',
  },
  accessories: {
    icon: Cable,
    accentColor: 'text-amber-500',
    bgGradient: 'from-amber-500/10 via-amber-500/5 to-transparent',
    itemCountText: 'Cables, Docks & Power',
  },
};

export default async function HomePage() {
  let featuredProducts: IProduct[] = [];
  let topDeals: IProduct[] = [];

  try {
    await connectDB();

    // Query featured products
    const featuredDocs = await Product.find({ featured: true })
      .limit(8)
      .lean();

    featuredProducts = featuredDocs.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      originalPrice: doc.originalPrice,
      images: Array.isArray(doc.images) ? doc.images : [],
      category: doc.category,
      brand: doc.brand,
      specs: doc.specs instanceof Map ? Object.fromEntries(doc.specs) : doc.specs || {},
      stock: doc.stock,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      featured: Boolean(doc.featured),
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    }));

    // Query top discounted deals
    const dealDocs = await Product.find({
      originalPrice: { $exists: true, $ne: null },
      $expr: { $gt: ['$originalPrice', '$price'] },
    })
      .sort({ rating: -1 })
      .limit(4)
      .lean();

    topDeals = dealDocs.map((doc: any) => ({
      _id: doc._id.toString(),
      name: doc.name,
      slug: doc.slug,
      description: doc.description,
      price: doc.price,
      originalPrice: doc.originalPrice,
      images: Array.isArray(doc.images) ? doc.images : [],
      category: doc.category,
      brand: doc.brand,
      specs: doc.specs instanceof Map ? Object.fromEntries(doc.specs) : doc.specs || {},
      stock: doc.stock,
      rating: doc.rating,
      reviewCount: doc.reviewCount,
      featured: Boolean(doc.featured),
      createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
    }));
  } catch (error) {
    console.error('Error fetching homepage products:', error);
  }

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-16">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden border-b border-border/80 bg-gradient-to-b from-primary/5 via-background to-background py-12 sm:py-20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.2),rgba(0,0,0,0))] pointer-events-none" />

        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 shadow-xs">
                <Store className="size-3.5" />
                <span>Nehru Place, New Delhi &bull; Authorized Premium Retailer</span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
                Next-Gen Electronics,{' '}
                <span className="bg-gradient-to-r from-primary via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Delivered Today.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Experience the premier collection of smartphones, high-performance laptops,
                audiophile sound systems, and smart tech with 2-hour Nehru Place pickup and certified local warranties.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <Button
                  asChild
                  size="lg"
                  className="w-full sm:w-auto h-12 px-7 text-sm font-semibold rounded-xl gap-2 shadow-md hover:shadow-lg transition-all"
                >
                  <Link href="/products">
                    Explore Catalog
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto h-12 px-6 text-sm font-semibold rounded-xl border-border/80 hover:bg-muted/50"
                >
                  <Link href="/products?category=smartphones">
                    Browse Flagships
                  </Link>
                </Button>
              </div>

              {/* Local Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs font-medium text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="size-4 text-emerald-500" />
                  <span>100% Genuine Manufacturer Guarantee</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="size-4 text-primary" />
                  <span>2-Hour Store Pickup</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-blue-500" />
                  <span>30-Day Hassle-Free Returns</span>
                </div>
              </div>
            </div>

            {/* Right Hero Visual Card */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md rounded-3xl border border-border/80 bg-card/80 p-6 shadow-xl backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-4 border-b border-border/60">
                  <div className="flex items-center gap-2">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <Sparkles className="size-3.5" />
                    </span>
                    <span className="text-xs font-bold uppercase tracking-wider text-primary">
                      Spotlight Deal
                    </span>
                  </div>
                  <Badge variant="secondary" className="text-[11px] font-semibold">
                    Save ₹15,000
                  </Badge>
                </div>

                <div className="py-6 flex flex-col items-center text-center">
                  <div className="relative size-48 sm:size-56 mb-4 rounded-2xl overflow-hidden bg-muted/30 p-2">
                    <Image
                      src="https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=800&q=80"
                      alt="Apple iPhone 15 Pro Max"
                      fill
                      className="object-contain p-2 hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>

                  <h3 className="text-lg font-bold text-foreground">
                    Apple iPhone 15 Pro Max
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                    Aerospace-grade titanium &bull; A17 Pro Chip &bull; 48MP Camera
                  </p>

                  <div className="mt-4 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-foreground">₹1,34,900</span>
                    <span className="text-sm text-muted-foreground line-through">₹1,49,900</span>
                  </div>

                  <div className="mt-5 w-full">
                    <Button asChild className="w-full h-10 text-xs font-semibold rounded-xl">
                      <Link href="/products/apple-iphone-15-pro-max">
                        View Product Details
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. VALUE PROPOSITION BAR */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/70 bg-card/60 shadow-xs">
            <div className="size-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Fast Local Delivery</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Same-day local courier for orders before 2 PM. Free shipping over ₹999.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/70 bg-card/60 shadow-xs">
            <div className="size-11 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Store className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">2-Hour Store Pickup</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Reserve online and collect curbside or at our Nehru Place store counter.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/70 bg-card/60 shadow-xs">
            <div className="size-11 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">1-Year Warranty</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Full manufacturer coverage plus certified on-site diagnostic support.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-2xl border border-border/70 bg-card/60 shadow-xs">
            <div className="size-11 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <RotateCcw className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">30-Day Returns</h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                Simple and transparent return policy with instant in-store refund options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. CATEGORIES GRID */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Shop by Category
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Explore our curated departments of authentic, cutting-edge electronics
            </p>
          </div>
          <Link
            href="/products"
            className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
          >
            All Departments
            <ChevronRight className="size-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat.id] || {
              icon: Zap,
              accentColor: 'text-primary',
              bgGradient: 'from-primary/10 to-transparent',
              itemCountText: 'Explore Collection',
            };
            const Icon = meta.icon;

            return (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="group relative flex flex-col items-center text-center p-6 rounded-2xl border border-border/70 bg-card/60 hover:bg-card hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                <div
                  className={`size-14 rounded-2xl bg-gradient-to-b ${meta.bgGradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
                >
                  <Icon className={`size-7 ${meta.accentColor}`} />
                </div>

                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {cat.label}
                </h3>
                <p className="text-[11px] text-muted-foreground mt-1 line-clamp-1">
                  {cat.description}
                </p>
                <span className="text-[10px] font-semibold text-primary mt-2 inline-flex items-center gap-1 group-hover:underline">
                  {meta.itemCountText}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. FEATURED PRODUCTS SECTION */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wider mb-1">
              <Sparkles className="size-3.5" />
              Handpicked Selection
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              Featured Products
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
              Customer favorites and top-rated devices in store now
            </p>
          </div>
          <Button asChild variant="outline" size="sm" className="rounded-xl text-xs font-semibold">
            <Link href="/products?sort=featured">View All Featured</Link>
          </Button>
        </div>

        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredProducts.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl bg-muted/10">
            <Zap className="size-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-sm font-semibold text-foreground">Products being updated</p>
            <p className="text-xs text-muted-foreground mt-1">
              Visit our full catalog to browse available stock.
            </p>
            <Button asChild size="sm" className="mt-4 rounded-xl text-xs">
              <Link href="/products">Browse All Products</Link>
            </Button>
          </div>
        )}
      </section>

      {/* 5. PROMOTIONAL BANNER */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 sm:p-12 shadow-xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.3),transparent_50%)] pointer-events-none" />

          <div className="relative max-w-2xl space-y-4">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold">
              Limited-Time In-Store & Online Special
            </span>
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white leading-tight">
              Upgrade Your Audio & Gear. Save Up To 25% Off.
            </h2>
            <p className="text-sm text-blue-100/90 leading-relaxed font-normal">
              Get studio-quality noise cancellation and crystal-clear acoustic fidelity from Bose, Sony, and Apple with complimentary store setup.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Button asChild size="sm" className="bg-white text-blue-950 hover:bg-blue-50 font-semibold rounded-xl text-xs h-10 px-5">
                <Link href="/products?category=audio">Shop Audio Deals</Link>
              </Button>
              <Button asChild variant="outline" size="sm" className="border-white/30 text-white hover:bg-white/10 font-semibold rounded-xl text-xs h-10 px-5">
                <Link href="/support">Visit Nehru Place Store</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TOP DISCOUNT DEALS */}
      {topDeals.length > 0 && (
        <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-border/60 pb-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
                <Sparkles className="size-3.5" />
                Special Markdowns
              </div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                Today&apos;s Best Deals
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Significant discounts on verified top-tier electronics
              </p>
            </div>
            <Link
              href="/products"
              className="text-xs font-semibold text-primary hover:underline flex items-center gap-1 shrink-0"
            >
              See all discounts
              <ChevronRight className="size-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {topDeals.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </section>
      )}

      {/* 7. CUSTOMER TESTIMONIALS */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Trusted by Tech Enthusiasts Across Delhi NCR
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Read real feedback from our community of creators, professionals, and students
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl border border-border/70 bg-card/60 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                &ldquo;Ordered my MacBook Pro M3 at 11 AM and picked it up at the Nehru Place branch by 1 PM. The staff even helped transfer my diagnostic data. Extraordinary service!&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border/40">
              <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                DL
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">David Lin</p>
                <p className="text-[11px] text-muted-foreground">Verified Local Buyer</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border/70 bg-card/60 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                &ldquo;ElectroMart carries 100% authentic gear with real manufacturer warranties. Finding the Sony WH-1000XM5 on sale here was the best tech purchase I&apos;ve made this year.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border/40">
              <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                SM
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Sarah Martinez</p>
                <p className="text-[11px] text-muted-foreground">Audio Engineer</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-border/70 bg-card/60 shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="size-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-foreground/90 leading-relaxed italic">
                &ldquo;Smooth checkout, transparent order tracking timeline, and friendly customer support when I needed to update my delivery address. Couldn&apos;t ask for more.&rdquo;
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2 border-t border-border/40">
              <div className="size-8 rounded-full bg-primary/10 text-primary font-bold text-xs flex items-center justify-center">
                MR
              </div>
              <div>
                <p className="text-xs font-semibold text-foreground">Marcus Reed</p>
                <p className="text-[11px] text-muted-foreground">Software Architect</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. NEWSLETTER / CLUB CTA */}
      <section className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-border/80 bg-muted/30 p-8 sm:p-10 text-center max-w-3xl mx-auto space-y-4 shadow-xs">
          <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto">
            <Zap className="size-6" />
          </div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            Join the ElectroMart Tech Insider Club
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
            Get early access to flash sales, local store event invites, and exclusive ₹500 off your first in-store or online order over ₹2,500.
          </p>
          <form
            action="#"
            className="flex flex-col sm:flex-row items-center justify-center gap-2 max-w-md mx-auto pt-2"
          >
            <input
              type="email"
              placeholder="Enter your email address"
              className="w-full h-10 px-3.5 text-xs bg-background border border-border/80 rounded-xl focus:outline-none focus:ring-1 focus:ring-primary"
              required
            />
            <Button type="submit" size="sm" className="w-full sm:w-auto h-10 px-5 text-xs font-semibold rounded-xl shrink-0">
              Subscribe
            </Button>
          </form>
          <p className="text-[11px] text-muted-foreground">
            No spam, ever. Unsubscribe at any time with one click.
          </p>
        </div>
      </section>
    </div>
  );
}
