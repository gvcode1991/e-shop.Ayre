import { connectToDatabase } from "../db/mongo.js";
import { User } from "../models/User.js";

const memoryUsers = new Map();

export async function registerUser(userData) {
  const user = normalizeUser(userData);
  const database = await connectToDatabase();

  if (!database.connected) {
    const currentUser = memoryUsers.get(user.email) || { favorites: [], purchases: [] };
    const savedUser = { ...currentUser, ...user };
    memoryUsers.set(user.email, savedUser);
    return savedUser;
  }

  const savedUser = await User.findOneAndUpdate(
    { email: user.email },
    { $set: user, $setOnInsert: { favorites: [], purchases: [] } },
    { upsert: true, returnDocument: "after", runValidators: true },
  );

  return savedUser.toJSON();
}

export async function getUserByEmail(email) {
  const normalizedEmail = normalizeEmail(email);
  const database = await connectToDatabase();

  if (!database.connected) {
    return memoryUsers.get(normalizedEmail) || null;
  }

  return User.findOne({ email: normalizedEmail }).populate("purchases");
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
    return user;
  }

  const update = isFavorite ? { $addToSet: { favorites: productId } } : { $pull: { favorites: productId } };
  return User.findOneAndUpdate({ email: normalizedEmail }, update, { returnDocument: "after" });
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
