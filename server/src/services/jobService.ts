import { executeQuery, sanitizeGraphData } from '../database/driver';
import { JOB_QUERIES } from '../database/queries/jobQueries';

export class JobService {
  /**
   * Get jobs with optional search, company, and skill filters.
   */
  static async getJobs(search = '', companyId = '', skillId = ''): Promise<any[]> {
    const records = await executeQuery(
      JOB_QUERIES.SEARCH_JOBS,
      { search: search.trim(), companyId: companyId.trim(), skillId: skillId.trim() }
    );

    return records.map((rec) => {
      const job = sanitizeGraphData(rec.j);
      const company = sanitizeGraphData(rec.company);
      const requiredSkills = (sanitizeGraphData(rec.requiredSkills) || [])
        .filter((item: any) => item && item.skill && item.skill.id)
        .map((item: any) => ({
          ...item.skill,
          importance: item.importance || 'Required',
        }));

      return {
        ...job,
        company,
        requiredSkills,
      };
    });
  }

  /**
   * Get job by ID.
   */
  static async getJobById(jobId: string): Promise<any | null> {
    const records = await executeQuery(
      JOB_QUERIES.GET_JOB_BY_ID,
      { jobId }
    );

    if (!records || records.length === 0 || !records[0].j) {
      return null;
    }

    const job = sanitizeGraphData(records[0].j);
    const company = sanitizeGraphData(records[0].company);
    const requiredSkills = (sanitizeGraphData(records[0].requiredSkills) || [])
      .filter((item: any) => item && item.skill && item.skill.id)
      .map((item: any) => ({
        ...item.skill,
        importance: item.importance || 'Required',
      }));

    return {
      ...job,
      company,
      requiredSkills,
    };
  }

  /**
   * Get all companies.
   */
  static async getCompanies(): Promise<any[]> {
    const records = await executeQuery(JOB_QUERIES.GET_ALL_COMPANIES);
    return records.map((rec) => {
      const company = sanitizeGraphData(rec.c);
      const openRolesCount = sanitizeGraphData(rec.openRolesCount) || 0;
      return {
        ...company,
        openRolesCount,
      };
    });
  }

  /**
   * Get all skills.
   */
  static async getSkills(): Promise<any[]> {
    const records = await executeQuery(JOB_QUERIES.GET_ALL_SKILLS);
    return records.map((rec) => {
      const skill = sanitizeGraphData(rec.s);
      const candidateCount = sanitizeGraphData(rec.candidateCount) || 0;
      const jobDemandCount = sanitizeGraphData(rec.jobDemandCount) || 0;
      return {
        ...skill,
        candidateCount,
        jobDemandCount,
      };
    });
  }
}
