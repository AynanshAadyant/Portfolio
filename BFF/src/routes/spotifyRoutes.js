import { Router } from 'express';
import SpotifyController from '../controllers/SpotifyController.js';
import requireAdmin from '../middlewares/authMiddleware.js';

const router = Router();

// Public endpoints
router.get('/now-playing', SpotifyController.getNowPlaying);
router.get('/top-tracks', SpotifyController.getTopTracks);

// Admin protected endpoints
router.post('/sync', requireAdmin, SpotifyController.sync);

export default router;
