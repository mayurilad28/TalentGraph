import { Request, Response, NextFunction } from 'express';
import { JobService } from '../services/jobService';

export class JobController {
  static async getJobs(req: Request, res: Response, next: NextFunction) {
    try {
      const search = (req.query.search as string) || '';
      const companyId = (req.query.companyId as string) || '';
      const skillId = (req.query.skillId as string) || '';
      const jobs = await JobService.getJobs(search, companyId, skillId);
      res.json({ data: jobs, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getJobById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const job = await JobService.getJobById(id);
      if (!job) {
        return res.status(404).json({
          data: null,
          error: { message: `Job with id '${id}' not found` },
        });
      }
      res.json({ data: job, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getCompanies(req: Request, res: Response, next: NextFunction) {
    try {
      const companies = await JobService.getCompanies();
      res.json({ data: companies, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getSkills(req: Request, res: Response, next: NextFunction) {
    try {
      const skills = await JobService.getSkills();
      res.json({ data: skills, error: null });
    } catch (error) {
      next(error);
    }
  }
}
