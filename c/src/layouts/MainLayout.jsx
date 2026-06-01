// src/layouts/MainLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import Button from "@/components/Button";
import { Menu, X, Search, Upload } from "lucide-react";
import logo from "@/assets/images/logo.svg";

const MainLayout = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleFindRecipe = () => {
        navigate("/recipes");
    };

    const handleShareRecipe = () => {
        navigate("/signin");
    };

    return (
        <div className="min-h-screen flex flex-col">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled ? "bg-white shadow-md" : "bg-transparent"
                }`}
            >
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    {/* Logo Section */}
                    <Link to="/" className="flex items-center gap-3">
                        <img
                            src={logo}
                            alt="LutongBahay Logo"
                            className="h-10 w-auto"
                        />
                        <span
                            className={`font-logo text-2xl font-black transition-colors duration-300 ${
                                isScrolled ? "text-primary" : "text-white"
                            }`}
                        >
                            LutongBahay
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="md"
                            icon={Search}
                            iconPosition="left"
                            onClick={handleFindRecipe}
                            className={
                                isScrolled
                                    ? "text-primary"
                                    : "text-white hover:bg-white/10"
                            }
                        >
                            Find Recipe
                        </Button>
                        <Button
                            variant={isScrolled ? "primary" : "outline"}
                            size="md"
                            icon={Upload}
                            iconPosition="left"
                            onClick={handleShareRecipe}
                            className={
                                !isScrolled
                                    ? "bg-white text-primary border-0 hover:bg-gray-100"
                                    : ""
                            }
                        >
                            Share Recipe
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className={`md:hidden p-2 rounded-lg transition-colors ${
                            isScrolled
                                ? "hover:bg-gray-100"
                                : "hover:bg-white/10"
                        }`}
                    >
                        {isMobileMenuOpen ? (
                            <X
                                className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`}
                            />
                        ) : (
                            <Menu
                                className={`w-6 h-6 ${isScrolled ? "text-gray-700" : "text-white"}`}
                            />
                        )}
                    </button>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-white shadow-lg border-t">
                        <div className="container mx-auto px-4 py-4 flex flex-col gap-3">
                            <Button
                                variant="ghost"
                                size="md"
                                fullWidth
                                icon={Search}
                                iconPosition="left"
                                onClick={handleFindRecipe}
                                className="text-primary justify-center"
                            >
                                Find Recipe
                            </Button>
                            <Button
                                variant="primary"
                                size="md"
                                fullWidth
                                icon={Upload}
                                iconPosition="left"
                                onClick={handleShareRecipe}
                                className="justify-center"
                            >
                                Share Recipe
                            </Button>
                        </div>
                    </div>
                )}
            </header>

            {/* Main Content - Outlet renders child routes */}
            <main className="flex-grow pt-0">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-white py-6 mt-auto">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-sm">
                        &copy; {new Date().getFullYear()} LutongBahay. All
                        rights reserved.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                        Developed by Nordev
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default MainLayout;