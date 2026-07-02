import React from "react";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  addToCart,
  catalogStatus,
  category,
  navigateTo,
  setCategory,
  setQuery,
  toggleFavorite,
  userAccount,
  visibleProducts,
}) {
  return (
    <section className="shop-section" id="productos">
      <div className="section-heading">
        <div>
          <p className="eyebrow">Catalogo</p>
          <h2>Productos destacados</h2>
          {catalogStatus.state === "fallback" && <p className="catalog-note">{catalogStatus.message}</p>}
        </div>
        <div className="catalog-shortcuts" aria-label="Categorias del catalogo">
          <button className={category === "Todos" ? "is-active" : ""} type="button" onClick={() => { setQuery(""); setCategory("Todos"); }}>Catalogo completo</button>
          <button className={category === "Selecciones" ? "is-active" : ""} type="button" onClick={() => { setQuery(""); setCategory("Selecciones"); }}>Remeras de selecciones</button>
          <button className={category === "Conjuntos" ? "is-active" : ""} type="button" onClick={() => { setQuery(""); setCategory("Conjuntos"); }}>Conjuntos deportivos</button>
          <button className={category === "Accesorios" ? "is-active" : ""} type="button" onClick={() => { setQuery(""); setCategory("Accesorios"); }}>Relojes y accesorios</button>
        </div>
      </div>

      <div className="product-grid" aria-live="polite">
        {visibleProducts.length ? visibleProducts.map((product) => (
          <ProductCard
            addToCart={addToCart}
            key={product.id}
            navigateTo={navigateTo}
            product={product}
            toggleFavorite={toggleFavorite}
            userAccount={userAccount}
          />
        )) : <p className="empty-state">No encontramos productos con esos filtros.</p>}
      </div>
    </section>
  );
}
