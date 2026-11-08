import express from 'express';
import { getContents, getContentById, getCategories } from '../controllers/contentController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/categories', getCategories);
router.get('/', optionalAuth, getContents);
router.get('/:id', optionalAuth, getContentById);

export default router;
