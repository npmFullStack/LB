// src/pages/RecipeDetails.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipes } from "@/data/mock_data";
import { 
    ArrowLeft, 
    Clock, 
    Users, 
    ChefHat, 
    Star, 
    List,
    Utensils,
    User,
    Calendar,
    BookOpen,
    CheckCircle
} from "lucide-react";
import Button from "@/components/Button";

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Find the recipe by ID
        const foundRecipe = recipes.find(r => r.id === parseInt(id));
        setRecipe(foundRecipe);
        setLoading(false);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading recipe...</p>
                </div>
            </div>
        );
    }

    if (!recipe) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Recipe Not Found</h2>
                    <p className="text-gray-600 mb-6">The recipe you're looking for doesn't exist.</p>
                    <Button onClick={() => navigate("/")} variant="primary">
                        Back to Home
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Section with Recipe Image */}
            <div className="relative h-[40vh] md:h-[50vh] lg:h-[60vh] overflow-hidden">
                <img 
                    src={recipe.image} 
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent"></div>
                
                {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 md:top-6 md:left-6 bg-white/90 hover:bg-white rounded-full p-2 transition-all duration-200"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-800" />
                </button>
            </div>

            {/* Recipe Content */}
            <div className="container mx-auto px-4 -mt-20 md:-mt-24 relative z-10">
                <div className="max-w-4xl mx-auto">
                    {/* Recipe Card */}
                    <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                        {/* Recipe Header */}
                        <div className="p-6 md:p-8">
                            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
                                {recipe.title}
                            </h1>
                            
                            {/* Uploader Info */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b border-gray-200">
                                <div className="flex items-center gap-3">
                                    <img 
                                        src={recipe.uploader?.avatar}
                                        alt={recipe.uploader?.name}
                                        className="w-12 h-12 rounded-full object-cover border-2 border-primary"
                                    />
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <User className="w-4 h-4 text-primary" />
                                            <span className="text-sm text-gray-600">Uploaded by</span>
                                        </div>
                                        <p className="font-semibold text-gray-800">{recipe.uploader?.name}</p>
                                        <div className="flex items-center gap-1 text-xs text-gray-500">
                                            <Calendar className="w-3 h-3" />
                                            <span>Member since {recipe.uploader?.joinDate}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-5 h-5 text-yellow-400 fill-current" />
                                    <span className="text-lg font-bold text-gray-800">{recipe.rating}</span>
                                    <span className="text-gray-500">/5</span>
                                </div>
                            </div>

                            {/* Recipe Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-8">
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <Users className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{recipe.servings}</p>
                                    <p className="text-sm text-gray-600">Servings</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <Clock className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-800">{recipe.cookTime}</p>
                                    <p className="text-sm text-gray-600">Cook Time</p>
                                </div>
                                <div className="text-center p-3 bg-gray-50 rounded-xl">
                                    <ChefHat className="w-6 h-6 text-primary mx-auto mb-2" />
                                    <p className="text-2xl font-bold text-gray-800 capitalize">{recipe.difficulty}</p>
                                    <p className="text-sm text-gray-600">Difficulty</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <BookOpen className="w-6 h-6 text-primary" />
                                    Description
                                </h2>
                                <p className="text-gray-700 leading-relaxed">{recipe.description}</p>
                            </div>

                            {/* Ingredients */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <Utensils className="w-6 h-6 text-primary" />
                                    Ingredients
                                </h2>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {recipe.ingredients.map((ingredient, index) => (
                                        <li key={index} className="flex items-center gap-2 text-gray-700">
                                            <CheckCircle className="w-4 h-4 text-primary" />
                                            <span>{ingredient}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Steps */}
                            <div className="mb-8">
                                <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
                                    <List className="w-6 h-6 text-primary" />
                                    Cooking Instructions
                                </h2>
                                <div className="space-y-4">
                                    {recipe.steps.map((step, index) => (
                                        <div key={index} className="flex gap-3">
                                            <div className="flex-shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-bold">
                                                {index + 1}
                                            </div>
                                            <p className="text-gray-700 leading-relaxed flex-1">{step}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecipeDetails;