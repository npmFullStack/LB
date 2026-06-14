// src/App.jsx (updated)
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import BackLayout from "@/layouts/BackLayout";
import AppLayout from "@/layouts/AppLayout";
import Index from "@/pages/Index";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import RecipeDetails from "@/pages/RecipeDetails";
import UserDetails from "@/pages/UserDetails";
import AllRecipes from "@/pages/AllRecipes";
import SearchRecipe from "@/pages/SearchRecipe";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import EditProfile from "@/pages/EditProfile";
import NewRecipe from "@/pages/NewRecipe";

function App() {
    return (
        <Router>
            <Routes>
                {/* Landing page with MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Index />} />
                </Route>

                {/* Authenticated pages with AppLayout */}
                <Route element={<AppLayout />}>
                    <Route path="/home" element={<Home />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/profile/edit" element={<EditProfile />} />
                    <Route path="/new-recipe" element={<NewRecipe />} />
                    <Route path="/search-recipe" element={<SearchRecipe />} />
                </Route>

                {/* Routes with BackLayout */}
                <Route element={<BackLayout />}>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                    <Route path="/recipe/:id" element={<RecipeDetails />} />
                    <Route path="/user/:userId" element={<UserDetails />} />
                    <Route path="/recipes" element={<AllRecipes />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
