import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import {
  Briefcase,
  Search,
  Filter,
  Building2,
  MapPin,
  Clock,
  ArrowRight,
  Sparkles,
  Layers,
} from 'lucide-react';
import { api } from '../lib/api';
import { Badge } from '../components/ui/Badge';
import { Skeleton } from '../components/ui/Skeleton';
import { EmptyState } from '../components/ui/EmptyState';
import { ErrorBanner } from '../components/ui/ErrorBanner';

export const Jobs: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [selectedSkill, setSelectedSkill] = useState('');

  const { data: jobs, isLoading, error, refetch } = useQuery({
    queryKey: ['jobs', searchTerm, selectedCompany, selectedSkill],
    queryFn: () => api.getJobs(searchTerm, selectedCompany, selectedSkill),
  });

  const { data: companies } = useQuery({
    queryKey: ['companies-meta'],
    queryFn: api.getCompanies,
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
            <Briefcase className="w-8 h-8 text-pink-400" />
            Job Opportunities
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse open engineering roles and discover matching candidates via graph traversal.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-300 self-start md:self-auto">
          {jobs ? `${jobs.length} Active Positions` : 'Loading...'}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col md:flex-row items-center gap-3 border-slate-800">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search jobs by title, company, or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 transition"
          />
        </div>

        {/* Company Filter */}
        <div className="relative w-full md:w-56">
          <Building2 className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer"
          >
            <option value="">All Companies</option>
            {(companies || []).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.openRolesCount} roles)
              </option>
            ))}
          </select>
        </div>

        {/* Skill Filter */}
        <div className="relative w-full md:w-56">
          <Filter className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <select
            value={selectedSkill}
            onChange={(e) => setSelectedSkill(e.target.value)}
            className="w-full bg-slate-900/80 border border-slate-800 rounded-xl pl-10 pr-8 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-pink-500 appearance-none cursor-pointer"
          >
            <option value="">Filter by Skill</option>
            {(skills || []).map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedCompany || selectedSkill) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCompany('');
              setSelectedSkill('');
            }}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition shrink-0"
          >
            Reset
          </button>
        )}
      </div>

      {/* Error state */}
      {error && <ErrorBanner onRetry={() => refetch()} />}

      {/* Jobs Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl space-y-4">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </div>
      ) : jobs && jobs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="glass-panel glass-panel-hover p-6 rounded-2xl flex flex-col justify-between space-y-5 border-slate-800 group"
            >
              <div className="space-y-4">
                {/* Company Logo & Job Title */}
                <div className="flex items-start gap-4">
                  <img
                    src={job.company?.logo || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=150'}
                    alt={job.company?.name}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-700 shadow-md shrink-0"
                  />
                  <div className="space-y-1 flex-1 overflow-hidden">
                    <h3 className="text-base font-bold text-white group-hover:text-pink-400 transition truncate">
                      {job.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-300 truncate">
                      {job.company?.name}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {job.company?.industry}
                    </p>
                  </div>
                </div>

                {/* Job Metadata */}
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 py-1 border-y border-slate-800/80">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    {job.location}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-400" />
                    {job.experienceMin}-{job.experienceMax} yrs
                  </span>
                  <span>•</span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium">
                    {job.employmentType}
                  </span>
                </div>

                {/* Description snippet */}
                <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                  {job.description}
                </p>

                {/* Required Skills */}
                <div className="space-y-1.5">
                  <div className="text-[11px] font-semibold text-slate-400 flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      Required Skills ({job.requiredSkills?.length || 0})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {job.requiredSkills?.slice(0, 4).map((skill: any) => (
                      <Badge
                        key={skill.id}
                        variant={skill.importance === 'Required' ? 'primary' : 'default'}
                        size="sm"
                      >
                        {skill.name}
                      </Badge>
                    ))}
                    {job.requiredSkills?.length > 4 && (
                      <Badge variant="outline" size="sm">
                        +{job.requiredSkills.length - 4}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <Link
                  to={`/jobs/${job.id}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-800/90 hover:bg-pink-600 text-slate-200 hover:text-white text-xs font-semibold transition"
                >
                  <span>Job Details & Matches</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to={`/graph?jobId=${job.id}`}
                  title="Explore Job in Graph Visualizer"
                  className="p-2 rounded-xl bg-pink-500/10 hover:bg-pink-500/20 text-pink-400 border border-pink-500/30 transition shrink-0"
                >
                  <Sparkles className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title="No job opportunities match your search"
          description="Try selecting a different skill or company filter."
          actionLabel="Reset Filters"
          onAction={() => {
            setSearchTerm('');
            setSelectedCompany('');
            setSelectedSkill('');
          }}
        />
      )}
    </div>
  );
};
