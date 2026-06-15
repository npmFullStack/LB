// src/routes/userRoutes.js
import express from 'express';
import { getUserProfile, updateUserProfile, getUserFavorites } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:userId', getUserProfile);
router.get('/:userId/favorites', getUserFavorites);
router.put('/:userId', protect, updateUserProfile);

export default router;