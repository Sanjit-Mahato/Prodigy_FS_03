'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShoppingCart, Check, Eye } from 'lucide-react';
import { IProduct } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { StarRating } from '@/components/shared/StarRating';
import { useCart } from '@/context/cart-context';
import { cn, formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: IProduct;
  viewMode?: 'grid' | 'list';
  className?: string;
}

export function ProductCard({
  product,
  viewMode = 'grid',
  className,
}: ProductCardProps) {
  const { addItem, setIsCartOpen } = useCart();
  const [isAdded, setIsAdded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const hasDiscount =
    product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) * 100
      )
    : 0;

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;

    addItem({
      productId: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0] || '/placeholder-product.png',
      stock: product.stock,
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1500);
  };

  const primaryImage =
    !imageError && product.images && product.images.length > 0
      ? product.images[0]
      : 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80';

  if (viewMode === 'list') {
    return (
      <div
        className={cn(
          'group relative flex flex-col sm:flex-row items-stretch bg-card rounded-xl border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-md transition-all duration-200 overflow-hidden',
          className
        )}
      >
        {/* Product Image */}
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full sm:w-60 h-52 sm:h-auto bg-muted/20 shrink-0 overflow-hidden flex items-center justify-center p-4"
        >
          <div className="relative w-full h-full min-h-[160px]">
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 100vw, 240px"
              className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
              onError={() => setImageError(true)}
            />
          </div>
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 shadow-xs"
            >
              -{discountPercent}%
            </Badge>
          )}
        </Link>

        {/* Content Details */}
        <div className="flex-1 flex flex-col justify-between p-5">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                {product.brand}
              </span>
              <span className="text-xs text-muted-foreground">•</span>
              <span className="text-xs text-muted-foreground capitalize">
                {product.category}
              </span>
              {isOutOfStock ? (
                <Badge variant="outline" className="text-xs text-destructive border-destructive/30 ml-auto">
                  Out of Stock
                </Badge>
              ) : isLowStock ? (
                <Badge variant="outline" className="text-xs text-amber-600 dark:text-amber-400 border-amber-500/30 ml-auto">
                  Only {product.stock} left
                </Badge>
              ) : (
                <Badge variant="outline" className="text-xs text-emerald-600 dark:text-emerald-400 border-emerald-500/30 ml-auto">
                  In Stock
                </Badge>
              )}
            </div>

            <Link href={`/products/${product.slug}`}>
              <h3 className="font-semibold text-base sm:text-lg text-foreground group-hover:text-primary transition-colors line-clamp-1">
                {product.name}
              </h3>
            </Link>

            <div className="mt-2 flex items-center gap-2">
              <StarRating
                rating={product.rating}
                reviewCount={product.reviewCount}
                size="sm"
                showValue
              />
            </div>

            <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>

            {/* Specs preview */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {Object.entries(product.specs)
                  .slice(0, 3)
                  .map(([key, val]) => (
                    <span
                      key={key}
                      className="inline-flex items-center text-xs bg-muted/60 text-muted-foreground px-2 py-0.5 rounded-md"
                    >
                      <strong className="font-medium mr-1 text-foreground/80">{key}:</strong> {val}
                    </span>
                  ))}
              </div>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-border/60 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-sm text-muted-foreground line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                  Save {formatPrice(product.originalPrice! - product.price)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                asChild
                className="gap-1.5 text-xs"
              >
                <Link href={`/products/${product.slug}`}>
                  <Eye className="size-3.5" />
                  View Details
                </Link>
              </Button>
              <Button
                size="sm"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={cn(
                  'gap-1.5 text-xs font-medium transition-all',
                  isAdded ? 'bg-emerald-600 hover:bg-emerald-600 text-white' : ''
                )}
              >
                {isAdded ? (
                  <>
                    <Check className="size-3.5" />
                    Added
                  </>
                ) : (
                  <>
                    <ShoppingCart className="size-3.5" />
                    Add to Cart
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div
      className={cn(
        'group relative flex flex-col bg-card rounded-xl border border-border/80 hover:border-primary/50 shadow-xs hover:shadow-lg transition-all duration-200 overflow-hidden',
        className
      )}
    >
      {/* Top Media Container */}
      <div className="relative aspect-square w-full bg-muted/20 p-3 flex items-center justify-center overflow-hidden rounded-t-2xl">
        <Link
          href={`/products/${product.slug}`}
          className="relative w-full h-full flex items-center justify-center"
        >
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-contain p-3 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1.5 z-10 pointer-events-none">
          {hasDiscount && (
            <Badge
              variant="destructive"
              className="text-xs font-semibold px-2 py-0.5 shadow-xs"
            >
              -{discountPercent}%
            </Badge>
          )}
          {product.featured && (
            <Badge
              variant="secondary"
              className="text-[11px] font-medium bg-primary/10 text-primary border-primary/20"
            >
              Featured
            </Badge>
          )}
        </div>

        {/* Stock Badge */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {isOutOfStock ? (
            <Badge variant="outline" className="text-[10px] text-destructive border-destructive/30 bg-background/80 backdrop-blur-xs">
              Out of Stock
            </Badge>
          ) : isLowStock ? (
            <Badge variant="outline" className="text-[10px] text-amber-600 dark:text-amber-400 border-amber-500/30 bg-background/80 backdrop-blur-xs">
              Only {product.stock} left
            </Badge>
          ) : null}
        </div>
      </div>

      {/* Details Container */}
      <div className="flex-1 flex flex-col p-4 justify-between">
        <div>
          <div className="flex items-center justify-between gap-1 text-xs text-muted-foreground mb-1.5">
            <span className="font-semibold text-primary uppercase tracking-wider text-[11px]">
              {product.brand}
            </span>
            <span className="capitalize text-[11px]">
              {product.category}
            </span>
          </div>

          <Link href={`/products/${product.slug}`}>
            <h3 className="font-medium text-sm text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
              {product.name}
            </h3>
          </Link>

          <div className="mt-2">
            <StarRating
              rating={product.rating}
              reviewCount={product.reviewCount}
              size="sm"
              showValue
            />
          </div>
        </div>

        {/* Bottom Price & Button */}
        <div className="mt-4 pt-3 border-t border-border/60">
          <div className="flex items-baseline justify-between mb-3">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-lg font-bold text-foreground">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-xs text-muted-foreground line-through">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
              </div>
              {hasDiscount && (
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  Save {formatPrice(product.originalPrice! - product.price)}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <Button
              variant="outline"
              size="sm"
              asChild
              className="text-xs h-8 px-2"
            >
              <Link href={`/products/${product.slug}`}>
                View
              </Link>
            </Button>
            <Button
              size="sm"
              disabled={isOutOfStock}
              onClick={handleAddToCart}
              className={cn(
                'text-xs h-8 px-2 gap-1 transition-all',
                isAdded ? 'bg-emerald-600 hover:bg-emerald-600 text-white' : ''
              )}
            >
              {isAdded ? (
                <>
                  <Check className="size-3.5" />
                  Added
                </>
              ) : (
                <>
                  <ShoppingCart className="size-3.5" />
                  Add
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
