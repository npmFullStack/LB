// components/layout/Header.jsx
import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  Search,
  Menu,
  X,
  User,
  LogOut,
  Home,
  BookOpen,
  Info,
  Mail,
  Compass,
  Share2,
  Bookmark,
  FileText,
} from "lucide-react";
import logo from "@/assets/images/logo.png";
import { useAuth } from "@/context/AuthContext";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/recipes", label: "Recipes", icon: BookOpen },
    { path: "/about", label: "About", icon: Info },
    { path: "/contact", label: "Contact", icon: Mail },
  ];

  const recipeNavLinks = [
    { path: "/recipes", label: "Find Recipes", icon: Compass },
    { path: "/submit-recipe", label: "Share Recipe", icon: Share2 },
    { path: "/saved-recipes", label: "Saved Recipes", icon: Bookmark },
    { path: "/my-recipes", label: "My Recipes", icon: FileText },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    closeMobileMenu();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top header with container padding */}
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center text-2xl font-heading tracking-wider"
            onClick={closeMobileMenu}
          >
            <img
              src={logo}
              alt="LutongBahay Logo"
              className="w-8 h-8 object-contain"
            />
            <span
              className="text-primary hover:text-primaryDark transition-colors"
              style={{ textShadow: "1px 1px 0 #8B5A2B" }}
            >
              LutongBahay
            </span>
          </Link>

          {/* Right section */}
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 font-sans text-sm font-medium hover:text-primary transition-colors ${
                        isActive ? "text-primary" : "text-textSecondary"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>

            {/* User Icon */}
            <Link
              to={isAuthenticated ? "/profile" : "/login"}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
            >
              <User className="w-5 h-5 text-primary" />
            </Link>

            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-2 text-textSecondary hover:text-primary transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Recipe Navigation Tabs - Full width primary bar with bigger text */}
      {isAuthenticated && (
        <div className="w-full bg-primary border-t border-primary/20">
          <div className="container mx-auto">
            <nav className="flex items-center justify-center space-x-12 py-4">
              {recipeNavLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center gap-3 font-sans text-base font-semibold py-2 px-1 transition-colors ${
                        isActive
                          ? "text-white border-b-2 border-white"
                          : "text-white/80 hover:text-white hover:border-b-2 hover:border-white/50"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </NavLink>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-borderLight">
          <div className="container mx-auto px-4 pb-2 pt-4">
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-2 font-sans text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                        isActive
                          ? "bg-primary/10 text-primary"
                          : "text-textSecondary hover:bg-gray-50 hover:text-primary"
                      }`
                    }
                  >
                    <Icon className="w-5 h-5" />
                    {link.label}
                  </NavLink>
                );
              })}

              {isAuthenticated && (
                <>
                  <div className="border-t border-borderLight my-2"></div>
                  {recipeNavLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <NavLink
                        key={link.path}
                        to={link.path}
                        onClick={closeMobileMenu}
                        className={({ isActive }) =>
                          `flex items-center gap-2 font-sans text-base font-medium py-2 px-4 rounded-lg transition-colors ${
                            isActive
                              ? "bg-primary/10 text-primary"
                              : "text-textSecondary hover:bg-gray-50 hover:text-primary"
                          }`
                        }
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </NavLink>
                    );
                  })}
                </>
              )}

              {isAuthenticated && (
                <div className="border-t border-borderLight mt-2 pt-2">
                  <div className="px-4 py-2 text-sm text-textSecondary">
                    Signed in as{" "}
                    <span className="font-medium text-textPrimary">
                      {user?.firstName} {user?.lastName}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left font-sans text-base font-medium py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
