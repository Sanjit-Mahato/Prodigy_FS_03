'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface ProductGalleryProps {
  images: string[];
  productName: string;
  hasDiscount?: boolean;
  discountPercent?: number;
  featured?: boolean;
}

export function ProductGallery({
  images,
  productName,
  hasDiscount,
  discountPercent,
  featured,
}: ProductGalleryProps) {
  const validImages =
    images && images.length > 0
      ? images
      : ['https://images.unsplash.com/photo-1526738549149-8e07eca6c147?auto=format&fit=crop&w=800&q=80'];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [imageError, setImageError] = useState(false);

  const activeImage = validImages[selectedIndex] || validImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Primary Hero Image Viewport */}
      <div className="relative aspect-square w-full rounded-2xl bg-muted/30 border border-border/80 p-6 flex items-center justify-center overflow-hidden group">
        <div className="relative w-full h-full flex items-center justify-center">
          <Image
            src={imageError ? '/placeholder-product.png' : activeImage}
            alt={`${productName} view ${selectedIndex + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, 550px"
            priority
            className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            onError={() => setImageError(true)}
          />
        </div>

        {/* Badges Overlay */}
        <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
          {hasDiscount && discountPercent && discountPercent > 0 && (
            <Badge variant="destructive" className="text-xs font-bold px-2.5 py-1 shadow-sm">
              SAVE {discountPercent}%
            </Badge>
          )}
          {featured && (
            <Badge variant="secondary" className="text-xs font-semibold bg-primary/10 text-primary border-primary/20">
              Featured Pick
            </Badge>
          )}
        </div>
      </div>

      {/* Thumbnails row (only if multi-image) */}
      {validImages.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {validImages.map((img, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setImageError(false);
                setSelectedIndex(idx);
              }}
              className={cn(
                'relative size-20 shrink-0 rounded-xl bg-muted/40 border-2 overflow-hidden p-1 transition-all cursor-pointer',
                selectedIndex === idx
                  ? 'border-primary ring-2 ring-primary/20 shadow-xs'
                  : 'border-border/60 hover:border-border hover:bg-muted/70 opacity-70 hover:opacity-100'
              )}
              aria-label={`Select image ${idx + 1}`}
            >
              <Image
                src={img}
                alt=""
                fill
                sizes="80px"
                className="object-contain p-1"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
