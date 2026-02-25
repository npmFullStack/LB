// pages/Home.jsx
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  Clock,
  Users,
  ChefHat,
  ArrowRight,
  Star,
  Heart,
  Beef,
  Carrot,
  Cake,
  UtensilsCrossed,
  Soup,
  Coffee,
  GlassWater,
  Loader2,
  SlidersHorizontal,
  X,
} from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import heroBg from "@/assets/images/heroBg.png";
import { recipeAPI } from "@/services/api";
import { getImageUrl } from "@/utils/imageUtils";

const Home = () => {
  const navigate = useNavigate();
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: "",
    category: "",
    difficulty: "",
    prepTime: "",
  });
  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (filters.category) count++;
    if (filters.difficulty) count++;
    if (filters.prepTime) count++;
    setActiveFilterCount(count);
  }, [filters]);

  // Fetch featured recipes
  useEffect(() => {
    fetchFeaturedRecipes();
  }, []);

  const fetchFeaturedRecipes = async () => {
    try {
      const response = await recipeAPI.getAllRecipes({
        sort: "newest",
        limit: 3,
      });
      setFeaturedRecipes(response.data.data.recipes || []);
    } catch (error) {
      console.error("Failed to fetch featured recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Build query params
    const params = new URLSearchParams();
    if (filters.search) params.set("q", filters.search);
    if (filters.category) params.set("category", filters.category);
    if (filters.difficulty) params.set("difficulty", filters.difficulty);
    if (filters.prepTime) params.set("prepTime", filters.prepTime);

    navigate(`/recipes?${params.toString()}`);
  };

  const removeFilter = (filterName) => {
    setFilters((prev) => {
      const newFilters = { ...prev };
      if (filterName === "category") newFilters.category = "";
      if (filterName === "difficulty") newFilters.difficulty = "";
      if (filterName === "prepTime") newFilters.prepTime = "";
      return newFilters;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      category: "",
      difficulty: "",
      prepTime: "",
    });
  };

  const applyFilters = () => {
    setShowFilters(false);
    handleSearch(new Event("submit"));
  };

  // Categories with icons
  const categories = [
    {
      name: "Appetizers",
      icon: UtensilsCrossed,
      count: 18,
      value: "appetizers",
    },
    { name: "Soups & Salads", icon: Soup, count: 24, value: "soups-salads" },
    { name: "Main Courses", icon: Beef, count: 42, value: "main-courses" },
    { name: "Side Dishes", icon: Carrot, count: 16, value: "side-dishes" },
    { name: "Breakfast", icon: Coffee, count: 22, value: "breakfast" },
    { name: "Beverages", icon: GlassWater, count: 15, value: "beverages" },
    { name: "Desserts", icon: Cake, count: 19, value: "desserts" },
  ];

  const difficulties = [
    { label: "Easy", value: "easy" },
    { label: "Medium", value: "medium" },
    { label: "Hard", value: "hard" },
  ];

  const prepTimes = [
    { label: "Under 15 mins", value: "15" },
    { label: "Under 30 mins", value: "30" },
    { label: "Under 45 mins", value: "45" },
    { label: "Under 60 mins", value: "60" },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Scroll to Top Button */}
      <ScrollToTopButton showAfter={300} />

      {/* Hero Section with Search and Filters */}
      <section
        className="relative py-20 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url(${heroBg})`,
        }}
      >
        <div className="absolute inset-0 bg-black/50"></div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-heading mb-4 text-white">
              Discover Authentic
              <span className="text-primary block">Filipino Recipes</span>
            </h1>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Find the perfect Lutong Bahay recipe for every occasion
            </p>

            {/* Search Bar with Filters */}
            <form onSubmit={handleSearch} className="mb-3">
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
                    name="search"
                    value={filters.search}
                    onChange={handleFilterChange}
                    placeholder="Search for recipes..."
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
                    {filters.category && (
                      <span className="inline-flex items-center gap-1 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                        {categories.find((c) => c.value === filters.category)
                          ?.name || filters.category}
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

            {/* Expanded Filters Dropdown */}
            {showFilters && (
              <div className="relative">
                <div className="absolute left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 overflow-hidden z-20">
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
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                          className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                        >
                          <option value="">All Categories</option>
                          {categories.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.name}
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
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                difficulty: "",
                              }))
                            }
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
                              key={diff.value}
                              type="button"
                              onClick={() =>
                                setFilters((prev) => ({
                                  ...prev,
                                  difficulty:
                                    prev.difficulty === diff.value
                                      ? ""
                                      : diff.value,
                                }))
                              }
                              className={`px-2.5 py-1 text-xs rounded-md border transition-colors ${
                                filters.difficulty === diff.value
                                  ? "bg-primary text-white border-primary"
                                  : "border-gray-300 text-gray-700 hover:border-primary hover:text-primary"
                              }`}
                            >
                              {diff.label}
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
                            onClick={() =>
                              setFilters((prev) => ({
                                ...prev,
                                prepTime: "",
                              }))
                            }
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
                                setFilters((prev) => ({
                                  ...prev,
                                  prepTime:
                                    prev.prepTime === time.value
                                      ? ""
                                      : time.value,
                                }))
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

      {/* Featured Recipes Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-heading text-textPrimary">
              Featured Recipes
            </h2>
            <Link
              to="/recipes"
              className="text-primary hover:text-primaryDark flex items-center gap-2 transition-colors font-medium"
            >
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredRecipes.map((recipe) => (
                <div
                  key={recipe.id}
                  className="bg-cardBg hover:bg-white rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 border border-borderLight"
                >
                  <img
                    src={getImageUrl(recipe.image)}
                    alt={recipe.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/api/placeholder/400/300";
                    }}
                  />
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-heading text-textPrimary">
                        {recipe.title}
                      </h3>
                      <button className="text-textSecondary hover:text-red-500 transition-colors">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <p className="text-textSecondary text-sm mb-4 line-clamp-2">
                      {recipe.description}
                    </p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1 text-sm text-textSecondary">
                        <Clock className="w-4 h-4 text-primary" />
                        <span>{recipe.prepTime + recipe.cookTime} mins</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-textSecondary">
                        <Users className="w-4 h-4 text-primary" />
                        <span>{recipe.servings} servings</span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-textSecondary">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>{(Math.random() * 1 + 4).toFixed(1)}</span>
                      </div>
                    </div>

                    <Link
                      to={`/recipe/${recipe.id}`}
                      className="inline-block w-full text-center bg-primary/10 hover:bg-primary text-primary hover:text-white px-4 py-2 rounded-lg transition-colors font-medium"
                    >
                      View Recipe
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-cardBg">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-heading text-center mb-12 text-textPrimary">
            Browse by Category
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((category, index) => {
              const IconComponent = category.icon;
              return (
                <Link
                  key={index}
                  to={`/recipes?category=${category.value}`}
                  className="bg-white hover:bg-primary group rounded-lg p-6 text-center transition-all duration-300 border border-borderLight shadow-sm hover:shadow-md"
                >
                  <IconComponent className="w-8 h-8 mx-auto mb-3 text-primary group-hover:text-white transition-colors" />
                  <h3 className="font-heading text-lg text-textPrimary group-hover:text-white transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-textSecondary group-hover:text-white/90 transition-colors">
                    {category.count} recipes
                  </p>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-8">
            <Link
              to="/categories"
              className="inline-flex items-center gap-2 text-primary hover:text-primaryDark font-medium transition-colors"
            >
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="container mx-auto px-4 text-center">
          <ChefHat className="w-16 h-16 mx-auto mb-6 text-white" />
          <h2 className="text-4xl font-heading mb-4 text-white">
            Ready to Cook?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join our community and share your own Lutong Bahay recipes with the
            world
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              to="/recipes"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-4 rounded-lg font-sans font-medium transition-colors shadow-sm"
            >
              Browse Recipes
            </Link>
            <Link
              to="/submit-recipe"
              className="border-2 border-white text-white hover:bg-white/10 px-8 py-4 rounded-lg font-sans font-medium transition-colors"
            >
              Share Your Recipe
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
