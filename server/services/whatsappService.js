const graphVersion = process.env.META_WHATSAPP_GRAPH_VERSION || "v20.0";

export function isWhatsAppAutomationConfigured() {
  return getProvider() !== "manual";
}

export async function notifyAdminOrder(order) {
  const message = buildOrderPreparationMessage(order);
  const fallbackUrl = buildAdminWhatsAppUrl(message);
  const provider = getProvider();

  if (!order || !message || provider === "manual") {
    return { sent: false, provider: "manual", fallbackUrl, reason: "not-configured" };
  }

  try {
    if (provider === "twilio") {
      const result = await sendWithTwilio(message);
      return { sent: true, provider, fallbackUrl, id: result.sid || result.id || "" };
    }

    if (provider === "meta") {
      const result = await sendWithMeta(message);
      const messageId = result.messages?.[0]?.id || "";
      return { sent: true, provider, fallbackUrl, id: messageId };
    }
  } catch (error) {
    console.warn(`No pudimos enviar WhatsApp automatico (${provider}): ${error.message}`);
    return { sent: false, provider, fallbackUrl, reason: "send-failed", message: error.message };
  }

  return { sent: false, provider: "manual", fallbackUrl, reason: "not-configured" };
}

export function buildOrderPreparationMessage(order) {
  if (!order) {
    return "";
  }

  const lines = [
    `Nuevo pedido AyRe: ${order.id}`,
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

function getProvider() {
  const configuredProvider = String(process.env.WHATSAPP_PROVIDER || "").trim().toLowerCase();

  if (configuredProvider === "twilio" && hasTwilioConfig()) return "twilio";
  if (configuredProvider === "meta" && hasMetaConfig()) return "meta";
  if (hasTwilioConfig()) return "twilio";
  if (hasMetaConfig()) return "meta";
  return "manual";
}

function hasTwilioConfig() {
  return Boolean(process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_WHATSAPP_FROM && getAdminNumber());
}

function hasMetaConfig() {
  return Boolean(process.env.META_WHATSAPP_TOKEN && process.env.META_WHATSAPP_PHONE_NUMBER_ID && getAdminNumber());
}

async function sendWithTwilio(message) {
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const body = new URLSearchParams({
    From: formatTwilioWhatsAppNumber(process.env.TWILIO_WHATSAPP_FROM),
    To: formatTwilioWhatsAppNumber(getAdminNumber()),
    Body: message,
  });

  const response = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
  });

  return readProviderResponse(response);
}

async function sendWithMeta(message) {
  const response = await fetch(`https://graph.facebook.com/${graphVersion}/${process.env.META_WHATSAPP_PHONE_NUMBER_ID}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.META_WHATSAPP_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      to: normalizePhoneNumber(getAdminNumber()),
      type: "text",
      text: {
        preview_url: false,
        body: message,
      },
    }),
  });

  return readProviderResponse(response);
}

async function readProviderResponse(response) {
  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    const message = data.message || data.error?.message || data.more_info || "Error enviando WhatsApp.";
    throw new Error(message);
  }

  return data;
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

function formatTwilioWhatsAppNumber(value) {
  const normalized = normalizePhoneNumber(value);
  return value?.startsWith("whatsapp:") ? value : `whatsapp:+${normalized}`;
}

function normalizePhoneNumber(value) {
  return String(value || "").replace(/[^\d]/g, "");
}
