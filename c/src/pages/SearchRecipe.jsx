// src/pages/SearchRecipe.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard";
import FilterMenu from "@/components/FilterMenu";
import Button from "@/components/Button";
import Select from "@/components/Select";
import { Search, Filter, ChevronDown } from "lucide-react";
import { recipes } from "@/data/mock_data";
import noResultImg from "@/assets/images/no-result.png";

const SearchRecipe = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [sortBy, setSortBy] = useState("");
    const [filteredRecipes, setFilteredRecipes] = useState(recipes);

    // Sort options
    const sortOptions = ["Popular", "Cook Time: Low to High", "Cook Time: High to Low"];

    // Get search param from navigation
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");
        if (searchQuery) {
            setSearchTerm(searchQuery);
            applyFilters(searchQuery, filters, sortBy);
        }
    }, [location.search]);

    const applyFilters = (search, activeFilters, sortValue) => {
        let filtered = [...recipes];

        if (search) {
            filtered = filtered.filter(
                recipe =>
                    recipe.title.toLowerCase().includes(search.toLowerCase()) ||
                    recipe.description
                        .toLowerCase()
                        .includes(search.toLowerCase())
            );
        }

        if (activeFilters.category && activeFilters.category !== "All") {
            filtered = filtered.filter(
                recipe => recipe.category === activeFilters.category
            );
        }

        if (activeFilters.difficulty && activeFilters.difficulty !== "All") {
            filtered = filtered.filter(
                recipe => recipe.difficulty === activeFilters.difficulty
            );
        }

        if (activeFilters.maxCookTime) {
            filtered = filtered.filter(recipe => {
                const time = parseInt(recipe.cookTime);
                if (activeFilters.maxCookTime === "Under 30 min")
                    return time < 30;
                if (activeFilters.maxCookTime === "30-60 min")
                    return time >= 30 && time <= 60;
                if (activeFilters.maxCookTime === "Over 60 min")
                    return time > 60;
                return true;
            });
        }

        // Apply sorting
        if (sortValue) {
            if (sortValue === "Cook Time: Low to High") {
                filtered.sort(
                    (a, b) => parseInt(a.cookTime) - parseInt(b.cookTime)
                );
            } else if (sortValue === "Cook Time: High to Low") {
                filtered.sort(
                    (a, b) => parseInt(b.cookTime) - parseInt(a.cookTime)
                );
            } else if (sortValue === "Popular") {
                filtered.sort((a, b) => b.rating - a.rating);
            }
        }

        setFilteredRecipes(filtered);
    };

    const handleSearch = e => {
        const term = e.target.value;
        setSearchTerm(term);
        applyFilters(term, filters, sortBy);
    };

    const handleSortChange = value => {
        setSortBy(value);
        applyFilters(searchTerm, filters, value);
    };

    const handleApplyFilters = newFilters => {
        setFilters(newFilters);
        applyFilters(searchTerm, newFilters, sortBy);
        setIsFilterOpen(false);
    };

    const clearAllFilters = () => {
        setSearchTerm("");
        setFilters({});
        setSortBy("");
        applyFilters("", {}, "");
        navigate("/search", { replace: true });
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Search */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        Search Recipes
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Find the perfect Filipino dish by searching for ingredients, 
                        dish names, or cooking methods
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
                            <div className="flex-1 flex items-center px-6">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search by recipe name, ingredient, or description..."
                                    value={searchTerm}
                                    onChange={handleSearch}
                                    className="w-full px-4 py-4 outline-none text-gray-700"
                                    autoFocus
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
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                        
                        {/* Active filters summary */}
                        {(searchTerm || Object.keys(filters).length > 0 || sortBy) && (
                            <div className="mt-3 flex flex-wrap items-center gap-2">
                                <span className="text-sm text-gray-500">Active:</span>
                                {searchTerm && (
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        Search: {searchTerm}
                                    </span>
                                )}
                                {filters.category && filters.category !== "All" && (
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        Category: {filters.category}
                                    </span>
                                )}
                                {filters.difficulty && filters.difficulty !== "All" && (
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        Difficulty: {filters.difficulty}
                                    </span>
                                )}
                                {filters.maxCookTime && (
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        Time: {filters.maxCookTime}
                                    </span>
                                )}
                                {sortBy && (
                                    <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                                        Sort: {sortBy}
                                    </span>
                                )}
                                {(searchTerm || Object.keys(filters).length > 0 || sortBy) && (
                                    <button
                                        onClick={clearAllFilters}
                                        className="text-sm text-red-500 hover:text-red-600 ml-2"
                                    >
                                        Clear all
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Search Results Section */}
                <section className="mb-16">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                {searchTerm 
                                    ? `Search Results for "${searchTerm}"`
                                    : Object.keys(filters).length > 0
                                    ? "Filtered Recipes"
                                    : "All Recipes"}
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Found {filteredRecipes.length} recipe
                                {filteredRecipes.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                        
                        {/* Sort By Select */}
                        <div className="w-full sm:w-64">
                            <Select
                                options={sortOptions}
                                value={sortBy}
                                onChange={handleSortChange}
                                placeholder="Sort by..."
                                isClearable={true}
                            />
                        </div>
                    </div>

                    {filteredRecipes.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {filteredRecipes.map(recipe => (
                                <RecipeCard key={recipe.id} recipe={recipe} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <img
                                src={noResultImg}
                                alt="No results found"
                                className="w-48 mx-auto mb-4 opacity-50"
                            />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No recipes found
                            </h3>
                            <p className="text-gray-500 mb-6">
                                We couldn't find any recipes matching your search.
                            </p>
                            <Button
                                onClick={clearAllFilters}
                                variant="outline"
                            >
                                Clear Search
                            </Button>
                        </div>
                    )}
                </section>
            </div>

            {/* Sidebar Filter Menu */}
            <FilterMenu
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
                initialFilters={filters}
            />
        </div>
    );
};

export default SearchRecipe;