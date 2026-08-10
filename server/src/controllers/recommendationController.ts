import { Request, Response, NextFunction } from 'express';
import { RecommendationService } from '../services/recommendationService';

export class RecommendationController {
  static async getCandidateJobRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const recommendations = await RecommendationService.getMatchingJobsForCandidate(id);
      res.json({ data: recommendations, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getJobCandidateRecommendations(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const recommendations = await RecommendationService.getMatchingCandidatesForJob(id);
      res.json({ data: recommendations, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getPlatformTopMatches(req: Request, res: Response, next: NextFunction) {
    try {
      const topMatches = await RecommendationService.getPlatformTopMatches();
      res.json({ data: topMatches, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getDashboardMetrics(req: Request, res: Response, next: NextFunction) {
    try {
      const metrics = await RecommendationService.getDashboardMetrics();
      res.json({ data: metrics, error: null });
    } catch (error) {
      next(error);
    }
  }
}
