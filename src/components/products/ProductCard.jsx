import React from "react";
import { Heart } from "lucide-react";

import { formatter } from "../../utils/formatters";
import { stockTotal } from "../../utils/stock";

export function ProductCard({ addToCart, navigateTo, product, toggleFavorite, userAccount }) {
  return (
    <article className="product-card">
      <div className="product-media" role="button" tabIndex={0} onClick={() => navigateTo(`/producto/${product.id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigateTo(`/producto/${product.id}`); }}>
        <img src={product.image} alt={product.name} loading="lazy" />
        <span>{product.badge}</span>
      </div>
      <div className="product-info">
        <div className="product-meta" role="button" tabIndex={0} onClick={() => navigateTo(`/producto/${product.id}`)} onKeyDown={(event) => { if (event.key === "Enter") navigateTo(`/producto/${product.id}`); }}>
          <div><h3>{product.name}</h3><p>{product.description}</p><small>{stockTotal(product.stock)} disponibles</small></div>
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
  );
}
