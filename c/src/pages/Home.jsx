// src/pages/Home.jsx
import React, { useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import { recipes, users } from "@/data/mock_data";

const Home = () => {
    const [activeTab, setActiveTab] = useState("latest");

    // Get current user (mock - would come from auth)
    const currentUserId = 1;
    const currentUser = users.find(u => u.id === currentUserId);

    // Latest recipes - sort by id descending (newest first)
    const latestRecipes = [...recipes].reverse();

    // Popular recipes - sort by rating
    const popularRecipes = [...recipes].sort((a, b) => b.rating - a.rating);

    // Following recipes - recipes from users that current user follows
    // For demo, let's say user follows users with id 2 and 3
    const followingUserIds = [2, 3]; // This would come from user's following list
    const followingRecipes = recipes.filter(recipe => 
        followingUserIds.includes(recipe.uploader.id)
    );

    const getActiveRecipes = () => {
        switch (activeTab) {
            case "latest":
                return latestRecipes;
            case "popular":
                return popularRecipes;
            case "following":
                return followingRecipes;
            default:
                return latestRecipes;
        }
    };

    const tabs = [
        { id: "latest", label: "Latest Recipes" },
        { id: "popular", label: "Popular Recipes" },
        { id: "following", label: "Following" }
    ];

    const activeRecipes = getActiveRecipes();

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Welcome Section */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Welcome back, {currentUser?.name}!
                </h1>
                <p className="text-gray-600">
                    Discover delicious Filipino recipes from our community
                </p>
            </div>

            {/* Tabs */}
            <div className="flex justify-center mb-8">
                <div className="inline-flex bg-white rounded-full p-1 shadow-sm border border-gray-200">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                                activeTab === tab.id
                                    ? "bg-primary text-white shadow-md"
                                    : "text-gray-600 hover:text-primary"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Recipes Grid */}
            {activeRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {activeRecipes.map(recipe => (
                        <RecipeCard key={recipe.id} recipe={recipe} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                    <p className="text-gray-500 text-lg">
                        {activeTab === "following" 
                            ? "No recipes from users you follow yet. Start following more cooks to see their recipes!"
                            : "No recipes found."}
                    </p>
                </div>
            )}
        </div>
    );
};

export default Home;