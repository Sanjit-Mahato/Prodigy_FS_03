'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Filter, X, RotateCcw, Star, ChevronDown, Check } from 'lucide-react';
import { CATEGORIES, BRANDS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface FilterProps {
  className?: string;
  isMobileSheet?: boolean;
  onCloseSheet?: () => void;
}

const PRICE_PRESETS = [
  { label: 'Under ₹5,000', min: '', max: '5000' },
  { label: '₹5,000 to ₹25,000', min: '5000', max: '25000' },
  { label: '₹25,000 to ₹1,00,000', min: '25000', max: '100000' },
  { label: 'Over ₹1,00,000', min: '100000', max: '' },
];

const RATING_OPTIONS = [
  { value: '4', label: '4★ & up' },
  { value: '3', label: '3★ & up' },
  { value: '2', label: '2★ & up' },
];

function FilterContent({ className, isMobileSheet, onCloseSheet }: FilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Current query parameters
  const currentCategory = searchParams.get('category') || '';
  const currentBrands = searchParams.get('brand')
    ? searchParams.get('brand')!.split(',').filter(Boolean)
    : [];
  const currentMinPrice = searchParams.get('minPrice') || '';
  const currentMaxPrice = searchParams.get('maxPrice') || '';
  const currentRating = searchParams.get('rating') || '';
  const currentInStock = searchParams.get('inStock') === 'true';

  // Local state for custom price inputs to avoid pushing on every keystroke
  const [minPriceInput, setMinPriceInput] = useState(currentMinPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(currentMaxPrice);

  useEffect(() => {
    setMinPriceInput(currentMinPrice);
    setMaxPriceInput(currentMaxPrice);
  }, [currentMinPrice, currentMaxPrice]);

  const updateFilters = (newParams: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString());

    Object.entries(newParams).forEach(([key, val]) => {
      if (val === null || val === '') {
        params.delete(key);
      } else {
        params.set(key, val);
      }
    });

    // Reset page to 1 when changing filters
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  const handleCategorySelect = (catId: string) => {
    const newCat = currentCategory === catId ? null : catId;
    updateFilters({ category: newCat });
    if (isMobileSheet && onCloseSheet) onCloseSheet();
  };

  const handleBrandToggle = (brand: string) => {
    let updatedBrands: string[];
    if (currentBrands.includes(brand)) {
      updatedBrands = currentBrands.filter((b) => b !== brand);
    } else {
      updatedBrands = [...currentBrands, brand];
    }
    updateFilters({
      brand: updatedBrands.length > 0 ? updatedBrands.join(',') : null,
    });
  };

  const handlePricePreset = (min: string, max: string) => {
    setMinPriceInput(min);
    setMaxPriceInput(max);
    updateFilters({
      minPrice: min || null,
      maxPrice: max || null,
    });
  };

  const handleApplyCustomPrice = (e: React.FormEvent) => {
    e.preventDefault();
    updateFilters({
      minPrice: minPriceInput || null,
      maxPrice: maxPriceInput || null,
    });
  };

  const handleRatingSelect = (rating: string) => {
    const newRating = currentRating === rating ? null : rating;
    updateFilters({ rating: newRating });
    if (isMobileSheet && onCloseSheet) onCloseSheet();
  };

  const handleInStockToggle = () => {
    updateFilters({
      inStock: currentInStock ? null : 'true',
    });
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('category');
    params.delete('brand');
    params.delete('minPrice');
    params.delete('maxPrice');
    params.delete('rating');
    params.delete('inStock');
    params.set('page', '1');
    setMinPriceInput('');
    setMaxPriceInput('');
    router.push(`/products?${params.toString()}`);
    if (isMobileSheet && onCloseSheet) onCloseSheet();
  };

  const activeFilterCount =
    (currentCategory ? 1 : 0) +
    currentBrands.length +
    (currentMinPrice || currentMaxPrice ? 1 : 0) +
    (currentRating ? 1 : 0) +
    (currentInStock ? 1 : 0);

  return (
    <div className={cn('space-y-6 text-sm', className)}>
      {/* Header with Clear Button */}
      <div className="flex items-center justify-between pb-3 border-b border-border/80">
        <div className="flex items-center gap-2">
          <Filter className="size-4 text-primary" />
          <h3 className="font-semibold text-foreground text-base">Filters</h3>
          {activeFilterCount > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAllFilters}
            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors hover:underline cursor-pointer"
          >
            <RotateCcw className="size-3" />
            Reset all
          </button>
        )}
      </div>

      {/* Category Section */}
      <div className="space-y-2.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Category
        </label>
        <div className="space-y-1">
          <button
            onClick={() => handleCategorySelect('')}
            className={cn(
              'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer',
              !currentCategory
                ? 'bg-primary/10 text-primary font-semibold'
                : 'text-foreground/80 hover:bg-muted/60'
            )}
          >
            <span>All Categories</span>
            {!currentCategory && <Check className="size-3.5 text-primary" />}
          </button>
          {CATEGORIES.map((cat) => {
            const isSelected = currentCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategorySelect(cat.id)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer',
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground/80 hover:bg-muted/60'
                )}
              >
                <span>{cat.label}</span>
                {isSelected && <Check className="size-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Brand Section */}
      <div className="space-y-2.5 pt-4 border-t border-border/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Brand
        </label>
        <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
          {BRANDS.map((brand) => {
            const isChecked = currentBrands.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center gap-2.5 px-2 py-1 rounded-md hover:bg-muted/50 cursor-pointer select-none text-xs text-foreground/80 transition-colors"
              >
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={() => handleBrandToggle(brand)}
                  className="rounded border-input text-primary focus:ring-primary/40 size-3.5 cursor-pointer accent-primary"
                />
                <span className={cn(isChecked && 'font-semibold text-foreground')}>
                  {brand}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price Range Section */}
      <div className="space-y-3 pt-4 border-t border-border/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Price Range
        </label>
        {/* Preset chips */}
        <div className="grid grid-cols-2 gap-1.5">
          {PRICE_PRESETS.map((preset) => {
            const isActive =
              currentMinPrice === preset.min && currentMaxPrice === preset.max;
            return (
              <button
                key={preset.label}
                type="button"
                onClick={() => handlePricePreset(preset.min, preset.max)}
                className={cn(
                  'text-[11px] px-2 py-1.5 rounded-md border text-center transition-colors font-medium cursor-pointer',
                  isActive
                    ? 'border-primary bg-primary/10 text-primary font-semibold'
                    : 'border-border/70 hover:border-border hover:bg-muted/50 text-foreground/80'
                )}
              >
                {preset.label}
              </button>
            );
          })}
        </div>

        {/* Custom Min/Max Inputs */}
        <form onSubmit={handleApplyCustomPrice} className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                min="0"
                placeholder="Min"
                value={minPriceInput}
                onChange={(e) => setMinPriceInput(e.target.value)}
                className="h-8 pl-6 text-xs"
              />
            </div>
            <span className="text-xs text-muted-foreground">to</span>
            <div className="relative flex-1">
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                ₹
              </span>
              <Input
                type="number"
                min="0"
                placeholder="Max"
                value={maxPriceInput}
                onChange={(e) => setMaxPriceInput(e.target.value)}
                className="h-8 pl-6 text-xs"
              />
            </div>
          </div>
          <Button type="submit" variant="secondary" size="sm" className="w-full text-xs h-7.5">
            Apply Price
          </Button>
        </form>
      </div>

      {/* Rating Section */}
      <div className="space-y-2 pt-4 border-t border-border/60">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Customer Rating
        </label>
        <div className="space-y-1">
          {RATING_OPTIONS.map((opt) => {
            const isSelected = currentRating === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => handleRatingSelect(opt.value)}
                className={cn(
                  'w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer',
                  isSelected
                    ? 'bg-primary/10 text-primary font-semibold'
                    : 'text-foreground/80 hover:bg-muted/60'
                )}
              >
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center text-amber-500">
                    {Array.from({ length: Number(opt.value) }).map((_, i) => (
                      <Star key={i} className="size-3.5 fill-current" />
                    ))}
                    {Array.from({ length: 5 - Number(opt.value) }).map((_, i) => (
                      <Star key={i} className="size-3.5 text-muted/80 stroke-muted-foreground" />
                    ))}
                  </div>
                  <span className="text-xs font-medium ml-1">{opt.label}</span>
                </div>
                {isSelected && <Check className="size-3.5 text-primary" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Stock Availability */}
      <div className="pt-4 border-t border-border/60">
        <label className="flex items-center justify-between cursor-pointer group select-none">
          <span className="text-xs font-medium text-foreground group-hover:text-primary transition-colors">
            In Stock Only
          </span>
          <input
            type="checkbox"
            checked={currentInStock}
            onChange={handleInStockToggle}
            className="rounded border-input text-primary focus:ring-primary/40 size-4 cursor-pointer accent-primary"
          />
        </label>
      </div>
    </div>
  );
}

export function ProductFilters({ className }: { className?: string }) {
  return (
    <Suspense
      fallback={
        <div className={cn('p-4 space-y-4 bg-card rounded-xl border border-border animate-pulse', className)}>
          <div className="h-5 w-24 bg-muted/60 rounded" />
          <div className="space-y-2">
            <div className="h-4 w-full bg-muted/40 rounded" />
            <div className="h-4 w-3/4 bg-muted/40 rounded" />
            <div className="h-4 w-1/2 bg-muted/40 rounded" />
          </div>
        </div>
      }
    >
      <div className={cn('p-5 bg-card rounded-xl border border-border/80 shadow-2xs', className)}>
        <FilterContent />
      </div>
    </Suspense>
  );
}

export function MobileProductFilters({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const searchParams = useSearchParams();

  const activeFilterCount =
    (searchParams.get('category') ? 1 : 0) +
    (searchParams.get('brand') ? searchParams.get('brand')!.split(',').filter(Boolean).length : 0) +
    (searchParams.get('minPrice') || searchParams.get('maxPrice') ? 1 : 0) +
    (searchParams.get('rating') ? 1 : 0) +
    (searchParams.get('inStock') === 'true' ? 1 : 0);

  return (
    <div className={className}>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 text-xs font-medium h-8.5">
            <Filter className="size-3.5" />
            <span>Filters</span>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="size-5 p-0 flex items-center justify-center text-[10px] ml-0.5">
                {activeFilterCount}
              </Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[360px] overflow-y-auto p-6">
          <SheetHeader className="mb-4 text-left">
            <SheetTitle className="text-lg font-bold">Filter Products</SheetTitle>
          </SheetHeader>
          <Suspense fallback={<div className="h-64 bg-muted/30 rounded-lg animate-pulse" />}>
            <FilterContent isMobileSheet onCloseSheet={() => setOpen(false)} />
          </Suspense>
        </SheetContent>
      </Sheet>
    </div>
  );
}
