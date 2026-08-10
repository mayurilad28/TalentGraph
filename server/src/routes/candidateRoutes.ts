import { Router } from 'express';
import { CandidateController } from '../controllers/candidateController';
import { RecommendationController } from '../controllers/recommendationController';

const router = Router();

// GET /api/candidates
router.get('/', CandidateController.getCandidates);

// GET /api/candidates/:id
router.get('/:id', CandidateController.getCandidateById);

// GET /api/candidates/:id/technologies (Multi-hop through projects)
router.get('/:id/technologies', CandidateController.getCandidateTechnologies);

// GET /api/candidates/:id/related-skills (Upskilling suggestions)
router.get('/:id/related-skills', CandidateController.getCandidateRelatedSkills);

// GET /api/candidates/:id/recommendations (Graph job matching)
router.get('/:id/recommendations', RecommendationController.getCandidateJobRecommendations);

export default router;
