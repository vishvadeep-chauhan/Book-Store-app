"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  bookId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  setItems: (items: CartItem[]) => void;
  addLocal: (item: CartItem) => void;
  remove: (itemId: string) => void;
  clear: () => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      setItems: (items) => set({ items }),
      addLocal: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.bookId === item.bookId);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.bookId === item.bookId ? { ...i, quantity: i.quantity + item.quantity } : i,
              ),
            };
          }
          return { items: [...s.items, item] };
        }),
      remove: (itemId) => set((s) => ({ items: s.items.filter((i) => i.id !== itemId) })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    { name: "bookstore-cart" },
  ),
);
