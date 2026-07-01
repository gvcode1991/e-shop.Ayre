const apiUrl = import.meta.env.VITE_API_URL || "/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${apiUrl}${path}`, options);
  const data = response.status === 204 ? {} : await response.json();
  return { response, data };
}

export function apiGet(path, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "GET",
  });
}

export function apiPost(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "POST",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    body: JSON.stringify(body),
  });
}

export function apiPut(path, body, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "PUT",
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    body: JSON.stringify(body),
  });
}

export function apiDelete(path, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "DELETE",
  });
}

export function apiUpload(path, formData, options = {}) {
  return apiRequest(path, {
    ...options,
    method: "POST",
    body: formData,
  });
}
