import React from "react";
import { Heart, Home, Menu, Search, ShoppingBag, UserRound } from "lucide-react";

export function Header({
  cartQuantity,
  headerActions,
  storeLogo,
  mainNavLinks,
  navigateTo,
  navigateToSection,
  query,
  searchPlaceholders,
  setCartOpen,
  setMenuOpen,
  setQuery,
  storeInfo,
}) {
  return (
    <header className="site-header">
      <div className="header-main">
        <button className="icon-action menu-button" type="button" aria-label="Abrir menu" onClick={() => setMenuOpen(true)}>
          <Menu size={25} />
        </button>

        <button className="mobile-search-button" type="button" aria-label={searchPlaceholders.mobile} onClick={() => navigateToSection("/", "productos")}>
          <Search size={21} />
        </button>

        <a className="brand" href="/" aria-label={`${storeInfo.name} inicio`} onClick={(event) => { event.preventDefault(); navigateTo("/"); }}>
          <img className="brand-mark" src={storeLogo} alt="" />
          <span className="brand-name">{storeInfo.name}</span>
        </a>

        <label className="header-search">
          <Search size={24} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder={searchPlaceholders.desktop} />
        </label>

        <div className="header-actions" aria-label="Accesos rapidos">
          <a href="/cuenta" aria-label={headerActions.favorites} onClick={(event) => { event.preventDefault(); navigateTo("/cuenta"); }}><Heart size={24} /><span>{headerActions.favorites}</span></a>
          <a href="/cuenta" aria-label={headerActions.account} onClick={(event) => { event.preventDefault(); navigateTo("/cuenta"); }}><UserRound size={23} /><span>{headerActions.account}</span></a>
          <a href="#contacto" aria-label={headerActions.stores}><Home size={23} /><span>{headerActions.stores}</span></a>
          <button className="header-cart" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
            <ShoppingBag size={24} />
            <span>{headerActions.cart}</span>
            <strong>{cartQuantity}</strong>
          </button>
        </div>

        <button className="mobile-account-button" type="button" aria-label={headerActions.account} onClick={() => navigateTo("/cuenta")}>
          <UserRound size={20} />
        </button>

        <button className="icon-action cart-button" type="button" aria-label="Abrir carrito" onClick={() => setCartOpen(true)}>
          <ShoppingBag size={20} />
          <strong>{cartQuantity}</strong>
        </button>
      </div>

      <nav className="main-nav" aria-label="Secciones">
        {mainNavLinks.map((link) => (
          <a href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} key={`${link.label}-${link.href}`}>
            {link.label}
          </a>
        ))}
      </nav>
    </header>
  );
}
