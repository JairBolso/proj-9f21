"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import type { CartItem } from "@/lib/types";

const STORAGE_KEY = "r3-carrinho";

interface CartContextValue {
  items: CartItem[];
  count: number;
  addItem: (item: Omit<CartItem, "qtd">, qtd?: number) => void;
  removeItem: (produtoId: string) => void;
  updateQtd: (produtoId: string, qtd: number) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // localStorage indisponível ou dado corrompido — segue com carrinho vazio
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: Omit<CartItem, "qtd">, qtd = 1) {
    setItems((prev) => {
      const existente = prev.find((i) => i.produto_id === item.produto_id);
      if (existente) {
        return prev.map((i) =>
          i.produto_id === item.produto_id ? { ...i, qtd: i.qtd + qtd } : i,
        );
      }
      return [...prev, { ...item, qtd }];
    });
  }

  function removeItem(produtoId: string) {
    setItems((prev) => prev.filter((i) => i.produto_id !== produtoId));
  }

  function updateQtd(produtoId: string, qtd: number) {
    if (qtd < 1) return removeItem(produtoId);
    setItems((prev) =>
      prev.map((i) => (i.produto_id === produtoId ? { ...i, qtd } : i)),
    );
  }

  function clear() {
    setItems([]);
  }

  const count = items.reduce((sum, i) => sum + i.qtd, 0);

  return (
    <CartContext.Provider
      value={{ items, count, addItem, removeItem, updateQtd, clear }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart precisa estar dentro de <CartProvider>");
  return ctx;
}
