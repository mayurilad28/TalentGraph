import { executeQuery, sanitizeGraphData } from '../database/driver';
import { CANDIDATE_QUERIES } from '../database/queries/candidateQueries';

export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experienceYears: number;
  summary: string;
  avatar: string;
  skills?: any[];
  projectCount?: number;
}

export class CandidateService {
  /**
   * Get candidates with optional search and skill filtering.
   */
  static async getCandidates(search = '', skillId = ''): Promise<Candidate[]> {
    const records = await executeQuery(
      CANDIDATE_QUERIES.SEARCH_CANDIDATES,
      { search: search.trim(), skillId: skillId.trim() }
    );

    return records.map((rec) => {
      const c = sanitizeGraphData(rec.c);
      const skills = sanitizeGraphData(rec.skills) || [];
      const projectCount = sanitizeGraphData(rec.projectCount) || 0;

      return {
        ...c,
        skills,
        projectCount,
      };
    });
  }

  /**
   * Get candidate details by ID.
   */
  static async getCandidateById(candidateId: string): Promise<any | null> {
    const records = await executeQuery(
      CANDIDATE_QUERIES.GET_CANDIDATE_BY_ID,
      { candidateId }
    );

    if (!records || records.length === 0 || !records[0].c) {
      return null;
    }

    const c = sanitizeGraphData(records[0].c);
    const skills = sanitizeGraphData(records[0].skills) || [];
    const projectsRaw = sanitizeGraphData(records[0].projectsRaw) || [];

    // Filter out null projects
    const projects = projectsRaw
      .filter((p: any) => p && p.project && p.project.id)
      .map((p: any) => ({
        ...p.project,
        role: p.role,
        durationMonths: p.durationMonths,
        technologies: p.technologies || [],
      }));

    return {
      ...c,
      skills,
      projects,
    };
  }

  /**
   * Multi-Hop: Get candidate technologies used in projects.
   */
  static async getCandidateTechnologies(candidateId: string): Promise<any[]> {
    const records = await executeQuery(
      CANDIDATE_QUERIES.GET_CANDIDATE_TECHNOLOGIES_THROUGH_PROJECTS,
      { candidateId }
    );

    return records.map((rec) => sanitizeGraphData(rec));
  }

  /**
   * Multi-Hop: Get upskilling suggestions based on connected skills in graph.
   */
  static async getRelatedSkills(candidateId: string): Promise<any[]> {
    const records = await executeQuery(
      CANDIDATE_QUERIES.GET_RELATED_SKILLS_FOR_UPSKILLING,
      { candidateId }
    );

    return records.map((rec) => sanitizeGraphData(rec));
  }
}
