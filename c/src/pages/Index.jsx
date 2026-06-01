// src/pages/Index.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import RecipeCard from "@/components/RecipeCard";
import FilterMenu from "@/components/FilterMenu";
import { recipes } from "@/data/mock_data";
import { Search, Filter, ChevronDown, ArrowRight } from "lucide-react";
import heroBg from "@/assets/images/heroBg.png";

const Index = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [filteredRecipes, setFilteredRecipes] = useState(recipes);

    const handleSearch = e => {
        const term = e.target.value;
        setSearchTerm(term);

        if (term && term.trim() !== "") {
            // Navigate to AllRecipes with search param
            navigate(`/recipes?search=${encodeURIComponent(term)}`);
        } else {
            // If search is empty, just update local state
            applyFilters(term, filters);
        }
    };

    const applyFilters = (search, activeFilters) => {
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

        if (activeFilters.sortBy) {
            if (activeFilters.sortBy === "Cook Time: Low to High") {
                filtered.sort(
                    (a, b) => parseInt(a.cookTime) - parseInt(b.cookTime)
                );
            } else if (activeFilters.sortBy === "Cook Time: High to Low") {
                filtered.sort(
                    (a, b) => parseInt(b.cookTime) - parseInt(a.cookTime)
                );
            } else if (activeFilters.sortBy === "Popular") {
                filtered.sort((a, b) => b.rating - a.rating);
            }
        }

        setFilteredRecipes(filtered);
    };

    const handleApplyFilters = newFilters => {
        setFilters(newFilters);
        applyFilters(searchTerm, newFilters);
        setIsFilterOpen(false);
    };

    const handleViewAllRecipes = () => {
        navigate("/recipes");
    };

    // Get featured recipes (first 4 or popular ones)
    const featuredRecipes = [...recipes]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 4);

    return (
        <div>
            {/* Hero Section - Full viewport height */}
            <section
                className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cover bg-center"
                style={{ backgroundImage: `url(${heroBg})` }}
            >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-black/60"></div>

                {/* Hero Content */}
                <div className="container mx-auto px-4 py-20 text-center relative z-10">
                    <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
                        <span className="text-primary">LutongBahay</span>
                        <br />
                        <span className="">Taste of Home</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl mx-auto">
                        Discover authentic Filipino recipes, share your family's
                        secret dishes, and bring the warmth of home cooking to
                        your table.
                    </p>

                    {/* Search Bar with Filter - Increased border radius */}
                    <div className="max-w-2xl mx-auto relative">
                        <div className="flex items-center bg-white rounded-full shadow-lg overflow-hidden">
                            <div className="flex-1 flex items-center px-6">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search for recipes..."
                                    value={searchTerm}
                                    onChange={handleSearch}
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
                                    <ChevronDown className="w-4 h-4 ml-1" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Recipes Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    {/* Responsive header: flex on desktop, stacked on mobile */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                                Featured Recipes
                            </h2>
                            <p className="text-gray-600">
                                Discover our most popular and beloved Filipino
                                dishes, hand-picked by our community of home
                                cooks.
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleViewAllRecipes}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="text-primary hover:text-orange-600 mt-2 sm:mt-0 self-end sm:self-auto"
                        >
                            View All Recipes
                        </Button>
                    </div>

                    {/* Recipes Grid - 4 columns */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {featuredRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>

                    {/* No Results Message */}
                    {filteredRecipes.length === 0 && searchTerm && (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">
                                No recipes found matching your criteria.
                            </p>
                        </div>
                    )}
                </div>
            </section>
            {/* Sidebar Filter Menu */}
            <FilterMenu
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
};

export default Index;
