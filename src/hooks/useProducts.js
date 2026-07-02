import { useEffect, useMemo, useState } from "react";

import { loadProducts as loadProductsRequest } from "../services/productsApi";
import { normalizeStock } from "../utils/stock";

const cloudinaryImages = {
  setBocaNino: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932145/WhatsApp_Image_2026-06-28_at_8.23.41_PM_3_i4i90z.jpg",
  conjuntoBocaAzul: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932144/WhatsApp_Image_2026-06-28_at_8.23.41_PM_2_fqbbbs.jpg",
  setRiverNino: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932143/WhatsApp_Image_2026-06-28_at_8.23.41_PM_1_ndes6x.jpg",
  conjuntoBocaBlanco: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932143/WhatsApp_Image_2026-06-28_at_8.23.40_PM_8_nyphyc.jpg",
  setRacingNino: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932142/WhatsApp_Image_2026-06-28_at_8.23.40_PM_7_n8kcwe.jpg",
  setAlNassrNino: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932142/WhatsApp_Image_2026-06-28_at_8.23.40_PM_5_kffkwg.jpg",
  camisetaArgentina10: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932080/WhatsApp_Image_2026-06-28_at_8.23.40_PM_4_qflkyu.jpg",
  camisetaArgentinaNegra: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932078/WhatsApp_Image_2026-06-28_at_8.23.40_PM_1_saxssz.jpg",
  camisetaArgentinaStock: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932080/WhatsApp_Image_2026-06-28_at_8.23.40_PM_3_qylvrs.jpg",
  camisetaPortugal7: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932079/WhatsApp_Image_2026-06-28_at_8.23.40_PM_2_wak6by.jpg",
  relojNegro: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932188/WhatsApp_Image_2026-06-29_at_7.23.07_PM_jftdrd.jpg",
  relojGold1: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932188/WhatsApp_Image_2026-06-29_at_7.23.07_PM_5_qksbfl.jpg",
  relojGold2: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932187/WhatsApp_Image_2026-06-29_at_7.23.07_PM_4_qyucfd.jpg",
  relojGold3: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932186/WhatsApp_Image_2026-06-29_at_7.23.07_PM_3_ewvg8n.jpg",
  relojSilver1: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932185/WhatsApp_Image_2026-06-29_at_7.23.07_PM_2_gqv1ep.jpg",
  relojSilver2: "https://res.cloudinary.com/dwifi7niu/image/upload/v1782932184/WhatsApp_Image_2026-06-29_at_7.23.07_PM_1_gjpudq.jpg",
};

const fallbackProducts = [
  { id: "set-boca-nino", name: "Set Boca nino", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Camiseta, short y medias para chicos.", price: 42900, image: cloudinaryImages.setBocaNino, badge: "Club" },
  { id: "conjunto-boca-azul", name: "Conjunto Boca azul", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Campera con capucha y pantalon deportivo.", price: 54900, image: cloudinaryImages.conjuntoBocaAzul, badge: "Nuevo" },
  { id: "set-river-nino", name: "Set River nino", category: "Conjuntos", tags: ["Clubes", "River"], description: "Kit completo con camiseta, short y medias.", price: 42900, image: cloudinaryImages.setRiverNino, badge: "Club" },
  { id: "conjunto-boca-blanco", name: "Conjunto Boca blanco", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Campera clara y pantalon con detalles.", price: 54900, image: cloudinaryImages.conjuntoBocaBlanco, badge: "Invierno" },
  { id: "set-racing-nino", name: "Set Racing nino", category: "Conjuntos", tags: ["Clubes", "Racing"], description: "Kit completo celeste, blanco y azul.", price: 42900, image: cloudinaryImages.setRacingNino, badge: "Club" },
  { id: "set-al-nassr-nino", name: "Set Al Nassr nino", category: "Conjuntos", tags: ["Clubes", "Al Nassr"], description: "Kit amarillo con short y medias.", price: 42900, image: cloudinaryImages.setAlNassrNino, badge: "Global" },
  { id: "camiseta-argentina-10", name: "Camiseta Argentina 10", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Modelo titular con detalles dorados.", price: 34900, image: cloudinaryImages.camisetaArgentina10, badge: "Seleccion" },
  { id: "camiseta-argentina-negra", name: "Camiseta Argentina negra", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Modelo alternativo con graficas azules.", price: 34900, image: cloudinaryImages.camisetaArgentinaNegra, badge: "Seleccion" },
  { id: "camiseta-argentina-stock", name: "Camiseta Argentina stock", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Pack disponible con etiqueta.", price: 34900, image: cloudinaryImages.camisetaArgentinaStock, badge: "Stock" },
  { id: "camiseta-portugal-7", name: "Camiseta Portugal 7", category: "Camisetas", tags: ["Selecciones", "Portugal"], description: "Modelo rojo con detalles verdes.", price: 34900, image: cloudinaryImages.camisetaPortugal7, badge: "Seleccion" },
  { id: "reloj-negro", name: "Reloj negro", category: "Accesorios", tags: ["Relojes"], description: "Reloj negro para completar tu look diario.", price: 29900, image: cloudinaryImages.relojNegro, badge: "Accesorio" },
  { id: "reloj-gold", name: "Reloj gold", category: "Accesorios", tags: ["Relojes"], description: "Reloj dorado con terminacion elegante.", price: 29900, image: cloudinaryImages.relojGold1, images: [cloudinaryImages.relojGold1, cloudinaryImages.relojGold2, cloudinaryImages.relojGold3], badge: "Accesorio" },
  { id: "reloj-silver", name: "Reloj silver", category: "Accesorios", tags: ["Relojes"], description: "Reloj plateado versatil para todos los dias.", price: 29900, image: cloudinaryImages.relojSilver1, images: [cloudinaryImages.relojSilver1, cloudinaryImages.relojSilver2], badge: "Accesorio" },
].map((product) => ({
  ...product,
  images: product.images || [product.image],
  stock: [
    { size: "8", quantity: 4 },
    { size: "10", quantity: 4 },
    { size: "12", quantity: 4 },
    { size: "S", quantity: 3 },
    { size: "M", quantity: 3 },
  ],
  colors: [],
}));

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
