// src/controllers/recipeController.js
import Recipe from '../models/Recipe.js';

export const getAllRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await Recipe.findAll(page, limit);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recipes', error: error.message });
    }
};

export const getRecipeById = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        // Check if current user has favorited this recipe
        if (req.userId) {
            recipe.isFavorited = await Recipe.isFavorited(req.userId, recipe.id);
            recipe.userRating = await Recipe.getUserRating(req.userId, recipe.id);
        }
        
        res.json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recipe', error: error.message });
    }
};

export const createRecipe = async (req, res) => {
    try {
        const recipeData = {
            userId: req.userId,
            title: req.body.title,
            description: req.body.description,
            ingredients: req.body.ingredients,
            instructions: req.body.instructions,
            prepTime: req.body.prepTime,
            cookTime: req.body.cookTime,
            servings: req.body.servings,
            imageUrl: req.body.imageUrl
        };
        
        const recipe = await Recipe.create(recipeData);
        res.status(201).json(recipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating recipe', error: error.message });
    }
};

export const updateRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        // Check if user owns the recipe
        if (recipe.user_id !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to update this recipe' });
        }
        
        const updatedRecipe = await Recipe.update(req.params.id, req.body);
        res.json(updatedRecipe);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating recipe', error: error.message });
    }
};

export const deleteRecipe = async (req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) {
            return res.status(404).json({ message: 'Recipe not found' });
        }
        
        // Check if user owns the recipe
        if (recipe.user_id !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to delete this recipe' });
        }
        
        await Recipe.delete(req.params.id);
        res.json({ message: 'Recipe deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting recipe', error: error.message });
    }
};

export const searchRecipes = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await Recipe.search(q, page, limit);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error searching recipes', error: error.message });
    }
};

export const getUserRecipes = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        
        const result = await Recipe.findByUserId(req.params.userId, page, limit);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching user recipes', error: error.message });
    }
};

export const toggleFavorite = async (req, res) => {
    try {
        const result = await Recipe.toggleFavorite(req.userId, req.params.recipeId);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error toggling favorite', error: error.message });
    }
};

export const rateRecipe = async (req, res) => {
    try {
        const { rating } = req.body;
        if (!rating || rating < 1 || rating > 5) {
            return res.status(400).json({ message: 'Rating must be between 1 and 5' });
        }
        
        const result = await Recipe.addRating(req.userId, req.params.recipeId, rating);
        res.json({ message: 'Rating added successfully', rating: result });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error rating recipe', error: error.message });
    }
};