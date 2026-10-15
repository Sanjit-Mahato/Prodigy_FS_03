import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Review from '@/lib/models/Review';
import Product from '@/lib/models/Product';
import User from '@/lib/models/User';
import mongoose from 'mongoose';

// POST /api/reviews - Create a new review
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required. Please sign in to submit a review.' },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await request.json();
    const { productId, rating, title, comment } = body;

    // Validation
    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: 'Missing required fields: productId, rating, title, and comment are required.' },
        { status: 400 }
      );
    }

    const ratingNum = Number(rating);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return NextResponse.json(
        { error: 'Rating must be a number between 1 and 5.' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format.' },
        { status: 400 }
      );
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json(
        { error: 'Product not found.' },
        { status: 404 }
      );
    }

    // Check for duplicate review (one per user per product)
    const existingReview = await Review.findOne({
      userId: session.user.id,
      productId,
    });

    if (existingReview) {
      return NextResponse.json(
        { error: 'You have already reviewed this product. Each customer may submit only one review per product.' },
        { status: 409 }
      );
    }

    // Create the review
    const review = await Review.create({
      userId: session.user.id,
      productId,
      rating: ratingNum,
      title: title.trim(),
      comment: comment.trim(),
      helpful: 0,
    });

    // Populate author details for immediate display
    await review.populate('userId', 'name avatar');

    // Recalculate product rating statistics using aggregation
    const stats = await Review.aggregate([
      { $match: { productId: new mongoose.Types.ObjectId(productId) } },
      {
        $group: {
          _id: '$productId',
          avgRating: { $avg: '$rating' },
          count: { $sum: 1 },
        },
      },
    ]);

    if (stats.length > 0) {
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(stats[0].avgRating * 10) / 10,
        reviewCount: stats[0].count,
      });
    }

    return NextResponse.json(
      {
        message: 'Review submitted successfully. Thank you for your feedback!',
        review: {
          ...review.toObject(),
          userId: review.userId,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Review creation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to submit review. Please try again.' },
      { status: 500 }
    );
  }
}

// PATCH /api/reviews - Increment helpful count for a review
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    const body = await request.json();
    const { reviewId } = body;

    if (!reviewId || !mongoose.Types.ObjectId.isValid(reviewId)) {
      return NextResponse.json(
        { error: 'Valid review ID is required.' },
        { status: 400 }
      );
    }

    const review = await Review.findByIdAndUpdate(
      reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );

    if (!review) {
      return NextResponse.json(
        { error: 'Review not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: 'Marked as helpful',
      helpful: review.helpful,
    });
  } catch (error: any) {
    console.error('Review helpful update error:', error);
    return NextResponse.json(
      { error: 'Failed to update helpful count.' },
      { status: 500 }
    );
  }
}
