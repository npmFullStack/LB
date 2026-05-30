// src/components/Button.jsx
import React from "react";

const Button = ({
    children,
    variant = "primary",
    size = "md",
    type = "button",
    disabled = false,
    fullWidth = false,
    onClick,
    className = "",
    icon: Icon,
    iconPosition = "left",
    iconClassName = "", 
    ...props
}) => {
    const variants = {
        primary: "bg-primary text-white hover:bg-orange-600",
        outline: "border-2 border-primary text-primary hover:bg-orange-50",
        ghost: "text-gray-600 hover:bg-gray-100"
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm",
        md: "px-4 py-2 text-base",
        lg: "px-6 py-3 text-lg",
        xl: "px-8 py-4 text-xl"
    };

    const widthStyle = fullWidth ? "w-full" : "";
    const baseStyle =
        "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2";

    const showIcon = () => {
        if (!Icon) return null;
        return <Icon className={iconClassName} />;
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={`
        ${baseStyle}
        ${variants[variant]}
        ${sizes[size]}
        ${widthStyle}
        ${className}
      `}
            {...props}
        >
            {iconPosition === "left" && showIcon()}
            {children}
            {iconPosition === "right" && showIcon()}
        </button>
    );
};

export default Button;