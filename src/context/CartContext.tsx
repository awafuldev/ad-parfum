"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { CartItem, Product, ProductVariant } from "@/types";

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  addItem: (product: Product, variant: ProductVariant, quantity?: number) => boolean;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  freeShippingThreshold: number;
  freeShippingProgress: {
    percent: number;
    needed: number;
    isFree: boolean;
  };
}

const CART_STORAGE_KEY = "ad_parfum_cart_v1";
const FREE_SHIPPING_THRESHOLD = 200000; // $200,000 COP

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart from storage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to persist cart to storage", e);
      }
    }
  }, [items, isLoaded]);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  const toggleCart = () => setIsOpen((prev) => !prev);

  const addItem = (product: Product, variant: ProductVariant, quantity = 1): boolean => {
    if (!variant.is_available || variant.stock <= 0) {
      return false;
    }

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex((i) => i.variant_id === variant.id);

      if (existingIndex > -1) {
        const existing = prevItems[existingIndex];
        const newQty = Math.min(existing.quantity + quantity, variant.stock);
        const updated = [...prevItems];
        updated[existingIndex] = {
          ...existing,
          quantity: newQty,
          max_stock: variant.stock,
        };
        return updated;
      } else {
        const newItem: CartItem = {
          product_id: product.id,
          variant_id: variant.id,
          product_name: product.name,
          brand_name: product.brand_name,
          variant_name: variant.name,
          size_ml: variant.size_ml,
          unit_price: variant.price,
          quantity: Math.min(quantity, variant.stock),
          image: product.primary_image,
          max_stock: variant.stock,
        };
        return [...prevItems, newItem];
      }
    });

    setIsOpen(true);
    return true;
  };

  const removeItem = (variantId: string) => {
    setItems((prev) => prev.filter((i) => i.variant_id !== variantId));
  };

  const updateQuantity = (variantId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(variantId);
      return;
    }

    setItems((prev) =>
      prev.map((item) => {
        if (item.variant_id === variantId) {
          const clampedQty = Math.min(quantity, item.max_stock);
          return { ...item, quantity: clampedQty };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.unit_price * item.quantity, 0);

  const isFree = subtotal >= FREE_SHIPPING_THRESHOLD;
  const needed = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const percent = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        openCart,
        closeCart,
        toggleCart,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        freeShippingThreshold: FREE_SHIPPING_THRESHOLD,
        freeShippingProgress: {
          percent,
          needed,
          isFree,
        },
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
