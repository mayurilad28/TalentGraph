import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Network } from 'vis-network';
import {
  GitGraph,
  Layers,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  Info,
  ExternalLink,
  Users,
  Briefcase,
  Cpu,
  Building2,
  FolderGit2,
} from 'lucide-react';
import { api, GraphData } from '../lib/api';
import { ErrorBanner } from '../components/ui/ErrorBanner';

const NODE_LEGEND = [
  { group: 'Candidate', color: '#6366f1', icon: Users, label: 'Candidate' },
  { group: 'Job', color: '#ec4899', icon: Briefcase, label: 'Job' },
  { group: 'Skill', color: '#10b981', icon: Layers, label: 'Skill' },
  { group: 'Company', color: '#f59e0b', icon: Building2, label: 'Company' },
  { group: 'Project', color: '#8b5cf6', icon: FolderGit2, label: 'Project' },
  { group: 'Technology', color: '#06b6d4', icon: Cpu, label: 'Technology' },
];

export const GraphExplorer: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const candidateId = searchParams.get('candidateId') || '';
  const jobId = searchParams.get('jobId') || '';

  const containerRef = useRef<HTMLDivElement>(null);
  const networkRef = useRef<Network | null>(null);
  const [selectedNode, setSelectedNode] = useState<any | null>(null);

  // Candidates & Jobs metadata for dropdown selectors
  const { data: candidates } = useQuery({
    queryKey: ['all-candidates-list'],
    queryFn: () => api.getCandidates(),
  });

  const { data: jobs } = useQuery({
    queryKey: ['all-jobs-list'],
    queryFn: () => api.getJobs(),
  });

  // Query Graph Data based on active filter mode
  const {
    data: graphData,
    isLoading,
    error,
    refetch,
  } = useQuery<GraphData>({
    queryKey: ['graph-data', candidateId, jobId],
    queryFn: () => {
      if (candidateId) return api.getCandidateGraph(candidateId);
      if (jobId) return api.getJobGraph(jobId);
      return api.getExploreGraph();
    },
  });

  // Initialize and update vis-network instance
  useEffect(() => {
    if (!containerRef.current || !graphData || !graphData.nodes || graphData.nodes.length === 0) {
      return;
    }

    const data = {
      nodes: graphData.nodes.map((node) => ({
        id: node.id,
        label: node.label,
        group: node.group,
        color: node.color,
        shape: 'box',
        margin: 10,
        font: {
          color: '#ffffff',
          size: 13,
          face: 'Inter, sans-serif',
          bold: { color: '#ffffff' },
        },
        borderWidth: 2,
        shadow: {
          enabled: true,
          color: 'rgba(0,0,0,0.5)',
          size: 8,
          x: 2,
          y: 2,
        },
      })),
      edges: graphData.edges.map((edge) => ({
        id: edge.id,
        from: edge.from,
        to: edge.to,
        label: edge.label,
        arrows: 'to',
        font: {
          color: '#94a3b8',
          size: 10,
          align: 'middle',
          background: '#0f172a',
          strokeWidth: 0,
        },
        color: {
          color: '#475569',
          highlight: '#818cf8',
          hover: '#6366f1',
        },
        smooth: {
          enabled: true,
          type: 'cubicBezier',
          roundness: 0.4,
        },
      })),
    };

    const options = {
      physics: {
        stabilization: { iterations: 150 },
        barnesHut: {
          gravitationalConstant: -3500,
          springConstant: 0.04,
          springLength: 120,
          damping: 0.09,
        },
      },
      interaction: {
        hover: true,
        tooltipDelay: 200,
        zoomView: true,
        dragView: true,
      },
      layout: {
        improvedLayout: true,
      },
    };

    const network = new Network(containerRef.current, data as any, options);
    networkRef.current = network;

    network.on('click', (params) => {
      if (params.nodes && params.nodes.length > 0) {
        const clickedNodeId = params.nodes[0];
        const rawNode = graphData.nodes.find((n) => n.id === clickedNodeId);
        setSelectedNode(rawNode || null);
      } else {
        setSelectedNode(null);
      }
    });

    return () => {
      network.destroy();
    };
  }, [graphData]);

  const handleZoomIn = () => {
    if (!networkRef.current) return;
    const scale = networkRef.current.getScale();
    networkRef.current.moveTo({ scale: scale * 1.3 });
  };

  const handleZoomOut = () => {
    if (!networkRef.current) return;
    const scale = networkRef.current.getScale();
    networkRef.current.moveTo({ scale: scale * 0.7 });
  };

  const handleFit = () => {
    if (!networkRef.current) return;
    networkRef.current.fit({ animation: { duration: 600, easingFunction: 'easeInOutQuad' } });
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-3">
            <GitGraph className="w-8 h-8 text-indigo-400" />
            Interactive Graph Explorer
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Visual relationship graph powered by CognoDB openCypher. Click any node to inspect connected properties.
          </p>
        </div>

        {/* View Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Candidate Subgraph Selector */}
          <select
            value={candidateId}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setSearchParams({ candidateId: val });
              else setSearchParams({});
              setSelectedNode(null);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="">Center on Candidate...</option>
            {(candidates || []).map((c) => (
              <option key={c.id} value={c.id}>
                👤 {c.name}
              </option>
            ))}
          </select>

          {/* Job Subgraph Selector */}
          <select
            value={jobId}
            onChange={(e) => {
              const val = e.target.value;
              if (val) setSearchParams({ jobId: val });
              else setSearchParams({});
              setSelectedNode(null);
            }}
            className="bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs font-semibold text-pink-300 focus:outline-none focus:border-pink-500 cursor-pointer"
          >
            <option value="">Center on Job...</option>
            {(jobs || []).map((j) => (
              <option key={j.id} value={j.id}>
                💼 {j.title}
              </option>
            ))}
          </select>

          {(candidateId || jobId) && (
            <button
              onClick={() => {
                setSearchParams({});
                setSelectedNode(null);
              }}
              className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition"
            >
              Reset to Full Overview
            </button>
          )}
        </div>
      </div>

      {/* Node Legend */}
      <div className="flex flex-wrap items-center gap-3 glass-panel px-4 py-2.5 rounded-2xl border-slate-800 text-xs">
        <span className="font-semibold text-slate-400 mr-1 flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" /> Node Types:
        </span>
        {NODE_LEGEND.map((item) => (
          <div key={item.group} className="flex items-center gap-1.5">
            <span
              className="w-3 h-3 rounded-md"
              style={{ backgroundColor: item.color }}
            />
            <span className="text-slate-300 font-medium">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Error state */}
      {error && <ErrorBanner onRetry={() => refetch()} />}

      {/* Graph Visualizer Canvas Container */}
      <div className="relative glass-panel rounded-3xl border-slate-800 overflow-hidden min-h-[620px] bg-slate-950/90 shadow-2xl flex">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950/80 z-20 space-y-3">
            <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            <p className="text-xs font-semibold text-slate-300">
              Querying CognoDB openCypher Subgraph...
            </p>
          </div>
        )}

        {/* Vis-network Container */}
        <div ref={containerRef} className="w-full h-[620px] cursor-grab active:cursor-grabbing" />

        {/* Zoom & Fit Floating Controls */}
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 glass-panel p-1.5 rounded-2xl border-slate-800 bg-slate-900/90 shadow-lg">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleFit}
            title="Fit to Screen"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => refetch()}
            title="Re-run Physics"
            className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-6 right-6 z-10 w-80 max-w-full glass-panel p-5 rounded-2xl border-indigo-500/30 bg-slate-900/95 shadow-2xl space-y-4 animate-fadeIn">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-md"
                  style={{
                    backgroundColor:
                      NODE_LEGEND.find((l) => l.group.toLowerCase() === selectedNode.group?.toLowerCase())?.color || '#6366f1',
                  }}
                />
                <span className="text-xs uppercase font-bold tracking-wider text-slate-400">
                  {selectedNode.group} Node
                </span>
              </div>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-base font-bold text-white">{selectedNode.label}</h3>
              {selectedNode.properties?.title && (
                <p className="text-xs font-medium text-indigo-300">
                  {selectedNode.properties.title}
                </p>
              )}
              {selectedNode.properties?.category && (
                <p className="text-xs text-emerald-400 font-medium">
                  Category: {selectedNode.properties.category}
                </p>
              )}
              {selectedNode.properties?.industry && (
                <p className="text-xs text-amber-400 font-medium">
                  Industry: {selectedNode.properties.industry}
                </p>
              )}
              {selectedNode.properties?.location && (
                <p className="text-xs text-slate-400">
                  Location: {selectedNode.properties.location}
                </p>
              )}
              {selectedNode.properties?.description && (
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                  {selectedNode.properties.description}
                </p>
              )}
            </div>

            {/* Quick Action Navigation based on Node Type */}
            <div className="pt-2 border-t border-slate-800">
              {selectedNode.group === 'candidate' && (
                <Link
                  to={`/candidates/${selectedNode.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <span>Open Candidate Profile</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
              {selectedNode.group === 'job' && (
                <Link
                  to={`/jobs/${selectedNode.id}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-semibold shadow-md transition"
                >
                  <span>Open Job Details</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
