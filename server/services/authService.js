import crypto from "node:crypto";

import { getDefaultAppSecret } from "../config/storeConfig.js";

const tokenTtlMs = 1000 * 60 * 60 * 24 * 7;

function getSecret() {
  return process.env.APP_SECRET || process.env.ADMIN_API_KEY || getDefaultAppSecret();
}

function base64UrlEncode(value) {
  return Buffer.from(JSON.stringify(value)).toString("base64url");
}

function base64UrlDecode(value) {
  return JSON.parse(Buffer.from(value, "base64url").toString("utf8"));
}

function sign(value) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("base64url");
}

export function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.scryptSync(String(password), salt, 64).toString("hex");
  return { hash, salt };
}

export function verifyPassword(password, salt, expectedHash) {
  if (!password || !salt || !expectedHash) {
    return false;
  }

  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expectedHash, "hex"));
}

export function createSessionToken(user) {
  const payload = {
    sub: user.email,
    name: user.name,
    role: user.role || "user",
    iat: Date.now(),
    exp: Date.now() + tokenTtlMs,
  };
  const encodedPayload = base64UrlEncode(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function createAdminSessionToken(email) {
  const payload = {
    sub: email,
    role: "admin",
    iat: Date.now(),
    exp: Date.now() + tokenTtlMs,
  };
  const encodedPayload = base64UrlEncode(payload);
  return `${encodedPayload}.${sign(encodedPayload)}`;
}

export function verifySessionToken(token) {
  const [encodedPayload, signature] = String(token || "").split(".");

  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return null;
  }

  const payload = base64UrlDecode(encodedPayload);

  if (!payload?.sub || Date.now() > payload.exp) {
    return null;
  }

  return payload;
}
