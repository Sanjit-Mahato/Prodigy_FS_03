import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { connectDB } from '@/lib/db';
import { Order } from '@/lib/models/Order';
import { Product } from '@/lib/models/Product';
import { Cart } from '@/lib/models/Cart';
import { ICartItem } from '@/types';

// Helper to generate readable e-commerce order numbers like "EM-20261015-4821"
function generateOrderNumber(): string {
  const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, '');
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `EM-${dateStr}-${randomPart}`;
}

/**
 * Validates that requested items exist with sufficient stock, and decrements inventory in MongoDB.
 *
 * Parameters:
 *  - items: array of items being purchased with productId and quantity
 * Returns:
 *  - { success: true } if all items are valid and stock was decremented
 *  - { success: false, error: string } if any item is out of stock or missing
 */
export async function validateAndDecrementStock(
  items: Array<{ productId: string; quantity: number }>
): Promise<{ success: boolean; error?: string }> {
  // TODO [USER CONTRIBUTION]:
  // Implement stock validation & decrement logic here:
  // 1. Iterate over items and verify product existence & available stock.
  // 2. If any product stock < item.quantity, return { success: false, error: `...` }.
  // 3. Atomically decrement each product's stock in MongoDB using Product.findByIdAndUpdate with $inc: { stock: -quantity }.

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      return { success: false, error: `Product not found for ID: ${item.productId}` };
    }
    if (product.stock < item.quantity) {
      return {
        success: false,
        error: `Insufficient stock for "${product.name}". Only ${product.stock} available.`,
      };
    }
  }

  // Decrement stock for all items
  for (const item of items) {
    await Product.findByIdAndUpdate(item.productId, {
      $inc: { stock: -item.quantity },
    });
  }

  return { success: true };
}

// GET: Fetch all orders for the authenticated user
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    await connectDB();

    const orders = await Order.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}

// POST: Place a new order
export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Please sign in or create an account to complete checkout' },
        { status: 401 }
      );
    }

    const body = await req.json();
    const {
      items,
      shippingAddress,
      paymentMethod = 'Credit Card',
      deliveryMethod = 'delivery',
      notes = '',
    } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.name || !shippingAddress.street) {
      return NextResponse.json(
        { error: 'Incomplete shipping or pickup details' },
        { status: 400 }
      );
    }

    await connectDB();

    // 1. Verify stock availability and decrement inventory
    const stockCheck = await validateAndDecrementStock(items);
    if (!stockCheck.success) {
      return NextResponse.json({ error: stockCheck.error }, { status: 400 });
    }

    // 2. Calculate subtotal, tax (18% GST), shipping (₹99 under ₹999, ₹0 over ₹999 or pickup)
    const subtotal = Math.round(
      items.reduce((acc: number, item: ICartItem) => acc + item.price * item.quantity, 0) * 100
    ) / 100;
    const tax = Math.round(subtotal * 0.18 * 100) / 100;
    const shipping = deliveryMethod === 'pickup' || subtotal >= 999 ? 0 : 99;
    const total = Math.round((subtotal + tax + shipping) * 100) / 100;

    // 3. Create initial tracking update
    const initialNote =
      deliveryMethod === 'pickup'
        ? 'Order placed. Sent to Nehru Place Flagship Store (Plot 18, Commercial Complex) for preparation. Ready in ~2 hours.'
        : 'Order confirmed and registered for courier dispatch from ElectroMart distribution hub.';

    const orderNumber = generateOrderNumber();

    const newOrder = await Order.create({
      userId: session.user.id,
      orderNumber,
      items: items.map((item: ICartItem) => ({
        productId: item.productId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
      })),
      subtotal,
      tax,
      shipping,
      total,
      shippingAddress: {
        name: shippingAddress.name,
        street: shippingAddress.street,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        phone: shippingAddress.phone,
      },
      status: 'pending',
      trackingUpdates: [
        {
          status: 'Order Placed',
          timestamp: new Date(),
          note: initialNote,
        },
      ],
      paymentMethod,
    });

    // 4. Empty the user's persistent cart upon successful order creation
    await Cart.findOneAndUpdate({ userId: session.user.id }, { items: [] });

    return NextResponse.json({
      success: true,
      orderId: newOrder._id.toString(),
      orderNumber: newOrder.orderNumber,
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 });
  }
}
