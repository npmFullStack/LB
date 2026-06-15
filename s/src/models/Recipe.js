// src/models/User.js
import pool from "./index.js";

const Recipe = {
    // Create a new recipe
    create: async recipeData => {
        const {
            userId,
            title,
            description,
            ingredients,
            instructions,
            prepTime,
            cookTime,
            servings,
            imageUrl
        } = recipeData;

        const query = `
            INSERT INTO recipes (user_id, title, description, ingredients, instructions, prep_time, cook_time, servings, image_url)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
            RETURNING *
        `;
        const values = [
            userId,
            title,
            description,
            ingredients,
            instructions,
            prepTime,
            cookTime,
            servings,
            imageUrl
        ];

        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Get all recipes with pagination
    findAll: async (page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT r.*, 
                   u.first_name, u.last_name, u.avatar_url,
                   COALESCE(AVG(rat.rating), 0) as avg_rating,
                   COUNT(DISTINCT fav.user_id) as favorite_count
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_ratings rat ON r.id = rat.recipe_id
            LEFT JOIN favorites fav ON r.id = fav.recipe_id
            GROUP BY r.id, u.id
            ORDER BY r.created_at DESC
            LIMIT $1 OFFSET $2
        `;
        const result = await pool.query(query, [limit, offset]);

        // Get total count
        const countResult = await pool.query("SELECT COUNT(*) FROM recipes");

        return {
            recipes: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        };
    },

    // Find recipe by ID with details
    findById: async id => {
        const query = `
            SELECT r.*, 
                   u.id as author_id, u.first_name, u.last_name, u.avatar_url, u.bio,
                   COALESCE(AVG(rat.rating), 0) as avg_rating,
                   COUNT(DISTINCT rat.id) as rating_count,
                   COUNT(DISTINCT fav.user_id) as favorite_count
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_ratings rat ON r.id = rat.recipe_id
            LEFT JOIN favorites fav ON r.id = fav.recipe_id
            WHERE r.id = $1
            GROUP BY r.id, u.id
        `;
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Update recipe
    update: async (id, updateData) => {
        const {
            title,
            description,
            ingredients,
            instructions,
            prepTime,
            cookTime,
            servings,
            imageUrl
        } = updateData;
        const query = `
            UPDATE recipes 
            SET title = COALESCE($1, title),
                description = COALESCE($2, description),
                ingredients = COALESCE($3, ingredients),
                instructions = COALESCE($4, instructions),
                prep_time = COALESCE($5, prep_time),
                cook_time = COALESCE($6, cook_time),
                servings = COALESCE($7, servings),
                image_url = COALESCE($8, image_url),
                updated_at = CURRENT_TIMESTAMP
            WHERE id = $9
            RETURNING *
        `;
        const values = [
            title,
            description,
            ingredients,
            instructions,
            prepTime,
            cookTime,
            servings,
            imageUrl,
            id
        ];
        const result = await pool.query(query, values);
        return result.rows[0];
    },

    // Delete recipe
    delete: async id => {
        const query = "DELETE FROM recipes WHERE id = $1 RETURNING id";
        const result = await pool.query(query, [id]);
        return result.rows[0];
    },

    // Search recipes by title or ingredients
    search: async (searchTerm, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT DISTINCT r.*, u.first_name, u.last_name
            FROM recipes r
            JOIN users u ON r.user_id = u.id
            WHERE r.title ILIKE $1 
               OR $2 = ANY(ARRAY(SELECT LOWER(unnest(r.ingredients))))
            ORDER BY r.created_at DESC
            LIMIT $3 OFFSET $4
        `;
        const searchPattern = `%${searchTerm}%`;
        const result = await pool.query(query, [
            searchPattern,
            searchTerm.toLowerCase(),
            limit,
            offset
        ]);

        const countQuery = `
            SELECT COUNT(DISTINCT r.id) 
            FROM recipes r
            WHERE r.title ILIKE $1 
               OR $2 = ANY(ARRAY(SELECT LOWER(unnest(r.ingredients))))
        `;
        const countResult = await pool.query(countQuery, [
            searchPattern,
            searchTerm.toLowerCase()
        ]);

        return {
            recipes: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        };
    },

    // Get user's recipes
    findByUserId: async (userId, page = 1, limit = 10) => {
        const offset = (page - 1) * limit;
        const query = `
            SELECT r.*, 
                   COALESCE(AVG(rat.rating), 0) as avg_rating
            FROM recipes r
            LEFT JOIN recipe_ratings rat ON r.id = rat.recipe_id
            WHERE r.user_id = $1
            GROUP BY r.id
            ORDER BY r.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        const result = await pool.query(query, [userId, limit, offset]);

        const countResult = await pool.query(
            "SELECT COUNT(*) FROM recipes WHERE user_id = $1",
            [userId]
        );

        return {
            recipes: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        };
    },

    // Add/remove favorite
    toggleFavorite: async (userId, recipeId) => {
        const checkQuery =
            "SELECT id FROM favorites WHERE user_id = $1 AND recipe_id = $2";
        const checkResult = await pool.query(checkQuery, [userId, recipeId]);

        if (checkResult.rows.length > 0) {
            await pool.query(
                "DELETE FROM favorites WHERE user_id = $1 AND recipe_id = $2",
                [userId, recipeId]
            );
            return { favorited: false };
        } else {
            await pool.query(
                "INSERT INTO favorites (user_id, recipe_id) VALUES ($1, $2)",
                [userId, recipeId]
            );
            return { favorited: true };
        }
    },

    // Check if recipe is favorited by user
    isFavorited: async (userId, recipeId) => {
        const query =
            "SELECT id FROM favorites WHERE user_id = $1 AND recipe_id = $2";
        const result = await pool.query(query, [userId, recipeId]);
        return result.rows.length > 0;
    },

    // Add rating to recipe
    addRating: async (userId, recipeId, rating) => {
        const query = `
            INSERT INTO recipe_ratings (user_id, recipe_id, rating)
            VALUES ($1, $2, $3)
            ON CONFLICT (user_id, recipe_id) 
            DO UPDATE SET rating = $3, created_at = CURRENT_TIMESTAMP
            RETURNING *
        `;
        const result = await pool.query(query, [userId, recipeId, rating]);
        return result.rows[0];
    },

    // Get user's rating for a recipe
    getUserRating: async (userId, recipeId) => {
        const query =
            "SELECT rating FROM recipe_ratings WHERE user_id = $1 AND recipe_id = $2";
        const result = await pool.query(query, [userId, recipeId]);
        return result.rows[0]?.rating || null;
    }
};

export default Recipe;
