'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import {
  Menu,
  Zap,
  Package,
  Headphones,
  Smartphone,
  Laptop,
  Watch,
  Layers,
  HelpCircle,
  Truck,
  User,
  LogOut,
  LogIn,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CATEGORIES } from '@/lib/constants';

const categoryIcons: Record<string, React.ReactNode> = {
  smartphones: <Smartphone className="size-4" />,
  laptops: <Laptop className="size-4" />,
  audio: <Headphones className="size-4" />,
  wearables: <Watch className="size-4" />,
  accessories: <Layers className="size-4" />,
};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  const handleLinkClick = () => {
    setOpen(false);
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open Navigation Menu">
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col w-72 p-0">
        <SheetHeader className="p-4 border-b border-border text-left">
          <SheetTitle className="flex items-center gap-2 text-lg font-bold tracking-tight">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Zap className="size-4 fill-current" />
            </span>
            ElectroMart
          </SheetTitle>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4">
          {/* Main Links */}
          <div className="space-y-1">
            <Link
              href="/products"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <Package className="size-4 text-primary" />
              All Products
            </Link>
            <Link
              href="/orders"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <Truck className="size-4 text-primary" />
              Track Order
            </Link>
            <Link
              href="/support"
              onClick={handleLinkClick}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md hover:bg-muted transition-colors text-foreground"
            >
              <HelpCircle className="size-4 text-primary" />
              Customer Support
            </Link>
          </div>

          <Separator />

          {/* Categories */}
          <div>
            <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Departments
            </h4>
            <div className="space-y-1">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/products?category=${cat.id}`}
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors text-foreground/80 hover:text-foreground"
                >
                  <span className="text-muted-foreground">
                    {categoryIcons[cat.id] || <Package className="size-4" />}
                  </span>
                  {cat.label}
                </Link>
              ))}
            </div>
          </div>

          <Separator />

          {/* User Account */}
          <div>
            <h4 className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              My Account
            </h4>
            {session ? (
              <div className="space-y-1">
                <div className="px-3 py-1.5 text-xs">
                  <p className="font-semibold text-foreground truncate">{session.user?.name}</p>
                  <p className="text-muted-foreground truncate">{session.user?.email}</p>
                </div>
                <Link
                  href="/profile"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <User className="size-4" />
                  Profile Settings
                </Link>
                <Link
                  href="/orders"
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-muted transition-colors"
                >
                  <Truck className="size-4" />
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    handleLinkClick();
                    signOut({ callbackUrl: '/' });
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
                >
                  <LogOut className="size-4" />
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="space-y-2 px-3 pt-1">
                <Button asChild className="w-full text-xs" size="sm">
                  <Link href="/auth/login" onClick={handleLinkClick}>
                    <LogIn className="size-3.5 mr-1.5" /> Sign In
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full text-xs" size="sm">
                  <Link href="/auth/register" onClick={handleLinkClick}>
                    Create Account
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Local Store Info footer */}
        <div className="p-4 border-t border-border bg-muted/30 text-xs text-muted-foreground space-y-1">
          <p className="font-medium text-foreground">ElectroMart Nehru Place</p>
          <p>Plot 18, Commercial Complex, Nehru Place</p>
          <p>Open Today: 10:00 AM – 8:30 PM IST</p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
