import { executeQuery, sanitizeGraphData } from '../database/driver';
import { GRAPH_QUERIES } from '../database/queries/graphQueries';

export interface GraphNode {
  id: string;
  label: string;
  group: 'candidate' | 'job' | 'skill' | 'company' | 'project' | 'technology';
  title?: string; // Tooltip / detail
  properties?: Record<string, any>;
  shape?: string;
  color?: { background: string; border: string; highlight?: { background: string; border: string } };
}

export interface GraphEdge {
  id: string;
  from: string;
  to: string;
  label: string;
  title?: string;
  arrows?: string;
  dashes?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

const COLOR_MAP: Record<string, { background: string; border: string }> = {
  candidate: { background: '#6366f1', border: '#4338ca' }, // Indigo
  job: { background: '#ec4899', border: '#be185d' },       // Pink
  skill: { background: '#10b981', border: '#047857' },     // Emerald
  company: { background: '#f59e0b', border: '#b45309' },   // Amber
  project: { background: '#8b5cf6', border: '#6d28d9' },   // Purple
  technology: { background: '#06b6d4', border: '#0e7490' } // Cyan
};

export class GraphService {
  /**
   * Format raw nodes and relationships into vis-network ready GraphData.
   */
  private static formatGraphData(
    candidates: any[] = [],
    jobs: any[] = [],
    skills: any[] = [],
    companies: any[] = [],
    projects: any[] = [],
    technologies: any[] = []
  ): GraphData {
    const nodeMap = new Map<string, GraphNode>();
    const edgeMap = new Map<string, GraphEdge>();

    const addNode = (id: string, label: string, group: GraphNode['group'], properties: Record<string, any> = {}) => {
      if (!id || nodeMap.has(id)) return;
      const color = COLOR_MAP[group] || { background: '#94a3b8', border: '#64748b' };
      nodeMap.set(id, {
        id,
        label,
        group,
        properties,
        color: {
          background: color.background,
          border: color.border,
          highlight: { background: color.background, border: '#ffffff' },
        },
      });
    };

    const addEdge = (from: string, to: string, label: string) => {
      if (!from || !to) return;
      const edgeId = `${from}->${to}:${label}`;
      if (edgeMap.has(edgeId)) return;
      edgeMap.set(edgeId, {
        id: edgeId,
        from,
        to,
        label,
        arrows: 'to',
      });
    };

    // Add candidate nodes
    candidates.forEach((c) => {
      if (c && c.id) addNode(c.id, c.name, 'candidate', c);
    });

    // Add job nodes
    jobs.forEach((j) => {
      if (j && j.id) addNode(j.id, j.title, 'job', j);
    });

    // Add skill nodes
    skills.forEach((s) => {
      if (s && s.id) addNode(s.id, s.name, 'skill', s);
    });

    // Add company nodes
    companies.forEach((comp) => {
      if (comp && comp.id) addNode(comp.id, comp.name, 'company', comp);
    });

    // Add project nodes
    projects.forEach((p) => {
      if (p && p.id) addNode(p.id, p.name, 'project', p);
    });

    // Add technology nodes
    technologies.forEach((t) => {
      if (t && t.id) addNode(t.id, t.name, 'technology', t);
    });

    return {
      nodes: Array.from(nodeMap.values()),
      edges: Array.from(edgeMap.values()),
    };
  }

  /**
   * Get Candidate Subgraph.
   */
  static async getCandidateSubgraph(candidateId: string): Promise<GraphData> {
    const records = await executeQuery(GRAPH_QUERIES.GET_CANDIDATE_SUBGRAPH, { candidateId });
    if (!records || records.length === 0) {
      return { nodes: [], edges: [] };
    }

    const row = records[0];
    const candidate = sanitizeGraphData(row.c);
    const skills = sanitizeGraphData(row.skills) || [];
    const projects = sanitizeGraphData(row.projects) || [];
    const technologies = sanitizeGraphData(row.technologies) || [];
    const jobs = sanitizeGraphData(row.jobs) || [];
    const companies = sanitizeGraphData(row.companies) || [];

    const graph = this.formatGraphData([candidate], jobs, skills, companies, projects, technologies);

    // Build edges
    // (Candidate)-[:HAS_SKILL]->(Skill)
    skills.forEach((s: any) => {
      if (candidate?.id && s?.id) {
        graph.edges.push({
          id: `${candidate.id}->${s.id}:HAS_SKILL`,
          from: candidate.id,
          to: s.id,
          label: 'HAS_SKILL',
          arrows: 'to',
        });
      }
    });

    // (Candidate)-[:WORKED_ON]->(Project)
    projects.forEach((p: any) => {
      if (candidate?.id && p?.id) {
        graph.edges.push({
          id: `${candidate.id}->${p.id}:WORKED_ON`,
          from: candidate.id,
          to: p.id,
          label: 'WORKED_ON',
          arrows: 'to',
        });
      }
    });

    // (Job)-[:POSTED_BY]->(Company)
    // (Job)-[:REQUIRES]->(Skill)
    // We can run a quick edge query or connect matching nodes
    const edgeRecords = await executeQuery(
      `MATCH (c:Candidate {id: $candidateId})
       OPTIONAL MATCH (c)-[:WORKED_ON]->(p:Project)-[:USES]->(t:Technology)
       OPTIONAL MATCH (c)-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)-[:POSTED_BY]->(comp:Company)
       RETURN p.id AS projId, t.id AS techId, j.id AS jobId, s.id AS skillId, comp.id AS compId`,
      { candidateId }
    );

    const edgeSet = new Set(graph.edges.map((e) => e.id));
    edgeRecords.forEach((rec) => {
      const pId = rec.projId;
      const tId = rec.techId;
      const jId = rec.jobId;
      const sId = rec.skillId;
      const compId = rec.compId;

      if (pId && tId) {
        const id = `${pId}->${tId}:USES`;
        if (!edgeSet.has(id)) {
          edgeSet.add(id);
          graph.edges.push({ id, from: pId, to: tId, label: 'USES', arrows: 'to' });
        }
      }

      if (jId && sId) {
        const id = `${jId}->${sId}:REQUIRES`;
        if (!edgeSet.has(id)) {
          edgeSet.add(id);
          graph.edges.push({ id, from: jId, to: sId, label: 'REQUIRES', arrows: 'to' });
        }
      }

      if (jId && compId) {
        const id = `${jId}->${compId}:POSTED_BY`;
        if (!edgeSet.has(id)) {
          edgeSet.add(id);
          graph.edges.push({ id, from: jId, to: compId, label: 'POSTED_BY', arrows: 'to' });
        }
      }
    });

    return graph;
  }

