// src/layouts/BackLayout.jsx
import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import Button from "@/components/Button";
import { ArrowLeft } from "lucide-react";

const BackLayout = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const handleBack = () => {
        const path = location.pathname;
        if (path === "/signin" || path === "/signup") {
            navigate("/");
        } else {
            navigate(-1);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gradient-to-br from-orange-50 to-amber-50">
            {/* Header with Back Button */}
            <header className="bg-white backdrop-blur-sm shadow-sm sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleBack}
                        icon={ArrowLeft}
                        iconPosition="left"
                        className="text-gray-600 hover:text-primary"
                    >
                        {location.pathname === "/signin" ||
                        location.pathname === "/signup"
                            ? "Back to Home"
                            : "Back"}
                    </Button>
                </div>
            </header>

            {/* Main Content - Removed centering classes */}
            <main className="flex-grow bg-white">
                <Outlet />
            </main>
        </div>
    );
};

export default BackLayout;
