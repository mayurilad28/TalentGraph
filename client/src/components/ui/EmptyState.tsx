import React from 'react';
import { LucideIcon, SearchX } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: LucideIcon;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon: Icon = SearchX,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="glass-panel p-12 rounded-2xl text-center flex flex-col items-center justify-center max-w-lg mx-auto">
      <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700/60 text-slate-400 mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-100">{title}</h3>
      <p className="mt-2 text-sm text-slate-400 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition shadow-lg shadow-indigo-600/20"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};
