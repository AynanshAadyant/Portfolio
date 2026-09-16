import { Router } from 'express';
import ContentController from '../controllers/ContentController.js';
import requireAdmin from '../middlewares/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', ContentController.getAllContent);
router.get('/:key', ContentController.getContentByKey);

// Admin protected endpoints
router.put('/:key', requireAdmin, ContentController.updateContentByKey);

export default router;
