import { executeQuery, sanitizeGraphData } from '../database/driver';
import { RECOMMENDATION_QUERIES } from '../database/queries/recommendationQueries';

export class RecommendationService {
  /**
   * Get matching jobs for a candidate calculated via CognoDB graph traversal.
   */
  static async getMatchingJobsForCandidate(candidateId: string): Promise<any[]> {
    const records = await executeQuery(
      RECOMMENDATION_QUERIES.GET_MATCHING_JOBS_FOR_CANDIDATE,
      { candidateId }
    );

    return records.map((rec) => {
      const job = sanitizeGraphData(rec.job);
      const company = sanitizeGraphData(rec.company);
      const matchedSkills = sanitizeGraphData(rec.matchedSkills) || [];
      const missingSkills = sanitizeGraphData(rec.missingSkills) || [];
      const allRequiredSkills = sanitizeGraphData(rec.allRequiredSkills) || [];
      const matchedCount = sanitizeGraphData(rec.matchedCount) || matchedSkills.length;
      const requiredCount = sanitizeGraphData(rec.requiredCount) || allRequiredSkills.length;
      const matchScore = sanitizeGraphData(rec.matchScore) || Math.round((matchedCount / (requiredCount || 1)) * 100);

      const explanation = `Matches ${matchedCount} of ${requiredCount} required skills (${matchScore}% match).`;

      return {
        job,
        company,
        matchedSkills,
        missingSkills,
        allRequiredSkills,
        matchedCount,
        requiredCount,
        matchScore,
        explanation,
      };
    });
  }

  /**
   * Get matching candidates for a job calculated via reverse graph traversal.
   */
  static async getMatchingCandidatesForJob(jobId: string): Promise<any[]> {
    const records = await executeQuery(
      RECOMMENDATION_QUERIES.GET_MATCHING_CANDIDATES_FOR_JOB,
      { jobId }
    );

    return records.map((rec) => {
      const candidate = sanitizeGraphData(rec.candidate);
      const matchedSkills = sanitizeGraphData(rec.matchedSkills) || [];
      const missingSkills = sanitizeGraphData(rec.missingSkills) || [];
      const allRequiredSkills = sanitizeGraphData(rec.allRequiredSkills) || [];
      const matchedCount = sanitizeGraphData(rec.matchedCount) || matchedSkills.length;
      const requiredCount = sanitizeGraphData(rec.requiredCount) || allRequiredSkills.length;
      const matchScore = sanitizeGraphData(rec.matchScore) || Math.round((matchedCount / (requiredCount || 1)) * 100);

      const explanation = `Candidate possesses ${matchedCount} of ${requiredCount} required skills (${matchScore}% match).`;

      return {
        candidate,
        matchedSkills,
        missingSkills,
        allRequiredSkills,
        matchedCount,
        requiredCount,
        matchScore,
        explanation,
      };
    });
  }

  /**
   * Get platform-wide top matching opportunities for Dashboard.
   */
  static async getPlatformTopMatches(): Promise<any[]> {
    const records = await executeQuery(RECOMMENDATION_QUERIES.GET_PLATFORM_TOP_MATCHES);
    return records.map((rec) => {
      const candidate = sanitizeGraphData(rec.candidate);
      const job = sanitizeGraphData(rec.job);
      const company = sanitizeGraphData(rec.company);
      const matchedSkills = sanitizeGraphData(rec.matchedSkills) || [];
      const matchScore = sanitizeGraphData(rec.matchScore);

      return {
        candidate,
        job,
        company,
        matchedSkills,
        matchScore,
      };
    });
  }

  /**
   * Get dashboard aggregated metrics.
   */
  static async getDashboardMetrics(): Promise<any> {
    const records = await executeQuery(RECOMMENDATION_QUERIES.GET_DASHBOARD_METRICS);
    if (!records || records.length === 0) {
      return {
        totalCandidates: 0,
        totalJobs: 0,
        totalSkills: 0,
        totalCompanies: 0,
      };
    }

    const row = records[0];
    return {
      totalCandidates: sanitizeGraphData(row.totalCandidates) || 0,
      totalJobs: sanitizeGraphData(row.totalJobs) || 0,
      totalSkills: sanitizeGraphData(row.totalSkills) || 0,
      totalCompanies: sanitizeGraphData(row.totalCompanies) || 0,
    };
  }
}
