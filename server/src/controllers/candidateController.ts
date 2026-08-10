import { Request, Response, NextFunction } from 'express';
import { CandidateService } from '../services/candidateService';

export class CandidateController {
  static async getCandidates(req: Request, res: Response, next: NextFunction) {
    try {
      const search = (req.query.search as string) || '';
      const skillId = (req.query.skillId as string) || '';
      const candidates = await CandidateService.getCandidates(search, skillId);
      res.json({ data: candidates, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getCandidateById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const candidate = await CandidateService.getCandidateById(id);
      if (!candidate) {
        return res.status(404).json({
          data: null,
          error: { message: `Candidate with id '${id}' not found` },
        });
      }
      res.json({ data: candidate, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getCandidateTechnologies(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const technologies = await CandidateService.getCandidateTechnologies(id);
      res.json({ data: technologies, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getCandidateRelatedSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const relatedSkills = await CandidateService.getRelatedSkills(id);
      res.json({ data: relatedSkills, error: null });
    } catch (error) {
      next(error);
    }
  }
}
