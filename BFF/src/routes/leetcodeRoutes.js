import { Router } from 'express';
import LeetCodeController from '../controllers/LeetCodeController.js';
import requireAdmin from '../middlewares/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/stats', LeetCodeController.getStats);

// Admin protected endpoints
router.post('/sync', requireAdmin, LeetCodeController.syncStats);

export default router;
