import mongoose from "mongoose";

let connectionPromise = null;

export function hasMongoUri() {
  return Boolean(process.env.MONGODB_URI);
}

export async function connectToDatabase() {
  if (!hasMongoUri()) {
    return { connected: false, reason: "missing-uri" };
  }

  if (mongoose.connection.readyState === 1) {
    return { connected: true };
  }

  if (!connectionPromise) {
    connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      dbName: process.env.MONGODB_DB_NAME || "ayre-shop",
    });
  }

  await connectionPromise;
  return { connected: true };
}
