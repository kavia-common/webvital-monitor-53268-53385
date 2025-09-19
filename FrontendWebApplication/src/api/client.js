/**
 * Axios client configured for the backend REST API with auth interceptors.
 * Uses REACT_APP_API_BASE_URL env for base URL.
 */
import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "",
  withCredentials: false,
});

// Inject access token if present
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 by attempting refresh, then redirect to login if fails
let refreshing = false;
let subscribers = [];

function onRefreshed(token) {
  subscribers.forEach((cb) => cb(token));
  subscribers = [];
}

function addSubscriber(callback) {
  subscribers.push(callback);
}

api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { response, config } = error || {};
    if (response && response.status === 401 && !config.__isRetryRequest) {
      if (refreshing) {
        return new Promise((resolve) => {
          addSubscriber((token) => {
            config.headers.Authorization = `Bearer ${token}`;
            config.__isRetryRequest = true;
            resolve(api(config));
          });
        });
      }
      refreshing = true;
      try {
        const rf = await axios.post(
          `${api.defaults.baseURL}/api/v1/auth/refresh`,
          {}
        );
        const newToken = rf?.data?.access_token || rf?.data?.token || null;
        if (newToken) {
          localStorage.setItem("access_token", newToken);
          onRefreshed(newToken);
          const retryCfg = { ...config, __isRetryRequest: true };
          retryCfg.headers.Authorization = `Bearer ${newToken}`;
          return api(retryCfg);
        }
      } catch (e) {
        // Clear tokens and redirect to login
        localStorage.removeItem("access_token");
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
      } finally {
        refreshing = false;
      }
    }
    return Promise.reject(error);
  }
);

export default api;
