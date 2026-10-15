# ElectroMart — Local Electronics E-Commerce Platform

**Date:** 2026-10-15
**Project:** Prodigy InfoTech Full-Stack Internship Task 03 (FS-03)
**Status:** Design Approved

---

## 1. Purpose

Build a full-stack e-commerce website for a local electronics store, enabling customers to browse and purchase products online. The platform demonstrates full-stack development skills through product listings, shopping cart, order tracking, user reviews, and customer support features.

**Success criteria:**
- Fully functional product browsing with filters/sort
- Working shopping cart with add/remove/update
- User authentication (register/login)
- Order placement and status tracking
- Product reviews system
- Customer support page
- Responsive, polished UI suitable for portfolio presentation
- Deployable to Vercel

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Database | MongoDB Atlas (Mongoose ODM) |
| Auth | NextAuth.js v5 (Credentials provider) |
| Styling | Tailwind CSS v4 + shadcn/ui |
| State | React Context (cart) + Server Components (data) |
| Animations | Framer Motion (subtle transitions) |
| Deployment | Vercel |

---

## 3. Architecture

```
Browser
  ├── Server Components (product listings, order history) → Direct DB reads
  ├── Client Components (cart, filters, forms) → API Routes
  └── NextAuth session → JWT strategy

Next.js App Router
  ├── /app/(store)/        → Public store pages
  ├── /app/(auth)/         → Login/register
  ├── /app/(account)/      → Protected user pages
  ├── /app/api/            → REST endpoints
  └── /lib/                → Models, services, utilities

MongoDB Atlas
  ├── products
  ├── users
  ├── carts
  ├── orders
  └── reviews
```

**Key architectural decisions:**
- Server Components for data-fetching pages (products, orders) — fast, SEO-friendly
- Client Components for interactive UIs (cart, filters, review forms)
- API Routes for all mutations (cart operations, order placement, review submission)
- React Context for client-side cart state; MongoDB persistence for logged-in users
- Middleware for route protection (account pages require auth)

---

## 4. Data Models

### Product
```typescript
{
  name: string
  slug: string              // URL-friendly, unique
  description: string
  price: number
  originalPrice?: number    // for showing discounts
  images: string[]          // array of image URLs
  category: enum            // smartphones | laptops | audio | wearables | accessories
  brand: string
  specs: Record<string, string>  // flexible key-value for varying product types
  stock: number
  rating: number            // computed average
  reviewCount: number       // computed count
  featured: boolean
  createdAt: Date
}
```

### User
```typescript
{
  name: string
  email: string             // unique
  passwordHash: string      // bcrypt
  avatar?: string
  role: 'customer' | 'admin'
  addresses: [{
    label: string
    street: string
    city: string
    state: string
    zip: string
    phone: string
  }]
  createdAt: Date
}
```

### Cart
```typescript
{
  userId: ObjectId          // ref: User
  items: [{
    productId: ObjectId     // ref: Product
    quantity: number
  }]
  updatedAt: Date
}
```

### Order
```typescript
{
  userId: ObjectId
  orderNumber: string       // human-readable (e.g., EM-2026-0001)
  items: [{
    productId: ObjectId
    name: string            // snapshot at time of order
    price: number           // snapshot at time of order
    quantity: number
    image: string
  }]
  subtotal: number
  tax: number
  shipping: number
  total: number
  shippingAddress: {
    name: string
    street: string
    city: string
    state: string
    zip: string
    phone: string
  }
  status: 'pending' | 'processing' | 'shipped' | 'delivered'
  trackingUpdates: [{
    status: string
    timestamp: Date
    note: string
  }]
  paymentMethod: string     // simulated — "Credit Card ending in ****"
  createdAt: Date
}
```

### Review
```typescript
{
  userId: ObjectId
  productId: ObjectId
  rating: number            // 1-5
  title: string
  comment: string
  helpful: number           // upvote count
  verified: boolean         // user has ordered this product
  createdAt: Date
}
```

### SupportTicket
```typescript
{
  userId?: ObjectId         // optional — guests can submit
  name: string
  email: string
  subject: string
  message: string
  status: 'open' | 'resolved'
  createdAt: Date
}
```

---

## 5. Pages & Routes

### Public Routes
| Route | Description | Rendering |
|-------|-------------|-----------|
| `/` | Homepage — hero banner, featured products, category cards | Server |
| `/products` | Product grid with sidebar filters, sort dropdown, search, pagination | Server + Client |
| `/products/[slug]` | Product detail — image gallery, specs, add-to-cart, reviews | Server + Client |
| `/cart` | Shopping cart — item list, quantity controls, price summary | Client |
| `/checkout` | Checkout — address form, payment (simulated), place order | Client |
| `/support` | FAQ accordion + contact form | Server + Client |

### Auth Routes
| Route | Description |
|-------|-------------|
| `/auth/login` | Email/password login form |
| `/auth/register` | Registration form |

