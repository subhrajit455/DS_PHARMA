import axios from "axios";

// A lightweight API client for website-facing endpoints.
// This mirrors the base URL used by the main apiClient, but is kept separate
// so consumers can explicitly request "website" content (e.g. /getheading).
const WEBSITE_API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://192.168.0.123:5000";

const websiteApi = axios.create({
  baseURL: WEBSITE_API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default websiteApi;
