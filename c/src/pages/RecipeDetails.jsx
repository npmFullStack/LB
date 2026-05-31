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
    CheckCircle2,
    Circle,
    BookOpen,
    ListOrdered,
} from "lucide-react";

const getBadgeConfig = (cat) => {
    const config = {
        Beverage: { color: "blue", icon: Coffee },
        "Main Dish": { color: "orange", icon: Utensils },
        Dessert: { color: "yellow", icon: IceCream },
        Appetizer: { color: "green", icon: Apple },
        Soup: { color: "red", icon: Soup },
    };
    return config[cat] || { color: "gray", icon: null };
};

const RecipeDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const recipe = recipes.find((r) => String(r.id) === String(id));

    const [checkedIngredients, setCheckedIngredients] = useState([]);
    const [checkedSteps, setCheckedSteps] = useState([]);
    const [activeTab, setActiveTab] = useState("ingredients");

    if (!recipe) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
                <h2 className="text-2xl font-bold text-gray-800">Recipe not found</h2>
                <p className="text-gray-500">The recipe you're looking for doesn't exist.</p>
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
        rating,
    } = recipe;

    const { color, icon: CategoryIcon } = getBadgeConfig(category);

    const toggleIngredient = (i) => {
        setCheckedIngredients((prev) =>
            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
        );
    };

    const toggleStep = (i) => {
        setCheckedSteps((prev) =>
            prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]
        );
    };

    const difficultyColor = {
        easy: "green",
        medium: "orange",
        hard: "red",
    }[difficulty?.toLowerCase()] || "gray";

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Hero Image */}
            <div className="relative h-72 md:h-96 w-full overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                    <Badge variant="solid" color={color}>
                        <div className="flex items-center gap-1">
                            {CategoryIcon && <CategoryIcon className="w-3 h-3" />}
                            <span>{category}</span>
                        </div>
                    </Badge>
                </div>

                {/* Title over image */}
                <div className="absolute bottom-0 left-0 right-0 px-6 pb-6">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-1 drop-shadow">
                        {title}
                    </h1>
                    <p className="text-gray-200 text-sm line-clamp-2 max-w-2xl">
                        {description}
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

                {/* Meta Bar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-wrap gap-6 items-center justify-between">
                    <div className="flex flex-wrap gap-6">
                        <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">Servings</p>
                                <p className="text-sm font-semibold text-gray-800">{servings}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">Cook Time</p>
                                <p className="text-sm font-semibold text-gray-800">{cookTime}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <ChefHat className="w-5 h-5 text-primary" />
                            <div>
                                <p className="text-xs text-gray-400">Difficulty</p>
                                <Badge variant="soft" color={difficultyColor} className="mt-0.5 capitalize">
                                    {difficulty}
                                </Badge>
                            </div>
                        </div>
                    </div>

                    {/* Uploader */}
                    <div className="flex items-center gap-3">
                        <img
                            src={uploader?.avatar}
                            alt={uploader?.name}
                            className="w-10 h-10 rounded-full object-cover ring-2 ring-primary/20"
                        />
                        <div>
                            <p className="text-xs text-gray-400">Uploaded by</p>
                            <p className="text-sm font-semibold text-gray-800">{uploader?.name}</p>
                        </div>
                    </div>
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

                {/* Ingredients Tab */}
                {activeTab === "ingredients" && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Ingredients</h2>
                            <span className="text-xs text-gray-400">
                                {checkedIngredients.length}/{ingredients.length} checked
                            </span>
                        </div>
                        {ingredients.length === 0 ? (
                            <p className="text-gray-400 text-sm">No ingredients listed.</p>
                        ) : (
                            <ul className="space-y-2">
                                {ingredients.map((ing, i) => (
                                    <li
                                        key={i}
                                        onClick={() => toggleIngredient(i)}
                                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-200 ${
                                            checkedIngredients.includes(i)
                                                ? "bg-primary/5 text-gray-400 line-through"
                                                : "hover:bg-gray-50 text-gray-700"
                                        }`}
                                    >
                                        {checkedIngredients.includes(i) ? (
                                            <CheckCircle2 className="w-5 h-5 text-primary shrink-0" />
                                        ) : (
                                            <Circle className="w-5 h-5 text-gray-300 shrink-0" />
                                        )}
                                        <span className="text-sm">{ing}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                )}

                {/* Steps Tab */}
                {activeTab === "steps" && (
                    <div className="bg-white rounded-2xl border border-gray-100 p-5">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-bold text-gray-800">Instructions</h2>
                            <span className="text-xs text-gray-400">
                                {checkedSteps.length}/{steps.length} done
                            </span>
                        </div>
                        {steps.length === 0 ? (
                            <p className="text-gray-400 text-sm">No instructions listed.</p>
                        ) : (
                            <ol className="space-y-3">
                                {steps.map((step, i) => (
                                    <li
                                        key={i}
                                        onClick={() => toggleStep(i)}
                                        className={`flex gap-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${
                                            checkedSteps.includes(i)
                                                ? "bg-primary/5"
                                                : "hover:bg-gray-50"
                                        }`}
                                    >
                                        <div
                                            className={`shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-200 ${
                                                checkedSteps.includes(i)
                                                    ? "bg-primary text-white"
                                                    : "bg-gray-100 text-gray-500"
                                            }`}
                                        >
                                            {checkedSteps.includes(i) ? (
                                                <CheckCircle2 className="w-4 h-4" />
                                            ) : (
                                                i + 1
                                            )}
                                        </div>
                                        <p
                                            className={`text-sm leading-relaxed pt-0.5 transition-all duration-200 ${
                                                checkedSteps.includes(i)
                                                    ? "text-gray-400 line-through"
                                                    : "text-gray-700"
                                            }`}
                                        >
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