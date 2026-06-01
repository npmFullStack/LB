// src/components/CategoryCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

// Import all category images statically
import mainDishImg from "@/assets/categories/main-dish.png";
import beverageImg from "@/assets/categories/beverage.png";
import dessertImg from "@/assets/categories/dessert.png";
import appetizerImg from "@/assets/categories/appetizer.png";
import soupImg from "@/assets/categories/soup.png";

const CategoryCard = ({ name, image }) => {
    const navigate = useNavigate();

    // Map image names to imported images
    const imageMap = {
        "main-dish": mainDishImg,
        beverage: beverageImg,
        dessert: dessertImg,
        appetizer: appetizerImg,
        soup: soupImg
    };

    const imageUrl = imageMap[image] || mainDishImg;

    const handleClick = () => {
        navigate(`/recipes?category=${encodeURIComponent(name)}`);
    };

    return (
        <div
            onClick={handleClick}
            className="group cursor-pointer transition-all duration-300 flex items-center gap-4 bg-white rounded-xl shadow-md hover:shadow-xl p-3"
        >
            {/* Image on the left */}
            <div className="relative overflow-hidden rounded-lg w-16 h-16 flex-shrink-0 bg-gray-100">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
            </div>

            {/* Name on the right */}
            <h2 className="font-semibold text-gray-700 group-hover:text-primary transition-colors flex-1">
                {name}
            </h2>
        </div>
    );
};

export default CategoryCard;
