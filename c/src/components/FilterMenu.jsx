// src/components/FilterMenu.jsx
import React, { useState, useEffect } from "react";
import Button from "./Button";
import { X } from "lucide-react";

const FilterMenu = ({ isOpen, onClose, onApplyFilters }) => {
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedDifficulty, setSelectedDifficulty] = useState("");
    const [maxCookTime, setMaxCookTime] = useState("");
    const [sortBy, setSortBy] = useState("");

    const categories = ["All", "Main Dish", "Beverage", "Dessert", "Appetizer", "Soup"];
    const difficulties = ["All", "Easy", "Medium", "Hard"];
    const cookTimes = ["All", "Under 30 min", "30-60 min", "Over 60 min"];
    const sortOptions = ["Newest", "Popular", "Cook Time: Low to High", "Cook Time: High to Low"];

    // Close on escape key
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const handleApply = () => {
        const filters = {
            category: selectedCategory,
            difficulty: selectedDifficulty,
            maxCookTime,
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
                    <div className="flex justify-between items-center mb-6 pb-4 border-b">
                        <h3 className="text-2xl font-bold text-gray-800">Filter Recipes</h3>
                        <button 
                            onClick={onClose}
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        >
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Category Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Category
                        </label>
                        <select 
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    {/* Difficulty Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Difficulty Level
                        </label>
                        <select 
                            value={selectedDifficulty}
                            onChange={(e) => setSelectedDifficulty(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">All Levels</option>
                            {difficulties.map(diff => (
                                <option key={diff} value={diff}>{diff}</option>
                            ))}
                        </select>
                    </div>

                    {/* Cook Time Filter */}
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Cook Time
                        </label>
                        <select 
                            value={maxCookTime}
                            onChange={(e) => setMaxCookTime(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Any Time</option>
                            {cookTimes.map(time => (
                                <option key={time} value={time}>{time}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort By */}
                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sort By
                        </label>
                        <select 
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="">Default</option>
                            {sortOptions.map(option => (
                                <option key={option} value={option}>{option}</option>
                            ))}
                        </select>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t">
                        <Button 
                            variant="outline" 
                            size="md" 
                            fullWidth
                            onClick={handleReset}
                        >
                            Reset
                        </Button>
                        <Button 
                            variant="primary" 
                            size="md" 
                            fullWidth
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