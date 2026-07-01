import { Facebook, Heart, Instagram, PackageCheck, Search, ShoppingBag, Truck, UserRound, X } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";

import { AccountPanel } from "./components/account/AccountPanel";
import { AdminPanel } from "./components/admin/AdminPanel";
import { CartDrawer } from "./components/cart/CartDrawer";
import { Header } from "./components/layout/Header";
import { Hero } from "./components/layout/Hero";
import { ProductGrid } from "./components/products/ProductGrid";
import { images } from "./config/images";
import { appVersion, categories, freeShippingThreshold, shippingCost } from "./config/storeConfig";
import { useSavedCart } from "./hooks/useSavedCart";
import { formatter } from "./utils/formatters";
import { getProductSizes, normalizeStock, parseListText, parseStockText, stockToText, stockTotal } from "./utils/stock";

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
const logoAyre = images.logo;

function cssImageUrl(imageUrl) {
  return `url("${imageUrl}")`;
}

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
const apiUrl = import.meta.env.VITE_API_URL || "/api";
const whatsappNumber = import.meta.env.VITE_WHATSAPP_NUMBER || "5491123456789";
const emptyCheckout = {
  name: "",
  phone: "",
  email: "",
  delivery: "Retiro en tienda",
  address: "",
  payment: "Efectivo",
  notes: "",
  notifyByEmail: true,
};
const emptyProductForm = {
  id: "",
  name: "",
  category: "Camisetas",
  tags: "",
  description: "",
  price: "",
  image: "",
  images: "",
  badge: "",
  stock: "S: 0\nM: 0\nL: 0",
  colors: "",
  active: true,
};
const emptyUserForm = {
  name: "",
  email: "",
  phone: "",
  password: "",
  acceptsMarketing: true,
};
const emptyAccountLookup = {
  email: "",
  password: "",
};

