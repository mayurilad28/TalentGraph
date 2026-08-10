import { Request, Response, NextFunction } from 'express';
import { GraphService } from '../services/graphService';

export class GraphController {
  static async getCandidateSubgraph(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const graphData = await GraphService.getCandidateSubgraph(id);
      res.json({ data: graphData, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getJobSubgraph(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const graphData = await GraphService.getJobSubgraph(id);
      res.json({ data: graphData, error: null });
    } catch (error) {
      next(error);
    }
  }

  static async getExploreSubgraph(req: Request, res: Response, next: NextFunction) {
    try {
      const graphData = await GraphService.getExploreSubgraph();
      res.json({ data: graphData, error: null });
    } catch (error) {
      next(error);
    }
  }
}
