import { Menu, Minus, Plus, Search, ShoppingBag, X } from "lucide-react";
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

const products = [
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

const categories = ["Todos", "Conjuntos", "Camisetas", "Selecciones", "Clubes"];
const carouselProducts = products.slice(0, 8);
const formatter = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

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

  const cartLines = useMemo(
    () => cart.map((item) => ({ ...products.find((product) => product.id === item.id), quantity: item.quantity })).filter((item) => item.id),
    [cart],
  );

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
    setCart((currentCart) =>
      currentCart.map((item) => (item.id === productId ? { ...item, quantity: item.quantity + change } : item)).filter((item) => item.quantity > 0),
    );
  }

  function closeLayers() {
    setMenuOpen(false);
    setCartOpen(false);
  }

  return (
    <>
      <header className="site-header">
        <button className="icon-action menu-button" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
          <Menu size={26} />
        </button>

        <a className="brand" href="#inicio" aria-label="AyRe inicio">
          <img src={logoAyre} alt="AyRe" />
        </a>

        <nav className="main-nav" aria-label="Secciones">
          <a href="#inicio">Inicio</a>
          <a href="#productos">Productos</a>
          <a href="#coleccion">Nosotros</a>
          <a href="#contacto">Contacto</a>
        </nav>

        <button className="icon-action cart-button" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={23} />
          <strong>{cartQuantity}</strong>
        </button>
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
        <p>Copyright © 2026 AyRe. Todos los derechos reservados.</p>
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
          <button className="checkout-button" type="button">Finalizar compra</button>
        </div>
      </aside>

      <aside className={`mobile-menu ${isMenuOpen ? "is-open" : ""}`} aria-label="Menu mobile" aria-hidden={!isMenuOpen}>
        <button className="close-menu" type="button" aria-label="Cerrar menu" onClick={() => setMenuOpen(false)}><X size={34} /></button>
        <div className="mobile-menu-inner">
          <nav className="mobile-links">
            <a href="#inicio" onClick={() => setMenuOpen(false)}>Inicio</a>
            <a href="#productos" onClick={() => setMenuOpen(false)}>Productos</a>
            <a href="#coleccion" onClick={() => setMenuOpen(false)}>Nosotros</a>
            <a href="#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
          </nav>
          <img src={logoAyre} alt="AyRe" />
        </div>
      </aside>

      {(isMenuOpen || isCartOpen) && <button className="overlay" type="button" aria-label="Cerrar" onClick={closeLayers} />}
    </>
  );
}
