"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type CartItem = {
  id: string;        // product.id (uuid)
  name: string;
  price: number;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (p: { id: string; name: string; price: number }, qty?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  total: number;
  count: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const STORAGE_KEY = "cart:v1";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch (err) {
      console.warn("Failed to load cart from localStorage", err);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addToCart = (p: { id: string; name: string; price: number }, qty = 1) => {
    setItems(curr => {
      const found = curr.find(i => i.id === p.id);
      if (found) {
        return curr.map(i => (i.id === p.id ? { ...i, quantity: i.quantity + qty } : i));
      }
      return [...curr, { id: p.id, name: p.name, price: p.price, quantity: qty }];
    });
  };

  const removeFromCart = (id: string) => {
    setItems(curr => curr.filter(i => i.id !== id));
  };

  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) {
      removeFromCart(id);
      return;
    }
    setItems(curr => curr.map(i => (i.id === id ? { ...i, quantity: qty } : i)));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((s, it) => s + (it.price || 0) * it.quantity, 0);
  const count = items.reduce((s, it) => s + it.quantity, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, count }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
};
