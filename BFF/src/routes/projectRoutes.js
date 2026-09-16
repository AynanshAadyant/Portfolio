import { Router } from 'express';
import ProjectController from '../controllers/ProjectController.js';
import requireAdmin from '../middlewares/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/', ProjectController.getAllProjects);
router.get('/:slug', ProjectController.getProjectBySlug);

// Admin protected endpoints
router.post('/', requireAdmin, ProjectController.createProject);
router.put('/:slug', requireAdmin, ProjectController.updateProject);
router.delete('/:slug', requireAdmin, ProjectController.deleteProject);

export default router;
