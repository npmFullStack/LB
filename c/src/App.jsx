// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import BackLayout from "@/layouts/BackLayout";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";
import RecipeDetails from "@/pages/RecipeDetails";
import UserDetails from "@/pages/UserDetails";
import AllRecipes from "@/pages/AllRecipes";

function App() {
    return (
        <Router>
            <Routes>
                {/* Routes using MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                </Route>

                {/* Routes using BackLayout */}
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