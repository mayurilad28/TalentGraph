import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'purple' | 'cyan' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  className = '',
}) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-sm';

  const variantClasses = {
    default: 'bg-slate-800 text-slate-300 border border-slate-700/60',
    primary: 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 font-medium',
    success: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-medium',
    warning: 'bg-amber-500/10 text-amber-400 border border-amber-500/30 font-medium',
    purple: 'bg-purple-500/10 text-purple-400 border border-purple-500/30 font-medium',
    cyan: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-medium',
    outline: 'bg-transparent text-slate-400 border border-slate-700/80',
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium transition-colors ${sizeClasses} ${variantClasses} ${className}`}
    >
      {children}
    </span>
  );
};
