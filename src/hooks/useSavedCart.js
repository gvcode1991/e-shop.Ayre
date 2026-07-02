import { useEffect, useState } from "react";

import { storageKeys } from "../config/storeConfig";

export function useSavedCart() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(storageKeys.cart) || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
  }, [cart]);

  return [cart, setCart];
}
