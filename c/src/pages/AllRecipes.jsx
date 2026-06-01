// src/pages/AllRecipes.jsx
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import RecipeCard from "@/components/RecipeCard";
import CategoryCard from "@/components/CategoryCard";
import FilterMenu from "@/components/FilterMenu";
import Button from "@/components/Button";
import { Search, Filter, ChevronDown, ArrowRight } from "lucide-react";
import { recipes } from "@/data/mock_data";
import noResultImg from "@/assets/images/no-result.png";

const AllRecipes = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchTerm, setSearchTerm] = useState("");
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({});
    const [filteredRecipes, setFilteredRecipes] = useState(recipes);

    // Get search param from navigation
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const searchQuery = params.get("search");
        if (searchQuery) {
            setSearchTerm(searchQuery);
            applyFilters(searchQuery, filters);
        }
    }, [location.search]);

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

    const handleSearch = e => {
        const term = e.target.value;
        setSearchTerm(term);
        applyFilters(term, filters);
    };

    const handleApplyFilters = newFilters => {
        setFilters(newFilters);
        applyFilters(searchTerm, newFilters);
        setIsFilterOpen(false);
    };

    const handleViewAllRecipes = () => {
        navigate("/recipes");
    };

    // Categories data
    const categories = [
        { name: "Main Dish", image: "main-dish" },
        { name: "Beverage", image: "beverage" },
        { name: "Dessert", image: "dessert" },
        { name: "Appetizer", image: "appetizer" },
        { name: "Soup", image: "soup" }
    ];

    // Get popular recipes (top 6 by rating)
    const popularRecipes = [...recipes]
        .sort((a, b) => b.rating - a.rating)
        .slice(0, 6);

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8">
                {/* Header with Search */}
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
                        All Recipes
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Discover and explore our complete collection of
                        authentic Filipino recipes
                    </p>

                    {/* Search Bar */}
                    <div className="max-w-2xl">
                        <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden border border-gray-200">
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

                {/* Browse By Category Section */}
                <section className="mb-16">
                    <div className="mb-6">
                        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                            Browse By Category
                        </h2>
                        <p className="text-gray-600 mt-1">
                            Explore recipes by dish type
                        </p>
                    </div>
                    {/* Grid: 2 cols on mobile, 3 cols on desktop with max width for cards */}
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-w-xl mx-auto md:max-w-none">
                        {categories.map(category => (
                            <CategoryCard
                                key={category.name}
                                name={category.name}
                                image={category.image}
                            />
                        ))}
                    </div>{" "}
                </section>

                {/* Popular Recipes Section */}
                <section className="mb-16">
                    {/* Responsive header: flex on desktop, stacked on mobile */}
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
                        <div>
                            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                Popular Recipes
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Most loved by our community
                            </p>
                        </div>
                        <Button
                            variant="ghost"
                            onClick={handleViewAllRecipes}
                            icon={ArrowRight}
                            iconPosition="right"
                            className="text-primary hover:text-orange-600 mt-2 sm:mt-0 self-end sm:self-auto"
                        >
                            View All
                        </Button>
                    </div>
                    {/* Grid: 1 col on mobile, 2 cols on tablet, 4 cols on desktop */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {popularRecipes.map(recipe => (
                            <RecipeCard key={recipe.id} recipe={recipe} />
                        ))}
                    </div>
                </section>
            </div>
            {/* Footer */}
            <footer className="bg-gray-900 text-white py-6 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} LutongBahay. All
                        rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Developed by Nordev
                    </p>
                </div>
            </footer>

            {/* Sidebar Filter Menu */}
            <FilterMenu
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApplyFilters={handleApplyFilters}
            />
        </div>
    );
};

export default AllRecipes;
