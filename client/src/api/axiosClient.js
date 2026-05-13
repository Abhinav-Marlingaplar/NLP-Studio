import axios from "axios";

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});

// ---------- REQUEST INTERCEPTOR ----------
api.interceptors.request.use(
  (config) => {
    // ✅ Read from sessionStorage instead of localStorage
    // The token itself isn't stored — but we can get it from AuthContext
    // via a helper. For now, use sessionStorage flag to know user is logged in
    // and rely on the response interceptor to refresh if 401 hits.
    
    // ✅ Get token from the module-level getter we'll set from AuthContext
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Module-level token store — set by AuthContext after login/refresh
// This keeps the token in memory only, never in any storage
let _accessToken = null;

export const setAccessToken = (token) => { _accessToken = token; };
export const getAccessToken = () => _accessToken;

let isRefreshing = false;
let refreshQueue = [];

// ---------- RESPONSE INTERCEPTOR ----------
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const refreshResponse = await api.post("/auth/refresh");
        const newToken = refreshResponse.data.accessToken;

        // ✅ Store in memory only, not localStorage
        setAccessToken(newToken);

        refreshQueue.forEach((p) => p.resolve(newToken));
        refreshQueue = [];
        isRefreshing = false;

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest);

      } catch (refreshError) {
        refreshQueue.forEach((p) => p.reject(refreshError));
        refreshQueue = [];
        isRefreshing = false;

        // ✅ Clear sessionStorage and redirect to landing, not /login
        setAccessToken(null);
        sessionStorage.removeItem("isLoggedIn");
        sessionStorage.removeItem("authUser");
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;