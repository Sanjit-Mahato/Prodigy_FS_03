'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange?: (page: number) => void;
  createPageURL?: (page: number) => string;
  className?: string;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  createPageURL,
  className,
}: PaginationProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (totalPages <= 1) return null;

  const defaultCreatePageURL = (page: number) => {
    const params = new URLSearchParams(searchParams ? searchParams.toString() : '');
    params.set('page', page.toString());
    return `${pathname}?${params.toString()}`;
  };

  const getPageURL = createPageURL || (onPageChange ? undefined : defaultCreatePageURL);

  const renderPageItem = (page: number) => {
    const isActive = page === currentPage;
    const url = getPageURL ? getPageURL(page) : undefined;

    if (url) {
      return (
        <Button
          key={page}
          variant={isActive ? 'default' : 'outline'}
          size="sm"
          className="size-8 p-0 text-xs"
          asChild
        >
          <Link href={url}>{page}</Link>
        </Button>
      );
    }

    return (
      <Button
        key={page}
        variant={isActive ? 'default' : 'outline'}
        size="sm"
        className="size-8 p-0 text-xs"
        onClick={() => onPageChange?.(page)}
      >
        {page}
      </Button>
    );
  };

  // Generate pagination items with ellipses if many pages
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    pages.push(1);

    if (currentPage > 3) {
      pages.push('ellipsis-start');
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('ellipsis-end');
    }

    pages.push(totalPages);
    return pages;
  };

  const prevURL = getPageURL && currentPage > 1 ? getPageURL(currentPage - 1) : undefined;
  const nextURL = getPageURL && currentPage < totalPages ? getPageURL(currentPage + 1) : undefined;

  return (
    <nav className={cn('flex items-center justify-center gap-1.5 py-4', className)} aria-label="Pagination">
      {prevURL ? (
        <Button
          variant="outline"
          size="sm"
          className="size-8 p-0"
          disabled={currentPage <= 1}
          asChild={currentPage > 1}
        >
          {currentPage > 1 ? (
            <Link href={prevURL} aria-label="Previous Page">
              <ChevronLeft className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronLeft className="size-4" />
            </span>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="size-8 p-0"
          disabled={currentPage <= 1}
          onClick={() => onPageChange?.(currentPage - 1)}
          aria-label="Previous Page"
        >
          <ChevronLeft className="size-4" />
        </Button>
      )}

      {getPageNumbers().map((item, idx) => {
        if (typeof item === 'string') {
          return (
            <span key={`ellipsis-${idx}`} className="px-1 text-muted-foreground text-xs">
              ...
            </span>
          );
        }
        return renderPageItem(item);
      })}

      {nextURL ? (
        <Button
          variant="outline"
          size="sm"
          className="size-8 p-0"
          disabled={currentPage >= totalPages}
          asChild={currentPage < totalPages}
        >
          {currentPage < totalPages ? (
            <Link href={nextURL} aria-label="Next Page">
              <ChevronRight className="size-4" />
            </Link>
          ) : (
            <span>
              <ChevronRight className="size-4" />
            </span>
          )}
        </Button>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="size-8 p-0"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange?.(currentPage + 1)}
          aria-label="Next Page"
        >
          <ChevronRight className="size-4" />
        </Button>
      )}
    </nav>
  );
}
