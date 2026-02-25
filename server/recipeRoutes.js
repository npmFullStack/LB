// recipeRoutes.js
import express from "express";
import { pool } from "./db.js";
import { createResponse } from "./helper.js";
import { authenticateToken } from "./authMiddleware.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase(),
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

// Create recipe
router.post(
  "/recipes",
  authenticateToken,
  upload.single("image"),
  async (req, res) => {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      const {
        title,
        description,
        category,
        prepTime,
        cookTime,
        servings,
        difficulty,
        tips,
        isPublic,
        ingredients,
        instructions,
      } = req.body;

      // Parse JSON strings if they come as strings
      const ingredientsArray =
        typeof ingredients === "string" ? JSON.parse(ingredients) : ingredients;
      const instructionsArray =
        typeof instructions === "string"
          ? JSON.parse(instructions)
          : instructions;

      // Insert recipe
      const [recipeResult] = await connection.query(
        `INSERT INTO recipes 
       (userId, title, description, category, prepTime, cookTime, servings, difficulty, image, tips, isPublic) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.user.id,
          title,
          description,
          category,
          prepTime,
          cookTime,
          servings,
          difficulty,
          req.file ? req.file.filename : null,
          tips,
          isPublic === "true" || isPublic === true,
        ],
      );

      const recipeId = recipeResult.insertId;

      // Insert ingredients
      for (let i = 0; i < ingredientsArray.length; i++) {
        if (ingredientsArray[i].trim()) {
          await connection.query(
            "INSERT INTO ingredients (recipeId, ingredient, position) VALUES (?, ?, ?)",
            [recipeId, ingredientsArray[i].trim(), i],
          );
        }
      }

      // Insert instructions
      for (let i = 0; i < instructionsArray.length; i++) {
        if (instructionsArray[i].trim()) {
          await connection.query(
            "INSERT INTO instructions (recipeId, instruction, stepNumber) VALUES (?, ?, ?)",
            [recipeId, instructionsArray[i].trim(), i + 1],
          );
        }
      }

      await connection.commit();

      res
        .status(201)
        .json(
          createResponse(true, "Recipe created successfully", { recipeId }),
        );
    } catch (error) {
      await connection.rollback();
      console.error("Create recipe error:", error);
      res
        .status(500)
        .json(createResponse(false, "Server error while creating recipe"));
    } finally {
      connection.release();
    }
  },
);

// Get all recipes (public)
router.get("/recipes", async (req, res) => {
  try {
    const [recipes] = await pool.query(`
      SELECT r.*, u.firstName, u.lastName,
             (SELECT COUNT(*) FROM ingredients WHERE recipeId = r.id) as ingredientCount,
             (SELECT COUNT(*) FROM instructions WHERE recipeId = r.id) as instructionCount
      FROM recipes r
      JOIN users u ON r.userId = u.id
      WHERE r.isPublic = true
      ORDER BY r.createdAt DESC
    `);

    res.json(
      createResponse(true, "Recipes retrieved successfully", { recipes }),
    );
  } catch (error) {
    console.error("Get recipes error:", error);
    res.status(500).json(createResponse(false, "Server error"));
  }
});

// Get single recipe
router.get("/recipes/:id", async (req, res) => {
  try {
    const [recipes] = await pool.query(
      `
      SELECT r.*, u.firstName, u.lastName, u.email
      FROM recipes r
      JOIN users u ON r.userId = u.id
      WHERE r.id = ? AND (r.isPublic = true OR r.userId = ?)
    `,
      [req.params.id, req.user?.id || 0],
    );

    if (recipes.length === 0) {
      return res.status(404).json(createResponse(false, "Recipe not found"));
    }

    const recipe = recipes[0];

    // Get ingredients
    const [ingredients] = await pool.query(
      "SELECT ingredient FROM ingredients WHERE recipeId = ? ORDER BY position",
      [req.params.id],
    );

    // Get instructions
    const [instructions] = await pool.query(
      "SELECT instruction FROM instructions WHERE recipeId = ? ORDER BY stepNumber",
      [req.params.id],
    );

    recipe.ingredients = ingredients.map((i) => i.ingredient);
    recipe.instructions = instructions.map((i) => i.instruction);

    res.json(createResponse(true, "Recipe retrieved successfully", { recipe }));
  } catch (error) {
    console.error("Get recipe error:", error);
    res.status(500).json(createResponse(false, "Server error"));
  }
});

// Get user's recipes
router.get("/my-recipes", authenticateToken, async (req, res) => {
  try {
    const [recipes] = await pool.query(
      `
      SELECT r.*, 
             (SELECT COUNT(*) FROM ingredients WHERE recipeId = r.id) as ingredientCount,
             (SELECT COUNT(*) FROM instructions WHERE recipeId = r.id) as instructionCount
      FROM recipes r
      WHERE r.userId = ?
      ORDER BY r.createdAt DESC
    `,
      [req.user.id],
    );

    res.json(
      createResponse(true, "Recipes retrieved successfully", { recipes }),
    );
  } catch (error) {
    console.error("Get my recipes error:", error);
    res.status(500).json(createResponse(false, "Server error"));
  }
});

export default router;
