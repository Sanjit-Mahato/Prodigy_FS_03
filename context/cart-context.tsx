'use client';

import React, { createContext, useContext, useEffect, useState, useCallback, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { ICartItem } from '@/types';
import { toast } from '@/components/ui/toast';

interface CartContextType {
  items: ICartItem[];
  addItem: (product: Omit<ICartItem, 'quantity'>, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'electromart_cart';

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<ICartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasHydrated, setHasHydrated] = useState(false);

  // 1. Initial hydration from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to parse cart from localStorage', e);
    } finally {
      setHasHydrated(true);
      setIsLoading(false);
    }
  }, []);

  // 2. Sync to localStorage for guests or when items change
  useEffect(() => {
    if (!hasHydrated) return;
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Failed to save cart to localStorage', e);
    }
  }, [items, hasHydrated]);

  // 3. Sync with backend API when user logs in
  useEffect(() => {
    if (status !== 'authenticated' || !session?.user || !hasHydrated) return;

    let isMounted = true;
    async function syncCartWithServer() {
      try {
        // Fetch server cart
        const res = await fetch('/api/cart');
        if (!res.ok) return;
        const serverCart = await res.json();
        const serverItems: ICartItem[] = serverCart.items || [];

        setItems((currentLocalItems) => {
          // Merge local and server items
          const mergedMap = new Map<string, ICartItem>();

          for (const item of serverItems) {
            mergedMap.set(item.productId, { ...item });
          }

          for (const localItem of currentLocalItems) {
            const existing = mergedMap.get(localItem.productId);
            if (existing) {
              // Combine quantities up to available stock
              const combinedQty = Math.min(existing.quantity + localItem.quantity, localItem.stock || 99);
              mergedMap.set(localItem.productId, {
                ...existing,
                quantity: combinedQty,
              });
            } else {
              mergedMap.set(localItem.productId, { ...localItem });
            }
          }

          const mergedItems = Array.from(mergedMap.values());

          // Save merged cart back to server in background
          fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: mergedItems }),
          }).catch((err) => console.error('Failed to sync merged cart to server', err));

          return mergedItems;
        });
      } catch (err) {
        console.error('Failed to sync cart with server:', err);
      }
    }

    syncCartWithServer();

    return () => {
      isMounted = false;
    };
  }, [status, session, hasHydrated]);

  // Sync state changes to server for logged-in user
  const syncToServer = useCallback(
    async (updatedItems: ICartItem[]) => {
      if (status === 'authenticated' && session?.user) {
        try {
          await fetch('/api/cart', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: updatedItems }),
          });
        } catch (e) {
          console.error('Error updating server cart', e);
        }
      }
    },
    [status, session]
  );

  const addItem = useCallback(
    (product: Omit<ICartItem, 'quantity'>, quantity: number = 1) => {
      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === product.productId);
        let nextItems: ICartItem[];

        if (existingIndex > -1) {
          const existing = prev[existingIndex];
          const newQty = Math.min(existing.quantity + quantity, product.stock);
          nextItems = [...prev];
          nextItems[existingIndex] = {
            ...existing,
            quantity: newQty,
          };
        } else {
          nextItems = [
            ...prev,
            {
              ...product,
              quantity: Math.min(quantity, product.stock),
            },
          ];
        }

        syncToServer(nextItems);
        return nextItems;
      });

      toast({
        title: 'Added to Cart',
        description: `${product.name} (${quantity}) has been added to your cart.`,
      });
    },
    [syncToServer]
  );

  const removeItem = useCallback(
    (productId: string) => {
      setItems((prev) => {
        const itemToRemove = prev.find((i) => i.productId === productId);
        const nextItems = prev.filter((i) => i.productId !== productId);
        syncToServer(nextItems);
        if (itemToRemove) {
          toast({
            title: 'Item Removed',
            description: `${itemToRemove.name} was removed from your cart.`,
          });
        }
        return nextItems;
      });
    },
    [syncToServer]
  );

  const updateQuantity = useCallback(
    (productId: string, quantity: number) => {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      setItems((prev) => {
        const nextItems = prev.map((item) => {
          if (item.productId === productId) {
            return {
              ...item,
              quantity: Math.min(quantity, item.stock),
            };
          }
          return item;
        });
        syncToServer(nextItems);
        return nextItems;
      });
    },
    [removeItem, syncToServer]
  );

  const clearCart = useCallback(() => {
    setItems([]);
    syncToServer([]);
  }, [syncToServer]);

  // Derived calculations
  const itemCount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  // 18% GST (Goods & Services Tax) calculation for India
  const tax = useMemo(() => Math.round(subtotal * 0.18 * 100) / 100, [subtotal]);

  // Free shipping over ₹999, otherwise flat ₹99 for domestic delivery
  const shipping = useMemo(() => {
    if (subtotal === 0 || subtotal >= 999) return 0;
    return 99;
  }, [subtotal]);

  const total = useMemo(
    () => Math.round((subtotal + tax + shipping) * 100) / 100,
    [subtotal, tax, shipping]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        tax,
        shipping,
        total,
        isCartOpen,
        setIsCartOpen,
        isLoading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
