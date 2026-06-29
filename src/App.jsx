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
const appVersion = "1.1.1";
const apiUrl = import.meta.env.VITE_API_URL || "/api";
const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });
const emptyCheckout = {
  name: "",
  phone: "",
  email: "",
  delivery: "Retiro en tienda",
  address: "",
  payment: "Efectivo",
  notes: "",
};
const emptyProductForm = {
  id: "",
  name: "",
  category: "Camisetas",
  tags: "",
  description: "",
  price: "",
  image: "",
  badge: "",
  stock: "",
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

  async function loadProducts() {
    try {
      const response = await fetch(`${apiUrl}/products`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos cargar el catalogo.");
      }

      const apiProducts = data.products.map((product) => ({
        ...product,
        sourceImage: product.image,
        image: productImages[product.id] || product.image,
      }));

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

  const cartLines = useMemo(
    () => cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity })).filter((item) => item.id),
    [cart, products],
  );

  const carouselProducts = useMemo(() => products.slice(0, 8), [products]);

  const cartQuantity = cartLines.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cartLines.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) => {
      const matchesCategory = category === "Todos" || product.category === category || product.tags.includes(category);
      const matchesQuery = [product.name, product.category, product.description, ...product.tags].join(" ").toLowerCase().includes(normalizedQuery);
      return matchesCategory && matchesQuery;
    });
  }, [category, query]);

  function addToCart(productId) {
    setCheckoutStatus({ state: "idle", message: "" });
    setCart((currentCart) => {
      const existing = currentCart.find((item) => item.id === productId);
      if (existing) {
        return currentCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + 1 } : item));
      }
      return [...currentCart, { id: productId, quantity: 1 }];
    });
    setCartOpen(true);
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

  function resetProductForm() {
    setProductForm(emptyProductForm);
    setEditingProductId("");
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
      image: product.sourceImage || product.image || "",
      badge: product.badge || "",
      stock: String(product.stock ?? ""),
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
    const shouldDelete = window.confirm("¿Eliminar este producto del catalogo?");

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

    setCheckoutStatus({ state: "loading", message: "Estamos preparando tu pedido..." });

    try {
      const response = await fetch(`${apiUrl}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: checkout,
          items: cartLines.map((item) => ({ id: item.id, quantity: item.quantity })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "No pudimos crear el pedido.");
      }

      setCart([]);
      setCheckout(emptyCheckout);
      setCheckoutStatus({ state: "success", message: `Pedido recibido: ${data.order.id}. Te contactamos para coordinar.` });
    } catch (error) {
      setCheckoutStatus({ state: "error", message: `${error.message} Revisa que la API este corriendo.` });
    }
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

          <a className="brand" href="#inicio" aria-label="AyRe inicio">
            <img src={logoAyre} alt="AyRe" />
          </a>

          <label className="header-search">
            <Search size={24} />
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Buscar camisetas, conjuntos, clubes..." />
          </label>

          <div className="header-actions" aria-label="Accesos rapidos">
            <a href="#productos" aria-label="Favoritos"><Heart size={24} /><span>Favoritos</span></a>
            <a href="#contacto" aria-label="Mi cuenta"><UserRound size={23} /><span>Mi cuenta</span></a>
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
          <a href="#admin">Admin</a>
        </nav>
      </header>

      <main id="inicio">
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
              <article className="carousel-card" key={`carousel-${product.id}`}>
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
                <div className="product-media">
                  <img src={product.image} alt={product.name} loading="lazy" />
                  <span>{product.badge}</span>
                </div>
                <div className="product-info">
                  <div className="product-meta">
                    <div><h3>{product.name}</h3><p>{product.description}</p></div>
                    <span className="price">{formatter.format(product.price)}</span>
                  </div>
                  <button className="add-button" type="button" onClick={() => addToCart(product.id)}>Agregar</button>
                </div>
              </article>
            )) : <p className="empty-state">No encontramos productos con esos filtros.</p>}
          </div>
        </section>

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
              </div>

              <label>
                Tags
                <input value={productForm.tags} onChange={(event) => updateProductForm("tags", event.target.value)} type="text" placeholder="Argentina, Selecciones, Messi" />
              </label>
              <label>
                Imagen
                <input value={productForm.image} onChange={(event) => updateProductForm("image", event.target.value)} type="text" placeholder="URL de imagen o /assets/archivo.jpg" />
              </label>
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
                    <span>{product.category} · {formatter.format(product.price)} · Stock {product.stock ?? 0}</span>
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
          <div className="cart-total"><span>Total</span><strong>{formatter.format(cartTotal)}</strong></div>
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

            <label>
              Comentarios
              <textarea value={checkout.notes} onChange={(event) => updateCheckout("notes", event.target.value)} placeholder="Talles, colores o cualquier detalle del pedido" rows="3" />
            </label>

            {checkoutStatus.message && <p className={`checkout-message ${checkoutStatus.state}`}>{checkoutStatus.message}</p>}
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
            <a href="#admin" onClick={() => setMenuOpen(false)}>Admin</a>
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
