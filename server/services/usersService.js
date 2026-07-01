import { connectToDatabase } from "../db/mongo.js";
import { User } from "../models/User.js";
import crypto from "node:crypto";
import { hashPassword, verifyPassword } from "./authService.js";

const memoryUsers = new Map();

export async function registerUser(userData) {
  const user = normalizeUser(userData);
  const password = String(userData.password || "");

  if (password.length < 8) {
    throw new Error("La contrasena debe tener al menos 8 caracteres.");
  }

  const passwordData = hashPassword(password);
  const confirmationToken = crypto.randomBytes(24).toString("hex");
  const database = await connectToDatabase();

  if (!database.connected) {
    const currentUser = memoryUsers.get(user.email);

    if (currentUser) {
      return { ...sanitizeUser(currentUser), alreadyExists: true };
    }

    const savedUser = { favorites: [], purchases: [], emailVerified: false, role: "user", ...user, passwordHash: passwordData.hash, passwordSalt: passwordData.salt, confirmationToken, confirmationSentAt: new Date().toISOString() };
    memoryUsers.set(user.email, savedUser);
    return savedUser;
  }

  const existingUser = await User.findOne({ email: user.email }).populate("purchases");

  if (existingUser) {
    return { ...existingUser.toJSON(), alreadyExists: true };
  }

  const savedUser = await User.create({
    ...user,
    passwordHash: passwordData.hash,
    passwordSalt: passwordData.salt,
    confirmationToken,
    confirmationSentAt: new Date(),
    favorites: [],
    purchases: [],
    emailVerified: false,
    role: "user",
  });

  return { ...savedUser.toJSON(), confirmationToken };
}

export async function deletePendingUser(email) {
  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) {
    return false;
  }

  const database = await connectToDatabase();

  if (!database.connected) {
    const user = memoryUsers.get(normalizedEmail);

    if (!user || user.emailVerified) {
      return false;
    }

    return memoryUsers.delete(normalizedEmail);
  }

  const result = await User.deleteOne({ email: normalizedEmail, emailVerified: false });
  return result.deletedCount > 0;
}

export async function authenticateUser(email, password) {
  const normalizedEmail = normalizeEmail(email);
  const database = await connectToDatabase();

  if (!database.connected) {
    const user = memoryUsers.get(normalizedEmail);
    return user && verifyPassword(password, user.passwordSalt, user.passwordHash) ? sanitizeUser(user) : null;
  }

  const user = await User.findOne({ email: normalizedEmail }).populate("purchases");

  if (!user || !verifyPassword(password, user.passwordSalt, user.passwordHash)) {
    return null;
  }

  return user.toJSON();
}

export async function listUsers() {
  const database = await connectToDatabase();

  if (!database.connected) {
    return [...memoryUsers.values()].map((user) => sanitizeUser(user));
  }

  const users = await User.find().sort({ createdAt: -1 });
  return users.map((user) => user.toJSON());
}

export async function updateUserRole(email, role) {
  const normalizedEmail = normalizeEmail(email);
  const normalizedRole = String(role || "").trim().toLowerCase();

  if (!["user", "admin"].includes(normalizedRole)) {
    throw new Error("Role invalido.");
  }

  const database = await connectToDatabase();

  if (!database.connected) {
    const user = memoryUsers.get(normalizedEmail);
    if (!user) return null;
    user.role = normalizedRole;
    memoryUsers.set(normalizedEmail, user);
    return sanitizeUser(user);
  }

  const user = await User.findOneAndUpdate(
    { email: normalizedEmail },
    { $set: { role: normalizedRole } },
    { returnDocument: "after", runValidators: true },
  ).populate("purchases");

  return user ? user.toJSON() : null;
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
