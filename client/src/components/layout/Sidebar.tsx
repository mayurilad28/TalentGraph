import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  GitGraph,
  Sparkles,
  Database,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/candidates', label: 'Candidate Explorer', icon: Users },
  { to: '/jobs', label: 'Job Opportunities', icon: Briefcase },
  { to: '/graph', label: 'Graph Explorer', icon: GitGraph },
];

export const Sidebar: React.FC = () => {
  return (
    <aside className="w-64 border-r border-slate-800/80 bg-slate-950/60 flex flex-col justify-between shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      {/* Navigation Links */}
      <div className="p-4 space-y-6">
        <div className="space-y-1">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
            Platform
          </div>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </div>

        {/* Graph Traversal Highlights */}
        <div className="pt-2">
          <div className="px-3 py-2 text-[11px] font-semibold tracking-wider text-slate-500 uppercase flex items-center justify-between">
            <span>Graph Traversals</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          </div>
          <div className="space-y-2 mt-1 px-3">
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
                2+ Hop Traversal
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                <code className="text-indigo-300">Candidate</code> → <code className="text-emerald-300">Skill</code> ← <code className="text-pink-300">Job</code>
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
              <div className="flex items-center gap-1.5 font-semibold text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-violet-400" />
                Indirect Technologies
              </div>
              <p className="text-[11px] leading-relaxed text-slate-400">
                <code className="text-indigo-300">Candidate</code> → <code className="text-purple-300">Project</code> → <code className="text-cyan-300">Tech</code>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
        <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20">
          <div className="flex items-center justify-between text-xs font-semibold text-indigo-300 mb-1">
            <span className="flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-indigo-400" />
              CognoDB Cloud
            </span>
            <span className="text-[10px] bg-indigo-500/20 px-1.5 py-0.2 rounded text-indigo-300">
              Bolt 5.x
            </span>
          </div>
          <p className="text-[11px] text-slate-400">
            openCypher graph engine running sub-millisecond relationship index-free adjacency.
          </p>
        </div>
      </div>
    </aside>
  );
};
