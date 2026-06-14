// src/pages/NewRecipe.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import BreadCrumbs from "@/components/BreadCrumbs";
import CustomSelect from "@/components/Select";
import { Upload, X, Plus, Trash2 } from "lucide-react";

const NewRecipe = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Breadcrumbs items
  const breadcrumbItems = [
    { label: "My Recipes", path: "/profile" },
    { label: "New Recipe", path: null } // null indicates current/active page
  ];

  // Unit options for ingredients
  const unitOptions = [
    { value: "tsp", label: "teaspoon (tsp)" },
    { value: "tbsp", label: "tablespoon (tbsp)" },
    { value: "cup", label: "cup" },
    { value: "ml", label: "milliliter (ml)" },
    { value: "l", label: "liter (L)" },
    { value: "g", label: "gram (g)" },
    { value: "kg", label: "kilogram (kg)" },
    { value: "oz", label: "ounce (oz)" },
    { value: "lb", label: "pound (lb)" },
    { value: "piece", label: "piece" },
    { value: "clove", label: "clove" },
    { value: "slice", label: "slice" },
    { value: "pinch", label: "pinch" },
    { value: "dash", label: "dash" },
    { value: "to taste", label: "to taste" },
    { value: "whole", label: "whole" }
  ];

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    difficulty: "",
    cookTime: "",
    servings: "",
    image: null,
    imagePreview: null,
    ingredients: [{ id: 1, name: "", amount: "", unit: "tbsp" }],
    instructions: [{ id: 1, step: "" }],
  });

  const [errors, setErrors] = useState({});

  const categories = [
    { value: "Breakfast", label: "Breakfast" },
    { value: "Lunch", label: "Lunch" },
    { value: "Dinner", label: "Dinner" },
    { value: "Dessert", label: "Dessert" },
    { value: "Appetizer", label: "Appetizer" },
    { value: "Snack", label: "Snack" },
    { value: "Beverage", label: "Beverage" },
    { value: "Soup", label: "Soup" },
    { value: "Salad", label: "Salad" },
  ];

  const difficultyLevels = [
    { value: "Easy", label: "Easy" },
    { value: "Medium", label: "Medium" },
    { value: "Hard", label: "Hard" },
  ];

  // Handle text input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({ ...prev, image: "Image size should be less than 5MB" }));
        return;
      }
      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({ ...prev, image: "Please upload an image file" }));
        return;
      }
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          image: file,
          imagePreview: reader.result,
        }));
      };
      reader.readAsDataURL(file);
      setErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const removeImage = () => {
    setFormData((prev) => ({ ...prev, image: null, imagePreview: null }));
  };

  // Ingredients management
  const addIngredient = () => {
    setFormData((prev) => ({
      ...prev,
      ingredients: [
        ...prev.ingredients,
        { id: Date.now(), name: "", amount: "", unit: "tbsp" },
      ],
    }));
  };

  const updateIngredient = (id, field, value) => {
    setFormData((prev) => ({
      ...prev,
      ingredients: prev.ingredients.map((ing) =>
        ing.id === id ? { ...ing, [field]: value } : ing
      ),
    }));
  };

  const removeIngredient = (id) => {
    if (formData.ingredients.length > 1) {
      setFormData((prev) => ({
        ...prev,
        ingredients: prev.ingredients.filter((ing) => ing.id !== id),
      }));
    }
  };

  // Instructions management
  const addInstruction = () => {
    setFormData((prev) => ({
      ...prev,
      instructions: [
        ...prev.instructions,
        { id: Date.now(), step: "" },
      ],
    }));
  };

  const updateInstruction = (id, value) => {
    setFormData((prev) => ({
      ...prev,
      instructions: prev.instructions.map((inst) =>
        inst.id === id ? { ...inst, step: value } : inst
      ),
    }));
  };

  const removeInstruction = (id) => {
    if (formData.instructions.length > 1) {
      setFormData((prev) => ({
        ...prev,
        instructions: prev.instructions.filter((inst) => inst.id !== id),
      }));
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) newErrors.title = "Recipe title is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.category) newErrors.category = "Please select a category";
    if (!formData.difficulty) newErrors.difficulty = "Please select difficulty level";
    if (!formData.cookTime) newErrors.cookTime = "Cook time is required";
    else if (isNaN(formData.cookTime) || parseInt(formData.cookTime) <= 0) {
      newErrors.cookTime = "Please enter a valid cook time in minutes";
    }
    if (!formData.servings) newErrors.servings = "Number of servings is required";
    else if (isNaN(formData.servings) || parseInt(formData.servings) <= 0) {
      newErrors.servings = "Please enter a valid number of servings";
    }
    if (!formData.image) newErrors.image = "Please upload a recipe image";
    
    // Check ingredients
    const hasEmptyIngredient = formData.ingredients.some(
      (ing) => !ing.name.trim() || !ing.amount.toString().trim()
    );
    if (hasEmptyIngredient) {
      newErrors.ingredients = "All ingredients must have name and amount";
    }
    
    // Check instructions
    const hasEmptyInstruction = formData.instructions.some(
      (inst) => !inst.step.trim()
    );
    if (hasEmptyInstruction) {
      newErrors.instructions = "All instruction steps must be filled";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      // In a real app, you would send formData to your backend
      console.log("Recipe submitted:", {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        difficulty: formData.difficulty,
        cookTime: formData.cookTime,
        servings: formData.servings,
        ingredients: formData.ingredients,
        instructions: formData.instructions,
        image: formData.image,
      });
      
      setIsSubmitting(false);
      navigate("/profile", { state: { recipeAdded: true } });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header with Breadcrumbs */}
        <div className="mb-6">
          <BreadCrumbs items={breadcrumbItems} className="mb-4" />
          <h1 className="text-3xl font-bold text-gray-800">Share Your Recipe</h1>
          <p className="text-gray-600 mt-1">
            Fill in the details below to share your delicious recipe with the community
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <label className="block text-lg font-semibold text-gray-800 mb-4">
              Recipe Image *
            </label>
            {!formData.imagePreview ? (
              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  errors.image
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300 hover:border-primary"
                }`}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer block"
                >
                  <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 mb-1">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-sm text-gray-400">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </label>
              </div>
            ) : (
              <div className="relative inline-block">
                <img
                  src={formData.imagePreview}
                  alt="Recipe preview"
                  className="w-64 h-48 object-cover rounded-xl shadow-md"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
            {errors.image && (
              <p className="text-red-500 text-sm mt-2">{errors.image}</p>
            )}
          </div>

          {/* Basic Information */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Basic Information
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Recipe Title *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Creamy Garlic Parmesan Pasta"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.title ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
                {errors.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Briefly describe your recipe..."
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <CustomSelect
                    options={categories}
                    value={formData.category}
                    onChange={(value) => handleSelectChange("category", value)}
                    placeholder="Select category"
                    isSearchable={true}
                    error={errors.category}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Difficulty Level *
                  </label>
                  <CustomSelect
                    options={difficultyLevels}
                    value={formData.difficulty}
                    onChange={(value) => handleSelectChange("difficulty", value)}
                    placeholder="Select difficulty"
                    isSearchable={false}
                    error={errors.difficulty}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Cook Time (minutes) *
                  </label>
                  <input
                    type="number"
                    name="cookTime"
                    value={formData.cookTime}
                    onChange={handleInputChange}
                    placeholder="e.g., 30"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.cookTime ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.cookTime && (
                    <p className="text-red-500 text-sm mt-1">{errors.cookTime}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Servings *
                  </label>
                  <input
                    type="number"
                    name="servings"
                    value={formData.servings}
                    onChange={handleInputChange}
                    placeholder="e.g., 4"
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.servings ? "border-red-500" : "border-gray-300"
                    } focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent`}
                  />
                  {errors.servings && (
                    <p className="text-red-500 text-sm mt-1">{errors.servings}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Ingredients */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Ingredients *</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={addIngredient}
              >
                Add Ingredient
              </Button>
            </div>
            
            <div className="space-y-3">
              {formData.ingredients.map((ingredient, index) => (
                <div key={ingredient.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      value={ingredient.name}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "name", e.target.value)
                      }
                      placeholder="Ingredient name"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="w-28">
                    <input
                      type="number"
                      step="any"
                      value={ingredient.amount}
                      onChange={(e) =>
                        updateIngredient(ingredient.id, "amount", e.target.value)
                      }
                      placeholder="Amount"
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="w-36">
                    <CustomSelect
                      options={unitOptions}
                      value={ingredient.unit}
                      onChange={(value) =>
                        updateIngredient(ingredient.id, "unit", value)
                      }
                      placeholder="Unit"
                      isClearable={false}
                      isSearchable={true}
                    />
                  </div>
                  {formData.ingredients.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIngredient(ingredient.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.ingredients && (
              <p className="text-red-500 text-sm mt-2">{errors.ingredients}</p>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Instructions *</h2>
              <Button
                type="button"
                variant="outline"
                size="sm"
                icon={Plus}
                onClick={addInstruction}
              >
                Add Step
              </Button>
            </div>
            
            <div className="space-y-4">
              {formData.instructions.map((instruction, index) => (
                <div key={instruction.id} className="flex gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-primary/10 text-primary rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={instruction.step}
                      onChange={(e) =>
                        updateInstruction(instruction.id, e.target.value)
                      }
                      rows="2"
                      placeholder={`Step ${index + 1}: Describe the cooking step...`}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  {formData.instructions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeInstruction(instruction.id)}
                      className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.instructions && (
              <p className="text-red-500 text-sm mt-2">{errors.instructions}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={() => navigate("/profile")}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? "Sharing Recipe..." : "Share Recipe"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewRecipe;