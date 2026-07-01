import { apiGet, apiPost, apiPut } from "./apiClient";

export function loginAdmin(credentials) {
  return apiPost("/admin/login", credentials);
}

export function validateAdminSession(options = {}) {
  return apiGet("/admin/session", options);
}

export function listAdminUsers(options = {}) {
  return apiGet("/admin/users", options);
}

export function updateUserRole(email, role, options = {}) {
  return apiPut(`/admin/users/${encodeURIComponent(email)}/role`, { role }, options);
}

export function getEmailHealth(options = {}) {
  return apiGet("/health/email", options);
}
