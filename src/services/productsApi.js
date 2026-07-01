import { apiDelete, apiGet, apiPost, apiPut } from "./apiClient";

export function loadProducts() {
  return apiGet("/products");
}

export function createProduct(product, options = {}) {
  return apiPost("/products", product, options);
}

export function updateProduct(id, product, options = {}) {
  return apiPut(`/products/${id}`, product, options);
}

export function deleteProduct(id, options = {}) {
  return apiDelete(`/products/${id}`, options);
}
