import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import '@/lib/models/User';
import '@/lib/models/Product';
import Review from '@/lib/models/Review';
import mongoose from 'mongoose';

// GET /api/reviews/[productId] - Fetch all reviews for a product
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid product ID format.' },
        { status: 400 }
      );
    }

    await dbConnect();

    const reviews = await Review.find({ productId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ reviews });
  } catch (error: any) {
    console.error('Fetch reviews error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews.' },
      { status: 500 }
    );
  }
}
