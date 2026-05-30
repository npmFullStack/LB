// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MainLayout from "@/layouts/MainLayout";
import BackLayout from "@/layouts/BackLayout";
import Home from "@/pages/Home";
import SignIn from "@/pages/SignIn";
import SignUp from "@/pages/SignUp";

function App() {
    return (
        <Router>
            <Routes>
                {/* Routes using MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Home />} />
                    {/* Add more MainLayout routes here */}
                </Route>

                {/* Routes using BackLayout */}
                <Route element={<BackLayout />}>
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                </Route>
            </Routes>
        </Router>
    );
}

export default App;