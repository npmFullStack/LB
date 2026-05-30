// src/components/RecipeCard.jsx
import React from "react";
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
    Soup
} from "lucide-react";

const RecipeCard = ({ recipe }) => {
    const {
        title,
        image,
        category,
        servings,
        cookTime,
        difficulty,
        description
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

    return (
        <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                {/* Badge on Top Right - Now with icon! */}
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

                {/* Recipe Details */}
                <div className="flex items-center justify-between gap-2 mb-4 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{servings}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{cookTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ChefHat className="w-3 h-3" />
                        <span className="capitalize">{difficulty}</span>
                    </div>
                </div>

                {/* View Details Button */}
                <Button
                    variant="outline"
                    size="md"
                    fullWidth
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
