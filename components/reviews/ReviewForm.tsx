'use client';

import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, Send, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { StarRating } from '@/components/shared/StarRating';
import { IReview } from '@/types';

interface ReviewFormProps {
  productId: string;
  onReviewSubmitted?: (newReview: IReview) => void;
  onCancel?: () => void;
}

export function ReviewForm({
  productId,
  onReviewSubmitted,
  onCancel,
}: ReviewFormProps) {
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      setError('Please sign in to write a verified customer review.');
      return;
    }

    if (!title.trim() || !comment.trim()) {
      setError('Please provide both a title and review feedback.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          rating,
          title: title.trim(),
          comment: comment.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to submit review');
      }

      setSuccess(true);
      if (onReviewSubmitted && data.review) {
        onReviewSubmitted(data.review);
      }
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="p-6 rounded-xl border border-dashed border-border/80 bg-muted/20 text-center space-y-3">
        <h4 className="font-semibold text-base text-foreground">
          Sign In to Share Your Experience
        </h4>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">
          We value authentic feedback from our verified customers. Please sign in to submit your rating and review.
        </p>
        <div className="pt-2 flex items-center justify-center gap-3">
          <Button asChild size="sm" className="h-9">
            <Link href="/auth/login">Sign In</Link>
          </Button>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={onCancel}
              className="h-9"
            >
              Cancel
            </Button>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="p-6 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-center space-y-2">
        <div className="size-10 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
          <CheckCircle2 className="size-5" />
        </div>
        <h4 className="font-semibold text-foreground text-base">
          Review Submitted!
        </h4>
        <p className="text-xs text-muted-foreground">
          Thank you for sharing your experience. Your feedback helps fellow electronics shoppers.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="p-5 sm:p-6 rounded-xl border border-border/80 bg-card/60 space-y-4 shadow-xs"
    >
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <h4 className="font-semibold text-base text-foreground">
          Write a Customer Review
        </h4>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-muted-foreground hover:text-foreground cursor-pointer"
          >
            Cancel
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
          <AlertCircle className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Star Selector */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">
          Overall Rating
        </label>
        <div className="flex items-center gap-2">
          <StarRating
            rating={rating}
            interactive
            onChange={setRating}
            size="lg"
          />
          <span className="text-xs font-semibold text-foreground ml-2">
            {rating === 5 && '5/5 - Outstanding!'}
            {rating === 4 && '4/5 - Very Good'}
            {rating === 3 && '3/5 - Average'}
            {rating === 2 && '2/5 - Below Average'}
            {rating === 1 && '1/5 - Poor'}
          </span>
        </div>
      </div>

      {/* Review Headline / Title */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-title"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
        >
          Review Headline
        </label>
        <Input
          id="review-title"
          placeholder="e.g. Exceptional sound clarity & battery life!"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          maxLength={100}
          required
          className="text-sm"
        />
      </div>

      {/* Comment Body */}
      <div className="space-y-1.5">
        <label
          htmlFor="review-comment"
          className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block"
        >
          Your Feedback
        </label>
        <Textarea
          id="review-comment"
          placeholder="What did you like or dislike? How does it perform in daily use?"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={4}
          required
          className="text-sm resize-none"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        {onCancel && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          size="sm"
          disabled={isSubmitting}
          className="gap-2"
        >
          <Send className="size-3.5" />
          {isSubmitting ? 'Submitting...' : 'Post Review'}
        </Button>
      </div>
    </form>
  );
}