### Protected Routes (require authentication)
| Route | Description |
|-------|-------------|
| `/orders` | Order history — list of past orders with status badges |
| `/orders/[id]` | Order detail — items, shipping, tracking timeline |
| `/profile` | User profile — edit name, manage addresses |

---

## 6. API Routes

### Cart
- `GET /api/cart` — get user's cart (populated with product data)
- `POST /api/cart` — add item `{ productId, quantity }`
- `PATCH /api/cart` — update quantity `{ productId, quantity }`
- `DELETE /api/cart` — remove item `{ productId }`

### Orders
- `GET /api/orders` — list user's orders
- `GET /api/orders/[id]` — get single order
- `POST /api/orders` — place order `{ shippingAddress, paymentMethod }`

### Reviews
- `GET /api/reviews/[productId]` — get reviews for product
- `POST /api/reviews` — submit review `{ productId, rating, title, comment }`
- `PATCH /api/reviews/[id]/helpful` — increment helpful count

### Support
- `POST /api/support` — submit ticket `{ name, email, subject, message }`

### Products
- `GET /api/products/search?q=...` — search autocomplete

---

## 7. Feature Details

### 7.1 Product Catalog & Filtering
- Categories: Smartphones, Laptops, Audio, Wearables, Accessories
- Sort: Price Low→High, Price High→Low, Rating, Newest, Popular
- Filters: Category, Brand, Price range, Rating
- Debounced search on name + description
- Grid/List view toggle
- 12 products per page, URL-based pagination

### 7.2 Shopping Cart
- Guest: localStorage persistence
- Auth: MongoDB persistence
- Cart merge on login (keep higher quantities)
- Slide-out sheet + dedicated page
- Quantity controls, remove, clear cart
- Price summary (subtotal, tax, total)

### 7.3 Checkout & Orders
- Single-page checkout: address → payment (simulated) → review → place
- Order number: auto-generated EM-YYYY-NNNN format
- Redirects to order detail on success

### 7.4 Order Tracking
- Statuses: Pending → Processing → Shipped → Delivered
- Timeline component with timestamps and notes
- Color-coded status badges

### 7.5 User Reviews
- Star rating (1-5) + title + comment
- One review per user per product
- Average rating on cards and detail page
- Sort by newest/helpful

### 7.6 Customer Support
- FAQ accordion (8-10 questions)
- Contact form → stored as SupportTicket

### 7.7 Authentication
- NextAuth.js v5, Credentials provider
- bcrypt password hashing
- JWT session strategy
- Middleware route protection

---

## 8. UI/UX Design

- **Theme:** Dark navy (#0f172a, #1e293b) + electric blue accents (#3b82f6)
- **Typography:** Inter font
- **Icons:** Lucide React
- **Components:** shadcn/ui (Button, Card, Sheet, Dialog, Accordion, Badge, Toast, Tabs)
- **Responsive:** Mobile-first, grid 1→2→3→4 columns
- **Dark mode:** System preference with toggle

---

## 9. Seed Data

`scripts/seed.ts` populates:
- 25-30 products across 5 categories
- 5 demo users
- Sample reviews, orders with tracking, support tickets

Run via: `npm run seed`

---

## 10. Project Structure

```
/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                # Homepage
│   ├── products/
│   │   ├── page.tsx            # Product listing
│   │   └── [slug]/page.tsx     # Product detail
│   ├── cart/page.tsx
│   ├── checkout/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── orders/
│   │   ├── page.tsx
│   │   └── [id]/page.tsx
│   ├── profile/page.tsx
│   ├── support/page.tsx
│   └── api/
│       ├── auth/[...nextauth]/
│       ├── cart/
│       ├── orders/
│       ├── reviews/
│       ├── products/
│       └── support/
├── components/
│   ├── ui/                     # shadcn/ui
│   ├── layout/                 # Header, Footer, MobileNav
│   ├── products/               # ProductCard, ProductGrid, Filters
│   ├── cart/                   # CartSheet, CartItem, CartSummary
│   ├── checkout/               # CheckoutForm, PaymentForm
│   ├── orders/                 # OrderCard, TrackingTimeline
│   ├── reviews/                # ReviewForm, ReviewList, StarRating
│   └── shared/                 # SearchBar, Pagination, EmptyState
├── lib/
│   ├── db.ts                   # MongoDB connection
│   ├── models/                 # Mongoose schemas
│   ├── auth.ts                 # NextAuth config
│   ├── utils.ts
│   └── constants.ts
├── context/
│   └── cart-context.tsx
├── hooks/
│   ├── use-cart.ts
│   └── use-debounce.ts
├── types/
│   └── index.ts
├── scripts/
│   └── seed.ts
└── middleware.ts
```

---

## 11. Deployment

- **Platform:** Vercel (free tier)
- **Database:** MongoDB Atlas (free M0 cluster)
- **Env vars:** `MONGODB_URI`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`
