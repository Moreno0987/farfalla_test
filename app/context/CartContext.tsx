"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  customization?: {
    engrave_name?: string;
    strap_color?: string;
    gift_box?: "standard" | "premium" | "luxury";
    gift_box_price?: number;
  };
};

type CartContextType = {
  cart: CartItem[];
  isOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load data dari localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem("farfalla-cart");
      if (stored) {
        setCart(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Gagal load cart:", error);
    }
    setIsInitialized(true);
  }, []);

  // Simpan ke localStorage
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem("farfalla-cart", JSON.stringify(cart));
    }
  }, [cart, isInitialized]);

  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) =>
          item.id === product.id &&
          JSON.stringify(item.customization) === JSON.stringify(product.customization)
      );

      if (existingIndex > -1) {
        const newCart = [...prev];
        newCart[existingIndex].quantity += 1;
        return newCart;
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback((id: string, qty: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(0, qty) } : item
      ).filter(item => item.quantity > 0)
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);
  const openCart = useCallback(() => setIsOpen(true), []);
  const closeCart = useCallback(() => setIsOpen(false), []);
  const toggleCart = useCallback(() => setIsOpen((v) => !v), []);

  const getTotal = () => cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const getItemCount = () => cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        isOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        openCart,
        closeCart,
        toggleCart,
        getTotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export default CartContext;