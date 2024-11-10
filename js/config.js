export const BASE_URL = "https://api.themoviedb.org/3";
export const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";

// Using API key authentication for simplicity
export const fetchOptions = {
  method: "GET",
  headers: {
    accept: "application/json",
  },
};

// Append API key to all URLs instead of using Authorization header
export function getApiUrl(endpoint) {
  return `${endpoint}${
    endpoint.includes("?") ? "&" : "?"
  }api_key=9ac18f83853be23c4144ed45bc63c9c6`;
}
