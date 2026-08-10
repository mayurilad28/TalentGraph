import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Briefcase,
  Layers,
  Building2,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Terminal,
  GitBranch,
} from 'lucide-react';
import { api } from '../lib/api';
import { StatCard } from '../components/ui/StatCard';
import { MatchScoreRing } from '../components/ui/MatchScoreRing';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { CypherQueryModal } from '../components/ui/CypherQueryModal';

export const Dashboard: React.FC = () => {
  const [showQueryModal, setShowQueryModal] = React.useState(false);

  const { data: stats, isLoading: statsLoading, error: statsError, refetch: refetchStats } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: api.getStats,
  });

  const { data: topMatches, isLoading: matchesLoading, error: matchesError, refetch: refetchMatches } = useQuery({
    queryKey: ['top-opportunities'],
    queryFn: api.getTopOpportunities,
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-3xl glass-panel p-8 md:p-10 border-indigo-500/20 bg-gradient-to-br from-indigo-950/40 via-slate-900/60 to-slate-950">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Graph-Powered Talent Intelligence Platform</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Discover Talent & Jobs Through Connected Relationships
          </h1>
          <p className="text-sm md:text-base text-slate-300 leading-relaxed">
            TalentGraph traverses multi-hop graph connections between candidates, skills, projects, technologies, and companies using <strong>CognoDB</strong> and <strong>openCypher</strong>.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              to="/candidates"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-lg shadow-indigo-600/30 transition transform hover:-translate-y-0.5"
            >
              <Users className="w-4 h-4" />
              Explore Candidates
            </Link>
            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition transform hover:-translate-y-0.5"
            >
              <Briefcase className="w-4 h-4" />
              Browse Open Roles
            </Link>
            <button
              onClick={() => setShowQueryModal(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-950/60 hover:bg-indigo-900/60 text-indigo-300 text-xs font-semibold border border-indigo-500/30 transition"
            >
              <Terminal className="w-3.5 h-3.5" />
              Inspect openCypher Query
            </button>
          </div>
        </div>
      </div>

      {/* Error state if DB is unreachable */}
      {(statsError || matchesError) && (
        <ErrorBanner
          onRetry={() => {
            refetchStats();
            refetchMatches();
          }}
        />
      )}

      {/* Platform Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {statsLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
            </div>
          ))
        ) : (
          <>
            <StatCard
              title="Total Candidates"
              value={stats?.totalCandidates ?? 24}
              icon={Users}
              colorVariant="indigo"
              description="Engineers & designers with graph-mapped skills"
            />
            <StatCard
              title="Open Opportunities"
              value={stats?.totalJobs ?? 16}
              icon={Briefcase}
              colorVariant="purple"
              description="Roles with explicit skill importance weights"
            />
            <StatCard
              title="Skill Taxonomy"
              value={stats?.totalSkills ?? 35}
              icon={Layers}
              colorVariant="emerald"
              description="Connected technical & domain capabilities"
            />
            <StatCard
              title="Partner Companies"
              value={stats?.totalCompanies ?? 8}
              icon={Building2}
              colorVariant="amber"
              description="SaaS, FinTech, HealthTech & Cloud leaders"
            />
          </>
        )}
      </div>

      {/* Top Matching Opportunities Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-400" />
              Top Graph-Matched Opportunities
            </h2>
            <p className="text-xs text-slate-400">
              High-confidence candidate-to-job matches calculated via 2+ hop relationship traversal.
            </p>
          </div>
          <Link
            to="/jobs"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
          >
            View All Jobs <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {matchesLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="glass-panel p-6 rounded-2xl space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-16 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(topMatches || []).slice(0, 6).map((match, idx) => (
              <div
                key={idx}
                className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-5 border-slate-800"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition">
                        {match.job.title}
                      </h3>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {match.company?.name || 'Partner Company'}
                      </p>
                    </div>
                    <MatchScoreRing score={match.matchScore} size="sm" showLabel={false} />
                  </div>

                  <div className="flex items-center gap-3 pt-2 border-t border-slate-800/80">
                    <img
                      src={match.candidate.avatar}
                      alt={match.candidate.name}
                      className="w-9 h-9 rounded-full object-cover border border-indigo-500/40"
                    />
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-200 truncate">
                        {match.candidate.name}
                      </p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {match.candidate.title}
                      </p>
                    </div>
                  </div>

                  {/* Matched Skills */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 mb-1.5 flex items-center justify-between">
                      <span>Matched Skills ({match.matchedSkills?.length})</span>
                      <span className="text-emerald-400 font-mono text-[10px]">Verified</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {match.matchedSkills?.slice(0, 4).map((s: any, sIdx: number) => (
                        <Badge key={sIdx} variant="success" size="sm">
                          ✓ {s.name}
                        </Badge>
                      ))}
                      {match.matchedSkills?.length > 4 && (
                        <Badge variant="outline" size="sm">
                          +{match.matchedSkills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <Link
                    to={`/candidates/${match.candidate.id}`}
                    className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1"
                  >
                    View Candidate <ArrowRight className="w-3 h-3" />
                  </Link>
                  <Link
                    to={`/jobs/${match.job.id}`}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-200 inline-flex items-center gap-1"
                  >
                    Job Details <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Why Graph Database Feature Box */}
      <div className="glass-panel p-8 rounded-3xl border-indigo-500/30 bg-gradient-to-r from-slate-900 via-indigo-950/20 to-slate-900 space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-400">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">
              Why a Graph Database for Talent Intelligence?
            </h3>
            <p className="text-xs text-slate-400">
              Relationship discovery versus complex relational multi-table JOINs
            </p>
          </div>
        </div>

        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          In traditional relational schemas, matching a candidate to jobs requires joining 5+ tables (<code>candidates</code>, <code>candidate_skills</code>, <code>skills</code>, <code>job_skills</code>, <code>jobs</code>, <code>companies</code>, <code>projects</code>, <code>technologies</code>), incurring recursive CTEs and performance bottlenecks.
          With <strong>CognoDB</strong> and <strong>openCypher</strong>, the graph traverses pointers in sub-millisecond index-free adjacency:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-indigo-300 mb-1">1. Multi-Hop Discovery</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Find technologies a candidate used in projects without explicit skill tags:
              <code>{" (c)-[:WORKED_ON]->(p)-[:USES]->(t)"}</code>
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-emerald-300 mb-1">2. Dynamic Compatibility</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Calculates matched skills, missing skills, and match percentage on the fly directly in Cypher.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs font-bold text-purple-300 mb-1">3. Upskilling Pathways</h4>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Discovers related skills that qualify a candidate for new positions via <code>{"(s1)-[:RELATED_TO]->(s2)"}</code>.
            </p>
          </div>
        </div>
      </div>

      {/* Query Inspector Modal */}
      <CypherQueryModal
        isOpen={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        title="Candidate-Job Multi-Hop Match Query"
        graphHops="3 Hops Traversal"
        explanation="Traverses (Candidate)-[:HAS_SKILL]->(Skill)<-[:REQUIRES]-(Job)-[:POSTED_BY]->(Company) to calculate matched vs missing skills and percentage match in a single openCypher statement."
        query={`MATCH (c:Candidate)-[:HAS_SKILL]->(s:Skill)<-[:REQUIRES]-(j:Job)-[:POSTED_BY]->(comp:Company)
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
LIMIT 6`}
      />
    </div>
  );
};
