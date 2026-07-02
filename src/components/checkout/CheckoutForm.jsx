import React from "react";

export function CheckoutForm({ checkout, submitOrder, updateCheckout }) {
  return (
    <form className="checkout-form staged-form" onSubmit={submitOrder}>
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
          Email registrado
          <input value={checkout.email} onChange={(event) => updateCheckout("email", event.target.value)} type="email" placeholder="tu@email.com" required />
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
    </form>
  );
}
