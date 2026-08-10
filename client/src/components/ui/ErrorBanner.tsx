import React from 'react';
import { AlertTriangle, RefreshCw, Database } from 'lucide-react';

interface ErrorBannerProps {
  message?: string;
  onRetry?: () => void;
  isDatabaseError?: boolean;
}

export const ErrorBanner: React.FC<ErrorBannerProps> = ({
  message = "We couldn't load this graph information. The graph database may be temporarily unavailable.",
  onRetry,
  isDatabaseError = true,
}) => {
  return (
    <div className="glass-panel border-rose-500/30 bg-rose-500/5 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 my-4">
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
          {isDatabaseError ? <Database className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
        </div>
        <div>
          <h4 className="text-sm font-semibold text-rose-300">
            {isDatabaseError ? 'CognoDB Connection Issue' : 'Application Error'}
          </h4>
          <p className="text-xs text-rose-300/80 mt-1 max-w-xl">
            {message}
          </p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/30 rounded-xl transition self-end sm:self-center shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Retry Connection
        </button>
      )}
    </div>
  );
};
