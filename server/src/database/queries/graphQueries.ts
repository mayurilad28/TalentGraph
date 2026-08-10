/**
 * openCypher queries for extracting subgraphs for visualization.
 */

export const GRAPH_QUERIES = {
  /**
   * Subgraph centered around a specific candidate.
   * Traverses:
   * (Candidate)-[:HAS_SKILL]->(Skill)
   * (Candidate)-[:WORKED_ON]->(Project)-[:USES]->(Technology)
   * (Skill)<-[:REQUIRES]-(Job)-[:POSTED_BY]->(Company)
   */
  GET_CANDIDATE_SUBGRAPH: `
    MATCH (c:Candidate {id: $candidateId})
    OPTIONAL MATCH (c)-[r1:HAS_SKILL]->(s:Skill)
    OPTIONAL MATCH (c)-[r2:WORKED_ON]->(p:Project)-[r3:USES]->(t:Technology)
    OPTIONAL MATCH (s)<-[r4:REQUIRES]-(j:Job)-[r5:POSTED_BY]->(comp:Company)
    RETURN
      c,
      collect(DISTINCT s) AS skills,
      collect(DISTINCT p) AS projects,
      collect(DISTINCT t) AS technologies,
      collect(DISTINCT j) AS jobs,
      collect(DISTINCT comp) AS companies
  `,

  /**
   * Subgraph centered around a specific job.
   * Traverses:
   * (Job)-[:POSTED_BY]->(Company)
   * (Job)-[:REQUIRES]->(Skill)
   * (Skill)<-[:HAS_SKILL]-(Candidate)
   */
  GET_JOB_SUBGRAPH: `
    MATCH (j:Job {id: $jobId})-[:POSTED_BY]->(comp:Company)
    OPTIONAL MATCH (j)-[r1:REQUIRES]->(s:Skill)
    OPTIONAL MATCH (s)<-[r2:HAS_SKILL]-(c:Candidate)
    RETURN
      j,
      comp,
      collect(DISTINCT s) AS skills,
      collect(DISTINCT c) AS candidates
  `,

  /**
   * General exploration subgraph (overview of top interconnected nodes).
   */
  GET_EXPLORE_SUBGRAPH: `
    MATCH (c:Candidate)-[r1:HAS_SKILL]->(s:Skill)
    WITH c, r1, s LIMIT 25
    OPTIONAL MATCH (j:Job)-[r2:REQUIRES]->(s)
    OPTIONAL MATCH (j)-[r3:POSTED_BY]->(comp:Company)
    OPTIONAL MATCH (c)-[r4:WORKED_ON]->(p:Project)-[r5:USES]->(t:Technology)
    RETURN
      collect(DISTINCT c) AS candidates,
      collect(DISTINCT s) AS skills,
      collect(DISTINCT j) AS jobs,
      collect(DISTINCT comp) AS companies,
      collect(DISTINCT p) AS projects,
      collect(DISTINCT t) AS technologies
  `
};
