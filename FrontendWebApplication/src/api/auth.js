/**
 * Authentication API helpers.
 */
import api from "./client";

/**
 * Extract a human-readable error message from various backend error shapes.
 */
function extractErrorMessage(error, fallback = "Operation failed") {
  try {
    const resp = error?.response?.data;
    if (!resp) return fallback;
    if (typeof resp === "string") return resp;
    if (resp.message) return resp.message;
    if (resp.error) return resp.error;
    if (resp.detail) return resp.detail;
    if (Array.isArray(resp.errors) && resp.errors.length) {
      const first = resp.errors[0];
      if (typeof first === "string") return first;
      if (first?.msg) return first.msg;
      if (first?.message) return first.message;
    }
    return JSON.stringify(resp);
  } catch {
    return fallback;
  }
}

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Login with email/password and store access token */
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  const token = data?.access_token || data?.token || data?.jwt || null;
  if (token) {
    localStorage.setItem("access_token", token);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function register(email, password, name) {
  /** Register a new user and persist access token if provided by backend */
  // Send common optional fields some backends require to avoid 400s
  const payload = {
    email,
    password,
    name,
    // Common aliases used by some backends:
    passwordConfirmation: password,
    password_confirmation: password,
  };

  const { data } = await api.post("/api/v1/auth/register", payload);

  // Normalize token across different backends
  const token = data?.access_token || data?.token || data?.jwt || null;
  if (token) {
    localStorage.setItem("access_token", token);
  }

  return data;
}

// PUBLIC_INTERFACE
export async function me() {
  /** Get current user profile */
  const { data } = await api.get("/api/v1/auth/me");
  return data;
}

// PUBLIC_INTERFACE
export function logout() {
  /** Remove token and redirect to login */
  localStorage.removeItem("access_token");
}

export { extractErrorMessage };
