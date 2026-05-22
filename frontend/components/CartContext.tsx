"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

export interface CartItem {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  subject: string;
}

interface CartContextValue {
  items: CartItem[];
  cartCount: number;
  totalPrice: number;
  addToCart: (item: CartItem) => void;
  removeFromCart: (itemId: string) => void;
  isInCart: (itemId: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem("edu_cart") : null;
    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch (error) {
        console.warn("Failed to parse cart content", error);
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("edu_cart", JSON.stringify(items));
    }
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems((current) => {
      if (current.some((entry) => entry.id === item.id)) return current;
      return [...current, item];
    });
  };

  const removeFromCart = (itemId: string) => {
    setItems((current) => current.filter((item) => item.id !== itemId));
  };

  const clearCart = () => setItems([]);

  const cartCount = items.length;
  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price, 0),
    [items]
  );

  const isInCart = (itemId: string) => items.some((item) => item.id === itemId);

  const value = useMemo(
    () => ({
      items,
      cartCount,
      totalPrice,
      addToCart,
      removeFromCart,
      isInCart,
      clearCart,
    }),
    [items, cartCount, totalPrice]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }
  return context;
}
