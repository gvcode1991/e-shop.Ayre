import React, { createContext, useContext, useMemo, useState } from "react";

import { useSavedCart } from "../hooks/useSavedCart";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useSavedCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutStatus, setCheckoutStatus] = useState({ state: "idle", message: "" });

  function resetCheckoutStatus() {
    setCheckoutStatus({ state: "idle", message: "" });
  }

  function openCart() {
    setCartOpen(true);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function addToCart(productId) {
    resetCheckoutStatus();
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === productId);
      if (existing) {
        return currentCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...currentCart, { id: productId, quantity: 1, size: "", color: "" }];
    });
    setCartOpen(true);
    setCheckoutStep(1);
  }

  function clearCart() {
    setCart([]);
    resetCheckoutStatus();
    setCheckoutStep(1);
  }

  function updateQuantity(productId, change) {
    resetCheckoutStatus();
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + change } : item)).filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(productId) {
    resetCheckoutStatus();
    setCart((currentCart) => currentCart.filter((item) => item.id !== productId));
  }

  function updateCartSize(productId, size) {
    resetCheckoutStatus();
    setCart((currentCart) => currentCart.map((item) => (item.id === productId ? { ...item, size } : item)));
  }

  function updateCartColor(productId, color) {
    resetCheckoutStatus();
    setCart((currentCart) => currentCart.map((item) => (item.id === productId ? { ...item, color } : item)));
  }

  const value = useMemo(() => ({
    addToCart,
    cart,
    clearCart,
    closeCart,
    checkoutStatus,
    checkoutStep,
    isCartOpen,
    openCart,
    resetCheckoutStatus,
    removeFromCart,
    setCart,
    setCartOpen,
    setCheckoutStatus,
    setCheckoutStep,
    updateCartColor,
    updateCartSize,
    updateQuantity,
  }), [cart, checkoutStatus, checkoutStep, isCartOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCartContext() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCartContext debe usarse dentro de CartProvider");
  }
  return context;
}
