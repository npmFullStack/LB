// src/components/RecipeCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import Button from "./Button";
import Badge from "./Badge";
import {
    Clock,
    Users,
    ChefHat,
    ArrowRight,
    Coffee,
    Utensils,
    IceCream,
    Apple,
    Soup,
    User
} from "lucide-react";

const RecipeCard = ({ recipe }) => {
    const navigate = useNavigate();
    const {
        id,
        title,
        image,
        category,
        servings,
        cookTime,
        difficulty,
        description,
        uploader
    } = recipe;

    // Function to get badge color and icon based on category
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

    const { color, icon: CategoryIcon } = getBadgeConfig(category);

    const handleViewRecipe = () => {
        navigate(`/recipe/${id}`);
    };

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Badge on Top Right */}
                <div className="absolute top-3 right-3">
                    <Badge variant="solid" color={color}>
                        <div className="flex items-center gap-1">
                            {CategoryIcon && (
                                <CategoryIcon className="w-3 h-3" />
                            )}
                            <span>{category}</span>
                        </div>
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1">
                    {title}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                    {description}
                </p>

                {/* Uploader Info */}
                <div className="flex items-center gap-2 mb-3 p-2 bg-gray-50 rounded-lg">
                    <img
                        src={uploader?.avatar}
                        alt={uploader?.name}
                        className="w-6 h-6 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                        <span className="text-xs text-gray-500">Uploaded by</span>
                        <span className="text-sm font-medium text-gray-700">
                            {uploader?.name}
                        </span>
                    </div>
                </div>

                {/* Recipe Details - Made text larger */}
                <div className="grid grid-cols-3 gap-2 mb-4 text-gray-700">
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                        <Users className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">{servings}</span>
                        <span className="text-xs text-gray-500">Servings</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                        <Clock className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold">{cookTime}</span>
                        <span className="text-xs text-gray-500">Cook Time</span>
                    </div>
                    <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 rounded-lg">
                        <ChefHat className="w-4 h-4 text-primary" />
                        <span className="text-sm font-semibold capitalize">{difficulty}</span>
                        <span className="text-xs text-gray-500">Difficulty</span>
                    </div>
                </div>

                {/* View Details Button */}
                <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={handleViewRecipe}
                    icon={ArrowRight}
                    iconPosition="right"
                    iconClassName="w-5 h-5"
                >
                    View Recipe
                </Button>
            </div>
        </div>
    );
};

export default RecipeCard;