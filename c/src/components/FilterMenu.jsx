// src/components/FilterMenu.jsx
import React, { useState, useEffect } from "react";
import Button from "./Button";
import Select from "./Select";
import { X, ListFilter, RotateCcw, CheckCircle } from "lucide-react";

const FilterMenu = ({ isOpen, onClose, onApplyFilters }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [maxCookTime, setMaxCookTime] = useState("");
    const [sortBy, setSortBy] = useState("");

    const categories = [
        "All Categories",
        "Main Dish",
        "Beverage",
        "Dessert",
        "Appetizer",
        "Soup"
    ];
    
    const difficulties = ["All Levels", "Easy", "Medium", "Hard"];
    const cookTimes = ["Any Time", "Under 30 min", "30-60 min", "Over 60 min"];
    const sortOptions = [
        "Newest",
        "Popular",
        "Cook Time: Low to High",
        "Cook Time: High to Low"
    ];

    // Close on escape key
    useEffect(() => {
        const handleEsc = e => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const handleApply = () => {
        const filters = {
            category: selectedCategory === "All Categories" ? "" : selectedCategory,
            difficulty: selectedDifficulty === "All Levels" ? "" : selectedDifficulty,
            maxCookTime: maxCookTime === "Any Time" ? "" : maxCookTime,
            sortBy
        };
        onApplyFilters(filters);
        onClose();
    };

    const handleReset = () => {
        setSelectedCategory("");
        setSelectedDifficulty("");
        setMaxCookTime("");
        setSortBy("");
        onApplyFilters({});
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Sidebar */}
            <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 overflow-y-auto">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
                        <div className="flex items-center gap-2">
                            <ListFilter className="w-6 h-6 text-primary" />
                            <h3 className="text-2xl font-bold text-gray-800 font-sans">
                                Filter Recipes
                            </h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                            Category
                        </label>
                        <Select
                            options={categories}
                            value={selectedCategory}
                            onChange={setSelectedCategory}
                            placeholder="Select category..."
                            isClearable={true}
                        />
                    </div>

                    {/* Difficulty Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                            Difficulty Level
                        </label>
                        <Select
                            options={difficulties}
                            value={selectedDifficulty}
                            onChange={setSelectedDifficulty}
                            placeholder="Select difficulty..."
                            isClearable={true}
                        />
                    </div>

                    {/* Cook Time Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                            Cook Time
                        </label>
                        <Select
                            options={cookTimes}
                            value={maxCookTime}
                            onChange={setMaxCookTime}
                            placeholder="Select cook time..."
                            isClearable={true}
                        />
                    </div>

                    {/* Sort By */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2 font-sans">
                            Sort By
                        </label>
                        <Select
                            options={sortOptions}
                            value={sortBy}
                            onChange={setSortBy}
                            placeholder="Sort by..."
                            isClearable={true}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                        <Button
                            variant="outline"
                            size="md"
                            fullWidth
                            icon={RotateCcw}
                            iconPosition="left"
                            onClick={handleReset}
                        >
                            Reset Filters
                        </Button>
                        <Button
                            variant="primary"
                            size="md"
                            fullWidth
                            icon={CheckCircle}
                            iconPosition="left"
                            onClick={handleApply}
                        >
                            Apply Filters
                        </Button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default FilterMenu;