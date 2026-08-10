/**
 * Job-related openCypher queries for CognoDB.
 */

export const JOB_QUERIES = {
  /**
   * Fetch all jobs with posting company and required skills.
   */
  GET_ALL_JOBS: `
    MATCH (j:Job)-[:POSTED_BY]->(c:Company)
    OPTIONAL MATCH (j)-[r:REQUIRES]->(s:Skill)
    WITH j, c, collect({ skill: s, importance: r.importance }) AS requiredSkills
    RETURN j, c AS company, requiredSkills
    ORDER BY j.title ASC
  `,

  /**
   * Search jobs with filters for search query, company, and skill.
   */
  SEARCH_JOBS: `
    MATCH (j:Job)-[:POSTED_BY]->(c:Company)
    WHERE ($search = '' OR toLower(j.title) CONTAINS toLower($search) OR toLower(j.description) CONTAINS toLower($search) OR toLower(c.name) CONTAINS toLower($search))
    AND ($companyId = '' OR c.id = $companyId)
    AND ($skillId = '' OR EXISTS((j)-[:REQUIRES]->(:Skill {id: $skillId})))
    OPTIONAL MATCH (j)-[r:REQUIRES]->(s:Skill)
    WITH j, c, collect({ skill: s, importance: r.importance }) AS requiredSkills
    RETURN j, c AS company, requiredSkills
    ORDER BY j.title ASC
  `,

  /**
   * Get single job by ID.
   */
  GET_JOB_BY_ID: `
    MATCH (j:Job {id: $jobId})-[:POSTED_BY]->(c:Company)
    OPTIONAL MATCH (j)-[r:REQUIRES]->(s:Skill)
    WITH j, c, collect({ skill: s, importance: r.importance }) AS requiredSkills
    RETURN j, c AS company, requiredSkills
  `,

  /**
   * Get all companies.
   */
  GET_ALL_COMPANIES: `
    MATCH (c:Company)
    OPTIONAL MATCH (j:Job)-[:POSTED_BY]->(c)
    WITH c, count(j) AS openRolesCount
    RETURN c, openRolesCount
    ORDER BY c.name ASC
  `,

  /**
   * Get all skills.
   */
  GET_ALL_SKILLS: `
    MATCH (s:Skill)
    OPTIONAL MATCH (c:Candidate)-[:HAS_SKILL]->(s)
    OPTIONAL MATCH (j:Job)-[:REQUIRES]->(s)
    WITH s, count(DISTINCT c) AS candidateCount, count(DISTINCT j) AS jobDemandCount
    RETURN s, candidateCount, jobDemandCount
    ORDER BY s.name ASC
  `,
};
