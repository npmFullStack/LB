// pages/ShareRecipe.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Upload,
  Image,
  Clock,
  Users,
  ChefHat,
  AlertCircle,
  CheckCircle,
  X,
  Plus,
  Trash2,
  Lock,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import noUserLogin from "@/assets/images/noUserLogin.png";
import { useAuth } from "@/context/AuthContext";
import { recipeAPI } from "@/services/api"; // Import recipeAPI

const ShareRecipe = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    prepTime: "",
    cookTime: "",
    servings: "",
    difficulty: "easy",
    image: null,
    ingredients: [""],
    instructions: [""],
    tips: "",
    isPublic: true,
  });

  const [imagePreview, setImagePreview] = useState(null);

  const categories = [
    "Appetizers",
    "Soups & Salads",
    "Main Courses",
    "Side Dishes",
    "Breakfast",
    "Beverages",
    "Desserts",
  ];

  const difficulties = [
    { value: "easy", label: "Easy" },
    { value: "medium", label: "Medium" },
    { value: "hard", label: "Hard" },
  ];

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      // You can optionally show a message or just let the component render the login prompt
    }
  }, [isAuthenticated]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          image: "Image size should be less than 5MB",
        }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          image: "Please upload an image file",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null }));
    setImagePreview(null);
  };

  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [...prev.ingredients, ""],
    }));
  };

  const updateIngredient = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const removeIngredient = (index) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((_, i) => i !== index),
      }));
    }
  };

  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [...prev.instructions, ""],
    }));
  };

  const updateInstruction = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((item, i) =>
        i === index ? value : item,
      ),
    }));
  };

  const removeInstruction = (index) => {
    if (formData.instructions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        instructions: prev.instructions.filter((_, i) => i !== index),
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) newErrors.title = "Recipe title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.prepTime) newErrors.prepTime = "Preparation time is required";
    if (!formData.cookTime) newErrors.cookTime = "Cooking time is required";
    if (!formData.servings)
      newErrors.servings = "Number of servings is required";
    if (!formData.image) newErrors.image = "Please upload a recipe image";

    const emptyIngredients = formData.ingredients.filter((i) => !i.trim());
    if (emptyIngredients.length > 0)
      newErrors.ingredients = "All ingredients must be filled";

    const emptyInstructions = formData.instructions.filter((i) => !i.trim());
    if (emptyInstructions.length > 0)
      newErrors.instructions = "All instructions must be filled";

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitStatus("submitting");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("prepTime", formData.prepTime);
      formDataToSend.append("cookTime", formData.cookTime);
      formDataToSend.append("servings", formData.servings);
      formDataToSend.append("difficulty", formData.difficulty);
      formDataToSend.append("tips", formData.tips);
      formDataToSend.append("isPublic", formData.isPublic);
      formDataToSend.append(
        "ingredients",
        JSON.stringify(formData.ingredients.filter((i) => i.trim())),
      );
      formDataToSend.append(
        "instructions",
        JSON.stringify(formData.instructions.filter((i) => i.trim())),
      );

      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      // Use the recipeAPI to submit
      const response = await recipeAPI.createRecipe(formDataToSend);

      if (response.data.success) {
        setSubmitStatus("success");
        // Optional: redirect after a few seconds
        setTimeout(() => {
          navigate("/recipes");
        }, 3000);
      }
    } catch (error) {
      console.error("Failed to submit recipe:", error);
      setSubmitStatus("error");

      // Show more specific error message if available
      const errorMessage =
        error.response?.data?.message ||
        "Failed to submit recipe. Please try again.";
      alert(errorMessage);
    }
  };

  // If not logged in, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <img
              src={noUserLogin}
              alt="Please log in to share recipes"
              className="w-64 h-64 mx-auto mb-8 object-contain"
            />
            <h1 className="text-3xl font-heading text-textPrimary mb-4">
              Sign In to Share Your Recipe
            </h1>
            <p className="text-textSecondary mb-8 max-w-lg mx-auto">
              Join our community of home cooks and share your favorite Lutong
              Bahay recipes. Sign in or create a free account to start sharing!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="bg-primary hover:bg-primaryDark text-white px-8 py-4 rounded-lg font-medium transition-colors shadow-sm"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="border-2 border-primary text-primary hover:bg-primary/10 px-8 py-4 rounded-lg font-medium transition-colors"
              >
                Sign Up for Free
              </Link>
            </div>
            <div className="mt-8">
              <Link
                to="/"
                className="text-primary hover:text-primaryDark inline-flex items-center gap-2"
              >
                Continue Browsing Recipes
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (submitStatus === "success") {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-3xl font-heading text-textPrimary mb-4">
              Recipe Submitted Successfully!
            </h1>
            <p className="text-textSecondary mb-8">
              Thank you for sharing your recipe. It will be reviewed by our team
              and published soon.
            </p>
            <div className="flex gap-4 justify-center">
              <Link
                to="/"
                className="bg-primary hover:bg-primaryDark text-white px-6 py-3 rounded-lg transition-colors"
              >
                Go to Homepage
              </Link>
              <Link
                to="/recipes"
                className="border border-primary text-primary hover:bg-primary/10 px-6 py-3 rounded-lg transition-colors"
              >
                Browse Recipes
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="container mx-auto px-4 py-12">
        {/* Welcome Message for Logged-in User */}
        {user && (
          <div className="max-w-4xl mx-auto mb-6 bg-primary/5 border border-primary/20 rounded-lg p-4">
            <p className="text-textPrimary">
              Welcome back,{" "}
              <span className="font-semibold text-primary">
                {user.firstName} {user.lastName}
              </span>
              ! Share your delicious recipe with the community.
            </p>
          </div>
        )}

        {/* Header */}
        <div className="max-w-4xl mx-auto mb-8">
          <h1 className="text-4xl font-heading text-textPrimary mb-2">
            Share Your Recipe
          </h1>
          <p className="text-textSecondary">
            Share your favorite Lutong Bahay recipe with our community. Fill in
            the details below and inspire others to cook!
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          {/* Basic Information */}
          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <h2 className="text-xl font-heading text-textPrimary mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-textPrimary font-medium mb-1">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Chicken Adobo"
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.title
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-cardBorder focus:border-primary focus:ring-primary"
                  }`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.title}
                  </p>
                )}
              </div>

              {/* Description */}
              <div>
                <label className="block text-textPrimary font-medium mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Briefly describe your recipe..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.description
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-cardBorder focus:border-primary focus:ring-primary"
                  }`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.description}
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                <label className="block text-textPrimary font-medium mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                    errors.category
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-cardBorder focus:border-primary focus:ring-primary"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat.toLowerCase()}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.category}
                  </p>
                )}
              </div>

              {/* Time and Servings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-textPrimary font-medium mb-1">
                    Prep Time (mins) *
                  </label>
                  <input
                    type="number"
                    name="prepTime"
                    value={formData.prepTime}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.prepTime
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-cardBorder focus:border-primary focus:ring-primary"
                    }`}
                  />
                  {errors.prepTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.prepTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-textPrimary font-medium mb-1">
                    Cook Time (mins) *
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.cookTime
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-cardBorder focus:border-primary focus:ring-primary"
                    }`}
                  />
                  {errors.cookTime && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.cookTime}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-textPrimary font-medium mb-1">
                    Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    min="1"
                    className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.servings
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-cardBorder focus:border-primary focus:ring-primary"
                    }`}
                  />
                  {errors.servings && (
                    <p className="text-red-500 text-sm mt-1">
                      {errors.servings}
                    </p>
                  )}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <label className="block text-textPrimary font-medium mb-1">
                  Difficulty Level
                </label>
                <div className="flex gap-4">
                  {difficulties.map((diff) => (
                    <label key={diff.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="difficulty"
                        value={diff.value}
                        checked={formData.difficulty === diff.value}
                        onChange={handleInputChange}
                        className="text-primary focus:ring-primary"
                      />
                      <span className="text-textSecondary">{diff.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Image Upload */}
          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <h2 className="text-xl font-heading text-textPrimary mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-primary" />
              Recipe Image *
            </h2>

            {!imagePreview ? (
              <div className="border-2 border-dashed border-cardBorder rounded-lg p-8 text-center">
                <input
                  type="file"
                  id="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image"
                  className="cursor-pointer inline-flex flex-col items-center gap-2"
                >
                  <Upload className="w-8 h-8 text-primary" />
                  <span className="text-textPrimary font-medium">
                    Click to upload an image
                  </span>
                  <span className="text-textSecondary text-sm">
                    PNG, JPG, GIF up to 5MB
                  </span>
                </label>
                {errors.image && (
                  <p className="text-red-500 text-sm mt-2 flex items-center justify-center gap-1">
                    <AlertCircle className="w-4 h-4" />
                    {errors.image}
                  </p>
                )}
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Recipe preview"
                  className="w-full max-h-96 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>

          {/* Ingredients */}
          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <h2 className="text-xl font-heading text-textPrimary mb-4 flex items-center gap-2">
              <span className="text-primary">🥘</span>
              Ingredients *
            </h2>

            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="text"
                    value={ingredient}
                    onChange={(e) => updateIngredient(index, e.target.value)}
                    placeholder={`Ingredient ${index + 1}`}
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.ingredients
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-cardBorder focus:border-primary focus:ring-primary"
                    }`}
                  />
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addIngredient}
                className="flex items-center gap-2 text-primary hover:text-primaryDark transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Ingredient
              </button>

              {errors.ingredients && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.ingredients}
                </p>
              )}
            </div>
          </div>

          {/* Instructions */}
          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <h2 className="text-xl font-heading text-textPrimary mb-4 flex items-center gap-2">
              <ChefHat className="w-5 h-5 text-primary" />
              Instructions *
            </h2>

            <div className="space-y-4">
              {formData.instructions.map((instruction, index) => (
                <div key={index} className="flex gap-2">
                  <span className="w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-medium">
                    {index + 1}
                  </span>
                  <textarea
                    value={instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${index + 1}`}
                    rows="2"
                    className={`flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-1 ${
                      errors.instructions
                        ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                        : "border-cardBorder focus:border-primary focus:ring-primary"
                    }`}
                  />
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(index)}
                      className="text-red-500 hover:text-red-700 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}

              <button
                type="button"
                onClick={addInstruction}
                className="flex items-center gap-2 text-primary hover:text-primaryDark transition-colors mt-2"
              >
                <Plus className="w-4 h-4" />
                Add Step
              </button>

              {errors.instructions && (
                <p className="text-red-500 text-sm flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.instructions}
                </p>
              )}
            </div>
          </div>

          {/* Tips and Notes */}
          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <h2 className="text-xl font-heading text-textPrimary mb-4">
              Tips & Notes (Optional)
            </h2>

            <textarea
              name="tips"
              value={formData.tips}
              onChange={handleInputChange}
              rows="4"
              placeholder="Share any tips, variations, or notes about this recipe..."
              className="w-full px-4 py-2 border border-cardBorder rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Privacy */}
          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                name="isPublic"
                checked={formData.isPublic}
                onChange={handleInputChange}
                className="text-primary focus:ring-primary rounded"
              />
              <span className="text-textPrimary">
                Make this recipe public (visible to everyone)
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 justify-end">
            <Link
              to="/"
              className="px-6 py-3 border border-cardBorder text-textSecondary hover:bg-gray-50 rounded-lg transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={submitStatus === "submitting"}
              className={`px-8 py-3 bg-primary hover:bg-primaryDark text-white rounded-lg font-medium transition-colors flex items-center gap-2 ${
                submitStatus === "submitting"
                  ? "opacity-75 cursor-not-allowed"
                  : ""
              }`}
            >
              {submitStatus === "submitting" ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                "Share Recipe"
              )}
            </button>
          </div>
        </form>
      </div>

      <Footer />
    </div>
  );
};

export default ShareRecipe;
