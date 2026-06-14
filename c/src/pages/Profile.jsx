// src/pages/Profile.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import RecipeCard from "@/components/RecipeCard";
import UserStatCard from "@/components/UserStatCard";
import { recipes, users } from "@/data/mock_data";
import { Edit, Trash2, Search, Filter, ChevronDown, Plus } from "lucide-react";
import FilterMenu from "@/components/FilterMenu";
import noResultImg from "@/assets/images/no-result.png";

const Profile = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState("recipes"); // "recipes" or "favorites"
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});

    // Get current user (mock - would come from auth)
    const currentUserId = 1;
    const currentUser = users.find(u => u.id === currentUserId);

    // Get user's recipes
    const [userRecipes, setUserRecipes] = useState(
        recipes.filter(recipe => recipe.uploader.id === currentUserId)
    );

    // Get user's favorite recipes
    const [favoriteRecipes, setFavoriteRecipes] = useState(
        recipes.filter(recipe => recipe.isFavorite)
    );

    // Apply filters and search to recipes
    const getFilteredRecipes = () => {
        let filtered = [...userRecipes];

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

        if (filters.category && filters.category !== "All Categories") {
            filtered = filtered.filter(
                recipe => recipe.category === filters.category
            );
        }

        if (filters.difficulty && filters.difficulty !== "All Levels") {
            filtered = filtered.filter(
                recipe => recipe.difficulty === filters.difficulty
            );
        }

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

    // Apply filters and search to favorites
    const getFilteredFavorites = () => {
        let filtered = [...favoriteRecipes];

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

        if (filters.category && filters.category !== "All Categories") {
            filtered = filtered.filter(
                recipe => recipe.category === filters.category
            );
        }

        if (filters.difficulty && filters.difficulty !== "All Levels") {
            filtered = filtered.filter(
                recipe => recipe.difficulty === filters.difficulty
            );
        }

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
    const filteredFavorites = getFilteredFavorites();

    const handleEditRecipe = recipeId => {
        navigate(`/edit-recipe/${recipeId}`);
    };

    const handleDeleteRecipe = recipeId => {
        setUserRecipes(userRecipes.filter(recipe => recipe.id !== recipeId));
        setShowDeleteConfirm(null);
    };

    const handleRemoveFavorite = recipeId => {
        setFavoriteRecipes(
            favoriteRecipes.filter(recipe => recipe.id !== recipeId)
        );
    };

    const handleAddRecipe = () => {
        navigate("/new-recipe");
    };

    const handleApplyFilters = newFilters => {
        setFilters(newFilters);
        setIsFilterOpen(false);
    };

    const clearAllFilters = () => {
        setFilters({});
        setSearchTerm("");
    };

    if (!currentUser) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">
                        User Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        Please sign in to view your profile.
                    </p>
                    <Button onClick={() => navigate("/signin")}>Sign In</Button>
                </div>
            </div>
        );
    }

    const currentData =
        activeTab === "recipes" ? filteredRecipes : filteredFavorites;
    const totalCount =
        activeTab === "recipes" ? userRecipes.length : favoriteRecipes.length;
    const filteredCount = currentData.length;
    const hasActiveFilters =
        searchTerm ||
        Object.keys(filters).some(key => filters[key] && key !== "sortBy");

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Profile Header - No Follow Button for own profile */}
            <div className="bg-white">
                <div className="container mx-auto px-4 py-8">
                    <div className="flex flex-col items-center text-center">
                        {/* Avatar */}
                        <div className="relative mb-4">
                            <img
                                src={currentUser.avatar}
                                alt={currentUser.name}
                                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-primary/20"
                            />
                            <div className="absolute bottom-0 right-0 bg-green-500 rounded-full w-4 h-4 border-2 border-white"></div>
                        </div>

                        {/* User Name */}
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
                            {currentUser.name}
                        </h1>

                        {/* Bio */}
                        <p className="text-gray-600 mb-4 max-w-2xl">
                            {currentUser.bio}
                        </p>

                        {/* Edit Profile Button (for own profile instead of Follow) */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => navigate("/profile/edit")}
                        >
                            Edit Profile
                        </Button>
                    </div>
                </div>
            </div>

            {/* Stats Bar */}
            <div className="bg-white shadow-sm border-b">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex justify-center gap-8">
                        <UserStatCard
                            value={userRecipes.length}
                            label="Recipes"
                        />
                        <UserStatCard
                            value={currentUser.followers}
                            label="Followers"
                        />
                        <UserStatCard
                            value={currentUser.following}
                            label="Following"
                        />
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="container mx-auto px-4 pt-6 pb-2">
                <div className="flex border-b border-gray-200">
                    <button
                        onClick={() => {
                            setActiveTab("recipes");
                            clearAllFilters();
                        }}
                        className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                            activeTab === "recipes"
                                ? "text-primary"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        My Recipes
                        {activeTab === "recipes" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                        )}
                    </button>
                    <button
                        onClick={() => {
                            setActiveTab("favorites");
                            clearAllFilters();
                        }}
                        className={`px-6 py-3 font-medium text-lg transition-colors relative ${
                            activeTab === "favorites"
                                ? "text-primary"
                                : "text-gray-500 hover:text-gray-700"
                        }`}
                    >
                        My Favorites
                        {activeTab === "favorites" && (
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                        )}
                    </button>
                </div>
            </div>

            {/* Search and Filter Bar - Only show if there are items */}
            <div className="container mx-auto px-4 pt-6">
                <div className="flex justify-between items-center flex-wrap gap-4">
                    <div className="flex-1 max-w-2xl">
                        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
                            <div className="flex-1 flex items-center px-6">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder={
                                        activeTab === "recipes"
                                            ? "Search your recipes..."
                                            : "Search your favorites..."
                                    }
                                    value={searchTerm}
                                    onChange={e =>
                                        setSearchTerm(e.target.value)
                                    }
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
                                        key => filters[key] && key !== "sortBy"
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
                                                const newFilters = {
                                                    ...filters
                                                };
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
                                                const newFilters = {
                                                    ...filters
                                                };
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
                                                const newFilters = {
                                                    ...filters
                                                };
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
                                                const newFilters = {
                                                    ...filters
                                                };
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
                                    onClick={clearAllFilters}
                                    className="text-sm text-gray-500 hover:text-red-500"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                    </div>

                    {activeTab === "recipes" && totalCount > 0 && (
                        <Button
                            variant="primary"
                            size="lg"
                            icon={Plus}
                            onClick={handleAddRecipe}
                        >
                            Add New Recipe
                        </Button>
                    )}
                </div>

                {/* Results count */}
                {totalCount > 0 && filteredCount > 0 && (
                    <p className="text-sm text-gray-500 mt-4">
                        Showing {filteredCount} of {totalCount}{" "}
                        {activeTab === "recipes" ? "recipes" : "favorites"}
                    </p>
                )}
            </div>

            {/* Content Grid */}
            <div className="container mx-auto px-4 py-8">
                {currentData.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {currentData.map(recipe => (
                            <div key={recipe.id} className="relative group">
                                <RecipeCard recipe={recipe} />

                                {/* Action Buttons - Different for Recipes vs Favorites */}
                                {activeTab === "recipes" && (
                                    <div className="absolute top-2 left-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                        <button
                                            onClick={() =>
                                                handleEditRecipe(recipe.id)
                                            }
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
                                )}

                                {activeTab === "favorites" && (
                                    <button
                                        onClick={() =>
                                            handleRemoveFavorite(recipe.id)
                                        }
                                        className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white z-10"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <img
                            src={noResultImg}
                            alt="No results found"
                            className="w-48 mx-auto mb-4 opacity-50"
                        />
                        {hasActiveFilters ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No{" "}
                                    {activeTab === "recipes"
                                        ? "recipes"
                                        : "favorites"}{" "}
                                    found
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    Try adjusting your search or filter criteria
                                </p>

                            </>
                        ) : activeTab === "recipes" ? (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No recipes yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    You haven't uploaded any recipes yet. Share
                                    your first recipe!
                                </p>
                                <Button
                                    variant="primary"
                                    icon={Plus}
                                    onClick={handleAddRecipe}
                                >
                                    Share Your First Recipe
                                </Button>
                            </>
                        ) : (
                            <>
                                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                    No favorites yet
                                </h3>
                                <p className="text-gray-500 mb-4">
                                    You haven't added any favorite recipes yet.
                                    Discover and save recipes you love!
                                </p>
                                <Button
                                    variant="primary"
                                    onClick={() => navigate("/home")}
                                >
                                    Discover Recipes
                                </Button>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-2xl p-6 max-w-sm mx-4">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">
                            Delete Recipe?
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Are you sure you want to delete this recipe? This
                            action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <Button
                                variant="outline"
                                onClick={() => setShowDeleteConfirm(null)}
                                className="flex-1"
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="primary"
                                onClick={() =>
                                    handleDeleteRecipe(showDeleteConfirm)
                                }
                                className="flex-1 bg-red-500 hover:bg-red-600"
                            >
                                Delete
                            </Button>
                        </div>
                    </div>
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

export default Profile;
