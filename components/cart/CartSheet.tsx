'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Plus, Minus, Trash2, ArrowRight } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { EmptyState } from '@/components/shared/EmptyState';

export function CartSheet() {
  const {
    items,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeItem,
    itemCount,
    subtotal,
    shipping,
    total,
  } = useCart();

  const freeShippingThreshold = 50;
  const progressToFreeShipping = Math.min(
    100,
    Math.round((subtotal / freeShippingThreshold) * 100)
  );
  const amountNeededForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-md p-0">
        <SheetHeader className="p-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2 text-base font-semibold">
            <ShoppingBag className="size-4.5 text-primary" />
            Shopping Cart
            <span className="text-xs font-normal text-muted-foreground ml-auto pr-6">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </span>
          </SheetTitle>

          {/* Free Shipping Progress Meter */}
          <div className="mt-2 bg-muted/60 p-2.5 rounded-lg text-xs">
            {amountNeededForFreeShipping > 0 ? (
              <p className="text-muted-foreground mb-1.5">
                Add <span className="font-semibold text-foreground">{formatPrice(amountNeededForFreeShipping)}</span> more for <span className="text-emerald-600 font-semibold dark:text-emerald-400">FREE delivery</span>!
              </p>
            ) : (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium mb-1.5 flex items-center gap-1">
                🎉 Congratulations! You have unlocked FREE delivery!
              </p>
            )}
            <div className="w-full bg-border/80 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-emerald-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progressToFreeShipping}%` }}
              />
            </div>
          </div>
        </SheetHeader>

        {/* Cart items list */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          {items.length === 0 ? (
            <EmptyState
              icon={ShoppingBag}
              title="Your cart is empty"
              description="Looks like you haven't added any electronics to your cart yet."
              action={{
                label: 'Start Shopping',
                onClick: () => setIsCartOpen(false),
              }}
            />
          ) : (
            <div className="divide-y divide-border/60">
              {items.map((item) => (
                <div key={item.productId} className="py-3.5 flex gap-3">
                  <div className="relative size-18 rounded-md border border-border bg-muted/30 overflow-hidden shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="72px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="text-sm font-medium leading-tight truncate text-foreground">
                        {item.name}
                      </h4>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-muted-foreground hover:text-destructive p-1 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </span>

                      {/* Quantity Selector */}
                      <div className="flex items-center border border-border rounded-md bg-muted/20">
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors rounded-l-md"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="px-2.5 text-xs font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                          disabled={item.quantity >= item.stock}
                          className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 rounded-r-md"
                          aria-label="Increase quantity"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer with totals and action buttons */}
        {items.length > 0 && (
          <SheetFooter className="p-4 border-t border-border bg-card/60 gap-3">
            <div className="space-y-1.5 w-full text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Estimated Shipping</span>
                <span>{shipping === 0 ? 'FREE' : formatPrice(shipping)}</span>
              </div>
              <Separator className="my-1.5" />
              <div className="flex justify-between text-sm font-bold text-foreground">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 w-full mt-2">
              <Button
                variant="outline"
                className="w-full text-xs"
                onClick={() => setIsCartOpen(false)}
                asChild
              >
                <Link href="/cart">View Cart</Link>
              </Button>
              <Button
                className="w-full text-xs"
                onClick={() => setIsCartOpen(false)}
                asChild
              >
                <Link href="/checkout" className="flex items-center justify-center gap-1">
                  Checkout <ArrowRight className="size-3.5" />
                </Link>
              </Button>
            </div>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
