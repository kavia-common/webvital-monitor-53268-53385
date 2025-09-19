/**
 * Authentication API helpers.
 */
import api from "./client";

// PUBLIC_INTERFACE
export async function login(email, password) {
  /** Login with email/password and store access token */
  const { data } = await api.post("/api/v1/auth/login", { email, password });
  if (data?.access_token) {
    localStorage.setItem("access_token", data.access_token);
  }
  return data;
}

// PUBLIC_INTERFACE
export async function register(email, password, name) {
  /** Register a new user and persist access token if provided by backend */
  const { data } = await api.post("/api/v1/auth/register", {
    email,
    password,
    name,
  });
  // Some backends return access_token on registration
  if (data?.access_token) {
    localStorage.setItem("access_token", data.access_token);
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
