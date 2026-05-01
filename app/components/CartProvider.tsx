"use client";

import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';

export interface CartItem {
  id: string;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
}

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  deleteItem: (id: string) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = 'menu-cart';

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    void Promise.resolve().then(() => {
      const storedCart = window.localStorage.getItem(storageKey);

      if (storedCart) {
        try {
          setItems(JSON.parse(storedCart) as CartItem[]);
        } catch {
          window.localStorage.removeItem(storageKey);
        }
      }

      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    if (!isReady) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [isReady, items]);

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return {
      items,
      totalItems,
      totalPrice,
      addItem: (item) => {
        setItems((currentItems) => {
          const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

          if (existingItem) {
            return currentItems.map((cartItem) =>
              cartItem.id === item.id
                ? { ...cartItem, quantity: cartItem.quantity + 1 }
                : cartItem
            );
          }

          return [...currentItems, { ...item, quantity: 1 }];
        });
      },
      removeItem: (id) => {
        setItems((currentItems) =>
          currentItems
            .map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item)
            .filter((item) => item.quantity > 0)
        );
      },
      deleteItem: (id) => {
        setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      },
      clearCart: () => setItems([]),
    };
  }, [items]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used inside CartProvider');
  }

  return context;
}
