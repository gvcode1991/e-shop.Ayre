import { useMemo, useState } from "react";

import { checkoutDefaults, deliveryMethods, freeShippingThreshold, orderMessages, shippingCost } from "../config/storeConfig";
import { useCartContext } from "../contexts/CartContext";
import { createOrder } from "../services/ordersApi";
import { getUserAccount } from "../services/usersApi";
import { formatter } from "../utils/formatters";

const emptyCheckout = {
  name: "",
  phone: "",
  email: "",
  delivery: checkoutDefaults.delivery,
  address: "",
  payment: checkoutDefaults.payment,
  notes: "",
  notifyByEmail: true,
};

export function useCheckout({ cartLines, loadProducts, setUserAccount, storeName, userAccount, userToken }) {
  const {
    checkoutStatus,
    checkoutStep,
    resetCheckoutStatus,
    setCart,
    setCheckoutStatus,
    setCheckoutStep,
  } = useCartContext();
  const [checkout, setCheckout] = useState(emptyCheckout);

  const cartSubtotal = useMemo(() => cartLines.reduce((sum, item) => sum + item.price * item.quantity, 0), [cartLines]);
  const currentShippingCost = checkout.delivery === deliveryMethods[1] && cartSubtotal < freeShippingThreshold ? shippingCost : 0;
  const cartTotal = cartSubtotal + currentShippingCost;
  const missingSizes = useMemo(() => cartLines.filter((item) => !item.size), [cartLines]);
  const missingColors = useMemo(() => cartLines.filter((item) => item.colors?.length > 0 && !item.color), [cartLines]);

  function authHeaders() {
    return userToken ? { Authorization: `Bearer ${userToken}` } : {};
  }

  function updateCheckout(field, value) {
    resetCheckoutStatus();
    setCheckout((currentCheckout) => ({ ...currentCheckout, [field]: value }));
  }

  function syncCheckoutEmail(email) {
    setCheckout((currentCheckout) => ({ ...currentCheckout, email: email || currentCheckout.email }));
  }

  async function submitOrder(event) {
    event.preventDefault();

    if (!cartLines.length) {
      setCheckoutStatus({ state: "error", message: "Agrega al menos un producto para finalizar la compra." });
      return;
    }

    if (missingSizes.length) {
      setCheckoutStatus({ state: "error", message: "Elegi el talle de cada producto antes de finalizar." });
      return;
    }

    if (missingColors.length) {
      setCheckoutStatus({ state: "error", message: "Elegi el color de cada producto antes de finalizar." });
      return;
    }

    if (checkoutStep === 1) {
      setCheckoutStatus({ state: "idle", message: "" });
      setCheckoutStep(2);
      return;
    }

    if (!checkout.name || !checkout.phone || !checkout.email) {
      setCheckoutStatus({ state: "error", message: "Completa nombre, telefono y email registrado." });
      return;
    }

    if (!userToken || !userAccount?.email || userAccount.email !== checkout.email.trim().toLowerCase()) {
      setCheckoutStatus({ state: "error", message: "Inicia sesion con el mismo email antes de finalizar la compra." });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(checkout.email)) {
      setCheckoutStatus({ state: "error", message: "Revisa el email para poder enviarte la confirmacion." });
      return;
    }

    if (!/^[0-9\s()+-]{8,}$/.test(checkout.phone)) {
      setCheckoutStatus({ state: "error", message: "Revisa el telefono o WhatsApp. Necesitamos al menos 8 numeros." });
      return;
    }

    if (checkoutStep === 2) {
      setCheckoutStatus({ state: "idle", message: "" });
      setCheckoutStep(3);
      return;
    }

    setCheckoutStatus({ state: "loading", message: "Estamos preparando tu pedido..." });

    try {
      const { response, data } = await createOrder({
        customer: checkout,
        items: cartLines.map((item) => ({ id: item.id, quantity: item.quantity, size: item.size, color: item.color })),
        totals: {
          subtotal: cartSubtotal,
          shipping: currentShippingCost,
          total: cartTotal,
        },
      }, {
        headers: authHeaders(),
      });

      if (!response.ok) {
        throw new Error(data.message || orderMessages.createError);
      }

      setCart([]);
      setCheckout(emptyCheckout);
      await loadProducts();
      if (data.adminWhatsAppUrl) {
        window.open(data.adminWhatsAppUrl, "_blank", "noopener,noreferrer");
      }
      setCheckoutStatus({ state: "success", message: orderMessages.success.replace("{orderId}", data.order.id) });
      if (checkout.email && userAccount?.email === checkout.email.toLowerCase()) {
        const { response: userResponse, data: userData } = await getUserAccount(userAccount.email, { headers: authHeaders() });
        if (userResponse.ok) {
          setUserAccount(userData.user);
        }
      }
    } catch (error) {
      setCheckoutStatus({ state: "error", message: `${error.message} ${orderMessages.apiErrorSuffix}` });
    }
  }

  function buildWhatsAppMessage() {
    const lines = cartLines.map((item) => `- ${item.name} talle ${item.size || "sin talle"}${item.color ? ` color ${item.color}` : ""} x${item.quantity}: ${formatter.format(item.price * item.quantity)}`);
    return encodeURIComponent([
      `Hola ${storeName}, quiero finalizar mi compra:`,
      ...lines,
      `Subtotal: ${formatter.format(cartSubtotal)}`,
      `Envio: ${currentShippingCost ? formatter.format(currentShippingCost) : "Sin cargo"}`,
      `Total: ${formatter.format(cartTotal)}`,
      `Entrega: ${checkout.delivery}${checkout.address ? ` - ${checkout.address}` : ""}`,
      `Pago: ${checkout.payment}`,
      `Nombre: ${checkout.name}`,
      `Telefono: ${checkout.phone}`,
    ].join("\n"));
  }

  return {
    buildWhatsAppMessage,
    cartSubtotal,
    cartTotal,
    checkout,
    checkoutStatus,
    checkoutStep,
    currentShippingCost,
    setCheckoutStep,
    submitOrder,
    syncCheckoutEmail,
    updateCheckout,
  };
}
