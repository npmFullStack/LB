// src/utils/imageUtils.js
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return "/api/placeholder/400/300";

  // If it's already a full URL, return as is
  if (imagePath.startsWith("http")) return imagePath;

  // If it's a data URL (base64), return as is
  if (imagePath.startsWith("data:")) return imagePath;

  // Otherwise, construct the full URL to the backend
  return `${API_BASE_URL.replace("/api", "")}/uploads/${imagePath}`;
};

export const getPlaceholderImage = (width = 400, height = 300) => {
  return `/api/placeholder/${width}/${height}`;
};
