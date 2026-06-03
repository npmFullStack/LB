// src/components/BreadCrumbs.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

const BreadCrumbs = ({ items, className = "" }) => {
    const navigate = useNavigate();

    // items format: [{ label: "My Recipes", path: "/profile" }, { label: "New Recipe", path: null }]
    // If path is null, it's the active/current page

    return (
        <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
            <ol className="flex items-center flex-wrap gap-1">
                {items.map((item, index) => {
                    const isLast = index === items.length - 1;
                    
                    return (
                        <li key={index} className="flex items-center">
                            {index > 0 && (
                                <ChevronRight className="w-4 h-4 text-gray-400 mx-1" />
                            )}
                            {isLast ? (
                                <span className="text-primary font-semibold">
                                    {item.label}
                                </span>
                            ) : (
                                <Link
                                    to={item.path}
                                    className="text-gray-600 hover:text-primary transition-colors"
                                >
                                    {item.label}
                                </Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default BreadCrumbs;