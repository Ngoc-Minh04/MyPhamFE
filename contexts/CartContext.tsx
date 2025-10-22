import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, getCartByUser } from '../reposi/Card';

interface CartContextType {
  cartItems: CartItem[];
  refreshCart: (userId: number) => Promise<void>;
  addToCartSuccess: () => void; // Callback khi thêm sản phẩm thành công
  clearCartLocal: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  const refreshCart = async (userId: number) => {
    try {
      const result = await getCartByUser(userId);
      if (result.success) {
        setCartItems(result.data || []);
      }
    } catch (error) {
      console.error('Error refreshing cart:', error);
    }
  };

  const addToCartSuccess = () => {
    // Trigger refresh - sẽ được gọi từ component có user context
  };

  const clearCartLocal = () => {
    setCartItems([]);
  };

  const value = {
    cartItems,
    refreshCart,
    addToCartSuccess,
    clearCartLocal,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
