/**
 * Recommendation and Multi-Hop Matching openCypher queries for CognoDB.
 * Calculates exact graph-backed match scores, matched skills, and missing skills.
 */

export const RECOMMENDATION_QUERIES = {
  /**
   * Find matching jobs for a given candidate using graph traversal.
   * Multi-Hop: (Candidate)-[:HAS_SKILL]->(Skill)<-[:REQUIRES]-(Job)-[:POSTED_BY]->(Company)
   */
  GET_MATCHING_JOBS_FOR_CANDIDATE: `
    MATCH (c:Candidate {id: $candidateId})
    MATCH (j:Job)-[:POSTED_BY]->(comp:Company)
    MATCH (j)-[r:REQUIRES]->(required:Skill)
    WITH c, j, comp, collect(DISTINCT required) AS allRequiredSkills
    
    // Find matched skills for this candidate on this job
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(matched:Skill)<-[:REQUIRES]-(j)
    WITH c, j, comp, allRequiredSkills, collect(DISTINCT matched) AS matchedSkills
    
    // Calculate missing skills using list filtering
    WITH c, j, comp, allRequiredSkills, matchedSkills,
         [s IN allRequiredSkills WHERE NOT s IN matchedSkills] AS missingSkills,
         size(matchedSkills) AS matchedCount,
         size(allRequiredSkills) AS requiredCount
    
    WHERE requiredCount > 0 AND matchedCount > 0
    
    RETURN
      j AS job,
      comp AS company,
      matchedSkills,
      missingSkills,
      allRequiredSkills,
      matchedCount,
      requiredCount,
      round((toFloat(matchedCount) / toFloat(requiredCount)) * 100) AS matchScore
    ORDER BY matchScore DESC, matchedCount DESC, j.title ASC
  `,

  /**
   * Find matching candidates for a given job using reverse graph traversal.
   * Multi-Hop: (Job)-[:REQUIRES]->(Skill)<-[:HAS_SKILL]-(Candidate)
   */
  GET_MATCHING_CANDIDATES_FOR_JOB: `
    MATCH (j:Job {id: $jobId})
    MATCH (j)-[r:REQUIRES]->(required:Skill)
    WITH j, collect(DISTINCT required) AS allRequiredSkills
    
    MATCH (c:Candidate)
    OPTIONAL MATCH (c)-[:HAS_SKILL]->(matched:Skill)<-[:REQUIRES]-(j)
    WITH j, c, allRequiredSkills, collect(DISTINCT matched) AS matchedSkills
    
    WITH j, c, allRequiredSkills, matchedSkills,
         [s IN allRequiredSkills WHERE NOT s IN matchedSkills] AS missingSkills,
         size(matchedSkills) AS matchedCount,
         size(allRequiredSkills) AS requiredCount
    
    WHERE requiredCount > 0 AND matchedCount > 0
    
    RETURN
      c AS candidate,
      matchedSkills,
      missingSkills,
      allRequiredSkills,
      matchedCount,
      requiredCount,
      round((toFloat(matchedCount) / toFloat(requiredCount)) * 100) AS matchScore
    ORDER BY matchScore DESC, matchedCount DESC, c.experienceYears DESC
  `,

  /**
   * Platform-wide Top Matching Opportunities for Dashboard.
   */
  GET_PLATFORM_TOP_MATCHES: `
    MATCH (c:Candidate)-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)-[:POSTED_BY]->(comp:Company)
    WITH c, j, comp, collect(DISTINCT s) AS matchedSkills
    MATCH (j)-[:REQUIRES]->(allReq:Skill)
    WITH c, j, comp, matchedSkills, collect(DISTINCT allReq) AS requiredSkills
    WITH c, j, comp, matchedSkills, requiredSkills,
         size(matchedSkills) AS matchedCount,
         size(requiredSkills) AS requiredCount,
         round((toFloat(size(matchedSkills)) / toFloat(size(requiredSkills))) * 100) AS matchScore
    WHERE matchScore >= 70
    RETURN c AS candidate, j AS job, comp AS company, matchedSkills, matchScore
    ORDER BY matchScore DESC, matchedCount DESC
    LIMIT 6
  `,

  /**
   * Dashboard Platform Metrics.
   */
  GET_DASHBOARD_METRICS: `
    MATCH (c:Candidate) WITH count(c) AS totalCandidates
    MATCH (j:Job) WITH totalCandidates, count(j) AS totalJobs
    MATCH (s:Skill) WITH totalCandidates, totalJobs, count(s) AS totalSkills
    MATCH (comp:Company) WITH totalCandidates, totalJobs, totalSkills, count(comp) AS totalCompanies
    RETURN totalCandidates, totalJobs, totalSkills, totalCompanies
  `
};
