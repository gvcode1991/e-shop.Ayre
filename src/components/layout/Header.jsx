import React from "react";
import { Heart, Home, Menu, Search, ShoppingBag, UserRound } from "lucide-react";

export function Header({
  cartQuantity,
  logoAyre,
  navigateTo,
  navigateToSection,
  query,
  setCartOpen,
  setMenuOpen,
  setQuery,
}) {
  return (
    <header className="site-header">
      <div className="header-main">
        <button className="icon-action menu-button" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
          <Menu size={25} />
        </button>

        <button className="mobile-search-button" type="button" aria-label="Buscar productos" onClick={() => navigateToSection("/", "productos")}>
          <Search size={21} />
        </button>

        <a className="brand" href="/" aria-label="AyRe inicio" onClick={(event) => { event.preventDefault(); navigateTo("/"); }}>
          <img className="brand-mark" src={logoAyre} alt="" />
          <span className="brand-name">AyRe</span>
        </a>

        <label className="header-search">
          <Search size={24} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Buscar camisetas, conjuntos, clubes..." />
        </label>

        <div className="header-actions" aria-label="Accesos rapidos">
          <a href="/cuenta" aria-label="Favoritos" onClick={(event) => { event.preventDefault(); navigateTo("/cuenta"); }}><Heart size={24} /><span>Favoritos</span></a>
          <a href="/cuenta" aria-label="Mi cuenta" onClick={(event) => { event.preventDefault(); navigateTo("/cuenta"); }}><UserRound size={23} /><span>Mi cuenta</span></a>
          <a href="#contacto" aria-label="Tiendas"><Home size={23} /><span>Tiendas</span></a>
          <button className="header-cart" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={24} />
            <span>Cesta</span>
            <strong>{cartQuantity}</strong>
          </button>
        </div>

        <button className="mobile-account-button" type="button" aria-label="Mi cuenta" onClick={() => navigateTo("/cuenta")}>
          <UserRound size={20} />
        </button>

        <button className="icon-action cart-button" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={20} />
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
  );
}
