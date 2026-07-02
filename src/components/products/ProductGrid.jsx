import React from "react";
import { ProductCard } from "./ProductCard";

export function ProductGrid({
  addToCart,
  catalogStatus,
  catalogContent,
  category,
  navigateTo,
  setCategory,
  setQuery,
  toggleFavorite,
  userAccount,
  visibleCategoryShortcuts,
  visibleProducts,
}) {
  return (
    <section className="shop-section" id="productos">
      <div className="section-heading">
        <div>
          <p className="eyebrow">{catalogContent.eyebrow}</p>
          <h2>{catalogContent.title}</h2>
          {catalogStatus.state === "fallback" && <p className="catalog-note">{catalogStatus.message}</p>}
        </div>
        <div className="catalog-shortcuts" aria-label="Categorias del catalogo">
          {visibleCategoryShortcuts.map((shortcut) => (
            <button className={category === shortcut.value ? "is-active" : ""} type="button" onClick={() => { setQuery(""); setCategory(shortcut.value); }} key={shortcut.value}>{shortcut.label}</button>
          ))}
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
        )) : <p className="empty-state">{catalogContent.emptyMessage}</p>}
      </div>
    </section>
  );
}
