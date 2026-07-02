import { getStoreName } from "../config/storeConfig.js";

export function notifyAdminOrder(order) {
  const message = buildOrderPreparationMessage(order);

  return {
    sent: false,
    provider: "manual",
    fallbackUrl: buildAdminWhatsAppUrl(message),
  };
}

export function buildOrderPreparationMessage(order) {
  if (!order) {
    return "";
  }

  const lines = [
    `Nuevo pedido ${getStoreName()}: ${order.id}`,
    `Cliente: ${order.customer?.name || ""}`,
    `Telefono: ${order.customer?.phone || ""}`,
    `Email: ${order.customer?.email || ""}`,
    `Entrega: ${order.fulfillment?.delivery || ""}${order.fulfillment?.address ? ` - ${order.fulfillment.address}` : ""}`,
    `Pago: ${order.payment || ""}`,
    "Productos:",
    ...(order.items || []).map((item) => `- ${item.name} talle ${item.size}${item.color ? ` color ${item.color}` : ""} x${item.quantity}`),
    `Total: $ ${Number(order.total || 0).toLocaleString("es-AR")}`,
    order.notes ? `Notas: ${order.notes}` : "",
  ].filter(Boolean);

  return lines.join("\n");
}

function buildAdminWhatsAppUrl(message) {
  const adminNumber = getAdminNumber();

  if (!adminNumber || !message) {
    return "";
  }

  return `https://wa.me/${normalizePhoneNumber(adminNumber)}?text=${encodeURIComponent(message)}`;
}

function getAdminNumber() {
  return process.env.ADMIN_WHATSAPP_NUMBER || process.env.VITE_WHATSAPP_NUMBER || "";
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}