  /**
   * Get Job Subgraph.
   */
  static async getJobSubgraph(jobId: string): Promise<GraphData> {
    const records = await executeQuery(GRAPH_QUERIES.GET_JOB_SUBGRAPH, { jobId });
    if (!records || records.length === 0) {
      return { nodes: [], edges: [] };
    }

    const row = records[0];
    const job = sanitizeGraphData(row.j);
    const company = sanitizeGraphData(row.comp);
    const skills = sanitizeGraphData(row.skills) || [];
    const candidates = sanitizeGraphData(row.candidates) || [];

    const graph = this.formatGraphData(candidates, [job], skills, company ? [company] : [], [], []);

    // Job to Company
    if (job?.id && company?.id) {
      graph.edges.push({
        id: `${job.id}->${company.id}:POSTED_BY`,
        from: job.id,
        to: company.id,
        label: 'POSTED_BY',
        arrows: 'to',
      });
    }

    // Job to Skills
    skills.forEach((s: any) => {
      if (job?.id && s?.id) {
        graph.edges.push({
          id: `${job.id}->${s.id}:REQUIRES`,
          from: job.id,
          to: s.id,
          label: 'REQUIRES',
          arrows: 'to',
        });
      }
    });

    // Candidates to Skills
    const edgeRecords = await executeQuery(
      `MATCH (j:Job {id: $jobId})-[:REQUIRES]->(s:Skill)<-[:HAS_SKILL]-(c:Candidate)
       RETURN c.id AS candId, s.id AS skillId`,
      { jobId }
    );

    const edgeSet = new Set(graph.edges.map((e) => e.id));
    edgeRecords.forEach((rec) => {
      const candId = rec.candId;
      const skillId = rec.skillId;
      if (candId && skillId) {
        const id = `${candId}->${skillId}:HAS_SKILL`;
        if (!edgeSet.has(id)) {
          edgeSet.add(id);
          graph.edges.push({ id, from: candId, to: skillId, label: 'HAS_SKILL', arrows: 'to' });
        }
      }
    });

    return graph;
  }

  /**
   * General exploration subgraph.
   */
  static async getExploreSubgraph(): Promise<GraphData> {
    const rawNodes = await executeQuery(`
      MATCH (c:Candidate) WITH collect(c)[0..10] AS candidates
      MATCH (j:Job) WITH candidates, collect(j)[0..8] AS jobs
      MATCH (s:Skill) WITH candidates, jobs, collect(s)[0..15] AS skills
      MATCH (comp:Company) WITH candidates, jobs, skills, collect(comp)[0..6] AS companies
      MATCH (p:Project) WITH candidates, jobs, skills, companies, collect(p)[0..8] AS projects
      MATCH (t:Technology) WITH candidates, jobs, skills, companies, projects, collect(t)[0..10] AS technologies
      RETURN candidates, jobs, skills, companies, projects, technologies
    `);

    if (!rawNodes || rawNodes.length === 0) {
      return { nodes: [], edges: [] };
    }

    const row = rawNodes[0];
    const candidates = sanitizeGraphData(row.candidates) || [];
    const jobs = sanitizeGraphData(row.jobs) || [];
    const skills = sanitizeGraphData(row.skills) || [];
    const companies = sanitizeGraphData(row.companies) || [];
    const projects = sanitizeGraphData(row.projects) || [];
    const technologies = sanitizeGraphData(row.technologies) || [];

    const graph = this.formatGraphData(candidates, jobs, skills, companies, projects, technologies);
    const candidateIds = candidates.map((c: any) => c.id);
    const jobIds = jobs.map((j: any) => j.id);

    // Fetch relationships between active nodes
    const edgeRecords = await executeQuery(
      `MATCH (a)-[r]->(b)
       WHERE a.id IN $nodeIds AND b.id IN $nodeIds
       RETURN a.id AS fromId, b.id AS toId, type(r) AS relType`,
      {
        nodeIds: graph.nodes.map((n) => n.id),
      }
    );

    const edgeSet = new Set<string>();
    edgeRecords.forEach((rec) => {
      const from = rec.fromId;
      const to = rec.toId;
      const label = rec.relType;
      const id = `${from}->${to}:${label}`;
      if (!edgeSet.has(id)) {
        edgeSet.add(id);
        graph.edges.push({ id, from, to, label, arrows: 'to' });
      }
    });

    return graph;
  }
}
