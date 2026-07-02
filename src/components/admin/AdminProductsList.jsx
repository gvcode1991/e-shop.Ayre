import React from "react";
import { Edit3, Trash2 } from "lucide-react";

import { formatter } from "../../utils/formatters";
import { stockTotal } from "../../utils/stock";

export function AdminProductsList({ editProduct, products, removeProduct }) {
  return (
    <div className="admin-products" aria-live="polite">
      {products.map((product) => (
        <article className="admin-product-row" key={`admin-${product.id}`}>
          <img src={product.image} alt="" />
          <div>
            <strong>{product.name}</strong>
            <span>{product.category} - {formatter.format(product.price)} - Stock {stockTotal(product.stock)} - {product.colors?.length ? `Colores ${product.colors.join(", ")} - ` : ""}{product.active === false ? "Inactivo" : "Activo"}</span>
          </div>
          <div className="admin-actions">
            <button type="button" aria-label={`Editar ${product.name}`} onClick={() => editProduct(product)}><Edit3 size={18} /></button>
            <button type="button" aria-label={`Eliminar ${product.name}`} onClick={() => removeProduct(product.id)}><Trash2 size={18} /></button>
          </div>
        </article>
      ))}
    </div>
  );
}
