// src/services/api.js
import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export const getImageUrl = (imagePath) => {
  if (!imagePath) return `${window.location.origin}/api/placeholder/400/300`;
  if (imagePath.startsWith("http")) return imagePath;
  if (imagePath.startsWith("data:")) return imagePath;

  // Remove /api from the base URL for images
  const baseUrl = API_BASE_URL.replace("/api", "");
  return `${baseUrl}/uploads/${imagePath}`;
};
// Auth APIs
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getCurrentUser: () => api.get("/auth/me"),
};

// Recipe APIs
export const recipeAPI = {
  // Get all public recipes
  getAllRecipes: (params) => api.get("/recipes", { params }),

  // Get single recipe
  getRecipe: (id) => api.get(`/recipes/${id}`),

  // Create new recipe
  createRecipe: (formData) => {
    return api.post("/recipes", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  // Get user's recipes (requires auth)
  getMyRecipes: () => api.get("/my-recipes"),

  // Search recipes
  searchRecipes: (query) => api.get(`/recipes/search?q=${query}`),

  // Get recipes by category
  getRecipesByCategory: (category) => api.get(`/recipes/category/${category}`),
};

export default api;
