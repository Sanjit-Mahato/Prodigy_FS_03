'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { ICartItem } from '@/types';
import { useCart } from '@/hooks/use-cart';
import { formatPrice } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface CartItemProps {
  item: ICartItem;
  compact?: boolean; // For slide-out drawer vs full page
}

export function CartItem({ item, compact = false }: CartItemProps) {
  const { updateQuantity, removeItem } = useCart();

  const handleIncrement = () => {
    if (item.quantity < item.stock) {
      updateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      updateQuantity(item.productId, item.quantity - 1);
    } else {
      removeItem(item.productId);
    }
  };

  return (
    <div
      className={`flex items-center gap-4 ${
        compact ? 'py-3' : 'py-5'
      } border-b border-border/60 transition-colors`}
    >
      {/* Product Image */}
      <div
        className={`relative shrink-0 overflow-hidden rounded-xl border border-border/80 bg-muted/20 flex items-center justify-center p-2 ${
          compact ? 'size-16' : 'size-24'
        }`}
      >
        {item.image ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 768px) 100px, 150px"
            className="object-contain transition-transform duration-300 hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-xs text-muted-foreground">
            No image
          </div>
        )}
      </div>

      {/* Details & Controls */}
      <div className="flex flex-1 flex-col justify-between self-stretch">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h4
              className={`font-semibold text-foreground line-clamp-1 ${
                compact ? 'text-xs' : 'text-sm'
              }`}
            >
              {item.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">
              Unit: {formatPrice(item.price)}
            </p>
          </div>

          {/* Remove Button */}
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => removeItem(item.productId)}
            className="size-7 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            aria-label={`Remove ${item.name} from cart`}
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>

        {/* Stepper & Line Total */}
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center rounded-lg border border-border bg-background shadow-2xs">
            <button
              type="button"
              onClick={handleDecrement}
              className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus className="size-3" />
            </button>
            <span className="w-8 text-center text-xs font-semibold font-mono">
              {item.quantity}
            </span>
            <button
              type="button"
              onClick={handleIncrement}
              disabled={item.quantity >= item.stock}
              className="flex size-7 items-center justify-center text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              aria-label="Increase quantity"
            >
              <Plus className="size-3" />
            </button>
          </div>

          <span
            className={`font-extrabold text-foreground ${
              compact ? 'text-xs' : 'text-sm'
            }`}
          >
            {formatPrice(item.price * item.quantity)}
          </span>
        </div>
      </div>
    </div>
  );
}
