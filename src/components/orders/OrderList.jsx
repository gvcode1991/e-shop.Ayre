import React from "react";
import { formatter } from "../../utils/formatters";

export function OrderList({ purchases }) {
  return (
    <div className="purchase-list">
      {(purchases || []).map((purchase) => (
        <article key={purchase.id || purchase._id || purchase.createdAt}>
          <span>{purchase.createdAt ? new Date(purchase.createdAt).toLocaleDateString("es-AR") : "Compra"}</span>
          <strong>{formatter.format(purchase.total || 0)}</strong>
          <small>{purchase.status || "pending"}</small>
        </article>
      ))}
    </div>
  );
}
