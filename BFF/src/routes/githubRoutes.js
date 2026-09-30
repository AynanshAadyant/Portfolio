import { Router } from 'express';
import GithubController from '../controllers/GithubController.js';
import requireAdmin from '../middlewares/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/commits', GithubController.getStats);

// Admin protected endpoints
router.post('/sync', requireAdmin, GithubController.syncStats);

export default router;
