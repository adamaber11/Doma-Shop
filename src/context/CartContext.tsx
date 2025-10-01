
"use client";

import React, { createContext, useState, useEffect, ReactNode } from 'react';
import type { CartItem, Product } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number, color?: string, size?: string) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

export const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const savedCart = localStorage.getItem('cartItems');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, isMounted]);

  const addToCart = (product: Product, quantity: number, selectedColor?: string, selectedSize?: string) => {
    if (!user) {
        toast({
            title: "يرجى تسجيل الدخول أولاً",
            description: "يجب عليك تسجيل الدخول لتتمكن من إضافة منتجات إلى السلة.",
            variant: "destructive"
        });
        router.push('/login');
        return;
    }

    const hasVariants = product.variants && product.variants.length > 0;
    const hasSizes = product.sizes && product.sizes.length > 0;

    if (hasVariants && !selectedColor) {
        toast({
            title: "خطأ",
            description: "الرجاء تحديد لون للمنتج.",
            variant: "destructive"
        });
        return;
    }
     if (hasSizes && !selectedSize) {
        toast({
            title: "خطأ",
            description: "الرجاء تحديد مقاس للمنتج.",
            variant: "destructive"
        });
        return;
    }
    
    const cartItemId = `${product.id}${selectedColor ? `-${selectedColor.replace('#', '')}` : ''}${selectedSize ? `-${selectedSize}`: ''}`;
    
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === cartItemId);

      if (existingItem) {
        const newQuantity = existingItem.quantity + quantity;
        if(newQuantity > product.stock) {
            toast({
                title: "الكمية غير متوفرة",
                description: `الكمية المتاحة في المخزون هي ${product.stock} فقط.`,
                variant: "destructive"
            });
            return prevItems;
        }
        return prevItems.map(item =>
          item.id === cartItemId
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      if(quantity > product.stock) {
        toast({
            title: "الكمية غير متوفرة",
            description: `الكمية المتاحة في المخزون هي ${product.stock} فقط.`,
            variant: "destructive"
        });
        return prevItems;
      }
      const newItem: CartItem = { 
        id: cartItemId, 
        product, 
        quantity,
        selectedColor,
        selectedSize
      };
      toast({
        title: "أضيف إلى السلة",
        description: `${product.name} تمت إضافته إلى سلة التسوق الخاصة بك.`,
      });
      return [...prevItems, newItem];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== cartItemId));
    toast({
      title: "تمت إزالة العنصر",
      description: "تمت إزالة العنصر من سلة التسوق الخاصة بك.",
    });
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    const itemToUpdate = cartItems.find(item => item.id === cartItemId);
    if (!itemToUpdate) return;

    if (quantity > itemToUpdate.product.stock) {
        toast({
            title: "الكمية غير متوفرة",
            description: `الكمية القصوى المتاحة هي ${itemToUpdate.product.stock}.`,
            variant: "destructive"
        });
        quantity = itemToUpdate.product.stock;
    }

    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === cartItemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.product.salePrice ?? item.product.price;
    return total + price * item.quantity;
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
