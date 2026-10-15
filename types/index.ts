export interface IProduct {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'smartphones' | 'laptops' | 'audio' | 'wearables' | 'accessories';
  brand: string;
  specs: Record<string, string>;
  stock: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: string;
}

export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'admin';
  addresses?: Array<{
    label: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  }>;
  createdAt: string;
}

export interface ICartItem {
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface ICart {
  userId?: string;
  items: ICartItem[];
}

export interface IOrder {
  _id: string;
  userId: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
  };
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  trackingUpdates: Array<{
    status: string;
    timestamp: string;
    note: string;
  }>;
  paymentMethod: string;
  createdAt: string;
}

export interface IReview {
  _id: string;
  userId: {
    _id: string;
    name: string;
    avatar?: string;
  };
  productId: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  createdAt: string;
}

export interface ISupportTicket {
  _id: string;
  userId?: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'open' | 'resolved';
  createdAt: string;
}
