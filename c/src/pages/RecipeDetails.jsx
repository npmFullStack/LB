// src/pages/RecipeDetails.jsx
import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { recipes } from "@/data/mock_data";
import Badge from "@/components/Badge";
import Button from "@/components/Button";
import {
    Clock,
    Users,
    ChefHat,
    Coffee,
    Utensils,
    IceCream,
    Apple,
    Soup,
    BookOpen,
    ListOrdered
} from "lucide-react";

const getBadgeConfig = cat => {
    const config = {
        Beverage: { color: "blue", icon: Coffee },
        "Main Dish": { color: "orange", icon: Utensils },
        Dessert: { color: "yellow", icon: IceCream },
        Appetizer: { color: "green", icon: Apple },
        Soup: { color: "red", icon: Soup }
    };
    return config[cat] || { color: "gray", icon: null };
};

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const recipe = recipes.find(r => String(r.id) === String(id));

    const [activeTab, setActiveTab] = useState("ingredients");

    if (!recipe) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <h2 className="text-2xl font-bold text-gray-800">
                    Recipe not found
                </h2>
                <p className="text-gray-500">
                    The recipe you're looking for doesn't exist.
                </p>
                <Button variant="primary" onClick={() => navigate("/")}>
                    Go Home
                </Button>
            </div>
        );
    }

    const {
        title,
        image,
        category,
        servings,
        cookTime,
        difficulty,
        description,
        uploader,
        ingredients = [],
        steps = [],
    } = recipe;

    const { color, icon: CategoryIcon } = getBadgeConfig(category);

    const difficultyColor =
        {
            easy: "green",
            medium: "orange",
            hard: "red"
        }[difficulty?.toLowerCase()] || "gray";

    const handleUploaderClick = () => {
        navigate(`/user/${uploader.id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Image - Full Width */}
            <div className="relative h-72 md:h-96 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <Badge variant="soft" color={color}>
                        <div className="flex items-center gap-1">
                            {CategoryIcon && (
                                <CategoryIcon className="w-3 h-3" />
                            )}
                            <span>{category}</span>
                        </div>
                    </Badge>
                </div>

                {/* Title over image */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-1 drop-shadow">
                        {title}
                    </h1>
                    <p className="text-gray-200 text-sm md:text-base line-clamp-2 max-w-3xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Main Content - Full Width */}
            <div className="max-w-5xl mx-auto px-6 md:px-8 py-8 md:py-12 space-y-6">
                {/* Meta Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 flex flex-wrap gap-6 items-center justify-between shadow-sm">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">
                                    Servings
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {servings}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">
                                    Cook Time
                                </p>
                                <p className="text-sm font-semibold text-gray-800">
                                    {cookTime}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">
                                    Difficulty
                                </p>
                                <Badge
                                    variant="outline"
                                    color={difficultyColor}
                                    className="mt-0.5 capitalize"
                                >
                                    {difficulty}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Uploader - Made Clickable */}
                    <button
                        onClick={handleUploaderClick}
                        className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer group"
                    >
                        <img
                            src={uploader?.avatar}
                            alt={uploader?.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20 group-hover:ring-primary/40 transition-all"
                        />
                        <div className="text-left">
                            <p className="text-xs text-gray-400">Uploaded by</p>
                            <p className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
                                {uploader?.name}
                            </p>
                        </div>
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 bg-white rounded-xl border border-gray-100 p-1 w-fit">
                    <button
                        onClick={() => setActiveTab("ingredients")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === "ingredients"
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        <BookOpen className="w-4 h-4" />
                        Ingredients
                    </button>
                    <button
                        onClick={() => setActiveTab("steps")}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                            activeTab === "steps"
                                ? "bg-primary text-white shadow-sm"
                                : "text-gray-500 hover:text-gray-800"
                        }`}
                    >
                        <ListOrdered className="w-4 h-4" />
                        Instructions
                    </button>
                </div>

                {/* Ingredients Tab - No checkboxes */}
                {activeTab === "ingredients" && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                            Ingredients
                        </h2>
                        {ingredients.length === 0 ? (
                            <p className="text-gray-400 text-sm">
                                No ingredients listed.
                            </p>
                        ) : (
                            <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {ingredients.map((ing, i) => (
                                    <li
                                        key={i}
                                        className="flex items-center gap-3 p-3 text-gray-700"
                                    >
                                        <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                                        <span className="text-sm">{ing}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Steps Tab - No checkboxes */}
                {activeTab === "steps" && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 shadow-sm">
                        <h2 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
                            Instructions
                        </h2>
                        {steps.length === 0 ? (
                            <p className="text-gray-400 text-sm">
                                No instructions listed.
                            </p>
                        ) : (
                            <ol className="space-y-4">
                                {steps.map((step, i) => (
                                    <li
                                        key={i}
                                        className="flex gap-4 p-3 text-gray-700"
                                    >
                                        <div className="shrink-0 w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                                            {i + 1}
                                        </div>
                                        <p className="text-sm leading-relaxed pt-0.5">
                                            {step}
                                        </p>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecipeDetails;