import { Router } from 'express';
import { JobController } from '../controllers/jobController';
import { RecommendationController } from '../controllers/recommendationController';

const router = Router();

// GET /api/jobs
router.get('/', JobController.getJobs);

// GET /api/jobs/meta/companies
router.get('/meta/companies', JobController.getCompanies);

// GET /api/jobs/meta/skills
router.get('/meta/skills', JobController.getSkills);

// GET /api/jobs/:id
router.get('/:id', JobController.getJobById);

// GET /api/jobs/:id/recommendations (Reverse graph matching)
router.get('/:id/recommendations', RecommendationController.getJobCandidateRecommendations);

export default router;
