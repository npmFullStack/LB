// pages/Profile.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-heading text-textPrimary mb-6">
            My Profile
          </h1>

          <div className="bg-cardBg rounded-lg border border-cardBorder p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Account Information</h2>
            <p className="text-textPrimary mb-2">
              <span className="font-medium">Name:</span> {user?.firstName}{" "}
              {user?.lastName}
            </p>
            <p className="text-textPrimary mb-2">
              <span className="font-medium">Email:</span> {user?.email}
            </p>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-lg transition-colors"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;
