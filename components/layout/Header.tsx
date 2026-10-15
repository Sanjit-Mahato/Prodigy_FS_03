'use client';

import React from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Zap,
  ShoppingBag,
  User,
  Truck,
  LogOut,
  MapPin,
  Clock,
  Phone,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { SearchBar } from '@/components/shared/SearchBar';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { MobileNav } from '@/components/layout/MobileNav';
import { CartSheet } from '@/components/cart/CartSheet';
import { useCart } from '@/hooks/use-cart';
import { CATEGORIES } from '@/lib/constants';

export function Header() {
  const { data: session, status } = useSession();
  const { itemCount, setIsCartOpen } = useCart();

  const getInitials = (name?: string | null) => {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/70 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80 transition-all">
        {/* Top utility announcement bar */}
        <div className="bg-primary text-primary-foreground text-xs py-1.5 px-4 hidden md:block">
          <div className="container mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <span className="flex items-center gap-1.5 font-medium">
                <MapPin className="size-3.5" />
                Nehru Place Store: Plot 18, Commercial Complex, New Delhi
              </span>
              <span className="flex items-center gap-1.5 text-primary-foreground/90">
                <Clock className="size-3.5" />
                Open Today until 8:30 PM IST
              </span>
              <span className="flex items-center gap-1.5 text-primary-foreground/90">
                <Phone className="size-3.5" />
                +91 (011) 2641-5678
              </span>
            </div>

            <div className="flex items-center gap-5 text-primary-foreground/90 font-medium">
              <span className="flex items-center gap-1 text-amber-300 font-semibold">
                <Sparkles className="size-3" />
                Free delivery on orders ₹999+
              </span>
              <Link href="/orders" className="hover:text-primary-foreground transition-colors">
                Track Order
              </Link>
              <Link href="/support" className="hover:text-primary-foreground transition-colors">
                Customer Support
              </Link>
            </div>
          </div>
        </div>

        {/* Main navigation row */}
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: Mobile Nav & Brand Logo */}
          <div className="flex items-center gap-3">
            <MobileNav />

            <Link href="/" className="flex items-center gap-2 group">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm group-hover:scale-105 transition-transform">
                <Zap className="size-5 fill-current" />
              </span>
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-foreground leading-none">
                  Electro<span className="text-primary">Mart</span>
                </span>
                <span className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground leading-tight">
                  Local Electronics
                </span>
              </div>
            </Link>
          </div>

          {/* Center: Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xl mx-4">
            <SearchBar />
          </div>

          {/* Right Actions: Account, Cart */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* User Account Menu */}
            {status === 'loading' ? (
              <div className="size-8 rounded-full bg-muted animate-pulse" />
            ) : session?.user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative flex items-center gap-2 p-1.5 rounded-full hover:bg-muted/80 focus-visible:ring-1"
                  >
                    <Avatar size="sm">
                      <AvatarImage src={session.user.image || undefined} alt={session.user.name || 'User'} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold text-xs">
                        {getInitials(session.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden lg:inline text-xs font-medium text-foreground max-w-24 truncate">
                      {session.user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="size-3 text-muted-foreground hidden lg:inline" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-1">
                  <DropdownMenuGroup>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-0.5">
                        <p className="text-sm font-semibold leading-none">{session.user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {session.user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer flex items-center">
                        <User className="size-4 mr-2" />
                        Profile & Addresses
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/orders" className="cursor-pointer flex items-center">
                        <Truck className="size-4 mr-2" />
                        My Orders
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      variant="destructive"
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="cursor-pointer flex items-center"
                    >
                      <LogOut className="size-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <div className="flex items-center gap-1 sm:gap-2">
                <Button asChild variant="ghost" size="sm" className="text-xs font-semibold">
                  <Link href="/auth/login">Sign In</Link>
                </Button>
                <Button asChild size="sm" className="text-xs font-semibold hidden sm:inline-flex">
                  <Link href="/auth/register">Sign Up</Link>
                </Button>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <ThemeToggle />

            {/* Shopping Cart Trigger */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 rounded-full px-3 h-9.5 border-border hover:border-primary/50 transition-colors"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="size-4 text-primary" />
              <span className="hidden sm:inline text-xs font-semibold">Cart</span>
              {itemCount > 0 && (
                <span className="flex size-5 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground tabular-nums">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar row */}
        <div className="md:hidden px-4 pb-3">
          <SearchBar />
        </div>

        {/* Category Navigation Pills */}
        <div className="hidden lg:block border-t border-border/50 bg-muted/20">
          <div className="container mx-auto px-4 flex items-center gap-1 py-1.5 text-xs font-medium overflow-x-auto scrollbar-none">
            <Link
              href="/products"
              className="px-3 py-1 rounded-md text-foreground/80 hover:text-foreground hover:bg-muted transition-colors font-semibold"
            >
              All Products
            </Link>
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.id}`}
                className="px-3 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors whitespace-nowrap"
              >
                {cat.label}
              </Link>
            ))}
            <div className="ml-auto flex items-center gap-4 text-muted-foreground">
              <Link href="/support" className="hover:text-foreground transition-colors">
                Local Store Repairs & Diagnostics
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Slide-out Cart Sheet */}
      <CartSheet />
    </>
  );
}
