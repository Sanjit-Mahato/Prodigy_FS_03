'use client';

import React, { useState } from 'react';
import { ThumbsUp, ShieldCheck, User } from 'lucide-react';
import { IReview } from '@/types';
import { StarRating } from '@/components/shared/StarRating';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ReviewCardProps {
  review: IReview;
  onHelpfulClick?: (reviewId: string) => void;
}

export function ReviewCard({ review, onHelpfulClick }: ReviewCardProps) {
  const [helpfulCount, setHelpfulCount] = useState(review.helpful || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const handleHelpful = async () => {
    if (hasVoted) return;

    // Optimistic update
    setHelpfulCount((prev) => prev + 1);
    setHasVoted(true);

    try {
      await fetch('/api/reviews', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewId: review._id }),
      });
    } catch (error) {
      // Revert on error
      setHelpfulCount((prev) => prev - 1);
      setHasVoted(false);
    }

    onHelpfulClick?.(review._id);
  };

  const formattedDate = review.createdAt
    ? new Date(review.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      })
    : 'Recently';

  const authorName = review.userId?.name || 'Verified Customer';

  return (
    <div className="p-5 rounded-xl border border-border/70 bg-card/60 transition-all hover:border-border">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
        {/* User Info */}
        <div className="flex items-center gap-3">
          <div className="size-9 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-semibold text-xs shrink-0">
            {review.userId?.avatar ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={review.userId.avatar}
                alt={authorName}
                className="size-full rounded-full object-cover"
              />
            ) : (
              authorName.charAt(0).toUpperCase() || <User className="size-4" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-semibold text-sm text-foreground">
                {authorName}
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                <ShieldCheck className="size-3" />
                Verified Purchase
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{formattedDate}</span>
          </div>
        </div>

        {/* Rating Stars */}
        <StarRating rating={review.rating} size="sm" />
      </div>

      {/* Review Content */}
      <div className="space-y-1.5">
        <h4 className="font-semibold text-sm text-foreground">
          {review.title}
        </h4>
        <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
          {review.comment}
        </p>
      </div>

      {/* Helpful Action Footer */}
      <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Was this review helpful to you?
        </p>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          disabled={hasVoted}
          onClick={handleHelpful}
          className={cn(
            'h-7 px-2.5 text-xs gap-1.5 text-muted-foreground hover:text-foreground',
            hasVoted && 'text-primary bg-primary/10 hover:bg-primary/10 cursor-default'
          )}
        >
          <ThumbsUp className={cn('size-3.5', hasVoted && 'fill-primary text-primary')} />
          <span>Helpful ({helpfulCount})</span>
        </Button>
      </div>
    </div>
  );
}
