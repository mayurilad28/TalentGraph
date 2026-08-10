import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  MapPin,
  Briefcase,
  Layers,
  ArrowRight,
  FolderGit2,
  Sparkles,
} from 'lucide-react';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { CandidateCardSkeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorBanner } from '../components/ui/ErrorBanner';

export const Candidates: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const { data: candidates, isLoading, error, refetch } = useQuery({
    queryKey: ['candidates', searchTerm, selectedSkill],
    queryFn: () => api.getCandidates(searchTerm, selectedSkill),
  });

  const { data: skills } = useQuery({
    queryKey: ['skills-meta'],
    queryFn: api.getSkills,
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <Users className="w-8 h-8 text-indigo-400" />
            Candidate Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse candidate profiles, graph-mapped skills, and project portfolios.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 self-start md:self-auto">
          {candidates ? `${candidates.length} Candidates Available` : 'Loading...'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center gap-3 border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search candidates by name, job title, or domain..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition"
          />
        </div>

        <div className="relative w-full sm:w-64">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 appearance-none cursor-pointer"
          >
            <option value="">Filter by Skill (All)</option>
            {(skills || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.category})
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedSkill) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedSkill('');
            }}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition shrink-0"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error state */}
      {error && <ErrorBanner onRetry={() => refetch()} />}

      {/* Candidate Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CandidateCardSkeleton key={i} />
          ))}
        </div>
      ) : candidates && candidates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-5 border-slate-800 group"
            >
              <div className="space-y-4">
                {/* Avatar & Core Info */}
                <div className="flex items-start gap-4">
                  <img
                    src={cand.avatar}
                    alt={cand.name}
                    className="w-14 h-14 rounded-2xl object-cover border-2 border-indigo-500/30 group-hover:border-indigo-500 transition shadow-md"
                  />
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition truncate">
                      {cand.name}
                    </h3>
                    <p className="text-xs font-medium text-slate-300 truncate">
                      {cand.title}
                    </p>
                    <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Briefcase className="w-3 h-3 text-indigo-400" />
                        {cand.experienceYears} yrs exp
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {cand.location.split('(')[0]}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {cand.summary}
                </p>

                {/* Direct Skills */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      Direct Skills ({cand.skills?.length || 0})
                    </span>
                    {cand.projectCount !== undefined && cand.projectCount > 0 && (
                      <span className="text-[10px] text-purple-400 flex items-center gap-1">
                        <FolderGit2 className="w-3 h-3" />
                        {cand.projectCount} Projects
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cand.skills?.slice(0, 5).map((skill: any) => (
                      <Badge key={skill.id} variant="default" size="sm">
                        {skill.name}
                      </Badge>
                    ))}
                    {cand.skills?.length > 5 && (
                      <Badge variant="outline" size="sm">
                        +{cand.skills.length - 5}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  to={`/candidates/${cand.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-indigo-600 text-slate-200 hover:text-white text-xs font-semibold transition"
                >
                  <span>View Profile & Graph</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/graph?candidateId=${cand.id}`}
                  title="Explore candidate in Graph Visualizer"
                  className="p-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No candidates match your search"
          description="Try clearing your search keyword or selecting a different skill filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedSkill('');
          }}
        />
      )}
    </div>
  );
};
