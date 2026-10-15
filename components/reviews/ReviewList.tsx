'use client';

import React, { useState } from 'react';
import { MessageSquarePlus, Filter, Star, ThumbsUp } from 'lucide-react';
import { IReview } from '@/types';
import { StarRating } from '@/components/shared/StarRating';
import { ReviewCard } from '@/components/reviews/ReviewCard';
import { ReviewForm } from '@/components/reviews/ReviewForm';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReviewListProps {
  productId: string;
  initialReviews: IReview[];
  averageRating: number;
  totalReviews: number;
}

export function ReviewList({
  productId,
  initialReviews,
  averageRating,
  totalReviews,
}: ReviewListProps) {
  const [reviews, setReviews] = useState<IReview[]>(initialReviews);
  const [isWritingReview, setIsWritingReview] = useState(false);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'newest' | 'highest' | 'lowest'>('newest');

  // Compute rating breakdown (5, 4, 3, 2, 1 stars count)
  const breakdown = [5, 4, 3, 2, 1].map((stars) => {
    const count = reviews.filter((r) => Math.round(r.rating) === stars).length;
    const percentage = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
    return { stars, count, percentage };
  });

  const handleReviewSubmitted = (newReview: IReview) => {
    setReviews((prev) => [newReview, ...prev]);
    setIsWritingReview(false);
  };

  // Filter and sort reviews
  const filteredReviews = reviews
    .filter((r) => (ratingFilter ? Math.round(r.rating) === ratingFilter : true))
    .sort((a, b) => {
      if (sortBy === 'highest') return b.rating - a.rating;
      if (sortBy === 'lowest') return a.rating - b.rating;
      // default: newest
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <div className="space-y-8">
      {/* Review Analytics & Summary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 rounded-2xl border border-border/80 bg-card/60 shadow-xs">
        {/* Score Overview */}
        <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-4 border-b md:border-b-0 md:border-r border-border/60">
          <div className="text-5xl font-extrabold text-foreground tracking-tight">
            {averageRating > 0 ? averageRating.toFixed(1) : '5.0'}
          </div>
          <div className="my-2.5">
            <StarRating rating={averageRating || 5} size="md" />
          </div>
          <p className="text-xs text-muted-foreground font-medium">
            Based on {reviews.length} verified customer reviews
          </p>

          <Button
            type="button"
            size="sm"
            onClick={() => setIsWritingReview((prev) => !prev)}
            className="mt-4 gap-2 text-xs font-semibold shadow-xs"
          >
            <MessageSquarePlus className="size-4" />
            {isWritingReview ? 'Close Review Form' : 'Write a Review'}
          </Button>
        </div>

        {/* Breakdown Progress Bars */}
        <div className="md:col-span-8 flex flex-col justify-center space-y-2">
          {breakdown.map(({ stars, count, percentage }) => (
            <button
              key={stars}
              type="button"
              onClick={() =>
                setRatingFilter((prev) => (prev === stars ? null : stars))
              }
              className={cn(
                'flex items-center gap-3 text-xs p-1.5 rounded-lg transition-colors group cursor-pointer w-full text-left',
                ratingFilter === stars
                  ? 'bg-primary/10 font-medium'
                  : 'hover:bg-muted/50'
              )}
            >
              <span className="w-12 text-muted-foreground group-hover:text-foreground font-medium shrink-0">
                {stars} Stars
              </span>
              <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%` }}
                />
              </div>
              <span className="w-10 text-right text-muted-foreground group-hover:text-foreground font-mono shrink-0">
                {percentage}%
              </span>
              <span className="text-[11px] text-muted-foreground/80 w-8 text-right shrink-0">
                ({count})
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Write Review Form Expandable Area */}
      {isWritingReview && (
        <div className="animate-in fade-in-50 duration-200">
          <ReviewForm
            productId={productId}
            onReviewSubmitted={handleReviewSubmitted}
            onCancel={() => setIsWritingReview(false)}
          />
        </div>
      )}

      {/* Filter and Sort Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5">
            <Filter className="size-3.5" />
            Filter by:
          </span>
          <div className="flex items-center gap-1.5">
            <Button
              type="button"
              variant={ratingFilter === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setRatingFilter(null)}
              className="h-7 text-xs px-2.5 rounded-md"
            >
              All
            </Button>
            {[5, 4, 3, 2, 1].map((s) => (
              <Button
                key={s}
                type="button"
                variant={ratingFilter === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setRatingFilter(s)}
                className="h-7 text-xs px-2 rounded-md gap-1"
              >
                <span>{s}</span>
                <Star className="size-3 fill-amber-400 text-amber-400" />
              </Button>
            ))}
          </div>
        </div>

        {/* Sort Select */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort-reviews"
            className="text-xs font-semibold text-muted-foreground"
          >
            Sort by:
          </label>
          <select
            id="sort-reviews"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="h-7 px-2 text-xs rounded-md border border-border bg-background text-foreground focus:outline-hidden focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="newest">Most Recent</option>
            <option value="highest">Highest Rating</option>
            <option value="lowest">Lowest Rating</option>
          </select>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="space-y-4">
        {filteredReviews.length === 0 ? (
          <div className="text-center py-12 border border-dashed border-border/80 rounded-2xl bg-muted/10 space-y-2">
            <p className="text-sm font-semibold text-foreground">
              {ratingFilter
                ? `No ${ratingFilter}-star customer reviews found.`
                : 'No reviews yet for this product.'}
            </p>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              Be the first to share your thoughts and help other shoppers make an informed decision!
            </p>
          </div>
        ) : (
          filteredReviews.map((review) => (
            <ReviewCard key={review._id} review={review} />
          ))
        )}
      </div>
    </div>
  );
}
