'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  Zap,
  Check,
  Minus,
  Plus,
  Truck,
  Store,
  ShieldCheck,
  Clock,
} from 'lucide-react';
import { IProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/context/cart-context';
import { cn } from '@/lib/utils';

interface ProductDetailActionsProps {
  product: IProduct;
}

export function ProductDetailActions({ product }: ProductDetailActionsProps) {
  const router = useRouter();
  const { addItem, setIsCartOpen } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdded, setIsAdded] = useState(false);

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;
  const maxAvailable = Math.min(product.stock, 10); // cap max per transaction to 10 or current stock

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(maxAvailable, prev + 1));
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;

    addItem(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder-product.png',
        stock: product.stock,
      },
      quantity
    );

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const handleBuyNow = () => {
    if (isOutOfStock) return;

    addItem(
      {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images[0] || '/placeholder-product.png',
        stock: product.stock,
      },
      quantity
    );

    router.push('/checkout');
  };

  return (
    <div className="space-y-6">
      {/* Stock Status Banner */}
      <div className="flex items-center gap-2">
        {isOutOfStock ? (
          <Badge variant="destructive" className="text-xs px-2.5 py-1">
            Out of Stock
          </Badge>
        ) : isLowStock ? (
          <Badge variant="outline" className="text-xs px-2.5 py-1 text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10">
            Only {product.stock} units remaining - order soon
          </Badge>
        ) : (
          <Badge variant="outline" className="text-xs px-2.5 py-1 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10">
            In Stock ({product.stock} available)
          </Badge>
        )}
      </div>

      {/* Quantity & Actions Bar */}
      {!isOutOfStock && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          {/* Quantity Stepper */}
          <div className="flex items-center border border-border rounded-xl p-1 bg-muted/30 w-fit">
            <span className="text-xs font-semibold px-3 text-muted-foreground select-none">
              Quantity:
            </span>
            <button
              type="button"
              onClick={handleDecrease}
              disabled={quantity <= 1}
              className="size-8 rounded-lg flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3.5" />
            </button>
            <span className="w-10 text-center font-bold text-sm text-foreground select-none">
              {quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrease}
              disabled={quantity >= maxAvailable}
              className="size-8 rounded-lg flex items-center justify-center hover:bg-muted text-foreground transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
              aria-label="Increase quantity"
            >
              <Plus className="size-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Primary Action Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
        <Button
          size="lg"
          disabled={isOutOfStock}
          onClick={handleAddToCart}
          className={cn(
            'h-12 text-sm font-semibold gap-2 shadow-sm transition-all',
            isAdded ? 'bg-emerald-600 hover:bg-emerald-600 text-white' : ''
          )}
        >
          {isAdded ? (
            <>
              <Check className="size-4.5" />
              Added to Cart ({quantity})
            </>
          ) : (
            <>
              <ShoppingCart className="size-4.5" />
              Add to Cart
            </>
          )}
        </Button>

        <Button
          variant="secondary"
          size="lg"
          disabled={isOutOfStock}
          onClick={handleBuyNow}
          className="h-12 text-sm font-semibold gap-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all"
        >
          <Zap className="size-4.5" />
          Buy Now
        </Button>
      </div>

      {/* Local Store Guarantee & Shipping Badges */}
      <div className="rounded-xl border border-border/80 bg-card/60 p-4 space-y-3 divide-y divide-border/60">
        <div className="flex items-start gap-3">
          <Store className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-foreground block">
              Free 2-Hour Nehru Place Pickup
            </span>
            <p className="text-muted-foreground mt-0.5">
              Available at our Nehru Place store. Ready within 2 hours of checkout.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3">
          <Truck className="size-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-foreground block">
              Free Delivery on Orders Over ₹999
            </span>
            <p className="text-muted-foreground mt-0.5">
              Standard local delivery in 1-2 business days with real-time SMS tracking.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 pt-3">
          <ShieldCheck className="size-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-semibold text-foreground block">
              ElectroMart 1-Year Guarantee & 30-Day Returns
            </span>
            <p className="text-muted-foreground mt-0.5">
              100% genuine products with manufacturer warranty and hassle-free local returns.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
