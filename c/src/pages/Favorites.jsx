// src/pages/Favorites.jsx
import React, { useState } from "react";
import RecipeCard from "@/components/RecipeCard";
import Button from "@/components/Button";
import { recipes } from "@/data/mock_data";
import { Heart, Trash2 } from "lucide-react";

const Favorites = () => {
    // Get favorite recipes (mock - would come from user's favorites list)
    const [favoriteRecipes, setFavoriteRecipes] = useState(
        recipes.filter(recipe => recipe.isFavorite)
    );

    const handleRemoveFavorite = (recipeId) => {
        setFavoriteRecipes(favoriteRecipes.filter(recipe => recipe.id !== recipeId));
    };

    const handleClearAll = () => {
        setFavoriteRecipes([]);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8">
                <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                        My Favorites
                    </h1>
                    <p className="text-gray-600">
                        Recipes you've saved for later
                    </p>
                </div>
                {favoriteRecipes.length > 0 && (
                    <Button
                        variant="outline"
                        size="md"
                        icon={Trash2}
                        onClick={handleClearAll}
                        className="mt-4 sm:mt-0 text-red-500 hover:text-red-600 border-red-200 hover:border-red-300"
                    >
                        Clear All
                    </Button>
                )}
            </div>

            {/* Stats */}
            {favoriteRecipes.length > 0 && (
                <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-2xl p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-pink-600 font-medium">Saved Recipes</p>
                            <p className="text-3xl font-bold text-gray-800">{favoriteRecipes.length}</p>
                        </div>
                        <Heart className="w-12 h-12 text-pink-400 fill-pink-400" />
                    </div>
                </div>
            )}

            {/* Recipes Grid */}
            {favoriteRecipes.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {favoriteRecipes.map(recipe => (
                        <div key={recipe.id} className="relative group">
                            <RecipeCard recipe={recipe} />
                            {/* Remove Favorite Button */}
                            <button
                                onClick={() => handleRemoveFavorite(recipe.id)}
                                className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-500 hover:text-white z-10"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                            {/* Favorite Badge */}
                            <div className="absolute top-2 left-2">
                                <div className="bg-red-500 text-white rounded-full p-1.5 shadow-md">
                                    <Heart className="w-3 h-3 fill-white" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 bg-white rounded-2xl">
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg mb-4">
                        You haven't added any favorite recipes yet.
                    </p>
                    <Button variant="primary" onClick={() => window.location.href = "/home"}>
                        Discover Recipes
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Favorites;