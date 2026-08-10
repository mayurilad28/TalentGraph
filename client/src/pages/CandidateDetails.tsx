import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin,
  Briefcase,
  Layers,
  FolderGit2,
  Cpu,
  Sparkles,
  ArrowLeft,
  Terminal,
  CheckCircle2,
  CircleDashed,
  TrendingUp,
  Building2,
  GitGraph,
} from 'lucide-react';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { EmptyState } from '../components/ui/EmptyState';
import { CypherQueryModal } from '../components/ui/CypherQueryModal';

export const CandidateDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'profile' | 'matches'>('profile');
  const [showQueryModal, setShowQueryModal] = useState(false);

  // Candidate Data
  const { data: candidate, isLoading: candidateLoading, error: candidateError } = useQuery({
    queryKey: ['candidate', id],
    queryFn: () => api.getCandidateById(id!),
    enabled: !!id,
  });

  // Indirect Technologies (Multi-hop through projects)
  const { data: technologies } = useQuery({
    queryKey: ['candidate-technologies', id],
    queryFn: () => api.getCandidateTechnologies(id!),
    enabled: !!id,
  });

  // Upskilling / Related Skills
  const { data: relatedSkills } = useQuery({
    queryKey: ['candidate-related-skills', id],
    queryFn: () => api.getCandidateRelatedSkills(id!),
    enabled: !!id,
  });

  // Matching Jobs Graph Traversal
  const {
    data: matchingJobs,
    isLoading: matchesLoading,
    refetch: findMatchingJobs,
    isFetching: matchesFetching,
  } = useQuery({
    queryKey: ['candidate-job-matches', id],
    queryFn: () => api.getCandidateRecommendations(id!),
    enabled: !!id && activeTab === 'matches',
  });

  if (candidateLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-48 w-full rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl md:col-span-2" />
        </div>
      </div>
    );
  }

  if (candidateError || !candidate) {
    return (
      <div className="space-y-4">
        <Link to="/candidates" className="text-xs text-indigo-400 inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Candidates
        </Link>
        <ErrorBanner
          message={`Unable to load candidate '${id}'. Make sure the database is connected.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Back Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/candidates"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Candidate Explorer
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/graph?candidateId=${candidate.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <GitGraph className="w-3.5 h-3.5 text-indigo-400" />
            View in Graph Visualizer
          </Link>
          <button
            onClick={() => setShowQueryModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-xs font-semibold text-indigo-300 border border-indigo-500/30 transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            Inspect Traversal Query
          </button>
        </div>
      </div>

      {/* Candidate Profile Header Card */}
      <div className="glass-panel p-8 rounded-3xl border-indigo-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-6">
          <img
            src={candidate.avatar}
            alt={candidate.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-2 border-indigo-500/40 shadow-xl"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {candidate.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                Available
              </span>
            </div>
            <p className="text-sm font-semibold text-indigo-300">{candidate.title}</p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-indigo-400" />
                {candidate.experienceYears} Years Experience
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {candidate.location}
              </span>
            </div>
          </div>
        </div>

        {/* Prominent Action Button */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveTab('matches');
              findMatchingJobs();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 transition transform hover:-translate-y-0.5 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Find Matching Jobs (Graph Traversal)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition ${
            activeTab === 'profile'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Candidate Profile & Knowledge Graph
        </button>
        <button
          onClick={() => {
            setActiveTab('matches');
            findMatchingJobs();
          }}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'matches'
              ? 'border-indigo-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <TrendingUp className="w-4 h-4 text-indigo-400" />
          Recommended Jobs ({matchingJobs?.length ?? '...'})
        </button>
      </div>

      {/* Tab 1: Profile & Multi-Hop Connections */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Direct Skills & Upskilling */}
          <div className="space-y-6">
            {/* Direct Skills */}
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Direct Skills ({candidate.skills?.length || 0})
              </h3>
              <p className="text-xs text-slate-400">
                Skills directly connected via <code>[:HAS_SKILL]</code>
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {(candidate.skills || []).map((skill: any) => (
                  <Badge key={skill.id} variant="primary" size="md">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Upskilling Recommendations (Skill -> RELATED_TO -> Skill) */}
            <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 bg-indigo-950/10 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Skills You May Want to Learn
                </h3>
              </div>
              <p className="text-xs text-slate-400">
                Discovered through 2-hop graph relation: <code>{"(Skill)-[:RELATED_TO]->(Skill)"}</code>
              </p>
              <div className="space-y-2.5 pt-1">
                {(relatedSkills || []).map((rel) => (
                  <div
                    key={rel.id}
                    className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-200">{rel.name}</p>
                      <p className="text-[10px] text-slate-400">
                        Related to: {rel.relatedToCurrentSkills?.slice(0, 2).join(', ')}
                      </p>
                    </div>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                      +{rel.connectionStrength} connections
                    </span>
                  </div>
                ))}
                {(!relatedSkills || relatedSkills.length === 0) && (
                  <p className="text-xs text-slate-500">All closely related skills already acquired!</p>
                )}
              </div>
            </div>
          </div>

          {/* Right Column: Projects & Indirect Technologies */}
          <div className="lg:col-span-2 space-y-6">
            {/* Summary */}
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-2">
              <h3 className="text-sm font-bold text-white">Professional Summary</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
                {candidate.summary}
              </p>
            </div>

            {/* Indirect Technologies Traversal Highlight */}
            <div className="glass-panel p-6 rounded-2xl border-cyan-500/20 bg-cyan-950/10 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-cyan-400" />
                    Indirect Technologies (Via Projects)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Discovered across 2 hops: <code>{"(Candidate)-[:WORKED_ON]->(Project)-[:USES]->(Technology)"}</code>
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/30">
                  Multi-Hop Traversal
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {(technologies || []).map((tech) => (
                  <div
                    key={tech.id}
                    className="p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 flex items-center gap-2"
                  >
                    <span className="text-xs font-semibold text-cyan-300">{tech.name}</span>
                    <span className="text-[10px] text-slate-400 px-1.5 py-0.2 rounded bg-slate-800">
                      {tech.projectCount} proj
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Portfolio */}
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FolderGit2 className="w-4 h-4 text-purple-400" />
                Featured Projects Worked On ({candidate.projects?.length || 0})
              </h3>
              <div className="space-y-4 pt-1">
                {(candidate.projects || []).map((proj: any) => (
                  <div
                    key={proj.id}
                    className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <div>
                        <h4 className="text-sm font-bold text-white">{proj.name}</h4>
                        <p className="text-xs text-indigo-400 font-medium">{proj.role} • {proj.durationMonths} months</p>
                      </div>
                      <span className="text-[10px] text-slate-400 px-2 py-0.5 rounded bg-slate-800 self-start sm:self-auto">
                        {proj.domain} ({proj.year})
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(proj.technologies || []).map((t: any) => (
                        <span
                          key={t.id}
                          className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700"
                        >
                          {t.name}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Recommended Jobs (Graph Traversal Results) */}
      {activeTab === 'matches' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-indigo-500/20 bg-indigo-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-indigo-400" />
                Graph Traversal Job Recommendations for {candidate.name}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Calculated live in CognoDB via: <code>{"(Candidate)-[:HAS_SKILL]->(Skill)<-[:REQUIRES]-(Job)"}</code>
              </p>
            </div>
            <button
              onClick={() => setShowQueryModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-indigo-300 border border-indigo-500/30 transition self-start md:self-auto"
            >
              <Terminal className="w-3.5 h-3.5" />
              View Cypher Query
            </button>
          </div>

          {matchesLoading || matchesFetching ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : matchingJobs && matchingJobs.length > 0 ? (
            <div className="space-y-4">
              {matchingJobs.map((rec) => (
                <div
                  key={rec.job.id}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-800 space-y-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-3">
                        <h4 className="text-lg font-bold text-white">{rec.job.title}</h4>
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                          {rec.job.employmentType}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-400">
                        <span className="flex items-center gap-1 text-slate-300 font-semibold">
                          <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                          {rec.company?.name}
                        </span>
                        <span>•</span>
                        <span>{rec.job.location}</span>
                        <span>•</span>
                        <span>{rec.job.experienceMin}-{rec.job.experienceMax} yrs exp</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-start md:self-auto">
                      <MatchScoreRing score={rec.matchScore} size="md" />
                      <Link
                        to={`/jobs/${rec.job.id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition shrink-0"
                      >
                        View Job Details
                      </Link>
                    </div>
                  </div>

                  {/* Why this match? */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <p className="text-xs text-indigo-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                      Why this match? {rec.explanation}
                    </p>

                    {/* Matched & Missing Skills Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Matched Skills */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Matched Skills ({rec.matchedSkills.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.matchedSkills.map((s) => (
                            <Badge key={s.id} variant="success" size="sm">
                              ✓ {s.name}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Missing Skills */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-slate-400 flex items-center gap-1.5">
                          <CircleDashed className="w-3.5 h-3.5 text-amber-400" />
                          Missing Skills ({rec.missingSkills.length})
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {rec.missingSkills.length > 0 ? (
                            rec.missingSkills.map((s) => (
                              <Badge key={s.id} variant="outline" size="sm">
                                ○ {s.name}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-xs text-emerald-400 font-medium">
                              Perfect Match! No missing skills.
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No matching jobs found"
              description="This candidate has no overlapping skills with current open job requirements. Try adding or editing candidate skills in the database."
            />
          )}
        </div>
      )}

      {/* Query Modal */}
      <CypherQueryModal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        title="Candidate Job Recommendation Query"
        graphHops="2 Hops Traversal"
        params={{ candidateId: candidate.id }}
        explanation="Traverses (Candidate)-[:HAS_SKILL]->(Skill)<-[:REQUIRES]-(Job) to dynamically compute intersection sets, matched vs missing skills, and calculate match percentage directly inside CognoDB openCypher."
        query={`MATCH (c:Candidate {id: $candidateId})
MATCH (j:Job)-[:POSTED_BY]->(comp:Company)
MATCH (j)-[r:REQUIRES]->(required:Skill)
WITH c, j, comp, collect(DISTINCT required) AS allRequiredSkills

OPTIONAL MATCH (c)-[:HAS_SKILL]->(matched:Skill)<-[:REQUIRES]-(j)
WITH c, j, comp, allRequiredSkills, collect(DISTINCT matched) AS matchedSkills

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
ORDER BY matchScore DESC, matchedCount DESC, j.title ASC`}
      />
    </div>
  );
};
