// context/CartContext.tsx
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface CartItem {
    id: number;       
    name: string;    
    image: string;  
    price: number;
    requ: string;   
    quta: number;     
  }
  
interface CartContextProps {
  cart: CartItem[];
  addToCart: (newItem: CartItem) => void;
  removeFromCart: (index: number) => void;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setCart((prev) => [...prev, newItem]);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
}
