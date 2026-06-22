import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Product } from '../api/types';

interface WishlistState {
  items: Product[];
  toggle: (product: Product) => void;
  has: (id: number) => boolean;
  remove: (id: number) => void;
  count: number;
}

const WishlistContext = createContext<WishlistState | null>(null);
const KEY = 'orbita_wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Product[]>(() => {
    try { return JSON.parse(localStorage.getItem(KEY) || '[]'); }
    catch { return []; }
  });

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(items)); }, [items]);

  const toggle = (product: Product) => {
    setItems((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  const has = (id: number) => items.some((p) => p.id === id);
  const remove = (id: number) => setItems((prev) => prev.filter((p) => p.id !== id));

  return (
    <WishlistContext.Provider value={{ items, toggle, has, remove, count: items.length }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist outside provider');
  return ctx;
}
