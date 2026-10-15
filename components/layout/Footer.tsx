'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  MapPin,
  Clock,
  Phone,
  Mail,
  ShieldCheck,
  RotateCcw,
  Wrench,
  Truck,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { toast } from '@/components/ui/toast';
import { CATEGORIES } from '@/lib/constants';

export function Footer() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast({
        title: 'Invalid Email',
        description: 'Please enter a valid email address.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubscribed(true);
    toast({
      title: 'Subscribed Successfully!',
      description: 'You will receive exclusive local deals and tech discounts.',
    });
    setEmail('');
  };

  return (
    <footer className="border-t border-border bg-card text-card-foreground mt-auto">
      {/* Local Store Guarantee & Value Props */}
      <div className="border-b border-border/80 bg-muted/40 py-8">
        <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Truck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Free Store Pickup</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Ready in 2 hours at our Nehru Place store or free shipping on orders ₹999+.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <RotateCcw className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">30-Day Local Returns</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Hassle-free returns and direct local warranty assistance.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <Wrench className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Certified In-Store Repairs</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Free hardware diagnostic checks by our certified electronics specialists.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-lg bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="size-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground">Authentic & Verified</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                100% genuine products with manufacturer-backed warranties.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main footer navigation */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Col 1 & 2: Store info & Brand */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <span className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Zap className="size-4.5 fill-current" />
              </span>
              <span className="text-xl font-black tracking-tight text-foreground">
                Electro<span className="text-primary">Mart</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm">
              Your trusted local neighborhood electronics headquarters. Providing genuine smartphones,
              laptops, premium audio, and certified repairs since 2012.
            </p>

            <div className="space-y-2 text-xs text-muted-foreground pt-2">
              <div className="flex items-center gap-2.5">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>Plot 18, Commercial Complex, Nehru Place, New Delhi, Delhi 110019</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="size-4 text-primary shrink-0" />
                <span>Mon – Sat: 10:00 AM – 8:30 PM IST | Sun: 11:00 AM – 7:00 PM IST</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="size-4 text-primary shrink-0" />
                <span>+91 (011) 2641-5678 • Nehru Place Store Care</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="size-4 text-primary shrink-0" />
                <span>support@electromart-delhi.in</span>
              </div>
            </div>
          </div>

          {/* Col 3: Departments */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-tight">Departments</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/products"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  All Products
                </Link>
              </li>
              {CATEGORIES.map((cat) => (
                <li key={cat.id}>
                  <Link
                    href={`/products?category=${cat.id}`}
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-tight">Customer Care</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  href="/orders"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Track Your Order
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Help Center & FAQs
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Submit Support Ticket
                </Link>
              </li>
              <li>
                <Link
                  href="/profile"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Manage Account
                </Link>
              </li>
              <li>
                <Link
                  href="/support#store-pickup"
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  In-Store Pickup Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Newsletter */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-foreground tracking-tight">
              Local Deals & Alerts
            </h4>
            <p className="text-xs text-muted-foreground">
              Subscribe to get alerts on weekly doorbusters, restocks, and local store events.
            </p>

            {isSubscribed ? (
              <div className="flex items-center gap-2 p-3 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-medium">
                <CheckCircle2 className="size-4" />
                Thanks for subscribing!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex gap-1.5">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="h-9 text-xs"
                    required
                  />
                  <Button type="submit" size="sm" className="h-9 px-3">
                    <ArrowRight className="size-3.5" />
                  </Button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  We respect your privacy. Unsubscribe anytime.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Bar: Copyright & Project Attribution */}
      <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
        <div>
          <p>© {new Date().getFullYear()} ElectroMart Local Electronics. All rights reserved.</p>
          <p className="text-[11px] mt-0.5">
            Prodigy InfoTech Internship Project FS-03 • Full-Stack E-Commerce Platform
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="font-semibold text-foreground/80">Accepted Payments:</span>
          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-muted px-2.5 py-1 rounded border border-border">
            <span>UPI (GPay / PhonePe / Paytm)</span> • <span>RuPay / Cards</span> • <span>Net Banking</span> • <span>Cash on Delivery</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
