import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { X, SlidersHorizontal, Sparkles } from 'lucide-react';
import { connectDB } from '@/lib/db';
import { Product } from '@/lib/models/Product';
import { IProduct } from '@/types';
import { ProductFilters } from '@/components/products/ProductFilters';
import { ProductGrid } from '@/components/products/ProductGrid';
import { Pagination } from '@/components/shared/Pagination';
import { Badge } from '@/components/ui/badge';
import { CATEGORIES } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'All Products | ElectroMart',
  description: 'Browse our full catalog of cutting-edge electronics, gadgets, laptops, smartphones, and accessories.',
};

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawParams = await searchParams;

  const search = typeof rawParams.search === 'string' ? rawParams.search.trim() : '';
  const category = typeof rawParams.category === 'string' ? rawParams.category.trim() : '';
  const brand = typeof rawParams.brand === 'string' ? rawParams.brand.trim() : '';
  const minPrice = typeof rawParams.minPrice === 'string' ? rawParams.minPrice.trim() : '';
  const maxPrice = typeof rawParams.maxPrice === 'string' ? rawParams.maxPrice.trim() : '';
  const rating = typeof rawParams.rating === 'string' ? rawParams.rating.trim() : '';
  const inStock = rawParams.inStock === 'true';
  const sort = typeof rawParams.sort === 'string' ? rawParams.sort : 'featured';
  const currentPage = Math.max(1, Number(rawParams.page) || 1);
  const itemsPerPage = 12;

  let products: IProduct[] = [];
  let totalCount = 0;
  let totalPages = 1;

  try {
    await connectDB();

    // Construct MongoDB query filter
    const query: Record<string, any> = {};

    if (search) {
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(escapedSearch, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex },
        { brand: searchRegex },
      ];
    }

    if (category) {
      query.category = category;
    }

    if (brand) {
      const brandsList = brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brandsList.length === 1) {
        query.brand = brandsList[0];
      } else if (brandsList.length > 1) {
        query.brand = { $in: brandsList };
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice && !isNaN(Number(minPrice))) {
        query.price.$gte = Number(minPrice);
      }
      if (maxPrice && !isNaN(Number(maxPrice))) {
        query.price.$lte = Number(maxPrice);
      }
    }

    if (rating && !isNaN(Number(rating))) {
      query.rating = { $gte: Number(rating) };
    }

    if (inStock) {
      query.stock = { $gt: 0 };
    }

    // Determine Sort Order
    let sortOptions: Record<string, 1 | -1> = { featured: -1, rating: -1, createdAt: -1 };
    switch (sort) {
      case 'price-asc':
        sortOptions = { price: 1 };
        break;
      case 'price-desc':
        sortOptions = { price: -1 };
        break;
      case 'rating':
        sortOptions = { rating: -1, reviewCount: -1 };
        break;
      case 'newest':
        sortOptions = { createdAt: -1 };
        break;
      case 'featured':
      default:
        sortOptions = { featured: -1, rating: -1, createdAt: -1 };
        break;
    }

    totalCount = await Product.countDocuments(query);
    totalPages = Math.ceil(totalCount / itemsPerPage) || 1;

    const rawProducts = await Product.find(query)
      .sort(sortOptions)
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage)
      .lean();

    products = rawProducts.map((doc: any) => ({
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
  } catch (error) {
    console.error('Error fetching products:', error);
  }

  // Helper function to build pagination URL while preserving active filters
  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (category) params.set('category', category);
    if (brand) params.set('brand', brand);
    if (minPrice) params.set('minPrice', minPrice);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (rating) params.set('rating', rating);
    if (inStock) params.set('inStock', 'true');
    if (sort && sort !== 'featured') params.set('sort', sort);
    params.set('page', pageNumber.toString());
    return `/products?${params.toString()}`;
  };

  // Helper to remove a specific filter chip
  const getFilterRemoveUrl = (keyToRemove: string, brandValue?: string) => {
    const params = new URLSearchParams();
    if (search && keyToRemove !== 'search') params.set('search', search);
    if (category && keyToRemove !== 'category') params.set('category', category);

    if (brand && keyToRemove !== 'brand') {
      params.set('brand', brand);
    } else if (brand && keyToRemove === 'brand-item' && brandValue) {
      const remaining = brand
        .split(',')
        .filter((b) => b.trim() !== brandValue)
        .join(',');
      if (remaining) params.set('brand', remaining);
    }

    if (minPrice && keyToRemove !== 'price') params.set('minPrice', minPrice);
    if (maxPrice && keyToRemove !== 'price') params.set('maxPrice', maxPrice);
    if (rating && keyToRemove !== 'rating') params.set('rating', rating);
    if (inStock && keyToRemove !== 'inStock') params.set('inStock', 'true');
    if (sort && sort !== 'featured') params.set('sort', sort);
    params.set('page', '1');
    return `/products?${params.toString()}`;
  };

  const activeCategory = CATEGORIES.find((c) => c.id === category);
  const activeBrands = brand ? brand.split(',').filter(Boolean) : [];
  const hasActiveFilters = Boolean(
    search || category || brand || minPrice || maxPrice || rating || inStock
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header / Breadcrumb Header */}
      <div className="border-b border-border/80 bg-muted/20">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span>/</span>
            <span className="text-foreground font-medium">Products</span>
            {activeCategory && (
              <>
                <span>/</span>
                <span className="text-primary font-medium">{activeCategory.label}</span>
              </>
            )}
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {activeCategory ? activeCategory.label : search ? `Search results for "${search}"` : 'All Products'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                {activeCategory
                  ? activeCategory.description
                  : 'Explore top-tier electronics from leading brands with 2-hour local pickup & certified guarantee.'}
              </p>
            </div>

            {totalCount > 0 && (
              <Badge variant="outline" className="w-fit text-xs font-medium py-1 px-3 border-primary/20 bg-primary/5 text-primary">
                <Sparkles className="size-3 mr-1.5" />
                {totalCount} Items Available
              </Badge>
            )}
          </div>

          {/* Active Filter Chips */}
          {hasActiveFilters && (
            <div className="flex flex-wrap items-center gap-2 mt-5 pt-4 border-t border-border/60">
              <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1">
                <SlidersHorizontal className="size-3" />
                Active filters:
              </span>

              {search && (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5 pl-2 pr-1">
                  Query: {search}
                  <Link href={getFilterRemoveUrl('search')} className="hover:text-destructive">
                    <X className="size-3" />
                  </Link>
                </Badge>
              )}

              {activeCategory && (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5 pl-2 pr-1">
                  {activeCategory.label}
                  <Link href={getFilterRemoveUrl('category')} className="hover:text-destructive">
                    <X className="size-3" />
                  </Link>
                </Badge>
              )}

              {activeBrands.map((b) => (
                <Badge key={b} variant="secondary" className="gap-1 text-xs py-0.5 pl-2 pr-1">
                  {b}
                  <Link href={getFilterRemoveUrl('brand-item', b)} className="hover:text-destructive">
                    <X className="size-3" />
                  </Link>
                </Badge>
              ))}

              {(minPrice || maxPrice) && (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5 pl-2 pr-1">
                  Price: ${minPrice || '0'} - ${maxPrice || '∞'}
                  <Link href={getFilterRemoveUrl('price')} className="hover:text-destructive">
                    <X className="size-3" />
                  </Link>
                </Badge>
              )}

              {rating && (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5 pl-2 pr-1">
                  {rating}★ & above
                  <Link href={getFilterRemoveUrl('rating')} className="hover:text-destructive">
                    <X className="size-3" />
                  </Link>
                </Badge>
              )}

              {inStock && (
                <Badge variant="secondary" className="gap-1 text-xs py-0.5 pl-2 pr-1">
                  In Stock Only
                  <Link href={getFilterRemoveUrl('inStock')} className="hover:text-destructive">
                    <X className="size-3" />
                  </Link>
                </Badge>
              )}

              <Link
                href="/products"
                className="text-xs text-primary hover:underline font-medium ml-1"
              >
                Clear all
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Main Content Layout */}
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-start gap-8">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden lg:block w-64 shrink-0 sticky top-24">
            <ProductFilters />
          </aside>

          {/* Product Grid & Pagination */}
          <main className="flex-1 min-w-0">
            <ProductGrid products={products} totalProducts={totalCount} />

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-10 border-t border-border/80 pt-6">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
