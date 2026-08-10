import { Router } from 'express';
import { GraphController } from '../controllers/graphController';

const router = Router();

// GET /api/graph/explore
router.get('/explore', GraphController.getExploreSubgraph);

// GET /api/graph/candidate/:id
router.get('/candidate/:id', GraphController.getCandidateSubgraph);

// GET /api/graph/job/:id
router.get('/job/:id', GraphController.getJobSubgraph);

export default router;
