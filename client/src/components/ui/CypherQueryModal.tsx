import React from 'react';
import { Terminal, Copy, Check, X, Sparkles } from 'lucide-react';

interface CypherQueryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  query: string;
  params?: Record<string, any>;
  explanation: string;
  graphHops?: string;
}

export const CypherQueryModal: React.FC<CypherQueryModalProps> = ({
  isOpen,
  onClose,
  title,
  query,
  params,
  explanation,
  graphHops = '2 Hops Traversal',
}) => {
  const [copied, setCopied] = React.useState(false);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(query.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-2xl border-indigo-500/30 overflow-hidden shadow-2xl bg-slate-900/95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                {title}
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {graphHops}
                </span>
              </h3>
              <p className="text-xs text-slate-400">Under-the-hood openCypher execution on CognoDB</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Why Graph Callout */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div className="text-xs text-indigo-200/90 leading-relaxed">
              <span className="font-semibold text-indigo-300">Graph Database Advantage: </span>
              {explanation}
            </div>
          </div>

          {/* Cypher Code Block */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 px-1 font-mono">
              <span>openCypher Parameterized Query</span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copied ? 'Copied' : 'Copy Query'}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed selection:bg-indigo-700">
              <code>{query.trim()}</code>
            </pre>
          </div>

          {/* Parameters */}
          {params && (
            <div>
              <div className="text-xs text-slate-400 mb-1.5 px-1 font-mono">Runtime Parameters</div>
              <pre className="p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-400 overflow-x-auto">
                <code>{JSON.stringify(params, null, 2)}</code>
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            Close Inspector
          </button>
        </div>
      </div>
    </div>
  );
};
