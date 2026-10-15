'use client';

import React, { useState } from 'react';
import { PackageSearch } from 'lucide-react';
import { IProduct } from '@/types';
import { ProductCard } from '@/components/products/ProductCard';
import { ViewToggle } from '@/components/products/ViewToggle';
import { ProductSort } from '@/components/products/ProductSort';
import { MobileProductFilters } from '@/components/products/ProductFilters';
import { EmptyState } from '@/components/shared/EmptyState';
import { cn } from '@/lib/utils';

interface ProductGridProps {
  products: IProduct[];
  totalProducts?: number;
  className?: string;
}

export function ProductGrid({
  products,
  totalProducts = products.length,
  className,
}: ProductGridProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  return (
    <div className={cn('space-y-6', className)}>
      {/* Catalog Action Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 bg-card/60 backdrop-blur-xs rounded-xl border border-border/80">
        <div className="flex items-center gap-3">
          {/* Mobile Filter Button */}
          <div className="lg:hidden">
            <MobileProductFilters />
          </div>

          <p className="text-xs sm:text-sm text-muted-foreground font-medium">
            Showing <span className="font-semibold text-foreground">{products.length}</span>
            {totalProducts !== products.length ? (
              <> of <span className="font-semibold text-foreground">{totalProducts}</span></>
            ) : null}{' '}
            products
          </p>
        </div>

        {/* Right side: Sort + View Toggle */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          <ProductSort />
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </div>
      </div>

      {/* Product List or Empty State */}
      {products.length === 0 ? (
        <EmptyState
          icon={PackageSearch}
          title="No products matched your criteria"
          description="We couldn't find any electronics matching your current search or filter filters. Try clearing some filters or searching for something else."
          action={{
            label: 'Clear All Filters',
            href: '/products',
          }}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              viewMode="grid"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              viewMode="list"
            />
          ))}
        </div>
      )}
    </div>
  );
}
