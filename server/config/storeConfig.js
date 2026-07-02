function slugStoreName() {
  return getStoreName().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function getStoreName() {
  return process.env.STORE_NAME || "Demo Store";
}

export function getServiceName() {
  return process.env.SERVICE_NAME || `${slugStoreName()}-api`;
}

export function getPublicAppUrl() {
  return process.env.PUBLIC_APP_URL || "http://127.0.0.1:3001";
}

export function getMongoDbName() {
  return process.env.MONGODB_DB_NAME || `${slugStoreName()}-shop`;
}

export function getCloudinaryFolder() {
  return process.env.CLOUDINARY_FOLDER || `${slugStoreName()}-products`;
}

export function getDefaultAppSecret() {
  return `${slugStoreName()}-dev-secret-change-me`;
}

