'use client';

import React, { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowUpDown } from 'lucide-react';
import { SORT_OPTIONS } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ProductSortProps {
  className?: string;
}

function ProductSortInner({ className }: ProductSortProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get('sort') || 'featured';

  const handleSortChange = (newSort: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (newSort === 'featured') {
      params.delete('sort');
    } else {
      params.set('sort', newSort);
    }
    // Always reset to page 1 on sort change
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="text-xs font-medium text-muted-foreground whitespace-nowrap flex items-center gap-1">
        <ArrowUpDown className="size-3.5" />
        Sort by:
      </span>
      <select
        value={currentSort}
        onChange={(e) => handleSortChange(e.target.value)}
        className="h-8.5 text-xs font-medium bg-background border border-border rounded-lg px-2.5 pr-8 focus:outline-hidden focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors cursor-pointer text-foreground"
        aria-label="Sort products"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value} className="bg-popover text-popover-foreground">
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function ProductSort({ className }: ProductSortProps) {
  return (
    <Suspense
      fallback={
        <div className={cn('flex items-center gap-2', className)}>
          <span className="text-xs text-muted-foreground">Sort:</span>
          <div className="h-8.5 w-36 bg-muted/50 rounded-lg animate-pulse" />
        </div>
      }
    >
      <ProductSortInner className={className} />
    </Suspense>
  );
}
