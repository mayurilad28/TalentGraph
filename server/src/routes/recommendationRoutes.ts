import { Router } from 'express';
import { RecommendationController } from '../controllers/recommendationController';

const router = Router();

// GET /api/recommendations/top
router.get('/top', RecommendationController.getPlatformTopMatches);

// GET /api/recommendations/stats
router.get('/stats', RecommendationController.getDashboardMetrics);

export default router;
