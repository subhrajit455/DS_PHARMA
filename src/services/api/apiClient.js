import axios from "axios";
import toast from "react-hot-toast";

const REQUEST_TIMEOUT = 15000;
const MAX_RETRIES = 2;

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://192.168.0.123:5000/api",
  timeout: REQUEST_TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

const isCancelError = (error) => {
  return (
    axios.isCancel(error) ||
    error.name === "CanceledError" ||
    error.code === "ERR_CANCELED"
  );
};

const isNetworkError = (error) => {
  return (
    !error.response &&
    !isCancelError(error) &&
    (error.code === "ECONNABORTED" ||
      error.code === "ERR_NETWORK" ||
      error.message === "Network Error")
  );
};

const isRetriableError = (error) => {
  if (isCancelError(error)) return false;
  if (isNetworkError(error)) return true;
  if (!error.response) return true;

  const status = error.response.status;
  return status >= 500 || status === 429;
};

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    config.metadata = { startTime: Date.now() };

    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`, {
        params: config.params,
        data: config.data,
      });
    }

    return config;
  },
  (error) => {
    console.error("[API] Request setup failed:", error);
    return Promise.reject(error);
  },
);

// ============================================================
// RESPONSE INTERCEPTOR
// ============================================================
apiClient.interceptors.response.use(
  (response) => {
    // Log response time in development
    if (import.meta.env.DEV && response.config.metadata) {
      const duration = Date.now() - response.config.metadata.startTime;
      console.log(
        `[API] ✓ ${response.config.method?.toUpperCase()} ${response.config.url} (${duration}ms)`,
      );
    }

    return response;
  },
  (error) => {
    // CRITICAL: Handle CanceledError properly (DO NOT show toast)
    if (isCancelError(error)) {
      if (import.meta.env.DEV) {
        console.log(`[API] Request canceled: ${error.config?.url}`);
      }
      return Promise.reject(error); // Silent rejection
    }

    // Handle network errors (server unreachable)
    if (isNetworkError(error)) {
      console.error("[API] Network error:", error.config?.url);

      // Show toast only once per network failure
      if (!error.config?._networkErrorShown) {
        toast.error(
          "Unable to connect to server. Please check your connection.",
        );
        if (error.config) error.config._networkErrorShown = true;
      }

      return Promise.reject({
        ...error,
        isNetworkError: true,
        retriable: true,
      });
    }

    // Handle timeout errors
    if (error.code === "ECONNABORTED" && error.message.includes("timeout")) {
      console.error("[API] Request timeout:", error.config?.url);
      toast.error("Request timed out. Please try again.");

      return Promise.reject({
        ...error,
        isTimeout: true,
        retriable: true,
      });
    }

    // Handle HTTP errors with response
    if (error.response) {
      const { status, data } = error.response;
      const url = error.config?.url;

      if (import.meta.env.DEV) {
        console.error(`[API] ✗ ${status} ${url}`, {
          error: data,
          config: error.config,
        });
      }

      switch (status) {
        case 401:
          localStorage.removeItem("authToken");
          toast.error("Session expired. Please login again.");
          break;

        case 403:
          toast.error("Access denied. You don't have permission.");
          break;

        case 404:
          if (import.meta.env.DEV) {
            console.warn(`[API] Resource not found: ${url}`);
          }
          break;

        case 429:
          toast.error("Too many requests. Please slow down.");
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Server errors - show generic message
          toast.error("Server error. Please try again later.");
          break;

        default: {
          // Other errors - use backend message if available
          const message = data?.message || data?.error || "An error occurred";
          toast.error(message);
          break;
        }
      }

      // Add retriable flag
      error.retriable = isRetriableError(error);
    }

    return Promise.reject(error);
  },
);

// ============================================================
// HELPER: Create cancelable request
// ============================================================
export const createCancelableRequest = (requestFn) => {
  const controller = new AbortController();

  const promise = requestFn(controller.signal);

  return {
    promise,
    cancel: () => controller.abort(),
  };
};

// ============================================================
// EXPORT
// ============================================================
export default apiClient;
export { isCancelError, isNetworkError, isRetriableError };
