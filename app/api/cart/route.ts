import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Cart } from '@/lib/models/Cart';
import { Product } from '@/lib/models/Product';
import { ICartItem } from '@/types';

// GET: Retrieve authenticated user's cart from MongoDB with live product data
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }

    await connectDB();

    const cart = await Cart.findOne({ userId: session.user.id })
      .populate({
        path: 'items.productId',
        model: Product,
        select: 'name price images stock slug',
      })
      .lean();

    if (!cart || !cart.items || cart.items.length === 0) {
      return NextResponse.json({ items: [] });
    }

    // Transform populated cart items into clean ICartItem shape
    const formattedItems: ICartItem[] = (cart.items as any[])
      .filter((item) => item.productId && item.productId._id) // Filter out deleted products
      .map((item) => {
        const prod = item.productId;
        return {
          productId: prod._id.toString(),
          name: prod.name,
          price: prod.price,
          image: Array.isArray(prod.images) && prod.images.length > 0 ? prod.images[0] : '',
          quantity: Math.min(item.quantity, prod.stock > 0 ? prod.stock : 1),
          stock: prod.stock,
        };
      });

    return NextResponse.json({ items: formattedItems });
  } catch (error) {
    console.error('Error fetching cart:', error);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST: Save or synchronize the user's cart items
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required to save cart to database' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { items } = body as { items: ICartItem[] };

    if (!Array.isArray(items)) {
      return NextResponse.json({ error: 'Invalid items array' }, { status: 400 });
    }

    await connectDB();

    // Map items to database schema format
    const dbItems = items
      .filter((item) => item.productId && item.quantity > 0)
      .map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
      }));

    // Upsert the cart document for the current user
    const updatedCart = await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { items: dbItems },
      { new: true, upsert: true }
    );

    return NextResponse.json({ success: true, count: updatedCart.items.length });
  } catch (error) {
    console.error('Error updating cart:', error);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}

// DELETE: Empty the user's persistent cart
export async function DELETE() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    await connectDB();
    await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { items: [] }
    );

    return NextResponse.json({ success: true, message: 'Cart cleared successfully' });
  } catch (error) {
    console.error('Error clearing cart:', error);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
