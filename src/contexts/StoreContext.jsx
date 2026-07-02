import React, { createContext, useContext, useMemo } from "react";

import { images } from "../config/images";
import * as navigation from "../config/navigation";
import * as storeConfig from "../config/storeConfig";
import { themeConfig } from "../config/themeConfig";

const StoreContext = createContext(null);

export function StoreProvider({ children }) {
  const value = useMemo(() => ({
    images,
    navigation,
    storeConfig,
    themeConfig,
  }), []);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStoreContext() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreContext debe usarse dentro de StoreProvider");
  }
  return context;
}
