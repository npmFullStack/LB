// db.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Database connected successfully");
    connection.release();
  } catch (error) {
    console.error("❌ Database connection failed:", error.message);
    process.exit(1);
  }
};

// Initialize database tables
const initializeDatabase = async () => {
  try {
    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        firstName VARCHAR(50) NOT NULL,
        lastName VARCHAR(50) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);

    // Create recipes table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS recipes (
        id INT PRIMARY KEY AUTO_INCREMENT,
        userId INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        category VARCHAR(50) NOT NULL,
        prepTime INT NOT NULL,
        cookTime INT NOT NULL,
        servings INT NOT NULL,
        difficulty ENUM('easy', 'medium', 'hard') DEFAULT 'easy',
        image VARCHAR(255),
        tips TEXT,
        isPublic BOOLEAN DEFAULT true,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create ingredients table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS ingredients (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recipeId INT NOT NULL,
        ingredient TEXT NOT NULL,
        position INT NOT NULL,
        FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE
      )
    `);

    // Create instructions table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS instructions (
        id INT PRIMARY KEY AUTO_INCREMENT,
        recipeId INT NOT NULL,
        instruction TEXT NOT NULL,
        stepNumber INT NOT NULL,
        FOREIGN KEY (recipeId) REFERENCES recipes(id) ON DELETE CASCADE
      )
    `);

    console.log("✅ Database tables initialized");
  } catch (error) {
    console.error("❌ Failed to initialize database tables:", error.message);
  }
};

export { pool, testConnection, initializeDatabase };
