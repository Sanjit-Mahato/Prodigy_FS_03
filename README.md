# ElectroMart ⚡ — Local Electronics Store E-Commerce Platform

> **Prodigy InfoTech Internship — Full-Stack Web Development Task FS-03**  
> A full-stack, responsive e-commerce web application engineered for a local electronics retail store with 2-hour downtown pickup, live parcel tracking, and authenticated customer reviews.

![Next.js 16](https://img.shields.io/badge/Next.js-16.4.1-black?logo=next.js)
![React 19](https://img.shields.io/badge/React-19.2.4-blue?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb)
![NextAuth](https://img.shields.io/badge/NextAuth-v5_Beta-purple?logo=auth0)

---

## 🏬 Business Overview

**ElectroMart** is a premier local electronics retailer headquartered in Downtown Tech Plaza (124 Market St, Suite 400, San Francisco, CA). The platform bridges online convenience with same-day local store fulfillment, offering:
- **Free 2-Hour Downtown In-Store Pickup** or standard regional delivery.
- **Certified In-Store Hardware Diagnostics & Repair** booking via customer support.
- **Live Order Milestone Simulation** (Pending ➔ Processing ➔ Shipped ➔ Delivered).
- **Verified Buyer Reviews** with dynamic MongoDB average rating recalculation.

---

## ✨ Features & Capabilities

### 1. 📱 Product Catalog & Discovery
- **Comprehensive Department Filtering**: Smartphones, Laptops, Audio, Wearables, and Accessories.
- **Brand & Price Faceting**: Filter by brands (Apple, Samsung, Sony, Dell, Bose, etc.) and custom price ranges.
- **Multidimensional Sorting**: Sort by Featured, Price (Low to High), Price (High to Low), Customer Rating, and Newest Arrivals.
- **Real-Time Keyword Search**: Instant searching across product names, descriptions, and technical specifications.
- **Detailed Product Pages**: High-resolution image galleries, technical specs tables, inventory stock badges, and customer ratings.

### 2. 🛒 Dual-Mode Shopping Cart
- **Guest Shopper Support**: Immediate cart addition stored in client-side `localStorage`.
- **Seamless Database Synchronization**: When a guest signs in or registers, their local cart items automatically merge with their MongoDB server-side cart.
- **Slide-out Cart Drawer (`CartSheet`)**: Fast access from any screen with quantity steppers and subtotal calculations.
- **Dedicated Cart Page (`/cart`)**: Detailed cost breakdown with local taxes, delivery estimates, and promo discount support.

### 3. 💳 Multi-Step Checkout & Local Fulfillment
- **Local Fulfillment Selector**: Choose between standard courier delivery or Free Same-Day In-Store Pickup at 124 Market St.
- **Interactive Address Validation**: Comprehensive shipping contact information with phone confirmation.
- **Simulated Payment Gateway**: Secure test payment form accepting test credit card credentials.
- **Inventory Protection**: Dynamic stock decrementing upon order confirmation.

### 4. 📦 Order Management & Live Milestone Tracking
- **Order History Dashboard (`/orders`)**: View past orders, delivery methods, item counts, and status chips.
- **Detailed Tracking Timeline (`/orders/[id]`)**: Visual progress indicators tracking every stage:
  - `PENDING`: Order received and verified.
  - `PROCESSING`: Packed and inspected at ElectroMart downtown warehouse.
  - `SHIPPED`: Handed to local courier with out-for-delivery updates.
  - `DELIVERED`: Signed for by recipient.
- **Simulated Status Progression**: Built-in test buttons allow simulated advancement through stages for testing.

### 5. ⭐ Customer Reviews & Ratings
- **Verified Purchase Submissions**: Interactive 5-star rating and detailed written feedback.
- **MongoDB Aggregation Pipeline**: Automatically updates product average ratings and total counts in real time via `$match` and `$group` aggregations.

### 6. 🎧 Customer Support & Local Store Directory
- **Operating Hours & Store Map Anchor**: Clear store hours and local customer care telephone `(555) 234-5678`.
- **Interactive FAQ Accordion**: Immediate answers regarding local pickup policies, warranties, and repairs.
- **Support Ticket Form**: Direct customer inquiry creation stored in the MongoDB database.

### 7. 🌗 Theme Customization
- **Full Dark / Light Mode Support**: Persistent color theme with sleek, contrast-compliant dark mode styling.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | Next.js 16.4.1 (App Router, Server & Client Components, Route Handlers) |
| **Frontend UI** | React 19, Tailwind CSS v4, Lucide React Icons |
| **Database** | MongoDB with Mongoose ODM (singleton connection caching) |
| **Authentication** | NextAuth.js v5 (Credentials Provider, JWT session strategy, bcryptjs) |
| **State Management** | React Context API (`CartContext`) with `localStorage` persistence |
| **Testing & Automation** | Chrome DevTools MCP automated headless verification |

---

## 🚀 Getting Started

### Prerequisites
- **Node.js**: v18.18+ or v20+
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017`) or MongoDB Atlas URI

### 1. Clone & Install Dependencies
```bash
git clone <repository-url>
cd Prodigy_FS_03
npm install
```

### 2. Environment Configuration
Create a `.env.local` file in the project root:
```env
MONGODB_URI=mongodb://localhost:27017/electromart
NEXTAUTH_SECRET=electromart_super_secret_jwt_key_2026_prodigy
AUTH_SECRET=electromart_super_secret_jwt_key_2026_prodigy
NEXTAUTH_URL=http://localhost:4000
AUTH_URL=http://localhost:4000
```

### 3. Seed Database
Populate the database with 25+ electronics items, test accounts, reviews, and sample orders:
```bash
npm run seed
```

### 4. Run Development or Production Server
```bash
# Development server (port 4000)
npm run dev -- -p 4000

# Or build and run production server
npm run build
npm run start -- -p 4000
```

Open [http://localhost:4000](http://localhost:4000) in your browser.

---

## 👥 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Test Customer** | `alex@example.com` | `password123` |
| **Admin / Staff** | `admin@electromart.com` | `admin123` |

---

## 📁 Project Architecture

```
Prodigy_FS_03/
├── app/
│   ├── api/
│   │   ├── auth/           # NextAuth route handlers & user registration
│   │   ├── cart/           # Server-side cart sync (GET, POST, PATCH, DELETE)
│   │   ├── orders/         # Order creation, listing & status simulation
│   │   ├── products/       # Product catalog retrieval with filtering & search
│   │   ├── reviews/        # Review creation & dynamic rating aggregation
│   │   └── support/        # Customer support ticket handling
│   ├── auth/               # Login & Register views
│   ├── cart/               # Full shopping cart breakdown page
│   ├── checkout/           # Multi-step checkout with store pickup toggle
│   ├── orders/             # Order history & live tracking timeline
│   ├── products/           # Catalog grid, filtering sidebar & product detail
│   ├── profile/            # User profile & saved addresses
│   ├── support/            # Local store directory, FAQs & ticket form
│   ├── layout.tsx          # Root layout, Header, Footer & Providers
│   └── page.tsx            # Homepage with hero, flash deals & departments
├── components/
│   ├── cart/               # CartSheet, CartItem, CartSummary
│   ├── checkout/           # AddressForm, PaymentForm, OrderReview
│   ├── layout/             # Header, Footer, MobileNav
│   ├── orders/             # OrderCard, TrackingTimeline
│   ├── products/           # ProductGrid, ProductCard, ProductFilters, ProductSort
│   ├── reviews/            # ReviewForm, ReviewList, ReviewCard
│   └── shared/             # SearchBar, StarRating, EmptyState, ThemeToggle
├── context/
│   └── cart-context.tsx    # Dual-mode cart state provider
├── lib/
│   ├── auth.ts             # NextAuth v5 credentials configuration
│   ├── db.ts               # MongoDB Mongoose cached connection singleton
│   ├── constants.ts        # Store hours, address, categories, FAQs
│   └── models/             # Mongoose schemas (User, Product, Cart, Order, Review, SupportTicket)
├── scripts/
│   └── seed.ts             # Database seed script for 25+ products and demo records
└── types/
    └── index.ts            # TypeScript interfaces for all data models
```

---

## 📄 License & Attribution

Developed by **Sanjit Kumar** for the **Prodigy InfoTech Full-Stack Web Development Internship (Task FS-03)**.  
ElectroMart is designed for educational and demonstration purposes showcasing a production-ready, full-stack Next.js and MongoDB e-commerce platform.
