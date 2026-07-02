import React from "react";

export function CheckoutForm({ checkout, checkoutContent, deliveryMethods, paymentHelpText, paymentMethods, submitOrder, updateCheckout }) {
  return (
    <form className="checkout-form staged-form" onSubmit={submitOrder}>
      <div className="checkout-grid">
        <label>
          {checkoutContent.fields.name.label}
          <input value={checkout.name} onChange={(event) => updateCheckout("name", event.target.value)} type="text" placeholder={checkoutContent.fields.name.placeholder} required />
        </label>
        <label>
          {checkoutContent.fields.phone.label}
          <input value={checkout.phone} onChange={(event) => updateCheckout("phone", event.target.value)} type="tel" placeholder={checkoutContent.fields.phone.placeholder} required />
        </label>
        <label>
          {checkoutContent.fields.email.label}
          <input value={checkout.email} onChange={(event) => updateCheckout("email", event.target.value)} type="email" placeholder={checkoutContent.fields.email.placeholder} required />
        </label>
        <label>
          {checkoutContent.fields.delivery.label}
          <select value={checkout.delivery} onChange={(event) => updateCheckout("delivery", event.target.value)}>
            {deliveryMethods.map((method) => <option key={method}>{method}</option>)}
          </select>
        </label>
      </div>

      {checkout.delivery === deliveryMethods[1] && (
        <label>
          {checkoutContent.fields.address.label}
          <input value={checkout.address} onChange={(event) => updateCheckout("address", event.target.value)} type="text" placeholder={checkoutContent.fields.address.placeholder} required />
        </label>
      )}

      <label>
        {checkoutContent.fields.payment.label}
        <select value={checkout.payment} onChange={(event) => updateCheckout("payment", event.target.value)}>
          {paymentMethods.map((method) => <option key={method}>{method}</option>)}
        </select>
      </label>
      <p className="payment-help">
        {paymentHelpText[checkout.payment]}
      </p>

      <label className="checkbox-label checkout-check">
        <input checked={checkout.notifyByEmail} onChange={(event) => updateCheckout("notifyByEmail", event.target.checked)} type="checkbox" />
        {checkoutContent.notifyLabel}
      </label>

      <label>
        {checkoutContent.fields.notes.label}
        <textarea value={checkout.notes} onChange={(event) => updateCheckout("notes", event.target.value)} placeholder={checkoutContent.fields.notes.placeholder} rows="3" />
      </label>
    </form>
  );
}
