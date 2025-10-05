import React, { createContext, useContext, useState, useEffect } from 'react';

interface CartItem {
  gameId: string;
  title: string;
  price: number;
  discount: number;
  cover: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discountAmount: number;
  total: number;
  couponCode: string | null;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (gameId: string) => void;
  updateQuantity: (gameId: string, quantity: number) => void;
  applyCoupon: (code: string) => boolean;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const COUPON_CODES: Record<string, number> = {
  'EPIC10': 0.1,
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [couponCode, setCouponCode] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const subtotal = items.reduce((sum, item) => {
    const itemPrice = item.price * (1 - item.discount);
    return sum + itemPrice * item.quantity;
  }, 0);

  const discountAmount = couponCode && COUPON_CODES[couponCode]
    ? subtotal * COUPON_CODES[couponCode]
    : 0;

  const total = subtotal - discountAmount;

  const addItem = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems((current) => {
      const existing = current.find((item) => item.gameId === newItem.gameId);
      if (existing) {
        return current.map((item) =>
          item.gameId === newItem.gameId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...newItem, quantity: 1 }];
    });
  };

  const removeItem = (gameId: string) => {
    setItems((current) => current.filter((item) => item.gameId !== gameId));
  };

  const updateQuantity = (gameId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(gameId);
      return;
    }
    setItems((current) =>
      current.map((item) =>
        item.gameId === gameId ? { ...item, quantity } : item
      )
    );
  };

  const applyCoupon = (code: string): boolean => {
    const upperCode = code.toUpperCase();
    if (COUPON_CODES[upperCode]) {
      setCouponCode(upperCode);
      return true;
    }
    return false;
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
  };

  const value = {
    items,
    itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
    subtotal,
    discountAmount,
    total,
    couponCode,
    addItem,
    removeItem,
    updateQuantity,
    applyCoupon,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
