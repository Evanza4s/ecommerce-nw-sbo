"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { cartsApi } from "@/server/modules/carts/api";
import type { Cart, CartItem } from "@/server/modules/carts/types";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "react-toastify";

interface CartContextType {
  cart: Cart | null;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  addToCart: (productVariantId: string, quantity: number) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeItem: (itemId: string) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState<Cart | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart(null);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    try {
      const res = await cartsApi.get();
      if (res.data) setCart(res.data);
    } catch (err) {
      console.error("Failed to fetch cart", err);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const addToCart = async (productVariantId: string, quantity: number) => {
    if (!isAuthenticated) {
      toast.error("Harap login terlebih dahulu untuk menambah ke keranjang");
      return;
    }
    try {
      await cartsApi.addItem({ product_variant_id: productVariantId, quantity });
      toast.success("Produk ditambahkan ke keranjang!");
      await fetchCart();
    } catch (err: any) {
      toast.error(err.message || "Gagal menambah produk ke keranjang");
      throw err;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      await cartsApi.updateItem(itemId, { quantity });
      await fetchCart();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengupdate kuantitas");
    }
  };

  const removeItem = async (itemId: string) => {
    try {
      await cartsApi.deleteItem(itemId);
      toast.success("Produk dihapus dari keranjang");
      await fetchCart();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus produk");
    }
  };

  const clearCart = async () => {
    try {
      await cartsApi.clearCart();
      toast.success("Keranjang berhasil dikosongkan");
      await fetchCart();
    } catch (err: any) {
      toast.error(err.message || "Gagal mengosongkan keranjang");
    }
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        isLoading,
        fetchCart,
        addToCart,
        updateQuantity,
        removeItem,
        clearCart,
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
