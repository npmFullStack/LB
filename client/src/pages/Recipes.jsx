// pages/Recipes.jsx
import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Clock,
  Users,
  Star,
  Heart,
  X,
  Loader2,
  AlertCircle,
  SlidersHorizontal,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import heroBg from "@/assets/images/heroBg.png";
import noRecipeFound from "@/assets/images/noRecipeFound.png";
import { recipeAPI } from "@/services/api";
import { getImageUrl } from "@/utils/imageUtils";

const Recipes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    difficulty: searchParams.get("difficulty") || "",
    prepTime: searchParams.get("prepTime") || "",
    sortBy: searchParams.get("sort") || "newest",
    search: searchParams.get("q") || "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.difficulty) count++;
    if (filters.prepTime) count++;
    if (filters.search) count++;
    setActiveFilterCount(count);
  }, [filters]);

  const categories = [
    "Appetizers",
    "Soups & Salads",
    "Main Courses",
    "Side Dishes",
    "Breakfast",
    "Beverages",
    "Desserts",
  ];

  const difficulties = ["easy", "medium", "hard"];

  const prepTimes = [
    { label: "Under 15 mins", value: "15" },
    { label: "Under 30 mins", value: "30" },
    { label: "Under 45 mins", value: "45" },
    { label: "Under 60 mins", value: "60" },
  ];

  // Fetch recipes
  useEffect(() => {
    fetchRecipes();
  }, [
    filters.category,
    filters.difficulty,
    filters.prepTime,
    filters.sortBy,
    filters.search,
  ]);

  const fetchRecipes = async () => {
    setLoading(true);
    setError(null);
    try {
      const params = {};
      if (filters.category) params.category = filters.category;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sort = filters.sortBy;
      if (filters.difficulty) params.difficulty = filters.difficulty;
      if (filters.prepTime) params.maxPrepTime = filters.prepTime;

      const response = await recipeAPI.getAllRecipes(params);
      setRecipes(response.data.data.recipes || []);
    } catch (err) {
      console.error("Failed to fetch recipes:", err);
      setError("Failed to load recipes. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      if (key === "sortBy") {
        newParams.set("sort", value);
      } else if (key === "search") {
        newParams.set("q", value);
      } else {
        newParams.set(key, value);
      }
    } else {
      if (key === "sortBy") {
        newParams.delete("sort");
      } else if (key === "search") {
        newParams.delete("q");
      } else {
        newParams.delete(key);
      }
    }
    setSearchParams(newParams);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Update URL params with current filters
    const newParams = new URLSearchParams();
    if (filters.search) newParams.set("q", filters.search);
    if (filters.category) newParams.set("category", filters.category);
    if (filters.difficulty) newParams.set("difficulty", filters.difficulty);
    if (filters.prepTime) newParams.set("prepTime", filters.prepTime);
    if (filters.sortBy && filters.sortBy !== "newest")
      newParams.set("sort", filters.sortBy);

    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      difficulty: "",
      prepTime: "",
      sortBy: "newest",
      search: "",
    });
    setSearchParams({});
  };

  const removeFilter = (filterName) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (filterName === "category") newFilters.category = "";
      if (filterName === "difficulty") newFilters.difficulty = "";
      if (filterName === "prepTime") newFilters.prepTime = "";
      if (filterName === "search") newFilters.search = "";
      return newFilters;
    });

    // Update URL params
    const newParams = new URLSearchParams(searchParams);
    if (filterName === "search") {
      newParams.delete("q");
    } else {
      newParams.delete(filterName);
    }
    setSearchParams(newParams);
  };

  const applyFilters = () => {
    setShowFilters(false);
    handleSearch(new Event("submit"));
  };

  const toggleFavorite = (recipeId) => {
    setFavorites((prev) =>
      prev.includes(recipeId)
        ? prev.filter((id) => id !== recipeId)
        : [...prev, recipeId],
    );
  };

  const filteredRecipes = recipes.filter((recipe) => {
    if (filters.difficulty && recipe.difficulty !== filters.difficulty) {
      return false;
    }
    if (filters.prepTime && recipe.prepTime > parseInt(filters.prepTime)) {
      return false;
    }
    return true;
  });

  // Sort recipes
  const sortedRecipes = [...filteredRecipes].sort((a, b) => {
    switch (filters.sortBy) {
      case "newest":
        return new Date(b.createdAt) - new Date(a.createdAt);
      case "oldest":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "popular":
        return (b.rating || 0) - (a.rating || 0);
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero Section with integrated search, filters, sort, and results count */}
      <section
        className="relative py-16 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            {/* Title and Description */}
            <div className="text-center mb-6">
              <h1 className="text-3xl md:text-4xl font-heading mb-3">
                <span className="text-primary">Browse Recipes</span>
              </h1>
              <p className="text-white/90 text-base max-w-2xl mx-auto">
                Discover authentic Filipino recipes shared by our community of
                home cooks.
              </p>
            </div>

            {/* Integrated Search Bar with Filters */}
            <form onSubmit={handleSearch} className="mb-4">
              <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Main Search Row */}
                <div className="flex items-center">
                  {/* Search Icon */}
                  <div className="pl-4">
                    <Search className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Search Input */}
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) =>
                      handleFilterChange("search", e.target.value)
                    }
                    placeholder="Search recipes..."
                    className="flex-1 px-3 py-3 focus:outline-none text-sm"
                  />

                  {/* Filter Button */}
                  <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className={`px-4 py-3 font-medium transition-colors flex items-center gap-1.5 text-sm border-l border-gray-200 ${
                      showFilters || activeFilterCount > 0
                        ? "text-primary"
                        : "text-gray-600 hover:text-primary"
                    }`}
                  >
                    <SlidersHorizontal className="w-4 h-4" />
                    <span className="hidden sm:inline">Filter</span>
                    {activeFilterCount > 0 && (
                      <span className="ml-1 bg-primary text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                        {activeFilterCount}
                      </span>
                    )}
                  </button>

                  {/* Search Button */}
                  <button
                    type="submit"
                    className="bg-primary text-white px-6 py-3 font-medium hover:bg-primary-dark transition-colors flex items-center gap-1.5 text-sm"
                  >
                    <Search className="w-4 h-4" />
                    <span className="hidden sm:inline">Search</span>
                  </button>
                </div>

                {/* Active Filters Badges Row */}
                {activeFilterCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2 px-4 pb-3 pt-1 border-t border-gray-100">
                    <span className="text-xs text-gray-500">
                      Active filters:
                    </span>
                    {filters.search && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        Search: {filters.search}
                        <button
                          onClick={() => removeFilter("search")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {filters.category.charAt(0).toUpperCase() +
                          filters.category.slice(1)}
                        <button
                          onClick={() => removeFilter("category")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.difficulty && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {filters.difficulty.charAt(0).toUpperCase() +
                          filters.difficulty.slice(1)}
                        <button
                          onClick={() => removeFilter("difficulty")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                    {filters.prepTime && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        Under {filters.prepTime} mins
                        <button
                          onClick={() => removeFilter("prepTime")}
                          className="hover:bg-primary/20 rounded-full p-0.5"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </form>

            {/* Sort Dropdown and Results Count Row */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between bg-white/10 backdrop-blur-sm rounded-lg p-3">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-white/80 text-sm">Sort by:</span>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange("sortBy", e.target.value)}
                  className="px-3 py-1.5 border border-white/20 bg-white/90 rounded-lg focus:outline-none focus:border-primary text-textPrimary text-sm"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>

              {/* Clear Filters Button (if any active) */}
              <div className="flex items-center gap-3">
                {activeFilterCount > 0 && (
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-1 px-3 py-1.5 text-white hover:text-white/80 transition-colors text-sm bg-white/10 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                    Clear All
                  </button>
                )}

                {/* Results Count */}
                <p className="text-white text-sm">
                  {sortedRecipes.length} recipe
                  {sortedRecipes.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* Expanded Filters Dropdown */}
            {showFilters && (
              <div className="relative mt-2">
                <div className="absolute left-0 right-0 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-20">
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold text-gray-800">
                        Filter Recipes
                      </h3>
                      <button
                        onClick={() => setShowFilters(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Category Filter */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          Category
                        </label>
                        <select
                          value={filters.category}
                          onChange={(e) =>
                            handleFilterChange("category", e.target.value)
                          }
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat} value={cat.toLowerCase()}>
                              {cat}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Difficulty Filter */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          Difficulty
                        </label>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => handleFilterChange("difficulty", "")}
                            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                              filters.difficulty === ""
                                ? "bg-primary text-white border-primary"
                                : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                            }`}
                          >
                            Any
                          </button>
                          {difficulties.map((diff) => (
                            <button
                              key={diff}
                              type="button"
                              onClick={() =>
                                handleFilterChange("difficulty", diff)
                              }
                              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                                filters.difficulty === diff
                                  ? "bg-primary text-white border-primary"
                                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {diff.charAt(0).toUpperCase() + diff.slice(1)}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Prep Time Filter */}
                      <div className="space-y-1">
                        <label className="block text-xs font-medium text-gray-600 text-left">
                          Prep Time
                        </label>
                        <div className="flex flex-wrap gap-1">
                          <button
                            type="button"
                            onClick={() => handleFilterChange("prepTime", "")}
                            className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                              filters.prepTime === ""
                                ? "bg-primary text-white border-primary"
                                : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                            }`}
                          >
                            Any
                          </button>
                          {prepTimes.map((time) => (
                            <button
                              key={time.value}
                              type="button"
                              onClick={() =>
                                handleFilterChange("prepTime", time.value)
                              }
                              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                                filters.prepTime === time.value
                                  ? "bg-primary text-white border-primary"
                                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {time.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex justify-end gap-2 mt-4 pt-3 border-t border-gray-200">
                      <button
                        onClick={clearFilters}
                        className="px-4 py-1.5 text-xs border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        Clear All
                      </button>
                      <button
                        onClick={applyFilters}
                        className="px-4 py-1.5 text-xs bg-primary text-white rounded-md font-medium hover:bg-primary-dark transition-colors"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Recipes Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <p className="text-textSecondary">{error}</p>
              <button
                onClick={fetchRecipes}
                className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primaryDark transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : sortedRecipes.length === 0 ? (
            <div className="text-center py-20">
              <img
                src={noRecipeFound}
                alt="No recipes found"
                className="w-64 h-64 mx-auto mb-4 opacity-75"
              />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No Recipes Found
              </h3>
              <p className="text-sm text-gray-500 max-w-md mx-auto mb-8">
                We couldn't find any recipes matching your search criteria. Try
                adjusting your filters or check back later for new recipes.
              </p>
              <button
                onClick={clearFilters}
                className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-cardBg hover:bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-borderLight group"
                >
                  <div className="relative">
                    <img
                      src={getImageUrl(recipe.image)}
                      alt={recipe.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "/api/placeholder/400/300";
                      }}
                    />

                    <button
                      onClick={() => toggleFavorite(recipe.id)}
                      className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                    >
                      <Heart
                        className={`w-4 h-4 ${
                          favorites.includes(recipe.id)
                            ? "fill-red-500 text-red-500"
                            : "text-textSecondary"
                        }`}
                      />
                    </button>
                    {recipe.difficulty && (
                      <span className="absolute bottom-2 left-2 px-2 py-1 bg-black/50 text-white text-xs rounded-full">
                        {recipe.difficulty}
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-heading text-textPrimary mb-2 line-clamp-1">
                      {recipe.title}
                    </h3>
                    <p className="text-textSecondary text-sm mb-3 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center gap-3 mb-3 text-xs text-textSecondary">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        <span>{recipe.prepTime + recipe.cookTime} mins</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-primary" />
                        <span>{recipe.servings} serves</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-textSecondary">
                        By {recipe.firstName} {recipe.lastName}
                      </span>
                      <Link
                        to={`/recipe/${recipe.id}`}
                        className="text-primary hover:text-primaryDark text-sm font-medium"
                      >
                        View Recipe →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Recipes;
