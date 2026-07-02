import { useEffect, useMemo, useState } from "react";

import { fallbackProducts } from "../config/storeConfig";
import { loadProducts as loadProductsRequest } from "../services/productsApi";
import { normalizeStock } from "../utils/stock";

const productImages = Object.fromEntries(fallbackProducts.map((product) => [product.id, product.image]));

function resolveApiProduct(product) {
  const primaryImage = product.imageUrl || product.image || "";
  const resolvedPrimaryImage = primaryImage.startsWith("http") ? primaryImage : productImages[product.id] || primaryImage;
  const galleryImages = (product.images?.length ? product.images : [primaryImage]).filter(Boolean);

  return {
    ...product,
    sourceImage: primaryImage,
    imageUrl: primaryImage,
    image: resolvedPrimaryImage,
    images: galleryImages.map((image) => (image.startsWith("http") ? image : productImages[product.id] || image)),
    stock: normalizeStock(product.stock),
    colors: product.colors || [],
    active: product.active ?? true,
  };
}

export function useProducts({ category, query }) {
  const [products, setProducts] = useState(fallbackProducts);
  const [catalogStatus, setCatalogStatus] = useState({ state: "loading", message: "" });

  async function loadProducts() {
    try {
      const { response, data } = await loadProductsRequest();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos cargar el catalogo.");
      }

      setProducts(data.products.map(resolveApiProduct));
      setCatalogStatus({ state: "ready", message: "Catalogo conectado a la API." });
    } catch {
      setProducts(fallbackProducts);
      setCatalogStatus({ state: "fallback", message: "Mostrando catalogo local. Encende la API para sincronizar productos." });
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  const activeProducts = useMemo(() => products.filter((product) => product.active !== false), [products]);
  const carouselProducts = useMemo(() => activeProducts.slice(0, 8), [activeProducts]);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return activeProducts.filter((product) => {
      const tags = product.tags || [];
      const normalizedCategory = category.toLowerCase();
      const matchesCategory = category === "Todos" || product.category.toLowerCase() === normalizedCategory || tags.some((tag) => tag.toLowerCase() === normalizedCategory);
      const matchesQuery = [product.name, product.category, product.description, ...tags].join(" ").toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [activeProducts, category, query]);

  return {
    activeProducts,
    carouselProducts,
    catalogStatus,
    loadProducts,
    products,
    setProducts,
    visibleProducts,
  };
}
