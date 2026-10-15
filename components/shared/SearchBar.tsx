'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

function SearchBarInput({
  placeholder,
  className,
  autoFocus,
}: SearchBarProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSearch = searchParams.get('search') || '';
  const [query, setQuery] = useState(currentSearch);

  useEffect(() => {
    setQuery(currentSearch);
  }, [currentSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set('search', trimmed);
      params.set('page', '1'); // Reset to page 1 on new search
    } else {
      params.delete('search');
    }

    router.push(`/products?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery('');
    const params = new URLSearchParams(searchParams.toString());
    params.delete('search');
    params.set('page', '1');
    router.push(`/products?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSearch} className={cn('relative w-full max-w-lg', className)}>
      <div className="relative flex items-center">
        <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="pl-9 pr-14 h-9.5 text-sm bg-muted/40 focus-visible:bg-background border-border/80 transition-colors rounded-full"
        />
        {query && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute right-9 text-muted-foreground hover:text-foreground p-1 transition-colors"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          className="absolute right-1 size-7.5 p-0 rounded-full hover:bg-muted"
          aria-label="Submit search"
        >
          <Search className="size-3.5 text-foreground/80" />
        </Button>
      </div>
    </form>
  );
}

export function SearchBar({
  placeholder = 'Search electronics, brands, specs...',
  className,
  autoFocus = false,
}: SearchBarProps) {
  return (
    <Suspense
      fallback={
        <div className={cn('relative w-full max-w-lg', className)}>
          <div className="relative flex items-center">
            <Search className="absolute left-3 size-4 text-muted-foreground pointer-events-none" />
            <Input
              type="text"
              placeholder={placeholder}
              disabled
              className="pl-9 pr-14 h-9.5 text-sm bg-muted/40 border-border/80 rounded-full opacity-60"
            />
          </div>
        </div>
      }
    >
      <SearchBarInput
        placeholder={placeholder}
        className={className}
        autoFocus={autoFocus}
      />
    </Suspense>
  );
}
