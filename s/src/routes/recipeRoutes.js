// src/routes/recipeRoutes.js
import express from 'express';
import {
    getAllRecipes,
    getRecipeById,
    createRecipe,
    updateRecipe,
    deleteRecipe,
    searchRecipes,
    getUserRecipes,
    toggleFavorite,
    rateRecipe
} from '../controllers/recipeController.js';
import { protect, optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/search', searchRecipes);
router.get('/', getAllRecipes);
router.get('/user/:userId', getUserRecipes);
router.get('/:id', optionalAuth, getRecipeById);

router.use(protect); // All routes below this require authentication

router.post('/', createRecipe);
router.put('/:id', updateRecipe);
router.delete('/:id', deleteRecipe);
router.post('/:recipeId/favorite', toggleFavorite);
router.post('/:recipeId/rate', rateRecipe);

export default router;