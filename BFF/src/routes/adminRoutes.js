import { Router } from 'express';
import AdminController from '../controllers/AdminController.js';
import requireAdmin from '../middlewares/authMiddleware.js';

const router = Router();

// Protect all admin routes
router.use(requireAdmin);

// Content CMS Management
router.get('/content', AdminController.listContent);
router.post('/content', AdminController.createContent);
router.delete('/content/:key', AdminController.deleteContent);
router.post('/content/bulk', AdminController.bulkUpsertContent);

// Project CMS Management
router.get('/projects', AdminController.listProjects);
router.post('/projects', AdminController.createProject);
router.put('/projects/:slug', AdminController.updateProject);
router.delete('/projects/:slug', AdminController.deleteProject);
router.patch('/projects/reorder', AdminController.reorderProjects);

// Cache & Telemetry Operations
router.get('/cache/status', AdminController.getCacheStatus);
router.post('/cache/clear', AdminController.clearCache);
router.post('/cache/seed', AdminController.seedInitialData);
router.post('/sync/leetcode', AdminController.syncLeetCode);
router.post('/sync/spotify', AdminController.syncSpotify);

// System Diagnostics
router.get('/system/health', AdminController.getHealth);

export default router;
