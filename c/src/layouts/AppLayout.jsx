// src/layouts/AppLayout.jsx
import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import Button from "@/components/Button";
import UserMenu from "@/components/UserMenu";
import { Home, Search, User, Menu, X } from "lucide-react";
import logo from "@/assets/images/logo.svg";

const AppLayout = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    // Mock current user
    const currentUser = {
        id: 1,
        name: "Maria Santos",
        email: "maria.santos@example.com",
        avatar: "https://randomuser.me/api/portraits/women/1.jpg"
    };

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navItems = [
        { path: "/home", label: "Home", icon: Home },
        { path: "/search-recipe", label: "Search Recipe", icon: Search },
          { path: "/profile", label: "Profile", icon: User },

 ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            {/* Header */}
            <header
                className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
                    isScrolled
                        ? "bg-white shadow-md"
                        : "bg-white/95 backdrop-blur-sm shadow-sm"
                }`}
            >
                <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                    {/* Logo Section with Mobile Menu Button */}
                    <div className="flex items-center gap-3 shrink-0">
                        {/* Mobile Menu Toggle Button */}
                        <button
                            onClick={() =>
                                setIsMobileMenuOpen(!isMobileMenuOpen)
                            }
                            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isMobileMenuOpen ? (
                                <X className="w-5 h-5 text-gray-600" />
                            ) : (
                                <Menu className="w-5 h-5 text-gray-600" />
                            )}
                        </button>

                        <Link to="/home" className="flex items-center gap-3">
                            <img
                                src={logo}
                                alt="LutongBahay Logo"
                                className="h-10 w-auto"
                            />
                            <span className="font-logo text-2xl font-black text-primary">
                                LutongBahay
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation Buttons - Centered */}
                    <div className="hidden md:flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <div key={item.path} className="relative">
                                    <Button
                                        variant={isActive ? "ghost" : "ghost"}
                                        size="md"
                                        icon={item.icon}
                                        iconPosition="left"
                                        onClick={() => navigate(item.path)}
                                        className={`${
                                            isActive
                                                ? "text-primary"
                                                : "text-gray-600 hover:text-primary"
                                        }`}
                                    >
                                        {item.label}
                                    </Button>
                                    {isActive && (
                                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* User Menu - Right */}
                    <div className="shrink-0">
                        <UserMenu user={currentUser} />
                    </div>
                </div>

                {/* Mobile Navigation - Dropdown Menu with Animation */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen
                            ? "max-h-96 opacity-100"
                            : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="bg-white border-t border-gray-200 py-2 px-4 shadow-lg">
                        {navItems.map(item => {
                            const isActive = location.pathname === item.path;
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => navigate(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                                        isActive
                                            ? "text-primary bg-primary/5"
                                            : "text-gray-600 hover:text-primary hover:bg-gray-50"
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    <span className="font-medium">
                                        {item.label}
                                    </span>
                                    {isActive && (
                                        <div className="ml-auto w-1 h-6 bg-primary rounded-full"></div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            </header>

            {/* Main Content - Add padding for fixed header */}
            <main className="flex-grow pt-20 pb-16 md:pb-0">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;
