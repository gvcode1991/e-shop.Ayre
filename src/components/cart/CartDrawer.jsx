import React from "react";
import { Minus, Plus, X } from "lucide-react";

import { CheckoutForm } from "../checkout/CheckoutForm";
import { cartContent, checkoutContent, deliveryMethods, freeShippingThreshold, paymentHelpText, paymentMethods } from "../../config/storeConfig";
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
    <aside className={`cart-panel ${isCartOpen ? "is-open" : ""}`} aria-label={cartContent.title} aria-hidden={!isCartOpen}>
      <div className="cart-header">
        <div><p className="eyebrow">{cartContent.eyebrow}</p><h2>{cartContent.title}</h2></div>
        <button className="icon-action close-cart" type="button" aria-label={cartContent.closeLabel} onClick={() => setCartOpen(false)}><X size={26} /></button>
      </div>
      <div className="checkout-steps" aria-label="Pasos de compra">
        <button type="button" className={checkoutStep === 1 ? "is-active" : ""} onClick={() => setCheckoutStep(1)}>{cartContent.steps[0]}</button>
        <button type="button" className={checkoutStep === 2 ? "is-active" : ""} onClick={() => cartLines.length && setCheckoutStep(2)}>{cartContent.steps[1]}</button>
        <button type="button" className={checkoutStep === 3 ? "is-active" : ""} onClick={() => cartLines.length && setCheckoutStep(3)}>{cartContent.steps[2]}</button>
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
                    {cartContent.sizeLabel}
                    <select value={item.size} onChange={(event) => updateCartSize(item.id, event.target.value)} required>
                      <option value="">{cartContent.chooseOption}</option>
                      {getProductSizes(item).map((size) => <option value={size} key={`${item.id}-${size}`}>{size}</option>)}
                    </select>
                  </label>
                  {item.colors?.length > 0 && (
                    <label className="line-size">
                      {cartContent.colorLabel}
                      <select value={item.color} onChange={(event) => updateCartColor(item.id, event.target.value)} required>
                        <option value="">{cartContent.chooseOption}</option>
                        {item.colors.map((color) => <option value={color} key={`${item.id}-${color}`}>{color}</option>)}
                      </select>
                    </label>
                  )}
                  <div className="qty-controls" aria-label={`Cantidad de ${item.name}`}>
                    <button type="button" onClick={() => updateQuantity(item.id, -1)} aria-label={cartContent.subtractLabel}><Minus size={16} /></button>
                    <strong>{item.quantity}</strong>
                    <button type="button" onClick={() => updateQuantity(item.id, 1)} aria-label={cartContent.addLabel}><Plus size={16} /></button>
                  </div>
                </div>
                <strong>{formatter.format(item.price * item.quantity)}</strong>
              </article>
            )) : <p className="empty-state">{cartContent.emptyMessage}</p>}
            {cartLines.length > 0 && <button className="clear-cart-button" type="button" onClick={clearCart}>{cartContent.clearLabel}</button>}
          </>
        )}

        {checkoutStep === 2 && (
          <CheckoutForm checkout={checkout} checkoutContent={checkoutContent} deliveryMethods={deliveryMethods} paymentHelpText={paymentHelpText} paymentMethods={paymentMethods} submitOrder={submitOrder} updateCheckout={updateCheckout} />
        )}

        {checkoutStep === 3 && (
          <div className="order-review">
            <h3>{cartContent.reviewTitle}</h3>
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
          <div><span>{cartContent.summary.subtotal}</span><strong>{formatter.format(cartSubtotal)}</strong></div>
          <div><span>{cartContent.summary.shipping}</span><strong>{currentShippingCost ? formatter.format(currentShippingCost) : cartContent.summary.freeShippingValue}</strong></div>
          <div className="cart-total"><span>{cartContent.summary.total}</span><strong>{formatter.format(cartTotal)}</strong></div>
          {checkout.delivery === deliveryMethods[1] && cartSubtotal < freeShippingThreshold && (
            <p>{cartContent.summary.freeShippingMessage.replace("{amount}", formatter.format(freeShippingThreshold - cartSubtotal))}</p>
          )}
        </div>
        {checkoutStatus.message && <p className={`checkout-message ${checkoutStatus.state}`}>{checkoutStatus.message}</p>}
        <a className="whatsapp-checkout" href={`https://wa.me/${whatsappNumber}?text=${buildWhatsAppMessage()}`} target="_blank" rel="noreferrer">
          {cartContent.whatsappLabel}
        </a>
        <div className="cart-step-actions">
          {checkoutStep > 1 && <button className="secondary-step-button" type="button" onClick={() => setCheckoutStep((currentStep) => Math.max(currentStep - 1, 1))}>{cartContent.previousStep}</button>}
          <button className="checkout-button" type="submit" disabled={checkoutStatus.state === "loading" || !cartLines.length}>
            {checkoutStatus.state === "loading" ? cartContent.loading : checkoutStep < 3 ? cartContent.nextStep : cartContent.finish}
          </button>
        </div>
      </form>
    </aside>
  );
}
