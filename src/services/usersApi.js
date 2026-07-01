import { apiGet, apiPost, apiPut } from "./apiClient";

export function registerUser(data) {
  return apiPost("/users", data);
}

export function loginUser(credentials) {
  return apiPost("/auth/login", credentials);
}

export function getUserAccount(email, options = {}) {
  return apiGet(`/users/${encodeURIComponent(email)}`, options);
}

export function updateFavorite(email, productId, data, options = {}) {
  return apiPut(`/users/${encodeURIComponent(email)}/favorites/${productId}`, data, options);
}

export function updatePreferences(email, data, options = {}) {
  return apiPut(`/users/${encodeURIComponent(email)}/preferences`, data, options);
}
