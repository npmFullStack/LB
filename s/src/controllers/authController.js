// src/controllers/authController.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const generateToken = userId => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
    });
};

export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, avatarUrl, bio } =
            req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res
                .status(400)
                .json({ message: "User already exists with this email" });
        }

        // Create new user
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,
            avatarUrl,
            bio
        });

        // Generate token
        const token = generateToken(user.id);

        res.status(201).json({
            message: "User created successfully",
            token,
            user
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating user",
            error: error.message
        });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Verify password
        const isValidPassword = await User.verifyPassword(user, password);
        if (!isValidPassword) {
            return res
                .status(401)
                .json({ message: "Invalid email or password" });
        }

        // Generate token
        const token = generateToken(user.id);

        // Remove password hash from response
        const { password_hash, ...userWithoutPassword } = user;

        res.json({
            message: "Login successful",
            token,
            user: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error during login",
            error: error.message
        });
    }
};

export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching user",
            error: error.message
        });
    }
};
