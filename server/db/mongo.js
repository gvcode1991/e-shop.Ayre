import mongoose from "mongoose";

import { getMongoDbName } from "../config/storeConfig.js";

let connectionPromise = null;
const isProduction = process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

export function hasMongoUri() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectToDatabase() {
  if (!hasMongoUri()) {
    if (isProduction) {
      throw new Error("MongoDB no esta configurado en produccion.");
    }

    return { connected: false, reason: "missing-uri" };
  }

  if (mongoose.connection.readyState === 1) {
    return { connected: true };
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: getMongoDbName(),
      serverSelectionTimeoutMS: 8000,
    });
  }

  try {
    await connectionPromise;
    return { connected: true };
  } catch (error) {
    if (isProduction) {
      connectionPromise = null;
      throw error;
    }

    console.warn(`MongoDB no disponible, usando memoria temporal: ${error.message}`);
    connectionPromise = null;
    return { connected: false, reason: "connection-failed" };
  }
}
