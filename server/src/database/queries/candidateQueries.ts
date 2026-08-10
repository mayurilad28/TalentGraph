/**
 * Candidate-related openCypher queries for CognoDB.
 * All queries strictly use parameters for injection safety and query plan caching.
 */

export const CANDIDATE_QUERIES = {
  /**
   * Fetch all candidates with their associated direct skills and project counts.
   */
  GET_ALL_CANDIDATES: `
    MATCH (c:Candidate)
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
    WITH c, collect(DISTINCT s) AS skills, count(DISTINCT p) AS projectCount
    RETURN c, skills, projectCount
    ORDER BY c.name ASC
  `,

  /**
   * Search candidates by name or filter by skill ID.
   */
  SEARCH_CANDIDATES: `
    MATCH (c:Candidate)
    WHERE ($search = '' OR toLower(c.name) CONTAINS toLower($search) OR toLower(c.title) CONTAINS toLower($search))
    AND ($skillId = '' OR EXISTS((c)-[:HAS_SKILL]->(:Skill {id: $skillId})))
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)
    WITH c, collect(DISTINCT s) AS skills, count(DISTINCT p) AS projectCount
    RETURN c, skills, projectCount
    ORDER BY c.name ASC
  `,

  /**
   * Get single candidate by ID with direct skills, projects, and technologies.
   */
  GET_CANDIDATE_BY_ID: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)
    WITH c, collect(DISTINCT s) AS skills
    OPTIONAL MATCH (c)-[w:WORKED_ON]->(p:Project)
    OPTIONAL MATCH (p)-[:USES]->(t:Technology)
    WITH c, skills, p, w, collect(DISTINCT t) AS technologies
    WITH c, skills, collect(CASE WHEN p IS NULL THEN NULL ELSE {
      project: p,
      role: w.role,
      durationMonths: w.durationMonths,
      technologies: technologies
    } END) AS projectsList
    RETURN c, skills, [item IN projectsList WHERE item IS NOT NULL] AS projectsRaw
  `,

  /**
   * Multi-Hop Traversal (2 Hops):
   * Candidate -> WORKED_ON -> Project -> USES -> Technology
   * Discovers technologies the candidate has hands-on experience with through projects.
   */
  GET_CANDIDATE_TECHNOLOGIES_THROUGH_PROJECTS: `
    MATCH (c:Candidate {id: $candidateId})-[:WORKED_ON]->(p:Project)-[:USES]->(t:Technology)
    RETURN DISTINCT
      t.id AS id,
      t.name AS name,
      t.category AS category,
      collect(DISTINCT p.name) AS usedInProjects,
      count(DISTINCT p) AS projectCount
    ORDER BY projectCount DESC, t.name ASC
  `,

  /**
   * Multi-Hop Traversal (2 Hops - Upskilling):
   * Candidate -> HAS_SKILL -> Skill -> RELATED_TO -> Skill (that candidate does not yet possess)
   */
  GET_RELATED_SKILLS_FOR_UPSKILLING: `
    MATCH (c:Candidate {id: $candidateId})-[:HAS_SKILL]->(mySkill:Skill)-[:RELATED_TO]->(recommended:Skill)
    WHERE NOT (c)-[:HAS_SKILL]->(recommended)
    RETURN
      recommended.id AS id,
      recommended.name AS name,
      recommended.category AS category,
      collect(DISTINCT mySkill.name) AS relatedToCurrentSkills,
      count(DISTINCT mySkill) AS connectionStrength
    ORDER BY connectionStrength DESC, recommended.name ASC
    LIMIT 6
  `,
};
