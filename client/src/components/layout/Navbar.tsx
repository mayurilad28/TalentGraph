import React from 'react';
import { Network, Database, GitFork } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../lib/api';

export const Navbar: React.FC = () => {
  const { data: health } = useQuery({
    queryKey: ['health'],
    queryFn: api.getHealth,
    refetchInterval: 30000,
  });

  const isConnected = health?.database?.connected ?? false;

  return (
    <header className="sticky top-0 z-40 h-16 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md px-6 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white shadow-lg shadow-indigo-500/20">
          <Network className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-indigo-200 bg-clip-text text-transparent">
              TalentGraph
            </span>
            <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              CognoDB
            </span>
          </div>
          <p className="text-[11px] text-slate-400 hidden sm:block">
            openCypher Relationship Intelligence
          </p>
        </div>
      </div>

      {/* Right Actions & Health Status */}
      <div className="flex items-center gap-4">
        {/* Database Health Badge */}
        <div
          title={health?.database?.message || 'Checking CognoDB status...'}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-all ${
            isConnected
              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
          }`}
        >
          <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-emerald-400 animate-pulse-subtle' : 'bg-amber-400'}`} />
          <Database className="w-3.5 h-3.5" />
          <span className="hidden md:inline">
            {isConnected ? 'CognoDB Connected' : 'CognoDB Reconnecting'}
          </span>
          {isConnected && health?.database?.latencyMs && (
            <span className="text-[10px] text-emerald-300/80 font-mono">
              ({health.database.latencyMs}ms)
            </span>
          )}
        </div>

        {/* Wexa Take-Home Tag */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400">
          <GitFork className="w-3.5 h-3.5 text-indigo-400" />
          <span>Wexa AI Submission</span>
        </div>
      </div>
    </header>
  );
};
