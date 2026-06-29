import { Edit3, Heart, Home, Menu, Minus, Plus, Save, Search, ShoppingBag, Trash2, UserRound, X } from "lucide-react";
import React from "react";
import { useEffect, useMemo, useState } from "react";

import logoAyre from "../assets/logo-ayre.jpg";
import heroImage from "../assets/camiseta-argentina-10.jpg";
import bocaSet from "../assets/set-boca-nino.jpg";
import bocaTrack from "../assets/conjunto-boca-azul.jpg";
import riverSet from "../assets/set-river-nino.jpg";
import bocaWhite from "../assets/conjunto-boca-blanco.jpg";
import racingSet from "../assets/set-racing-nino.jpg";
import nassrSet from "../assets/set-al-nassr-nino.jpg";
import argentinaHome from "../assets/camiseta-argentina-10.jpg";
import argentinaBlack from "../assets/camiseta-argentina-negra.jpg";
import argentinaStock from "../assets/camiseta-argentina-stock.jpg";
import portugalSeven from "../assets/camiseta-portugal-7.jpg";

const fallbackProducts = [
  { id: "set-boca-nino", name: "Set Boca nino", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Camiseta, short y medias para chicos.", price: 42900, image: bocaSet, badge: "Club" },
  { id: "conjunto-boca-azul", name: "Conjunto Boca azul", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Campera con capucha y pantalon deportivo.", price: 54900, image: bocaTrack, badge: "Nuevo" },
  { id: "set-river-nino", name: "Set River nino", category: "Conjuntos", tags: ["Clubes", "River"], description: "Kit completo con camiseta, short y medias.", price: 42900, image: riverSet, badge: "Club" },
  { id: "conjunto-boca-blanco", name: "Conjunto Boca blanco", category: "Conjuntos", tags: ["Clubes", "Boca"], description: "Campera clara y pantalon con detalles.", price: 54900, image: bocaWhite, badge: "Invierno" },
  { id: "set-racing-nino", name: "Set Racing nino", category: "Conjuntos", tags: ["Clubes", "Racing"], description: "Kit completo celeste, blanco y azul.", price: 42900, image: racingSet, badge: "Club" },
  { id: "set-al-nassr-nino", name: "Set Al Nassr nino", category: "Conjuntos", tags: ["Clubes", "Al Nassr"], description: "Kit amarillo con short y medias.", price: 42900, image: nassrSet, badge: "Global" },
  { id: "camiseta-argentina-10", name: "Camiseta Argentina 10", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Modelo titular con detalles dorados.", price: 34900, image: argentinaHome, badge: "Seleccion" },
  { id: "camiseta-argentina-negra", name: "Camiseta Argentina negra", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Modelo alternativo con graficas azules.", price: 34900, image: argentinaBlack, badge: "Seleccion" },
  { id: "camiseta-argentina-stock", name: "Camiseta Argentina stock", category: "Camisetas", tags: ["Selecciones", "Argentina"], description: "Pack disponible con etiqueta.", price: 34900, image: argentinaStock, badge: "Stock" },
  { id: "camiseta-portugal-7", name: "Camiseta Portugal 7", category: "Camisetas", tags: ["Selecciones", "Portugal"], description: "Modelo rojo con detalles verdes.", price: 34900, image: portugalSeven, badge: "Seleccion" },
];

const productImages = Object.fromEntries(fallbackProducts.map((product) => [product.id, product.image]));
const categories = ["Todos", "Conjuntos", "Camisetas", "Selecciones", "Clubes"];
const appVersion = "1.4.0";
const apiUrl = import.meta.env.VITE_API_URL || "/api";
const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const availableSizes = ["4", "6", "8", "10", "12", "14", "S", "M", "L", "XL"];
const freeShippingThreshold = 60000;
const shippingCost = 4500;
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
  stock: "",
  active: true,
};
const emptyUserForm = {
  name: "",
  email: "",
  phone: "",
  acceptsMarketing: true,
};

function useSavedCart() {
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

export default function App() {
  const [cart, setCart] = useSavedCart();
  const [isCartOpen, setCartOpen] = useState(false);
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todos");
  const [products, setProducts] = useState(fallbackProducts);
  const [catalogStatus, setCatalogStatus] = useState({ state: "loading", message: "" });
  const [checkout, setCheckout] = useState(emptyCheckout);
  const [checkoutStatus, setCheckoutStatus] = useState({ state: "idle", message: "" });
  const [productForm, setProductForm] = useState(emptyProductForm);
  const [editingProductId, setEditingProductId] = useState("");
  const [adminStatus, setAdminStatus] = useState({ state: "idle", message: "" });
  const [imageUpload, setImageUpload] = useState({ file: null, preview: "", status: "idle", message: "" });
  const [currentPath, setCurrentPath] = useState(() => window.location.pathname);
  const [userForm, setUserForm] = useState(emptyUserForm);
  const [userAccount, setUserAccount] = useState(null);
  const [userStatus, setUserStatus] = useState({ state: "idle", message: "" });

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
    () => cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity, size: item.size || "" })).filter((item) => item.id),
    [cart, products],
  );

  const activeProducts = useMemo(() => products.filter((product) => product.active !== false), [products]);
  const carouselProducts = useMemo(() => activeProducts.slice(0, 8), [activeProducts]);

  const cartQuantity = cartLines.reduce((sum, item) => sum + item.quantity, 0);
  const cartSubtotal = cartLines.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const currentShippingCost = checkout.delivery === "Envio a domicilio" && cartSubtotal < freeShippingThreshold ? shippingCost : 0;
  const cartTotal = cartSubtotal + currentShippingCost;
  const missingSizes = cartLines.filter((item) => !item.size);

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

  function addToCart(productId) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === productId);
      if (existing) {
        return currentCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...currentCart, { id: productId, quantity: 1, size: "" }];
    });
    setCartOpen(true);
  }

  function updateCartSize(productId, size) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCart((currentCart) => currentCart.map((item) => (item.id === productId ? { ...item, size } : item)));
  }

  function navigateTo(path) {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function updateUserForm(field, value) {
    setUserStatus({ state: "idle", message: "" });
    setUserForm((currentUser) => ({ ...currentUser, [field]: value }));
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
      setUserStatus({ state: "success", message: "Cuenta registrada. Ya podes guardar favoritos y compras." });
    } catch (error) {
      setUserStatus({ state: "error", message: `${error.message} Revisa que la API este corriendo.` });
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
        headers: { "Content-Type": "application/json" },
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
      stock: String(product.stock ?? ""),
      active: product.active ?? true,
    });
    document.getElementById("admin")?.scrollIntoView({ behavior: "smooth" });
  }

  async function submitProduct(event) {
    event.preventDefault();
    setAdminStatus({ state: "loading", message: editingProductId ? "Actualizando producto..." : "Creando producto..." });

    const payload = {
      ...productForm,
      price: Number(productForm.price || 0),
      stock: Number(productForm.stock || 0),
      tags: productForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      imageUrl: productForm.image,
      images: productForm.images.split(/[\n,]+/).map((image) => image.trim()).filter(Boolean),
      active: Boolean(productForm.active),
    };

    try {
      const response = await fetch(`${apiUrl}/products${editingProductId ? `/${editingProductId}` : ""}`, {
        method: editingProductId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
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
    const shouldDelete = window.confirm("Eliminar este producto del catalogo?");

    if (!shouldDelete) {
      return;
    }

    setAdminStatus({ state: "loading", message: "Eliminando producto..." });

    try {
      const response = await fetch(`${apiUrl}/products/${productId}`, { method: "DELETE" });

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

    if (checkout.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email)) {
      setCheckoutStatus({ state: "error", message: "Revisa el email para poder enviarte la confirmacion." });
      return;
    }

    if (!/^[0-9\s()+-]{8,}$/.test(checkout.phone)) {
      setCheckoutStatus({ state: "error", message: "Revisa el telefono o WhatsApp. Necesitamos al menos 8 numeros." });
      return;
    }

    setCheckoutStatus({ state: "loading", message: "Estamos preparando tu pedido..." });

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: checkout,
          items: cartLines.map((item) => ({ id: item.id, quantity: item.quantity, size: item.size })),
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
      setCheckoutStatus({ state: "success", message: `Pedido recibido: ${data.order.id}. Te contactamos para coordinar.` });
      if (checkout.email && userAccount?.email === checkout.email.toLowerCase()) {
        const userResponse = await fetch(`${apiUrl}/users/${encodeURIComponent(userAccount.email)}`);
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
    const lines = cartLines.map((item) => `- ${item.name} talle ${item.size || "sin talle"} x${item.quantity}: ${formatter.format(item.price * item.quantity)}`);
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
      <header className="site-header">
        <div className="header-main">
          <button className="icon-action menu-button" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
            <Menu size={25} />
          </button>

          <a className="brand" href="/" aria-label="AyRe inicio" onClick={(event) => { event.preventDefault(); navigateTo("/"); }}>
            <img src={logoAyre} alt="AyRe" />
          </a>

          <label className="header-search">
            <Search size={24} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Buscar camisetas, conjuntos, clubes..." />
          </label>

          <div className="header-actions" aria-label="Accesos rapidos">
            <a href="#cuenta" aria-label="Favoritos"><Heart size={24} /><span>Favoritos</span></a>
            <a href="#cuenta" aria-label="Mi cuenta"><UserRound size={23} /><span>Mi cuenta</span></a>
            <a href="#contacto" aria-label="Tiendas"><Home size={23} /><span>Tiendas</span></a>
            <button className="header-cart" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
              <ShoppingBag size={24} />
              <span>Cesta</span>
              <strong>{cartQuantity}</strong>
            </button>
          </div>

          <button className="icon-action cart-button" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={22} />
            <strong>{cartQuantity}</strong>
          </button>
        </div>

        <nav className="main-nav" aria-label="Secciones">
          <a href="#productos">Coleccion</a>
          <a href="#productos">Camisetas</a>
          <a href="#productos">Conjuntos</a>
          <a href="#coleccion">AyRe</a>
          <a href="#contacto">Contacto</a>
          <a href="/admin" target="_blank" rel="noreferrer">Admin</a>
        </nav>
      </header>

      <main id={isAdminRoute ? "admin" : "inicio"}>
        {!isAdminRoute && (
          <>
        <section className="hero" style={{ "--hero-image": `url(${heroImage})` }}>
          <div className="hero-copy">
            <p className="eyebrow">Mundial style drops</p>
            <h1>Indumentaria para jugar y alentar</h1>
            <p className="hero-text">Camisetas, conjuntos y equipos de clubes y selecciones con una tienda lista para crecer.</p>
            <div className="hero-actions">
              <a className="primary-action" href="#productos">Ver catalogo</a>
              <a className="secondary-action" href="#coleccion">Conocer AyRe</a>
            </div>
          </div>
        </section>

        <section className="shipping-band" aria-label="Beneficio de envio">
          <span>Envios gratis desde $60.000</span>
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
          <div><span>01</span><strong>Clubes y selecciones</strong><p>Modelos elegidos para chicos, entrenamiento y uso urbano.</p></div>
          <div><span>02</span><strong>Stock visible</strong><p>Catalogo preparado para sumar talles, colores y variantes.</p></div>
          <div><span>03</span><strong>Compra simple</strong><p>Carrito persistente y estructura lista para futuro checkout.</p></div>
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

        <section className="shop-section" id="productos">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Catalogo</p>
              <h2>Productos destacados</h2>
              {catalogStatus.state === "fallback" && <p className="catalog-note">{catalogStatus.message}</p>}
            </div>
            <div className="shop-tools" role="search">
              <label className="search-box">
                <span>Buscar</span>
                <div className="search-input">
                  <Search size={18} />
                  <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Boca, River, Argentina..." />
                </div>
              </label>
              <select value={category} onChange={(event) => setCategory(event.target.value)} aria-label="Filtrar categoria">
                {categories.map((item) => <option value={item} key={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <div className="product-grid" aria-live="polite">
            {visibleProducts.length ? visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <div className="product-media" role="button" tabIndex={0} onClick={() => navigateTo(`/producto/${product.id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigateTo(`/producto/${product.id}`); }}>
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span>{product.badge}</span>
                </div>
                <div className="product-info">
                  <div className="product-meta" role="button" tabIndex={0} onClick={() => navigateTo(`/producto/${product.id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigateTo(`/producto/${product.id}`); }}>
                    <div><h3>{product.name}</h3><p>{product.description}</p></div>
                    <span className="price">{formatter.format(product.price)}</span>
                  </div>
                  <div className="product-actions">
                    <button className="add-button" type="button" onClick={() => addToCart(product.id)}>Agregar</button>
                    <button className="favorite-icon-button" type="button" aria-label={`Guardar ${product.name}`} onClick={() => toggleFavorite(product.id)}>
                      <Heart size={18} fill={(userAccount?.favorites || []).includes(product.id) ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </article>
            )) : <p className="empty-state">No encontramos productos con esos filtros.</p>}
          </div>
        </section>
          </>
        )}

        {isAdminRoute && (
        <section className="admin-section" id="admin">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Gestion</p>
              <h2>Panel admin</h2>
              <p className="catalog-note">Alta, baja y modificacion de productos del catalogo.</p>
            </div>
            <button className="secondary-admin-button" type="button" onClick={resetProductForm}>Nuevo producto</button>
          </div>

          <div className="admin-layout">
            <form className="admin-form" onSubmit={submitProduct}>
              <h3>{editingProductId ? "Editar producto" : "Agregar producto"}</h3>
              <div className="admin-grid">
                <label>
                  Codigo
                  <input value={productForm.id} onChange={(event) => updateProductForm("id", event.target.value)} type="text" placeholder="camiseta-argentina-10" disabled={Boolean(editingProductId)} />
                </label>
                <label>
                  Nombre
                  <input value={productForm.name} onChange={(event) => updateProductForm("name", event.target.value)} type="text" placeholder="Nombre del producto" required />
                </label>
                <label>
                  Categoria
                  <select value={productForm.category} onChange={(event) => updateProductForm("category", event.target.value)}>
                    <option>Conjuntos</option>
                    <option>Camisetas</option>
                    <option>Selecciones</option>
                    <option>Clubes</option>
                  </select>
                </label>
                <label>
                  Etiqueta
                  <input value={productForm.badge} onChange={(event) => updateProductForm("badge", event.target.value)} type="text" placeholder="Nuevo, Stock, Club..." />
                </label>
                <label>
                  Precio
                  <input value={productForm.price} onChange={(event) => updateProductForm("price", event.target.value)} type="number" min="0" placeholder="34900" required />
                </label>
                <label>
                  Stock
                  <input value={productForm.stock} onChange={(event) => updateProductForm("stock", event.target.value)} type="number" min="0" placeholder="10" />
                </label>
                <label className="checkbox-label">
                  <input checked={productForm.active} onChange={(event) => updateProductForm("active", event.target.checked)} type="checkbox" />
                  Producto activo
                </label>
              </div>

              <label>
                Tags
                <input value={productForm.tags} onChange={(event) => updateProductForm("tags", event.target.value)} type="text" placeholder="Argentina, Selecciones, Messi" />
              </label>
              <label>
                Imagen principal
                <input value={productForm.image} onChange={(event) => updateProductForm("image", event.target.value)} type="text" placeholder="URL de imagen o /assets/archivo.jpg" />
              </label>
              <label>
                Galeria de imagenes
                <textarea value={productForm.images} onChange={(event) => updateProductForm("images", event.target.value)} rows="4" placeholder="Una URL por linea. Cloudinary las agrega automaticamente." />
              </label>
              <div className="image-upload-box">
                <div>
                  <strong>Subir imagen</strong>
                  <span>JPG, PNG o WebP hasta 5 MB. Se guarda en Cloudinary.</span>
                </div>
                <input type="file" accept="image/*" onChange={(event) => updateProductImageFile(event.target.files?.[0] || null)} />
                {(imageUpload.preview || productForm.image) && (
                  <img src={imageUpload.preview || productForm.image} alt="Vista previa del producto" />
                )}
                <button className="secondary-admin-button" type="button" onClick={uploadProductImage} disabled={imageUpload.status === "loading" || !imageUpload.file}>
                  {imageUpload.status === "loading" ? "Subiendo..." : "Subir a Cloudinary"}
                </button>
                {imageUpload.message && <p className={`upload-message ${imageUpload.status}`}>{imageUpload.message}</p>}
              </div>
              <label>
                Descripcion
                <textarea value={productForm.description} onChange={(event) => updateProductForm("description", event.target.value)} rows="3" placeholder="Descripcion corta para el catalogo" required />
              </label>

              {adminStatus.message && <p className={`checkout-message ${adminStatus.state}`}>{adminStatus.message}</p>}

              <button className="checkout-button" type="submit" disabled={adminStatus.state === "loading"}>
                <Save size={18} />
                {editingProductId ? "Guardar cambios" : "Crear producto"}
              </button>
            </form>

            <div className="admin-products" aria-live="polite">
              {products.map((product) => (
                <article className="admin-product-row" key={`admin-${product.id}`}>
                  <img src={product.image} alt="" />
                  <div>
                    <strong>{product.name}</strong>
                    <span>{product.category} - {formatter.format(product.price)} - Stock {product.stock ?? 0} - {product.active === false ? "Inactivo" : "Activo"}</span>
                  </div>
                  <div className="admin-actions">
                    <button type="button" aria-label={`Editar ${product.name}`} onClick={() => editProduct(product)}><Edit3 size={18} /></button>
                    <button type="button" aria-label={`Eliminar ${product.name}`} onClick={() => removeProduct(product.id)}><Trash2 size={18} /></button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        )}

        {!isAdminRoute && (
          <>
        <section className="account-section" id="cuenta">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Cuenta</p>
              <h2>Registro de usuarios</h2>
              <p className="catalog-note">Registrate para recibir novedades, guardar favoritos y asociar tus compras a tu email.</p>
            </div>
          </div>
          <div className="account-layout">
            <form className="admin-form" onSubmit={submitUser}>
              <div className="admin-grid">
                <label>Nombre<input value={userForm.name} onChange={(event) => updateUserForm("name", event.target.value)} type="text" required /></label>
                <label>Email<input value={userForm.email} onChange={(event) => updateUserForm("email", event.target.value)} type="email" required /></label>
                <label>Telefono<input value={userForm.phone} onChange={(event) => updateUserForm("phone", event.target.value)} type="tel" /></label>
                <label className="checkbox-label"><input checked={userForm.acceptsMarketing} onChange={(event) => updateUserForm("acceptsMarketing", event.target.checked)} type="checkbox" /> Recibir novedades por email</label>
              </div>
              {userStatus.message && <p className={`checkout-message ${userStatus.state}`}>{userStatus.message}</p>}
              <button className="checkout-button" type="submit">Crear / actualizar cuenta</button>
            </form>
            <div className="account-summary">
              <h3>{userAccount ? userAccount.name : "Tus datos"}</h3>
              <p>{userAccount ? userAccount.email : "Cuando te registres, tus favoritos y compras quedaran asociados a tu email."}</p>
              <strong>Favoritos: {(userAccount?.favorites || []).length}</strong>
              <strong>Compras: {(userAccount?.purchases || []).length}</strong>
            </div>
          </div>
        </section>

        <section className="contact-band" id="contacto">
          <div>
            <p className="eyebrow">AyRe team</p>
            <h2>Recibi novedades de nuevos ingresos</h2>
          </div>
          <form className="newsletter-form" onSubmit={(event) => event.preventDefault()}>
            <input type="email" placeholder="tu@email.com" aria-label="Email" required />
            <button type="submit">Sumarme</button>
          </form>
        </section>
          </>
        )}
      </main>

      <footer className="site-footer">
        <a className="footer-brand" href="#inicio" aria-label="AyRe inicio">
          <img src={logoAyre} alt="AyRe" />
        </a>
        <p>Copyright (c) 2026 AyRe. Todos los derechos reservados.</p>
        <span className="version-mark">v{appVersion}</span>
      </footer>

      <aside className={`cart-panel ${isCartOpen ? "is-open" : ""}`} aria-label="Carrito" aria-hidden={!isCartOpen}>
        <div className="cart-header">
          <div><p className="eyebrow">Compra</p><h2>Carrito</h2></div>
          <button className="icon-action close-cart" type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)}><X size={26} /></button>
        </div>
        <div className="cart-items">
          {cartLines.length ? cartLines.map((item) => (
            <article className="cart-line" key={item.id}>
              <img src={item.image} alt="" />
              <div>
                <h3>{item.name}</h3>
                <p>{formatter.format(item.price)} x {item.quantity}</p>
                <label className="line-size">
                  Talle
                  <select value={item.size} onChange={(event) => updateCartSize(item.id, event.target.value)} required>
                    <option value="">Elegir</option>
                    {availableSizes.map((size) => <option value={size} key={`${item.id}-${size}`}>{size}</option>)}
                  </select>
                </label>
                <div className="qty-controls" aria-label={`Cantidad de ${item.name}`}>
                  <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Restar"><Minus size={16} /></button>
                  <strong>{item.quantity}</strong>
                  <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Sumar"><Plus size={16} /></button>
                </div>
              </div>
              <strong>{formatter.format(item.price * item.quantity)}</strong>
            </article>
          )) : <p className="empty-state">Tu carrito esta vacio.</p>}
        </div>
        <div className="cart-footer">
          <div className="checkout-summary" aria-label="Resumen de compra">
            <div><span>Subtotal</span><strong>{formatter.format(cartSubtotal)}</strong></div>
            <div><span>Envio</span><strong>{currentShippingCost ? formatter.format(currentShippingCost) : "Sin cargo"}</strong></div>
            <div className="cart-total"><span>Total</span><strong>{formatter.format(cartTotal)}</strong></div>
            {checkout.delivery === "Envio a domicilio" && cartSubtotal < freeShippingThreshold && (
              <p>Te faltan {formatter.format(freeShippingThreshold - cartSubtotal)} para envio gratis.</p>
            )}
          </div>
          <form className="checkout-form" onSubmit={submitOrder}>
            <div className="checkout-grid">
              <label>
                Nombre
                <input value={checkout.name} onChange={(event) => updateCheckout("name", event.target.value)} type="text" placeholder="Nombre y apellido" required />
              </label>
              <label>
                Telefono
                <input value={checkout.phone} onChange={(event) => updateCheckout("phone", event.target.value)} type="tel" placeholder="WhatsApp" required />
              </label>
              <label>
                Email
                <input value={checkout.email} onChange={(event) => updateCheckout("email", event.target.value)} type="email" placeholder="tu@email.com" />
              </label>
              <label>
                Entrega
                <select value={checkout.delivery} onChange={(event) => updateCheckout("delivery", event.target.value)}>
                  <option>Retiro en tienda</option>
                  <option>Envio a domicilio</option>
                  <option>Coordinar por WhatsApp</option>
                </select>
              </label>
            </div>

            {checkout.delivery === "Envio a domicilio" && (
              <label>
                Direccion
                <input value={checkout.address} onChange={(event) => updateCheckout("address", event.target.value)} type="text" placeholder="Calle, numero, localidad" required />
              </label>
            )}

            <label>
              Pago
              <select value={checkout.payment} onChange={(event) => updateCheckout("payment", event.target.value)}>
                <option>Efectivo</option>
                <option>Transferencia</option>
                <option>Mercado Pago</option>
                <option>Coordinar</option>
              </select>
            </label>
            <p className="payment-help">
              {checkout.payment === "Transferencia" && "Al confirmar, guardamos el pedido y te pasamos los datos de transferencia por WhatsApp."}
              {checkout.payment === "Mercado Pago" && "Dejamos el pedido reservado y te enviamos el link de Mercado Pago para completar el pago."}
              {checkout.payment === "Efectivo" && "Pagas al retirar o al coordinar la entrega."}
              {checkout.payment === "Coordinar" && "Te contactamos para elegir el metodo de pago mas comodo."}
            </p>

            <label className="checkbox-label checkout-check">
              <input checked={checkout.notifyByEmail} onChange={(event) => updateCheckout("notifyByEmail", event.target.checked)} type="checkbox" />
              Enviarme confirmacion y novedades al email
            </label>

            <label>
              Comentarios
              <textarea value={checkout.notes} onChange={(event) => updateCheckout("notes", event.target.value)} placeholder="Nombre en camiseta, colores o cualquier detalle del pedido" rows="3" />
            </label>

            {checkoutStatus.message && <p className={`checkout-message ${checkoutStatus.state}`}>{checkoutStatus.message}</p>}
            <a className="whatsapp-checkout" href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`} target="_blank" rel="noreferrer">
              Consultar por WhatsApp
            </a>
            <button className="checkout-button" type="submit" disabled={checkoutStatus.state === "loading" || !cartLines.length}>
              {checkoutStatus.state === "loading" ? "Enviando pedido..." : "Finalizar compra"}
            </button>
          </form>
        </div>
      </aside>

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
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Buscar" />
        </label>

        <img className="mobile-menu-logo" src={logoAyre} alt="AyRe" />

        <nav className="mobile-links">
          <a href="#productos" onClick={() => setMenuOpen(false)}>Camisetas mundialistas</a>
          <a href="#productos" onClick={() => setMenuOpen(false)}>Selecciones <Plus size={19} /></a>
          <a href="#productos" onClick={() => setMenuOpen(false)}>Clubes <Plus size={19} /></a>
          <a href="#productos" onClick={() => setMenuOpen(false)}>Conjuntos deportivos <Plus size={19} /></a>
            <a href="#coleccion" onClick={() => setMenuOpen(false)}>AyRe</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
            <a href="/admin" target="_blank" rel="noreferrer" onClick={() => setMenuOpen(false)}>Admin</a>
          </nav>

        <div className="mobile-account">
          <UserRound size={21} />
          <a href="#contacto" onClick={() => setMenuOpen(false)}>Cuenta</a>
        </div>
      </aside>

      {(isMenuOpen || isCartOpen) && <button className="overlay" type="button" aria-label="Cerrar" onClick={closeLayers} />}
    </>
  );
}
