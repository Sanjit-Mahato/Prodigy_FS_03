import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import mongoose from 'mongoose';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;

    await connectDB();

    let query: Record<string, any> = { userId: session.user.id };

    // Support lookup by either MongoDB ObjectId or by readable orderNumber (e.g. EM-20261015-4821)
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query).lean();

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    return NextResponse.json({ order });
  } catch (error) {
    console.error('Error fetching order detail:', error);
    return NextResponse.json({ error: 'Failed to fetch order details' }, { status: 500 });
  }
}

// PATCH: Advance order status for testing/simulation (e.g. advance to 'processing', 'shipped', 'delivered')
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const { status, note } = body as {
      status: 'pending' | 'processing' | 'shipped' | 'delivered';
      note?: string;
    };

    if (!['pending', 'processing', 'shipped', 'delivered'].includes(status)) {
      return NextResponse.json({ error: 'Invalid order status' }, { status: 400 });
    }

    await connectDB();

    let query: Record<string, any> = { userId: session.user.id };
    if (mongoose.Types.ObjectId.isValid(id)) {
      query._id = id;
    } else {
      query.orderNumber = id;
    }

    const order = await Order.findOne(query);

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const statusNotes: Record<string, string> = {
      pending: 'Order received and awaiting processing.',
      processing: 'Order packed and inspected by quality control team at ElectroMart warehouse.',
      shipped: 'Handed over to local courier. Out for delivery with live tracking.',
      delivered: 'Package successfully delivered and signed for by recipient.',
    };

    order.status = status;
    order.trackingUpdates.push({
      status: `Status changed to ${status.toUpperCase()}`,
      timestamp: new Date(),
      note: note || statusNotes[status],
    });

    await order.save();

    return NextResponse.json({ success: true, order });
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 });
  }
}
