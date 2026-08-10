const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export interface ApiResponse<T> {
  data: T | null;
  error: { message: string; code?: string } | null;
}

export interface Candidate {
  id: string;
  name: string;
  title: string;
  location: string;
  experienceYears: number;
  summary: string;
  avatar: string;
  skills: Array<{ id: string; name: string; category: string }>;
  projectCount?: number;
  projects?: Array<{
    id: string;
    name: string;
    description: string;
    domain: string;
    year: number;
    role: string;
    durationMonths: number;
    technologies: Array<{ id: string; name: string; category: string }>;
  }>;
}

export interface Job {
  id: string;
  title: string;
  description: string;
  location: string;
  employmentType: string;
  experienceMin: number;
  experienceMax: number;
  company: {
    id: string;
    name: string;
    industry: string;
    logo: string;
  };
  requiredSkills: Array<{
    id: string;
    name: string;
    category: string;
    importance: string;
  }>;
}

export interface JobRecommendation {
  job: Job;
  company: Job['company'];
  matchedSkills: Array<{ id: string; name: string; category: string }>;
  missingSkills: Array<{ id: string; name: string; category: string }>;
  allRequiredSkills: Array<{ id: string; name: string; category: string }>;
  matchedCount: number;
  requiredCount: number;
  matchScore: number;
  explanation: string;
}

export interface CandidateRecommendation {
  candidate: Candidate;
  matchedSkills: Array<{ id: string; name: string; category: string }>;
  missingSkills: Array<{ id: string; name: string; category: string }>;
  allRequiredSkills: Array<{ id: string; name: string; category: string }>;
  matchedCount: number;
  requiredCount: number;
  matchScore: number;
  explanation: string;
}

export interface IndirectTechnology {
  id: string;
  name: string;
  category: string;
  usedInProjects: string[];
  projectCount: number;
}

export interface RelatedSkill {
  id: string;
  name: string;
  category: string;
  relatedToCurrentSkills: string[];
  connectionStrength: number;
}

export interface GraphData {
  nodes: Array<{
    id: string;
    label: string;
    group: string;
    properties: Record<string, any>;
    color: { background: string; border: string; highlight?: { background: string; border: string } };
  }>;
  edges: Array<{
    id: string;
    from: string;
    to: string;
    label: string;
    arrows?: string;
  }>;
}

export interface DashboardMetrics {
  totalCandidates: number;
  totalJobs: number;
  totalSkills: number;
  totalCompanies: number;
}

export interface HealthStatus {
  status: 'healthy' | 'degraded';
  database: {
    connected: boolean;
    message: string;
    latencyMs?: number;
  };
  timestamp: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    const body: ApiResponse<T> = await res.json();
    if (!res.ok || body.error) {
      throw new Error(body.error?.message || `Request failed with status ${res.status}`);
    }

    return body.data as T;
  } catch (error: any) {
    console.error(`API Error on ${endpoint}:`, error);
    throw error;
  }
}

export const api = {
  // Health
  getHealth: async (): Promise<HealthStatus> => {
    const res = await fetch(`${API_BASE_URL}/health`);
    return res.json();
  },

  // Candidates
  getCandidates: (search = '', skillId = '') =>
    request<Candidate[]>(`/candidates?search=${encodeURIComponent(search)}&skillId=${encodeURIComponent(skillId)}`),

  getCandidateById: (id: string) =>
    request<Candidate>(`/candidates/${id}`),

  getCandidateTechnologies: (id: string) =>
    request<IndirectTechnology[]>(`/candidates/${id}/technologies`),

  getCandidateRelatedSkills: (id: string) =>
    request<RelatedSkill[]>(`/candidates/${id}/related-skills`),

  getCandidateRecommendations: (id: string) =>
    request<JobRecommendation[]>(`/candidates/${id}/recommendations`),

  // Jobs
  getJobs: (search = '', companyId = '', skillId = '') =>
    request<Job[]>(`/jobs?search=${encodeURIComponent(search)}&companyId=${encodeURIComponent(companyId)}&skillId=${encodeURIComponent(skillId)}`),

  getJobById: (id: string) =>
    request<Job>(`/jobs/${id}`),

  getJobRecommendations: (id: string) =>
    request<CandidateRecommendation[]>(`/jobs/${id}/recommendations`),

  getCompanies: () =>
    request<Array<{ id: string; name: string; industry: string; logo: string; openRolesCount: number }>>('/jobs/meta/companies'),

  getSkills: () =>
    request<Array<{ id: string; name: string; category: string; candidateCount: number; jobDemandCount: number }>>('/jobs/meta/skills'),

  // Recommendations & Stats
  getTopOpportunities: () =>
    request<Array<{
      candidate: Candidate;
      job: Job;
      company: { name: string; logo: string };
      matchedSkills: Array<{ name: string }>;
      matchScore: number;
    }>>('/recommendations/top'),

  getStats: () =>
    request<DashboardMetrics>('/recommendations/stats'),

  // Graph
  getExploreGraph: () =>
    request<GraphData>('/graph/explore'),

  getCandidateGraph: (id: string) =>
    request<GraphData>(`/graph/candidate/${id}`),

  getJobGraph: (id: string) =>
    request<GraphData>(`/graph/job/${id}`),
};
