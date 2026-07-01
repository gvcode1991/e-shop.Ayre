import { apiGet, apiPost } from "./apiClient";

export function createOrder(orderData, options = {}) {
  return apiPost("/orders", orderData, options);
}

export function listOrders(options = {}) {
  return apiGet("/orders", options);
}
