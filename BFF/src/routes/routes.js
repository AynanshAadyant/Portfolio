import { Router } from 'express';
import authRoutes from './authRoutes.js';
import contentRoutes from './contentRoutes.js';
import projectRoutes from './projectRoutes.js';
import leetcodeRoutes from './leetcodeRoutes.js';
import spotifyRoutes from './spotifyRoutes.js';
import adminRoutes from './adminRoutes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/content', contentRoutes);
router.use('/projects', projectRoutes);
router.use('/leetcode', leetcodeRoutes);
router.use('/spotify', spotifyRoutes);
router.use('/admin', adminRoutes);

export default router;