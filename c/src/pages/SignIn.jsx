// src/pages/SignIn.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Button from "@/components/Button";
import { Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import logo from "@/assets/images/logo.svg";

const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // No validation - direct navigation to Dashboard
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="w-full max-w-md">
                <div className="bg-white rounded-3xl p-8">
                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="flex justify-center mb-4">
                            <img
                                src={logo}
                                alt="LutongBahay Logo"
                                className="h-16 w-auto"
                            />
                        </div>
                        <h1 className="text-3xl font-bold text-primary font-logo">
                            LutongBahay
                        </h1>
                        <p className="text-gray-500 mt-2">Welcome back!</p>
                    </div>

                    {/* Sign In Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            fullWidth
                            icon={LogIn}
                            iconPosition="right"
                            className="mt-6 rounded-xl font-semibold"
                        >
                            Sign In
                        </Button>
                    </form>

                    {/* Sign Up Link */}
                    <p className="text-center text-gray-600 mt-6">
                        Don't have an account?{" "}
                        <Link
                            to="/signup"
                            className="text-primary hover:underline font-medium"
                        >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default SignIn;