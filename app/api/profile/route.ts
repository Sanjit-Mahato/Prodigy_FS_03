import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { User } from '@/lib/models/User';
import { Order } from '@/lib/models/Order';

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id && !session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    let user = null;

    // Try to find user by ID first, then by email as fallback
    if (session.user.id) {
      user = await User.findById(session.user.id).select('-passwordHash').lean();
    }
    if (!user && session.user.email) {
      user = await User.findOne({ email: session.user.email.toLowerCase() }).select('-passwordHash').lean();
    }

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = (user as any)._id.toString();

    // Also get order statistics for customer dashboard
    const orderCount = await Order.countDocuments({
      $or: [{ userId: userId }, { userId: (user as any)._id }]
    });
    const recentOrders = await Order.find({
      $or: [{ userId: userId }, { userId: (user as any)._id }]
    })
      .sort({ createdAt: -1 })
      .limit(3)
      .lean();

    return NextResponse.json({
      user: {
        id: (user as any)._id.toString(),
        name: (user as any).name,
        email: (user as any).email,
        avatar: (user as any).avatar || '',
        role: (user as any).role,
        addresses: (user as any).addresses || [],
        createdAt: (user as any).createdAt,
      },
      stats: {
        orderCount,
        recentOrders,
      },
    });
  } catch (error: any) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch profile' },
      { status: 500 }
    );
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, avatar, addresses } = body;

    await connectDB();
    const user = await User.findById(session.user.id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (name && typeof name === 'string' && name.trim().length > 0) {
      user.name = name.trim();
    }

    if (avatar !== undefined) {
      user.avatar = avatar;
    }

    if (Array.isArray(addresses)) {
      user.addresses = addresses;
    }

    await user.save();

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update profile' },
      { status: 500 }
    );
  }
}
