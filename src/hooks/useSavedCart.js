import { useEffect, useState } from "react";

export function useSavedCart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("ayre-cart") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("ayre-cart", JSON.stringify(cart));
  }, [cart]);

  return [cart, setCart];
}
