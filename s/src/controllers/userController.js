// src/controllers/userController.js
import User from '../models/User.js';
import Recipe from '../models/Recipe.js';

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user profile', error: error.message });
    }
};

export const updateUserProfile = async (req, res) => {
    try {
        // Check if user is updating their own profile
        if (parseInt(req.params.userId) !== req.userId) {
            return res.status(403).json({ message: 'You can only update your own profile' });
        }
        
        const updatedUser = await User.update(req.userId, req.body);
        res.json(updatedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating user profile', error: error.message });
    }
};

export const getUserFavorites = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        
        const query = `
            SELECT r.*, 
                   u.first_name, u.last_name,
                   COALESCE(AVG(rat.rating), 0) as avg_rating
            FROM favorites f
            JOIN recipes r ON f.recipe_id = r.id
            JOIN users u ON r.user_id = u.id
            LEFT JOIN recipe_ratings rat ON r.id = rat.recipe_id
            WHERE f.user_id = $1
            GROUP BY r.id, u.id
            ORDER BY f.created_at DESC
            LIMIT $2 OFFSET $3
        `;
        
        const result = await pool.query(query, [req.params.userId, limit, offset]);
        
        const countQuery = 'SELECT COUNT(*) FROM favorites WHERE user_id = $1';
        const countResult = await pool.query(countQuery, [req.params.userId]);
        
        res.json({
            favorites: result.rows,
            total: parseInt(countResult.rows[0].count),
            page,
            totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching favorites', error: error.message });
    }
};