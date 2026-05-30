// src/components/Badge.jsx
import React from "react";

const Badge = ({ children, variant = "soft", color = "primary", className = "" }) => {
    const variants = {
        solid: {
            primary: "bg-primary text-white",
            red: "bg-red-600 text-white",
            blue: "bg-blue-600 text-white",
            green: "bg-green-600 text-white",
            yellow: "bg-yellow-600 text-white",
            orange: "bg-orange-600 text-white",
            purple: "bg-purple-600 text-white",
            gray: "bg-gray-600 text-white"
        },
        soft: {
            primary: "bg-primary/10 text-primary",
            red: "bg-red-100 text-red-700",
            blue: "bg-blue-100 text-blue-700",
            green: "bg-green-100 text-green-700",
            yellow: "bg-yellow-100 text-yellow-700",
            orange: "bg-orange-100 text-orange-700",
            purple: "bg-purple-100 text-purple-700",
            gray: "bg-gray-100 text-gray-700"
        },
        outline: {
            primary: "border-2 border-primary text-primary bg-transparent",
            red: "border-2 border-red-600 text-red-600 bg-transparent",
            blue: "border-2 border-blue-600 text-blue-600 bg-transparent",
            green: "border-2 border-green-600 text-green-600 bg-transparent",
            yellow: "border-2 border-yellow-600 text-yellow-600 bg-transparent",
            orange: "border-2 border-orange-600 text-orange-600 bg-transparent",
            purple: "border-2 border-purple-600 text-purple-600 bg-transparent",
            gray: "border-2 border-gray-600 text-gray-600 bg-transparent"
        },
        ghost: {
            primary: "text-primary hover:bg-primary/10",
            red: "text-red-600 hover:bg-red-100",
            blue: "text-blue-600 hover:bg-blue-100",
            green: "text-green-600 hover:bg-green-100",
            yellow: "text-yellow-600 hover:bg-yellow-100",
            orange: "text-orange-600 hover:bg-orange-100",
            purple: "text-purple-600 hover:bg-purple-100",
            gray: "text-gray-600 hover:bg-gray-100"
        }
    };

    const badgeStyle = variants[variant]?.[color] || variants.soft.primary;

    return (
        <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors duration-200 ${badgeStyle} ${className}`}
        >
            {children}
        </span>
    );
};

export default Badge;