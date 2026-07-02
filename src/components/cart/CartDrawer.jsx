import React from "react";
import { Minus, Plus, X } from "lucide-react";

import { CheckoutForm } from "../checkout/CheckoutForm";
import { freeShippingThreshold } from "../../config/storeConfig";
import { formatter } from "../../utils/formatters";
import { getProductSizes } from "../../utils/stock";

export function CartDrawer({
  buildWhatsAppMessage,
  cartLines,
  cartSubtotal,
  cartTotal,
  checkout,
  checkoutStatus,
  checkoutStep,
  clearCart,
  currentShippingCost,
  isCartOpen,
  setCartOpen,
  setCheckoutStep,
  submitOrder,
  updateCartColor,
  updateCartSize,
  updateCheckout,
  updateQuantity,
  whatsappNumber,
}) {
  return (
    <aside className={`cart-panel ${isCartOpen ? "is-open" : ""}`} aria-label="Carrito" aria-hidden={!isCartOpen}>
      <div className="cart-header">
        <div><p className="eyebrow">Compra</p><h2>Carrito</h2></div>
        <button className="icon-action close-cart" type="button" aria-label="Cerrar carrito" onClick={() => setCartOpen(false)}><X size={26} /></button>
      </div>
      <div className="checkout-steps" aria-label="Pasos de compra">
        <button type="button" className={checkoutStep === 1 ? "is-active" : ""} onClick={() => setCheckoutStep(1)}>1. Productos</button>
        <button type="button" className={checkoutStep === 2 ? "is-active" : ""} onClick={() => cartLines.length && setCheckoutStep(2)}>2. Datos</button>
        <button type="button" className={checkoutStep === 3 ? "is-active" : ""} onClick={() => cartLines.length && setCheckoutStep(3)}>3. Confirmar</button>
      </div>
      <div className="cart-items">
        {checkoutStep === 1 && (
          <>
            {cartLines.length ? cartLines.map((item) => (
              <article className="cart-line" key={item.id}>
                <img src={item.image} alt="" />
                <div>
                  <h3>{item.name}</h3>
                  <p>{formatter.format(item.price)} x {item.quantity}</p>
                  <label className="line-size">
                    Talle
                    <select value={item.size} onChange={(event) => updateCartSize(item.id, event.target.value)} required>
                      <option value="">Elegir</option>
                      {getProductSizes(item).map((size) => <option value={size} key={`${item.id}-${size}`}>{size}</option>)}
                    </select>
                  </label>
                  {item.colors?.length > 0 && (
                    <label className="line-size">
                      Color
                      <select value={item.color} onChange={(event) => updateCartColor(item.id, event.target.value)} required>
                        <option value="">Elegir</option>
                        {item.colors.map((color) => <option value={color} key={`${item.id}-${color}`}>{color}</option>)}
                      </select>
                    </label>
                  )}
                  <div className="qty-controls" aria-label={`Cantidad de ${item.name}`}>
                    <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label="Restar"><Minus size={16} /></button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label="Sumar"><Plus size={16} /></button>
                  </div>
                </div>
                <strong>{formatter.format(item.price * item.quantity)}</strong>
              </article>
            )) : <p className="empty-state">Tu carrito esta vacio.</p>}
            {cartLines.length > 0 && <button className="clear-cart-button" type="button" onClick={clearCart}>Vaciar carrito</button>}
          </>
        )}

        {checkoutStep === 2 && (
          <CheckoutForm checkout={checkout} submitOrder={submitOrder} updateCheckout={updateCheckout} />
        )}

        {checkoutStep === 3 && (
          <div className="order-review">
            <h3>Revisar pedido</h3>
            {cartLines.map((item) => (
              <div className="review-line" key={`review-${item.id}`}>
                <span>{item.name} - talle {item.size || "sin talle"}{item.color ? ` - color ${item.color}` : ""} x{item.quantity}</span>
                <strong>{formatter.format(item.price * item.quantity)}</strong>
              </div>
            ))}
            <div className="review-customer">
              <span>{checkout.name}</span>
              <span>{checkout.phone}</span>
              <span>{checkout.email}</span>
              <span>{checkout.delivery}{checkout.address ? ` - ${checkout.address}` : ""}</span>
              <span>{checkout.payment}</span>
            </div>
          </div>
        )}
      </div>

      <form className="cart-footer" onSubmit={submitOrder}>
        <div className="checkout-summary" aria-label="Resumen de compra">
          <div><span>Subtotal</span><strong>{formatter.format(cartSubtotal)}</strong></div>
          <div><span>Envio</span><strong>{currentShippingCost ? formatter.format(currentShippingCost) : "Sin cargo"}</strong></div>
          <div className="cart-total"><span>Total</span><strong>{formatter.format(cartTotal)}</strong></div>
          {checkout.delivery === "Envio a domicilio" && cartSubtotal < freeShippingThreshold && (
            <p>Te faltan {formatter.format(freeShippingThreshold - cartSubtotal)} para envio gratis.</p>
          )}
        </div>
        {checkoutStatus.message && <p className={`checkout-message ${checkoutStatus.state}`}>{checkoutStatus.message}</p>}
        <a className="whatsapp-checkout" href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`} target="_blank" rel="noreferrer">
          Consultar por WhatsApp
        </a>
        <div className="cart-step-actions">
          {checkoutStep > 1 && <button className="secondary-step-button" type="button" onClick={() => setCheckoutStep((currentStep) => Math.max(currentStep - 1, 1))}>Volver</button>}
          <button className="checkout-button" type="submit" disabled={checkoutStatus.state === "loading" || !cartLines.length}>
            {checkoutStatus.state === "loading" ? "Enviando pedido..." : checkoutStep < 3 ? "Continuar" : "Finalizar compra"}
          </button>
        </div>
      </form>
    </aside>
  );
}
