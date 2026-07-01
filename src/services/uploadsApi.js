import { apiUpload } from "./apiClient";

export function uploadProductImage(formData, options = {}) {
  return apiUpload("/uploads/products", formData, options);
}
