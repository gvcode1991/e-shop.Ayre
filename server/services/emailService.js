import { getPublicAppUrl, getStoreName } from "../config/storeConfig.js";

const resendApiUrl = "https://api.resend.com";

function cleanEnvValue(value) {
  return String(value || "").trim().replace(/^["']|["']$/g, "");
}

function getResendApiKey() {
  return cleanEnvValue(process.env.RESEND_API_KEY);
}

function getResendFrom() {
  return cleanEnvValue(process.env.RESEND_FROM);
}

function getSafeApiKeyInfo() {
  const apiKey = getResendApiKey();

  return {
    length: apiKey.length,
    prefix: apiKey.slice(0, 3),
    suffix: apiKey.length > 6 ? apiKey.slice(-4) : "",
  };
}

function getResendHeaders() {
  return {
    Authorization: `Bearer ${getResendApiKey()}`,
    "Content-Type": "application/json",
  };
}

async function readResendResponse(response) {
  const text = await response.text();

  if (!text) {
    return {};
  }

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

export function isEmailConfigured() {
  return Boolean(getResendApiKey() && getResendFrom());
}

export async function verifyEmailConnection() {
  if (!isEmailConfigured()) {
    return { ok: false, configured: false, reason: "missing-resend", apiKey: getSafeApiKeyInfo() };
  }

  return {
    ok: true,
    configured: true,
    provider: "resend",
    message: "Resend esta configurado. El envio real se valida al crear la cuenta.",
    apiKey: getSafeApiKeyInfo(),
  };
}

export async function sendAccountConfirmationEmail(user, token) {
  if (!isEmailConfigured()) {
    return { sent: false, reason: "missing-resend" };
  }

  const storeName = getStoreName();
  const appUrl = getPublicAppUrl();
  const confirmUrl = `${appUrl}/api/users/confirm/${token}`;
  const response = await fetch(`${resendApiUrl}/emails`, {
    method: "POST",
    headers: getResendHeaders(),
    body: JSON.stringify({
      from: getResendFrom(),
      to: user.email,
      subject: `Confirma tu cuenta ${storeName}`,
      text: `Hola ${user.name}, confirma tu cuenta para poder comprar en ${storeName}: ${confirmUrl}`,
      html: `
        <div style="font-family:Arial,sans-serif;line-height:1.5;color:#241913">
          <h1>Confirma tu cuenta ${storeName}</h1>
          <p>Hola ${user.name}, necesitamos confirmar tu email para activar tu cuenta y habilitar tus compras.</p>
          <p><a href="${confirmUrl}" style="display:inline-block;padding:12px 18px;border-radius:999px;background:#9b7350;color:white;text-decoration:none">Activar cuenta</a></p>
          <p>Si el boton no funciona, copia este enlace:</p>
          <p>${confirmUrl}</p>
        </div>
      `,
    }),
    signal: AbortSignal.timeout(15000),
  });
  const data = await readResendResponse(response);

  if (!response.ok) {
    const error = new Error(data.message || data.error || "Resend no pudo enviar el email.");
    error.status = response.status;
    error.provider = "resend";
    throw error;
  }

  return { sent: true, provider: "resend", id: data.id };
}