export default function App() {
  const [cart, setCart] = useSavedCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [products, setProducts] = useState(fallbackProducts);
  const [catalogStatus, setCatalogStatus] = useState({ state: "loading", message: "" });
  const [checkout, setCheckout] = useState(emptyCheckout);
  const [checkoutStep, setCheckoutStep] = useState(1);
  const [checkoutStatus, setCheckoutStatus] = useState({ state: "idle", message: "" });
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [adminStatus, setAdminStatus] = useState({ state: "idle", message: "" });
  const [imageUpload, setImageUpload] = useState({ file: null, preview: "", status: "idle", message: "" });
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [accountLookup, setAccountLookup] = useState(emptyAccountLookup);
  const [userAccount, setUserAccount] = useState(null);
  const [userToken, setUserToken] = useState(() => localStorage.getItem("ayre-user-token") || "");
  const [adminLogin, setAdminLogin] = useState({ email: "", password: "" });
  const [adminToken, setAdminToken] = useState(() => sessionStorage.getItem("ayre-admin-token") || "");
  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [userStatus, setUserStatus] = useState({ state: "idle", message: "" });

  useEffect(() => {
    if (userToken) localStorage.setItem("ayre-user-token", userToken);
    else localStorage.removeItem("ayre-user-token");
  }, [userToken]);

  useEffect(() => {
    if (adminToken) sessionStorage.setItem("ayre-admin-token", adminToken);
    else sessionStorage.removeItem("ayre-admin-token");
  }, [adminToken]);

  useEffect(() => {
    const handleNavigation = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", handleNavigation);
    return () => window.removeEventListener("popstate", handleNavigation);
  }, []);

  async function loadProducts() {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos cargar el catalogo.");
      }

      const apiProducts = data.products.map((product) => {
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
      });

      setProducts(apiProducts);
      setCatalogStatus({ state: "ready", message: "Catalogo conectado a la API." });
    } catch {
      setProducts(fallbackProducts);
      setCatalogStatus({ state: "fallback", message: "Mostrando catalogo local. Encende la API para sincronizar productos." });
    }
  }

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => () => {
    if (imageUpload.preview) {
      URL.revokeObjectURL(imageUpload.preview);
    }
  }, [imageUpload.preview]);

  const cartLines = useMemo(
    () => cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity, size: item.size || "", color: item.color || "" })).filter((item) => item.id),
    [cart, products],
  );

  const activeProducts = useMemo(() => products.filter((product) => product.active !== false), [products]);
  const carouselProducts = useMemo(() => activeProducts.slice(0, 8), [activeProducts]);

  const cartQuantity = cartLines.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartLines.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentShippingCost = checkout.delivery === "Envio a domicilio" && cartSubtotal < freeShippingThreshold ? shippingCost : 0;
  const cartTotal = cartSubtotal + currentShippingCost;
  const missingSizes = cartLines.filter((item) => !item.size);
  const missingColors = cartLines.filter((item) => item.colors?.length > 0 && !item.color);

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

  const selectedProduct = useMemo(() => {
    const match = currentPath.match(/^\/producto\/([^/]+)/);
    if (!match) return null;
    return activeProducts.find((product) => product.id === decodeURIComponent(match[1])) || null;
  }, [activeProducts, currentPath]);

  const isAdminRoute = currentPath === "/admin";
  const isRegisterRoute = currentPath === "/registro";
  const isAccountRoute = currentPath === "/cuenta";

  function adminHeaders(extraHeaders = {}) {
    return adminToken ? { ...extraHeaders, Authorization: `Bearer ${adminToken}` } : extraHeaders;
  }

  function authHeaders(extraHeaders = {}) {
    return userToken ? { ...extraHeaders, Authorization: `Bearer ${userToken}` } : extraHeaders;
  }

  useEffect(() => {
    document.body.classList.toggle("has-open-layer", isCartOpen || isMenuOpen);
    return () => document.body.classList.remove("has-open-layer");
  }, [isCartOpen, isMenuOpen]);

  function addToCart(productId) {
    setCheckoutStatus({ state: "idle", message: "" });
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
    setCheckoutStatus({ state: "idle", message: "" });
    setCheckoutStep(1);
  }

  function updateCartSize(productId, size) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCart((currentCart) => currentCart.map((item) => (item.id === productId ? { ...item, size } : item)));
  }

  function updateCartColor(productId, color) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCart((currentCart) => currentCart.map((item) => (item.id === productId ? { ...item, color } : item)));
  }

  function navigateTo(path) {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function navigateToSection(path, sectionId) {
    navigateTo(path);
    window.setTimeout(() => document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" }), 100);
  }

  function searchFromMobile(value) {
    setQuery(value);
    setCategory("Todos");
  }

  function openMobileCategory(nextCategory) {
    setQuery("");
    setCategory(nextCategory);
    setMenuOpen(false);
    navigateToSection("/", "productos");
  }

  function updateUserForm(field, value) {
    setUserStatus({ state: "idle", message: "" });
    setUserForm((currentUser) => ({ ...currentUser, [field]: value }));
  }

  function updateAccountLookup(field, value) {
    setUserStatus({ state: "idle", message: "" });
    setAccountLookup((currentLookup) => ({ ...currentLookup, [field]: value }));
  }

  async function submitUser(event) {
    event.preventDefault();
    setUserStatus({ state: "loading", message: "Guardando cuenta..." });

    try {
      const response = await fetch(`${apiUrl}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userForm),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos registrar el usuario.");
      }

      setUserAccount(data.user);
      setUserToken(data.token || "");
      setAccountLookup({ email: data.user.email, password: "" });
      const emailSent = Boolean(data.email?.sent);
      setUserStatus({
        state: emailSent ? "success" : "error",
        message: emailSent
          ? "Te enviamos un email para activar tu cuenta antes de comprar."
          : data.email?.message || "Cuenta creada, pero no pudimos enviar el email de activacion. Revisa Resend en Render.",
      });
    } catch (error) {
      setUserStatus({ state: "error", message: `${error.message} Revisa que la API este corriendo.` });
    }
  }

  async function loadAccount(event) {
    event.preventDefault();
    setUserStatus({ state: "loading", message: "Iniciando sesion..." });

    try {
      const response = await fetch(`${apiUrl}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accountLookup),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos iniciar sesion.");
      }

      setUserAccount(data.user);
      setUserToken(data.token || "");
      setUserForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        password: "",
        acceptsMarketing: Boolean(data.user.acceptsMarketing),
      });
      setCheckout((currentCheckout) => ({ ...currentCheckout, email: data.user.email || currentCheckout.email }));
      setUserStatus({ state: "success", message: data.user.emailVerified ? "Sesion iniciada. Cuenta activa." : "Sesion iniciada. Cuenta pendiente de confirmacion por email." });
    } catch (error) {
      setUserStatus({ state: "error", message: error.message });
    }
  }

  async function saveAccountPreferences(acceptsMarketing) {
    if (!userAccount?.email) return;

    setUserStatus({ state: "loading", message: "Guardando preferencias..." });

    try {
      const response = await fetch(`${apiUrl}/users/${encodeURIComponent(userAccount.email)}/preferences`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ acceptsMarketing }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos guardar las preferencias.");
      }

      setUserAccount(data.user);
      setUserStatus({ state: "success", message: "Preferencias guardadas." });
    } catch (error) {
      setUserStatus({ state: "error", message: error.message });
    }
  }

  async function toggleFavorite(productId) {
    if (!userAccount?.email) {
      setUserStatus({ state: "error", message: "Registrate con tu email para guardar favoritos." });
      navigateTo("/");
      setTimeout(() => document.getElementById("cuenta")?.scrollIntoView({ behavior: "smooth" }), 100);
      return;
    }

    const isFavorite = !(userAccount.favorites || []).includes(productId);

    try {
      const response = await fetch(`${apiUrl}/users/${encodeURIComponent(userAccount.email)}/favorites/${productId}`, {
        method: "PUT",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({ isFavorite }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos actualizar favoritos.");
      }

      setUserAccount(data.user);
      setUserStatus({ state: "success", message: isFavorite ? "Producto agregado a favoritos." : "Producto quitado de favoritos." });
    } catch (error) {
      setUserStatus({ state: "error", message: error.message });
    }
  }

  function updateQuantity(productId, change) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + change } : item)).filter((item) => item.quantity > 0),
    );
  }

  function updateCheckout(field, value) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCheckout((currentCheckout) => ({ ...currentCheckout, [field]: value }));
  }

  function updateProductForm(field, value) {
    setAdminStatus({ state: "idle", message: "" });
    setProductForm((currentProduct) => ({ ...currentProduct, [field]: value }));
  }

  async function unlockAdmin(event) {
    event.preventDefault();
    setAdminStatus({ state: "loading", message: "Iniciando sesion admin..." });

    try {
      const response = await fetch(`${apiUrl}/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminLogin),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Credenciales admin incorrectas.");
      }

      setAdminToken(data.token || "");
      setAdminUnlocked(true);
      setAdminStatus({ state: "success", message: "Panel admin desbloqueado." });
    } catch (error) {
      setAdminUnlocked(false);
      setAdminStatus({ state: "error", message: error.message });
    }
  }

  function appendProductImage(url) {
    setProductForm((currentProduct) => {
      const images = currentProduct.images
        .split(/[\n,]+/)
        .map((image) => image.trim())
        .filter(Boolean);
      const nextImages = [...new Set([currentProduct.image || url, ...images, url].filter(Boolean))];

      return {
        ...currentProduct,
        image: currentProduct.image || url,
        images: nextImages.join("\n"),
      };
    });
  }

  function updateProductImageFile(file) {
    if (imageUpload.preview) {
      URL.revokeObjectURL(imageUpload.preview);
    }

    setImageUpload({
      file,
      preview: file ? URL.createObjectURL(file) : "",
      status: "idle",
      message: file ? "Imagen lista para subir." : "",
    });
  }

  async function uploadProductImage() {
    if (!adminUnlocked) {
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "error", message: "Desbloquea el panel admin antes de subir imagenes." }));
      return;
    }

    if (!imageUpload.file) {
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "error", message: "Elegi una imagen primero." }));
      return;
    }

    const formData = new FormData();
    formData.append("image", imageUpload.file);
    setImageUpload((currentUpload) => ({ ...currentUpload, status: "loading", message: "Subiendo imagen a Cloudinary..." }));

    try {
      const response = await fetch(`${apiUrl}/uploads/products`, {
        method: "POST",
        headers: adminHeaders(),
        body: formData,
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos subir la imagen.");
      }

      appendProductImage(data.image.url);
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "success", message: "Imagen subida y URL cargada." }));
    } catch (error) {
      setImageUpload((currentUpload) => ({ ...currentUpload, status: "error", message: `${error.message} Revisa Cloudinary en Render.` }));
    }
  }

  function resetProductForm() {
    setProductForm(emptyProductForm);
    setEditingProductId("");
    updateProductImageFile(null);
    setAdminStatus({ state: "idle", message: "" });
  }

  function editProduct(product) {
    setEditingProductId(product.id);
    setProductForm({
      id: product.id,
      name: product.name,
      category: product.category,
      tags: (product.tags || []).join(", "),
      description: product.description,
      price: String(product.price),
      image: product.imageUrl || product.sourceImage || product.image || "",
      images: (product.images || []).join("\n"),
      badge: product.badge || "",
      stock: stockToText(product.stock),
      colors: (product.colors || []).join(", "),
      active: product.active ?? true,
    });
    document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitProduct(event) {
    event.preventDefault();
    if (!adminUnlocked) {
      setAdminStatus({ state: "error", message: "Desbloquea el panel admin antes de guardar." });
      return;
    }

    setAdminStatus({ state: "loading", message: editingProductId ? "Actualizando producto..." : "Creando producto..." });

    const payload = {
      ...productForm,
      price: Number(productForm.price || 0),
      stock: parseStockText(productForm.stock),
      colors: parseListText(productForm.colors),
      tags: productForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      imageUrl: productForm.image,
      images: productForm.images.split(/[\n,]+/).map((image) => image.trim()).filter(Boolean),
      active: Boolean(productForm.active),
    };

    try {
      const response = await fetch(`${apiUrl}/products${editingProductId ? `/${editingProductId}` : ""}`, {
        method: editingProductId ? "PUT" : "POST",
        headers: adminHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify(payload),
      });
      const data = response.status === 204 ? {} : await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos guardar el producto.");
      }

      await loadProducts();
      setProductForm(emptyProductForm);
      setEditingProductId("");
      setAdminStatus({ state: "success", message: editingProductId ? "Producto actualizado." : "Producto creado." });
    } catch (error) {
      setAdminStatus({ state: "error", message: `${error.message} Revisa que la API este corriendo.` });
    }
  }

  async function removeProduct(productId) {
    if (!adminUnlocked) {
      setAdminStatus({ state: "error", message: "Desbloquea el panel admin antes de eliminar." });
      return;
    }

    const shouldDelete = window.confirm("Eliminar este producto del catalogo?");

    if (!shouldDelete) {
      return;
    }

    setAdminStatus({ state: "loading", message: "Eliminando producto..." });

    try {
      const response = await fetch(`${apiUrl}/products/${productId}`, { method: "DELETE", headers: adminHeaders() });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "No pudimos eliminar el producto.");
      }

      await loadProducts();
      setAdminStatus({ state: "success", message: "Producto eliminado." });
    } catch (error) {
      setAdminStatus({ state: "error", message: `${error.message} Revisa que la API este corriendo.` });
    }
  }

  async function submitOrder(event) {
    event.preventDefault();

    if (!cartLines.length) {
      setCheckoutStatus({ state: "error", message: "Agrega al menos un producto para finalizar la compra." });
      return;
    }

    if (missingSizes.length) {
      setCheckoutStatus({ state: "error", message: "Elegi el talle de cada producto antes de finalizar." });
      return;
    }

    if (missingColors.length) {
      setCheckoutStatus({ state: "error", message: "Elegi el color de cada producto antes de finalizar." });
      return;
    }

    if (checkoutStep === 1) {
      setCheckoutStatus({ state: "idle", message: "" });
      setCheckoutStep(2);
      return;
    }

    if (!checkout.name || !checkout.phone || !checkout.email) {
      setCheckoutStatus({ state: "error", message: "Completa nombre, telefono y email registrado." });
      return;
    }

    if (!userToken || !userAccount?.email || userAccount.email !== checkout.email.trim().toLowerCase()) {
      setCheckoutStatus({ state: "error", message: "Inicia sesion con el mismo email antes de finalizar la compra." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email)) {
      setCheckoutStatus({ state: "error", message: "Revisa el email para poder enviarte la confirmacion." });
      return;
    }

    if (!/^[0-9\s()+-]{8,}$/.test(checkout.phone)) {
      setCheckoutStatus({ state: "error", message: "Revisa el telefono o WhatsApp. Necesitamos al menos 8 numeros." });
      return;
    }

    if (checkoutStep === 2) {
      setCheckoutStatus({ state: "idle", message: "" });
      setCheckoutStep(3);
      return;
    }

    setCheckoutStatus({ state: "loading", message: "Estamos preparando tu pedido..." });

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: authHeaders({ "Content-Type": "application/json" }),
        body: JSON.stringify({
          customer: checkout,
          items: cartLines.map((item) => ({ id: item.id, quantity: item.quantity, size: item.size, color: item.color })),
          totals: {
            subtotal: cartSubtotal,
            shipping: currentShippingCost,
            total: cartTotal,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos crear el pedido.");
      }

      setCart([]);
      setCheckout(emptyCheckout);
      await loadProducts();
      if (data.adminWhatsAppUrl) {
        window.open(data.adminWhatsAppUrl, "_blank", "noopener,noreferrer");
      }
      setCheckoutStatus({ state: "success", message: `Pedido recibido: ${data.order.id}. Carrito vaciado y stock actualizado.` });
      if (checkout.email && userAccount?.email === checkout.email.toLowerCase()) {
        const userResponse = await fetch(`${apiUrl}/users/${encodeURIComponent(userAccount.email)}`, { headers: authHeaders() });
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setUserAccount(userData.user);
        }
      }
    } catch (error) {
      setCheckoutStatus({ state: "error", message: `${error.message} Revisa que la API este corriendo.` });
    }
  }

  function buildWhatsAppMessage() {
    const lines = cartLines.map((item) => `- ${item.name} talle ${item.size || "sin talle"}${item.color ? ` color ${item.color}` : ""} x${item.quantity}: ${formatter.format(item.price * item.quantity)}`);
    return encodeURIComponent([
      "Hola AyRe, quiero finalizar mi compra:",
      ...lines,
      `Subtotal: ${formatter.format(cartSubtotal)}`,
      `Envio: ${currentShippingCost ? formatter.format(currentShippingCost) : "Sin cargo"}`,
      `Total: ${formatter.format(cartTotal)}`,
      `Entrega: ${checkout.delivery}${checkout.address ? ` - ${checkout.address}` : ""}`,
      `Pago: ${checkout.payment}`,
      `Nombre: ${checkout.name}`,
      `Telefono: ${checkout.phone}`,
    ].join("\n"));
  }

  function closeLayers() {
    setMenuOpen(false);
    setCartOpen(false);
  }

  return (
    <>
      <Header
        cartQuantity={cartQuantity}
        logoAyre={logoAyre}
        navigateTo={navigateTo}
        navigateToSection={navigateToSection}
        query={query}
        setCartOpen={setCartOpen}
        setMenuOpen={setMenuOpen}
        setQuery={setQuery}
      />

      <main id={isAdminRoute ? "admin" : isRegisterRoute ? "registro" : isAccountRoute ? "cuenta" : "inicio"}>
        {!isAdminRoute && !isRegisterRoute && !isAccountRoute && (
          <>
        <Hero cssImageUrl={cssImageUrl} images={images} />

        <section className="shipping-band" aria-label="Beneficio de envio">
          <div>
            <span>Envios a todo el pais</span>
            <span>Medios de pago disponibles</span>
            <span>Envios a todo el pais</span>
            <span>Medios de pago disponibles</span>
          </div>
        </section>

        {selectedProduct && (
          <section className="product-detail" aria-label={`Detalle de ${selectedProduct.name}`}>
            <button className="text-link detail-back" type="button" onClick={() => navigateTo("/")}>Volver al catalogo</button>
            <div className="product-detail-layout">
              <div className="product-gallery">
                <img className="product-gallery-main" src={selectedProduct.image} alt={selectedProduct.name} />
                {selectedProduct.images?.length > 1 && (
                  <div className="product-gallery-thumbs" aria-label="Galeria de imagenes">
                    {selectedProduct.images.map((image) => (
                      <img src={image} alt="" key={`${selectedProduct.id}-${image}`} />
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="eyebrow">{selectedProduct.category}</p>
                <h2>{selectedProduct.name}</h2>
                <p>{selectedProduct.description}</p>
                <strong className="detail-price">{formatter.format(selectedProduct.price)}</strong>
                <div className="variant-summary" aria-label="Variantes disponibles">
                  <span>Stock total: {stockTotal(selectedProduct.stock)}</span>
                  <span>Talles: {getProductSizes(selectedProduct).join(", ")}</span>
                  {selectedProduct.colors?.length > 0 && <span>Colores: {selectedProduct.colors.join(", ")}</span>}
                </div>
                <div className="detail-actions">
                  <button className="primary-action" type="button" onClick={() => addToCart(selectedProduct.id)}>Agregar al carrito</button>
                  <button className="favorite-button" type="button" onClick={() => toggleFavorite(selectedProduct.id)}>
                    <Heart size={18} />
                    {(userAccount?.favorites || []).includes(selectedProduct.id) ? "Guardado" : "Favorito"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        <section className="intro-band" id="coleccion" aria-label="Valores de AyRe">
          <div><span>01</span><strong>Remeras de selecciones</strong><p>Modelos elegidos para vestir comodo, sumar identidad y armar looks casuales.</p></div>
          <div><span>02</span><strong>Conjuntos deportivos</strong><p>Prendas practicas para uso diario, entrenar o moverte con estilo.</p></div>
          <div><span>03</span><strong>Accesorios y relojes</strong><p>Detalles seleccionados para completar tu outfit y renovar tu coleccion.</p></div>
        </section>

        <section className="category-showcase" aria-label="Categorias destacadas">
          <button className="category-tile large" type="button" style={{ "--tile-image": cssImageUrl(images.categories.camisetas) }} onClick={() => openMobileCategory("Camisetas")}>
            <span>Camisetas mundialistas</span>
          </button>
          <button className="category-tile" type="button" style={{ "--tile-image": cssImageUrl(images.categories.conjuntos) }} onClick={() => openMobileCategory("Conjuntos")}>
            <span>Conjuntos deportivos</span>
          </button>
          <button className="category-tile" type="button" style={{ "--tile-image": cssImageUrl(images.categories.selecciones) }} onClick={() => openMobileCategory("Selecciones")}>
            <span>Selecciones</span>
          </button>
        </section>

        <section className="home-carousel" aria-label="Productos destacados en inicio">
          <div className="section-heading compact-heading">
            <div>
              <p className="eyebrow">Nuevos ingresos</p>
              <h2>Lo mas buscado</h2>
            </div>
            <a className="text-link" href="#productos">Ver todo</a>
          </div>

          <div className="carousel-track">
            {carouselProducts.map((product) => (
              <article className="carousel-card" key={`carousel-${product.id}`} role="button" tabIndex={0} onClick={() => navigateTo(`/producto/${product.id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigateTo(`/producto/${product.id}`); }}>
                <img src={product.image} alt={product.name} />
                <div>
                  <span>{product.category}</span>
                  <h3>{product.name}</h3>
                  <strong>{formatter.format(product.price)}</strong>
                </div>
              </article>
            ))}
          </div>
        </section>

        <ProductGrid
          addToCart={addToCart}
          catalogStatus={catalogStatus}
          category={category}
          navigateTo={navigateTo}
          setCategory={setCategory}
          setQuery={setQuery}
          toggleFavorite={toggleFavorite}
          userAccount={userAccount}
          visibleProducts={visibleProducts}
        />
          </>
        )}

        {isAdminRoute && (
          <AdminPanel
            adminLogin={adminLogin}
            adminStatus={adminStatus}
            adminUnlocked={adminUnlocked}
            editingProductId={editingProductId}
            editProduct={editProduct}
            imageUpload={imageUpload}
            productForm={productForm}
            products={products}
            removeProduct={removeProduct}
            resetProductForm={resetProductForm}
            setAdminLogin={setAdminLogin}
            setAdminToken={setAdminToken}
            setAdminUnlocked={setAdminUnlocked}
            submitProduct={submitProduct}
            unlockAdmin={unlockAdmin}
            updateProductForm={updateProductForm}
            updateProductImageFile={updateProductImageFile}
            uploadProductImage={uploadProductImage}
          />
        )}

        {(isRegisterRoute || isAccountRoute) && (
          <AccountPanel
            accountLookup={accountLookup}
            isRegisterRoute={isRegisterRoute}
            loadAccount={loadAccount}
            saveAccountPreferences={saveAccountPreferences}
            submitUser={submitUser}
            updateAccountLookup={updateAccountLookup}
            updateUserForm={updateUserForm}
            userAccount={userAccount}
            userForm={userForm}
            userStatus={userStatus}
          />
        )}

        {!isAdminRoute && !isRegisterRoute && !isAccountRoute && (
        <section className="contact-band" id="contacto">
          <div className="shipping-icon" aria-hidden="true">
            <Truck size={38} />
          </div>
          <div>
            <p className="eyebrow">Envios</p>
            <h2>Compras desde cualquier punto del pais</h2>
            <p>Preparamos tu pedido y coordinamos la entrega por WhatsApp para que recibas tus prendas y accesorios de forma simple.</p>
          </div>
          <div className="shipping-note">
            <PackageCheck size={24} />
            <span>Despacho coordinado y seguimiento del pedido.</span>
          </div>
        </section>
        )}
      </main>

      <footer className="site-footer">
        <div className="footer-links">
          <details>
            <summary>Navegacion</summary>
            <a href="#productos">Catalogo</a>
            <a href="#coleccion">Coleccion</a>
            <a href="/cuenta" onClick={(event) => { event.preventDefault(); navigateTo("/cuenta"); }}>Mi cuenta</a>
          </details>
          <details>
            <summary>Contactanos</summary>
            <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noreferrer">WhatsApp</a>
            <a href="mailto:ventas@ayre.com.ar">ventas@ayre.com.ar</a>
          </details>
        </div>

        <div className="footer-social" aria-label="Redes sociales">
          <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" aria-label="Instagram de AyRe"><Instagram size={25} /></a>
          <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" aria-label="Facebook de AyRe"><Facebook size={25} /></a>
        </div>

        <a className="footer-brand" href="#inicio" aria-label="AyRe inicio">
          <img src={logoAyre} alt="" />
          <span>AyRe</span>
        </a>

        <div className="footer-legal">
          <p>Copyright AyRe - 2026. Todos los derechos reservados.</p>
          <span className="version-mark">v{appVersion}</span>
        </div>
      </footer>

      <CartDrawer
        buildWhatsAppMessage={buildWhatsAppMessage}
        cartLines={cartLines}
        cartSubtotal={cartSubtotal}
        cartTotal={cartTotal}
        checkout={checkout}
        checkoutStatus={checkoutStatus}
        checkoutStep={checkoutStep}
        clearCart={clearCart}
        currentShippingCost={currentShippingCost}
        isCartOpen={isCartOpen}
        setCartOpen={setCartOpen}
        setCheckoutStep={setCheckoutStep}
        submitOrder={submitOrder}
        updateCartColor={updateCartColor}
        updateCartSize={updateCartSize}
        updateCheckout={updateCheckout}
        updateQuantity={updateQuantity}
        whatsappNumber={whatsappNumber}
      />

      <aside className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`} aria-label="Menu mobile" aria-hidden={!isMenuOpen}>
        <div className="mobile-menu-top">
          <button className="menu-plain-button" type="button" aria-label="Cerrar menu" onClick={() => setMenuOpen(false)}><X size={24} /></button>
          <button className="menu-bag" type="button" aria-label="Abrir carrito" onClick={() => { setMenuOpen(false); setCartOpen(true); }}>
            <ShoppingBag size={23} />
            <strong>{cartQuantity}</strong>
          </button>
        </div>

        <label className="mobile-search">
          <Search size={20} />
          <input value={query} onChange={(event) => searchFromMobile(event.target.value)} type="search" placeholder="Buscar productos" />
        </label>

        {query.trim() && (
          <div className="mobile-search-results" aria-live="polite">
            {visibleProducts.slice(0, 5).map((product) => (
              <button type="button" key={`mobile-result-${product.id}`} onClick={() => { setMenuOpen(false); navigateTo(`/producto/${product.id}`); }}>
                <img src={product.image} alt="" />
                <span>{product.name}</span>
                <strong>{formatter.format(product.price)}</strong>
              </button>
            ))}
            {!visibleProducts.length && <p>No encontramos productos.</p>}
          </div>
        )}

        <nav className="mobile-links">
          <a href="#productos" onClick={(event) => { event.preventDefault(); openMobileCategory("Todos"); }}>Indumentaria</a>
          <a href="#productos" onClick={(event) => { event.preventDefault(); openMobileCategory("Accesorios"); }}>Accesorios</a>
          <a href="/registro" onClick={(event) => { event.preventDefault(); setMenuOpen(false); navigateTo("/registro"); }}>Registro</a>
          <a href="/cuenta" onClick={(event) => { event.preventDefault(); setMenuOpen(false); navigateTo("/cuenta"); }}>Mi cuenta</a>
          </nav>

        <div className="mobile-account">
          <UserRound size={21} />
          <a href="/cuenta" onClick={(event) => { event.preventDefault(); setMenuOpen(false); navigateTo("/cuenta"); }}>Mi cuenta</a>
        </div>
      </aside>

      {(isMenuOpen || isCartOpen) && <button className="overlay" type="button" aria-label="Cerrar" onClick={closeLayers} />}
    </>
  );
}
