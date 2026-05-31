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
        uploader,
    } = recipe;

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

    const { color, icon: CategoryIcon } = getBadgeConfig(category);

    const handleViewRecipe = () => {
        navigate(`/recipe/${id}`);
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-primary/30 hover:shadow-lg transition-all duration-300 flex flex-col">
            {/* Image Container */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                    <Badge variant="solid" color={color}>
                        <div className="flex items-center gap-1">
                            {CategoryIcon && <CategoryIcon className="w-3 h-3" />}
                            <span>{category}</span>
                        </div>
                    </Badge>
                </div>
            </div>

            {/* Content */}
            <div className="p-4 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-gray-800 mb-1 line-clamp-1">
                    {title}
                </h3>
                <p className="text-gray-500 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {description}
                </p>

                {/* Recipe Details — vertical, left-aligned, no bg */}
                <div className="flex flex-col gap-2 mb-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <Users className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm">
                            <span className="font-semibold text-gray-800">{servings}</span>
                            <span className="text-gray-400 ml-1">servings</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm">
                            <span className="font-semibold text-gray-800">{cookTime}</span>
                            <span className="text-gray-400 ml-1">cook time</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                        <ChefHat className="w-4 h-4 text-primary shrink-0" />
                        <span className="text-sm">
                            <span className="font-semibold text-gray-800 capitalize">{difficulty}</span>
                            <span className="text-gray-400 ml-1">difficulty</span>
                        </span>
                    </div>
                </div>

                {/* Bottom row — uploader right, button fills width */}
                <div className="mt-auto pt-3 border-t border-gray-100">
                    <div className="flex items-center justify-between mb-3">
                        <span className="text-xs text-gray-400">Uploaded by</span>
                        <div className="flex items-center gap-2">
                            <span className="text-xs font-medium text-gray-700">
                                {uploader?.name}
                            </span>
                            <img
                                src={uploader?.avatar}
                                alt={uploader?.name}
                                className="w-6 h-6 rounded-full object-cover ring-1 ring-gray-200"
                            />
                        </div>
                    </div>

                    <Button
                        variant="outline"
                        size="md"
                        fullWidth
                        onClick={handleViewRecipe}
                        icon={ArrowRight}
                        iconPosition="right"
                        iconClassName="w-4 h-4"
                    >
                        View Recipe
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default RecipeCard;