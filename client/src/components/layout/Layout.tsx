import React from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { LayoutDashboard, Users, Briefcase, GitGraph } from 'lucide-react';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <Navbar />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto space-y-8">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 border-t border-slate-800 bg-slate-950/95 backdrop-blur-lg flex items-center justify-around z-40 px-2">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>
        <NavLink
          to="/candidates"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <Users className="w-5 h-5" />
          <span>Candidates</span>
        </NavLink>
        <NavLink
          to="/jobs"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <Briefcase className="w-5 h-5" />
          <span>Jobs</span>
        </NavLink>
        <NavLink
          to="/graph"
          className={({ isActive }) =>
            `flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-xs font-medium ${
              isActive ? 'text-indigo-400' : 'text-slate-400'
            }`
          }
        >
          <GitGraph className="w-5 h-5" />
          <span>Graph</span>
        </NavLink>
      </div>
    </div>
  );
};
