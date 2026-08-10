import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Building2,
  MapPin,
  Clock,
  Layers,
  Sparkles,
  ArrowLeft,
  Terminal,
  CheckCircle2,
  CircleDashed,
  TrendingUp,
  Users,
  GitGraph,
} from 'lucide-react';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { EmptyState } from '../components/ui/EmptyState';
import { CypherQueryModal } from '../components/ui/CypherQueryModal';

export const JobDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'details' | 'candidates'>('details');
  const [showQueryModal, setShowQueryModal] = useState(false);

  // Job Details
  const { data: job, isLoading: jobLoading, error: jobError } = useQuery({
    queryKey: ['job', id],
    queryFn: () => api.getJobById(id!),
    enabled: !!id,
  });

  // Reverse Traversal: Matching Candidates
  const {
    data: candidateMatches,
    isLoading: candidatesLoading,
    refetch: findMatchingCandidates,
    isFetching: candidatesFetching,
  } = useQuery({
    queryKey: ['job-candidate-matches', id],
    queryFn: () => api.getJobRecommendations(id!),
    enabled: !!id && activeTab === 'candidates',
  });

  if (jobLoading) {
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

  if (jobError || !job) {
    return (
      <div className="space-y-4">
        <Link to="/jobs" className="text-xs text-pink-400 inline-flex items-center gap-1">
          <ArrowLeft className="w-3 h-3" /> Back to Job Opportunities
        </Link>
        <ErrorBanner
          message={`Unable to load job '${id}'. Make sure the database is connected.`}
        />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/jobs"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Job Opportunities
        </Link>
        <div className="flex items-center gap-2">
          <Link
            to={`/graph?jobId=${job.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-pink-500/40 text-xs font-semibold text-slate-300 hover:text-white transition"
          >
            <GitGraph className="w-3.5 h-3.5 text-pink-400" />
            View in Graph Visualizer
          </Link>
          <button
            onClick={() => setShowQueryModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-xs font-semibold text-pink-300 border border-pink-500/30 transition"
          >
            <Terminal className="w-3.5 h-3.5" />
            Inspect Cypher Query
          </button>
        </div>
      </div>

      {/* Header Card */}
      <div className="glass-panel p-8 rounded-3xl border-pink-500/20 bg-gradient-to-br from-slate-900 via-pink-950/20 to-slate-900 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-start md:items-center gap-6">
          <img
            src={job.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
            alt={job.company?.name}
            className="w-20 h-20 md:w-24 md:h-24 rounded-3xl object-cover border-2 border-pink-500/40 shadow-xl"
          />
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white">
                {job.title}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-pink-500/10 border border-pink-500/30 text-pink-400 text-xs font-semibold">
                {job.employmentType}
              </span>
            </div>
            <p className="text-sm font-semibold text-pink-300 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              {job.company?.name} • {job.company?.industry}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                {job.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Experience: {job.experienceMin} - {job.experienceMax} Years
              </span>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <button
            onClick={() => {
              setActiveTab('candidates');
              findMatchingCandidates();
            }}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-pink-600/30 transition transform hover:-translate-y-0.5 shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            Find Matching Candidates (Reverse Traversal)
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-1">
        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition ${
            activeTab === 'details'
              ? 'border-pink-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          Job Specifications & Requirements
        </button>
        <button
          onClick={() => {
            setActiveTab('candidates');
            findMatchingCandidates();
          }}
          className={`px-4 py-2 text-sm font-bold border-b-2 transition flex items-center gap-2 ${
            activeTab === 'candidates'
              ? 'border-pink-500 text-white'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4 text-pink-400" />
          Top Matching Candidates ({candidateMatches?.length ?? '...'})
        </button>
      </div>

      {/* Tab 1: Details */}
      {activeTab === 'details' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="space-y-6">
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-400" />
                Required Skills ({job.requiredSkills?.length || 0})
              </h3>
              <div className="flex flex-wrap gap-2 pt-1">
                {(job.requiredSkills || []).map((skill: any) => (
                  <Badge
                    key={skill.id}
                    variant={skill.importance === 'Required' ? 'primary' : 'default'}
                    size="md"
                  >
                    {skill.name} {skill.importance === 'Required' ? '(Required)' : '(Preferred)'}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-amber-400" />
                About {job.company?.name}
              </h3>
              <p className="text-xs text-slate-400">
                Industry: <strong className="text-slate-200">{job.company?.industry}</strong>
              </p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Connected in CognoDB graph as posting organization with active talent pipelines.
              </p>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <div className="glass-panel p-6 rounded-2xl border-slate-800 space-y-3">
              <h3 className="text-sm font-bold text-white">Role Overview & Responsibilities</h3>
              <p className="text-xs md:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                {job.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Candidate Recommendations */}
      {activeTab === 'candidates' && (
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border-pink-500/20 bg-pink-950/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-pink-400" />
                Reverse Graph Traversal Candidate Matches for {job.title}
              </h3>
              <p className="text-xs text-slate-300 mt-1">
                Calculated live via openCypher: <code>{"(Job)-[:REQUIRES]->(Skill)<-[:HAS_SKILL]-(Candidate)"}</code>
              </p>
            </div>
            <button
              onClick={() => setShowQueryModal(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-pink-300 border border-pink-500/30 transition self-start md:self-auto"
            >
              <Terminal className="w-3.5 h-3.5" />
              View Cypher Query
            </button>
          </div>

          {candidatesLoading || candidatesFetching ? (
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass-panel p-6 rounded-2xl space-y-4">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ))}
            </div>
          ) : candidateMatches && candidateMatches.length > 0 ? (
            <div className="space-y-4">
              {candidateMatches.map((rec, idx) => (
                <div
                  key={rec.candidate.id}
                  className="glass-panel glass-panel-hover p-6 rounded-2xl border-slate-800 space-y-5"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-xs text-slate-300 shrink-0">
                        #{idx + 1}
                      </div>
                      <img
                        src={rec.candidate.avatar}
                        alt={rec.candidate.name}
                        className="w-12 h-12 rounded-xl object-cover border border-indigo-500/40 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-bold text-white">{rec.candidate.name}</h4>
                          <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                            {rec.candidate.experienceYears} yrs exp
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-slate-300">{rec.candidate.title}</p>
                        <p className="text-[11px] text-slate-400">{rec.candidate.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6 self-start md:self-auto">
                      <MatchScoreRing score={rec.matchScore} size="md" />
                      <Link
                        to={`/candidates/${rec.candidate.id}`}
                        className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition shrink-0"
                      >
                        View Full Candidate
                      </Link>
                    </div>
                  </div>

                  {/* Why this match? */}
                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
                    <p className="text-xs text-pink-300 font-semibold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-pink-400" />
                      Why this candidate? {rec.explanation}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                      {/* Matched Skills */}
                      <div className="space-y-1.5">
                        <div className="text-[11px] font-bold text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Candidate Matched Skills ({rec.matchedSkills.length})
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
                          Skills To Upskill ({rec.missingSkills.length})
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
                              100% Skill Coverage!
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
              title="No matching candidates found"
              description="No candidates currently in the graph possess the skills required for this job."
            />
          )}
        </div>
      )}

      {/* Query Modal */}
      <CypherQueryModal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        title="Job Reverse Match Cypher Query"
        graphHops="2 Hops Traversal"
        params={{ jobId: job.id }}
        explanation="Traverses (Job)-[:REQUIRES]->(Skill)<-[:HAS_SKILL]-(Candidate) to rank candidates by number and percentage of matching skills in CognoDB."
        query={`MATCH (j:Job {id: $jobId})
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
ORDER BY matchScore DESC, matchedCount DESC, c.experienceYears DESC`}
      />
    </div>
  );
};
