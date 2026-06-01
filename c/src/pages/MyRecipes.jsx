// src/pages/MyRecipes.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard";
import Button from "@/components/Button";
import FilterMenu from "@/components/FilterMenu";
import { recipes, users } from "@/data/mock_data";
import { Plus, Edit, Trash2, Search, Filter, ChevronDown } from "lucide-react";

const MyRecipes = () => {
    const navigate = useNavigate();
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});

    // Get current user (mock - would come from auth)
    const currentUserId = 1;
    const currentUser = users.find(u => u.id === currentUserId);

    // Get recipes uploaded by current user
    const [myRecipes, setMyRecipes] = useState(
        recipes.filter(recipe => recipe.uploader.id === currentUserId)
    );

    // Apply filters and search to recipes
    const getFilteredRecipes = () => {
        let filtered = [...myRecipes];

        // Apply search
        if (searchTerm) {
            filtered = filtered.filter(
                recipe =>
                    recipe.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) ||
                    recipe.description
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
            );
        }

        // Apply category filter
        if (filters.category && filters.category !== "All Categories") {
            filtered = filtered.filter(
                recipe => recipe.category === filters.category
            );
        }

        // Apply difficulty filter
        if (filters.difficulty && filters.difficulty !== "All Levels") {
            filtered = filtered.filter(
                recipe => recipe.difficulty === filters.difficulty
            );
        }

        // Apply cook time filter
        if (filters.maxCookTime && filters.maxCookTime !== "Any Time") {
            filtered = filtered.filter(recipe => {
                const time = parseInt(recipe.cookTime);
                if (filters.maxCookTime === "Under 30 min") return time < 30;
                if (filters.maxCookTime === "30-60 min")
                    return time >= 30 && time <= 60;
                if (filters.maxCookTime === "Over 60 min") return time > 60;
                return true;
            });
        }

        // Apply sorting
        if (filters.sortBy) {
            if (filters.sortBy === "Cook Time: Low to High") {
                filtered.sort(
                    (a, b) => parseInt(a.cookTime) - parseInt(b.cookTime)
                );
            } else if (filters.sortBy === "Cook Time: High to Low") {
                filtered.sort(
                    (a, b) => parseInt(b.cookTime) - parseInt(a.cookTime)
                );
            } else if (filters.sortBy === "Popular") {
                filtered.sort((a, b) => b.rating - a.rating);
            } else if (filters.sortBy === "Newest") {
                filtered.sort((a, b) => b.id - a.id);
            }
        }

        return filtered;
    };

    const filteredRecipes = getFilteredRecipes();

    const handleAddRecipe = () => {
        navigate("/add-recipe");
    };

    const handleEditRecipe = recipeId => {
        navigate(`/edit-recipe/${recipeId}`);
    };

    const handleDeleteRecipe = recipeId => {
        setMyRecipes(myRecipes.filter(recipe => recipe.id !== recipeId));
        setShowDeleteConfirm(null);
    };

    const handleApplyFilters = newFilters => {
        setFilters(newFilters);
        setIsFilterOpen(false);
    };

    // Calculate stats
    const totalRecipes = filteredRecipes.length;
    const totalViews = filteredRecipes.reduce((sum, r) => sum + r.reviews, 0);
    const averageRating = (
        filteredRecipes.reduce((sum, r) => sum + r.rating, 0) / totalRecipes ||
        0
    ).toFixed(1);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        My Recipes
                    </h1>
                    <p className="text-gray-600">
                        Manage your uploaded recipes
                    </p>
                </div>
                <Button
                    variant="primary"
                    size="lg"
                    icon={Plus}
                    onClick={handleAddRecipe}
                    className="mt-4 sm:mt-0"
                >
                    Add New Recipe
                </Button>
            </div>


            {/* Search Bar with Filter Button - Exactly like AllRecipes */}
            <div className="mb-8">
                <div className="max-w-2xl">
                    <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
                        <div className="flex-1 flex items-center px-6">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search your recipes..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-4 outline-none text-gray-700"
                            />
                        </div>
                        <div className="relative">
                            <Button
                                variant="ghost"
                                size="lg"
                                onClick={() => setIsFilterOpen(true)}
                                icon={Filter}
                                className="rounded-r-full px-6"
                            >
                                Filter
                                {Object.keys(filters).some(
                                    key => filters[key]
                                ) && (
                                    <span className="ml-1 bg-primary text-white text-xs rounded-full w-5 h-5 inline-flex items-center justify-center">
                                        {
                                            Object.keys(filters).filter(
                                                key =>
                                                    filters[key] &&
                                                    key !== "sortBy"
                                            ).length
                                        }
                                    </span>
                                )}
                                <ChevronDown className="w-4 h-4 ml-1" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Active Filters Display */}
                {(filters.category ||
                    filters.difficulty ||
                    filters.maxCookTime ||
                    filters.sortBy) && (
                    <div className="flex flex-wrap gap-2 mt-3">
                        {filters.category && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.category}
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        delete newFilters.category;
                                        setFilters(newFilters);
                                    }}
                                    className="hover:text-red-500 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {filters.difficulty && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.difficulty}
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        delete newFilters.difficulty;
                                        setFilters(newFilters);
                                    }}
                                    className="hover:text-red-500 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {filters.maxCookTime && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                {filters.maxCookTime}
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        delete newFilters.maxCookTime;
                                        setFilters(newFilters);
                                    }}
                                    className="hover:text-red-500 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        {filters.sortBy && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                Sort: {filters.sortBy}
                                <button
                                    onClick={() => {
                                        const newFilters = { ...filters };
                                        delete newFilters.sortBy;
                                        setFilters(newFilters);
                                    }}
                                    className="hover:text-red-500 text-lg leading-none"
                                >
                                    ×
                                </button>
                            </span>
                        )}
                        <button
                            onClick={() => {
                                setFilters({});
                                setSearchTerm("");
                            }}
                            className="text-sm text-gray-500 hover:text-red-500"
                        >
                            Clear all
                        </button>
                    </div>
                )}
            </div>

            {/* Results count */}
            {filteredRecipes.length > 0 && (
                <p className="text-sm text-gray-500 mb-4">
                    Showing {filteredRecipes.length} of {myRecipes.length}{" "}
                    recipes
                </p>
            )}

            {/* Recipes Grid */}
            {filteredRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredRecipes.map(recipe => (
                        <div key={recipe.id} className="relative group">
                            <RecipeCard recipe={recipe} />
                            {/* Action Buttons Overlay */}
                            <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                <button
                                    onClick={() => handleEditRecipe(recipe.id)}
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-primary hover:text-white transition-colors"
                                    aria-label="Edit recipe"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() =>
                                        setShowDeleteConfirm(recipe.id)
                                    }
                                    className="p-2 bg-white rounded-full shadow-md hover:bg-red-500 hover:text-white transition-colors"
                                    aria-label="Delete recipe"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>

                            {/* Delete Confirmation Modal */}
                            {showDeleteConfirm === recipe.id && (
                                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                                    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
                                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                                            Delete Recipe?
                                        </h3>
                                        <p className="text-gray-600 mb-6">
                                            Are you sure you want to delete "
                                            {recipe.title}"? This action cannot
                                            be undone.
                                        </p>
                                        <div className="flex gap-3">
                                            <Button
                                                variant="outline"
                                                onClick={() =>
                                                    setShowDeleteConfirm(null)
                                                }
                                                className="flex-1"
                                            >
                                                Cancel
                                            </Button>
                                            <Button
                                                variant="primary"
                                                onClick={() =>
                                                    handleDeleteRecipe(
                                                        recipe.id
                                                    )
                                                }
                                                className="flex-1 bg-red-500 hover:bg-red-600"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                    <p className="text-gray-500 text-lg mb-4">
                        {searchTerm ||
                        Object.keys(filters).some(
                            key => filters[key] && key !== "sortBy"
                        )
                            ? "No recipes match your search criteria."
                            : "You haven't uploaded any recipes yet."}
                    </p>
                    {(searchTerm ||
                        Object.keys(filters).some(key => filters[key])) && (
                        <Button
                            variant="outline"
                            onClick={() => {
                                setSearchTerm("");
                                setFilters({});
                            }}
                            className="mb-4"
                        >
                            Clear Filters
                        </Button>
                    )}
                    <Button
                        variant="primary"
                        icon={Plus}
                        onClick={handleAddRecipe}
                    >
                        Share Your First Recipe
                    </Button>
                </div>
            )}

            {/* Sidebar Filter Menu */}
            <FilterMenu
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
};

export default MyRecipes;
