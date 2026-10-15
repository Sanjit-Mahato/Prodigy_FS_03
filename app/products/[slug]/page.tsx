import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronRight, ArrowLeft, ShieldCheck, Tag } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { Review } from '@/lib/models/Review';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { User } from '@/lib/models/User'; // Ensure User model registered for populate
import { IProduct, IReview } from '@/types';
import { ProductGallery } from '@/components/products/ProductGallery';
import { ProductDetailActions } from '@/components/products/ProductDetailActions';
import { ProductTabs } from '@/components/products/ProductTabs';
import { ProductCard } from '@/components/products/ProductCard';
import { StarRating } from '@/components/shared/StarRating';
import { Badge } from '@/components/ui/badge';
import { formatPrice } from '@/lib/utils';
import { CATEGORIES } from '@/lib/constants';

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  await connectDB();
  const product = await Product.findOne({ slug }).lean();

  if (!product) {
    return {
      title: 'Product Not Found | ElectroMart',
      description: 'The requested product could not be located in our catalog.',
    };
  }

  return {
    title: `${product.name} | ElectroMart`,
    description: product.description.slice(0, 160),
    openGraph: {
      title: `${product.name} - ${formatPrice(product.price)}`,
      description: product.description.slice(0, 160),
      images: product.images?.[0] ? [{ url: product.images[0] }] : [],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = await params;
  await connectDB();

  const rawProduct = await Product.findOne({ slug }).lean();

  if (!rawProduct) {
    notFound();
  }

  // Normalize Product to IProduct
  const product: IProduct = {
    _id: rawProduct._id.toString(),
    name: rawProduct.name,
    slug: rawProduct.slug,
    description: rawProduct.description,
    price: rawProduct.price,
    originalPrice: rawProduct.originalPrice,
    images: Array.isArray(rawProduct.images) ? rawProduct.images : [],
    category: rawProduct.category,
    brand: rawProduct.brand,
    specs:
      rawProduct.specs instanceof Map
        ? Object.fromEntries(rawProduct.specs)
        : rawProduct.specs || {},
    stock: rawProduct.stock,
    rating: rawProduct.rating,
    reviewCount: rawProduct.reviewCount,
    featured: Boolean(rawProduct.featured),
    createdAt: rawProduct.createdAt
      ? new Date(rawProduct.createdAt).toISOString()
      : new Date().toISOString(),
  };

  // Fetch Related Products from same category
  const rawRelated = await Product.find({
    category: product.category,
    _id: { $ne: rawProduct._id },
  })
    .limit(4)
    .lean();

  const relatedProducts: IProduct[] = rawRelated.map((doc: any) => ({
    _id: doc._id.toString(),
    name: doc.name,
    slug: doc.slug,
    description: doc.description,
    price: doc.price,
    originalPrice: doc.originalPrice,
    images: Array.isArray(doc.images) ? doc.images : [],
    category: doc.category,
    brand: doc.brand,
    specs: doc.specs instanceof Map ? Object.fromEntries(doc.specs) : (doc.specs || {}),
    stock: doc.stock,
    rating: doc.rating,
    reviewCount: doc.reviewCount,
    featured: Boolean(doc.featured),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
  }));

  // Fetch Customer Reviews
  const rawReviews = await Review.find({ productId: rawProduct._id })
    .populate('userId', 'name avatar')
    .sort({ createdAt: -1 })
    .lean();

  const reviews: IReview[] = rawReviews.map((r: any) => ({
    _id: r._id.toString(),
    productId: r.productId.toString(),
    userId: {
      _id: r.userId?._id?.toString() || 'anonymous',
      name: r.userId?.name || 'Verified Customer',
      avatar: r.userId?.avatar,
    },
    rating: r.rating,
    title: r.title,
    comment: r.comment,
    helpful: r.helpful || 0,
    createdAt: r.createdAt ? new Date(r.createdAt).toISOString() : new Date().toISOString(),
  }));

  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;
  const savings = hasDiscount ? product.originalPrice! - product.price : 0;

  const categoryObj = CATEGORIES.find((c) => c.id === product.category);

  return (
    <div className="min-h-screen bg-background">
      {/* Breadcrumb Navigation */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3.5">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground flex-wrap">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href="/products"
              className="hover:text-foreground transition-colors"
            >
              Products
            </Link>
            <ChevronRight className="size-3.5" />
            <Link
              href={`/products?category=${product.category}`}
              className="hover:text-foreground transition-colors"
            >
              {categoryObj ? categoryObj.label : product.category}
            </Link>
            <ChevronRight className="size-3.5" />
            <span className="text-foreground font-medium truncate max-w-xs">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-12">
        {/* Back Link */}
        <div>
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Products Catalog
          </Link>
        </div>

        {/* Product Hero Section: Gallery + Action Buy Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-start">
          {/* Left Column: Image Gallery (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <ProductGallery
              images={product.images}
              productName={product.name}
              hasDiscount={Boolean(hasDiscount)}
              discountPercent={discountPercent}
              featured={product.featured}
            />
          </div>

          {/* Right Column: Title, Rating, Price, Stock & Actions (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Brand & Category Tags */}
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="outline" className="text-xs font-semibold uppercase tracking-wider bg-primary/5 text-primary border-primary/20">
                {product.brand}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {categoryObj?.label || product.category}
              </Badge>
              {product.stock > 0 && (
                <span className="inline-flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 font-medium ml-auto">
                  <ShieldCheck className="size-3.5" />
                  Authorized Dealer Stock
                </span>
              )}
            </div>

            {/* Product Headline */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                {product.name}
              </h1>
            </div>

            {/* Ratings & Reviews summary */}
            <div className="flex items-center gap-3 pb-2 border-b border-border/60">
              <div className="flex items-center gap-1.5">
                <StarRating rating={product.rating} size="sm" />
                <span className="text-sm font-bold text-foreground">
                  {product.rating > 0 ? product.rating.toFixed(1) : '5.0'}
                </span>
              </div>
              <span className="text-muted-foreground text-xs">•</span>
              <a
                href="#reviews"
                className="text-xs text-primary hover:underline font-medium"
              >
                {product.reviewCount} customer reviews
              </a>
              <span className="text-muted-foreground text-xs">•</span>
              <span className="text-xs text-muted-foreground">
                Item #{product._id.slice(-6).toUpperCase()}
              </span>
            </div>

            {/* Pricing Details */}
            <div className="p-4 rounded-xl bg-card/60 border border-border/80 space-y-1.5 shadow-2xs">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-extrabold text-foreground tracking-tight">
                  {formatPrice(product.price)}
                </span>
                {hasDiscount && (
                  <span className="text-lg text-muted-foreground line-through font-medium">
                    {formatPrice(product.originalPrice!)}
                  </span>
                )}
                {hasDiscount && discountPercent > 0 && (
                  <Badge variant="destructive" className="text-xs font-bold px-2 py-0.5">
                    Save {discountPercent}%
                  </Badge>
                )}
              </div>
              {hasDiscount && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1">
                  <Tag className="size-3" />
                  You save {formatPrice(savings)} with ElectroMart Store Special
                </p>
              )}
            </div>

            {/* Short Snippet */}
            <p className="text-sm text-muted-foreground leading-relaxed">
              {product.description}
            </p>

            {/* Interactive Buy Box: Quantity, Add to Cart, Guarantees */}
            <ProductDetailActions product={product} />
          </div>
        </div>

        {/* Tabbed Section: Specs, Description, Reviews, Store Pickup */}
        <section id="reviews" className="pt-6 border-t border-border/80">
          <ProductTabs product={product} reviews={reviews} />
        </section>

        {/* Related Products Recommendation Carousel/Grid */}
        {relatedProducts.length > 0 && (
          <section className="pt-8 border-t border-border/80 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground tracking-tight">
                  Recommended For You
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Customers who viewed this item also considered these {categoryObj?.label || 'electronics'}
                </p>
              </div>
              <Link
                href={`/products?category=${product.category}`}
                className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
              >
                View all in {categoryObj?.label || 'Category'}
                <ChevronRight className="size-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
