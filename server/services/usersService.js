import { connectToDatabase } from "../db/mongo.js";
import { User } from "../models/User.js";
import crypto from "node:crypto";

const memoryUsers = new Map();

export async function registerUser(userData) {
  const user = normalizeUser(userData);
  const confirmationToken = crypto.randomBytes(24).toString("hex");
  const database = await connectToDatabase();

  if (!database.connected) {
    const currentUser = memoryUsers.get(user.email) || { favorites: [], purchases: [], emailVerified: false };
    const savedUser = { ...currentUser, ...user, confirmationToken, confirmationSentAt: new Date().toISOString() };
    memoryUsers.set(user.email, savedUser);
    return savedUser;
  }

  const savedUser = await User.findOneAndUpdate(
    { email: user.email },
    {
      $set: { ...user, confirmationToken, confirmationSentAt: new Date() },
      $setOnInsert: { favorites: [], purchases: [], emailVerified: false },
    },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  return { ...savedUser.toJSON(), confirmationToken };
}

export async function confirmUserEmail(token) {
  const normalizedToken = String(token || "").trim();

  if (!normalizedToken) {
    return null;
  }

  const database = await connectToDatabase();

  if (!database.connected) {
    const user = [...memoryUsers.values()].find((item) => item.confirmationToken === normalizedToken);
    if (!user) return null;
    user.emailVerified = true;
    user.confirmationToken = "";
    memoryUsers.set(user.email, user);
    return user;
  }

  const user = await User.findOneAndUpdate(
    { confirmationToken: normalizedToken },
    { $set: { emailVerified: true }, $unset: { confirmationToken: "", confirmationSentAt: "" } },
    { returnDocument: "after" },
  );

  return user ? user.toJSON() : null;
}

export async function isVerifiedUserEmail(email) {
  const user = await getUserByEmail(email);
  return Boolean(user?.emailVerified);
}

export async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const database = await connectToDatabase();

  if (!database.connected) {
    return sanitizeUser(memoryUsers.get(normalizedEmail)) || null;
  }

  const user = await User.findOne({ email: normalizedEmail }).populate("purchases");
  return user ? user.toJSON() : null;
}

export async function setFavorite(email, productId, isFavorite) {
  const normalizedEmail = normalizeEmail(email);
  const database = await connectToDatabase();

  if (!database.connected) {
    const user = memoryUsers.get(normalizedEmail);
    if (!user) return null;
    const favorites = new Set(user.favorites || []);
    if (isFavorite) favorites.add(productId);
    else favorites.delete(productId);
    user.favorites = [...favorites];
    memoryUsers.set(normalizedEmail, user);
    return sanitizeUser(user);
  }

  const update = isFavorite ? { $addToSet: { favorites: productId } } : { $pull: { favorites: productId } };
  return User.findOneAndUpdate({ email: normalizedEmail }, update, { returnDocument: "after" });
}

export async function updateUserPreferences(email, preferences) {
  const normalizedEmail = normalizeEmail(email);
  const acceptsMarketing = Boolean(preferences.acceptsMarketing);
  const database = await connectToDatabase();

  if (!database.connected) {
    const user = memoryUsers.get(normalizedEmail);
    if (!user) return null;
    user.acceptsMarketing = acceptsMarketing;
    memoryUsers.set(normalizedEmail, user);
    return sanitizeUser(user);
  }

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { acceptsMarketing } },
    { returnDocument: "after" },
  ).populate("purchases");

  return user ? user.toJSON() : null;
}

export async function attachPurchaseToUser(email, orderId) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail || !orderId) {
    return null;
  }

  const database = await connectToDatabase();

  if (!database.connected) {
    const user = memoryUsers.get(normalizedEmail);
    if (!user) return null;
    user.purchases = [...(user.purchases || []), orderId];
    memoryUsers.set(normalizedEmail, user);
    return user;
  }

  return User.findOneAndUpdate({ email: normalizedEmail }, { $addToSet: { purchases: orderId } }, { returnDocument: "after" });
}

function normalizeUser(userData) {
  const name = String(userData.name || "").trim();
  const email = normalizeEmail(userData.email);

  if (!name || !email) {
    throw new Error("Nombre y email son obligatorios para registrarse.");
  }

  return {
    name,
    email,
    phone: String(userData.phone || "").trim(),
    acceptsMarketing: Boolean(userData.acceptsMarketing ?? true),
  };
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function sanitizeUser(user) {
  if (!user) return null;
  const { confirmationToken, confirmationSentAt, ...publicUser } = user;
  return publicUser;
}
