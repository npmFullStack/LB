// authRoutes.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "./db.js";
import { createResponse } from "./helper.js";
import { authenticateToken } from "./authMiddleware.js";

const router = express.Router();

// Register
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json(createResponse(false, "All fields are required"));
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res
        .status(400)
        .json(createResponse(false, "Invalid email format"));
    }

    // Password strength validation
    if (password.length < 8) {
      return res
        .status(400)
        .json(createResponse(false, "Password must be at least 8 characters"));
    }

    // Check if user exists
    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email],
    );

    if (existingUsers.length > 0) {
      return res
        .status(409)
        .json(createResponse(false, "Email already registered"));
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await pool.query(
      "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword],
    );

    // Generate token
    const token = jwt.sign(
      { id: result.insertId, email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    const userData = {
      id: result.insertId,
      firstName,
      lastName,
      email,
    };

    res.status(201).json(
      createResponse(true, "Registration successful", {
        user: userData,
        token,
      }),
    );
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json(createResponse(false, "Server error during registration"));
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json(createResponse(false, "Email and password are required"));
    }

    // Get user
    const [users] = await pool.query(
      "SELECT id, firstName, lastName, email, password FROM users WHERE email = ?",
      [email],
    );

    if (users.length === 0) {
      return res
        .status(401)
        .json(createResponse(false, "Invalid email or password"));
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res
        .status(401)
        .json(createResponse(false, "Invalid email or password"));
    }

    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE },
    );

    const userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
    };

    res.json(
      createResponse(true, "Login successful", { user: userData, token }),
    );
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json(createResponse(false, "Server error during login"));
  }
});

// Get current user
router.get("/me", authenticateToken, async (req, res) => {
  try {
    const [users] = await pool.query(
      "SELECT id, firstName, lastName, email, createdAt FROM users WHERE id = ?",
      [req.user.id],
    );

    if (users.length === 0) {
      return res.status(404).json(createResponse(false, "User not found"));
    }

    res.json(
      createResponse(true, "User retrieved successfully", { user: users[0] }),
    );
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json(createResponse(false, "Server error"));
  }
});

export default router;
