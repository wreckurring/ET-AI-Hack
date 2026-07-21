'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import { NetworkGraphData } from '@/types';
import { Network as NetworkIcon, RefreshCw, ZoomIn, Info } from 'lucide-react';

interface Neo4jNetworkGraphProps {
  graphData: NetworkGraphData;
}

export default function Neo4jNetworkGraph({ graphData }: Neo4jNetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Build Nodes and Edges for Vis.js
    const nodesArray = graphData.nodes.map(n => {
      let color = '#00f0ff';
      let shape = 'dot';
      let size = 20;

      if (n.group === 'victim') {
        color = '#38bdf8'; // Cyan blue
        shape = 'diamond';
        size = 18;
      } else if (n.group === 'upi') {
        color = '#ffb703'; // Amber
        shape = 'square';
        size = 24;
      } else if (n.group === 'mule_account') {
        color = '#ff2a5f'; // Danger Red
        shape = 'triangle';
        size = 28;
      } else if (n.group === 'phone') {
        color = '#a855f7'; // Purple
        shape = 'dot';
        size = 22;
      } else if (n.group === 'ip') {
        color = '#00ff66'; // Neon green
        shape = 'hexagon';
        size = 20;
      }

      return {
        id: n.id,
        label: n.label,
        group: n.group,
        title: n.title,
        color: {
          background: color,
          border: '#ffffff',
          highlight: { background: '#ffffff', border: color }
        },
        shape: shape,
        size: size,
        font: { color: '#ffffff', size: 12, strokeWidth: 3, strokeColor: '#070b14' }
      };
    });

    const edgesArray = graphData.edges.map(e => ({
      from: e.from_node,
      to: e.to_node,
      label: e.label,
      color: { color: 'rgba(0, 240, 255, 0.4)', highlight: '#00f0ff' },
      arrows: 'to',
      font: { color: '#94a3b8', size: 10, align: 'middle', background: '#070b14' },
      smooth: { type: 'cubicBezier' }
    }));

    const data = {
      nodes: new DataSet(nodesArray as any),
      edges: new DataSet(edgesArray as any)
    };

    const options = {
      nodes: {
        shadow: true,
        borderWidth: 2
      },
      edges: {
        width: 2,
        shadow: true
      },
      physics: {
        solver: 'forceAtlas2Based',
        forceAtlas2Based: {
          gravitationalConstant: -50,
          centralGravity: 0.01,
          springLength: 100,
          springConstant: 0.08
        },
        maxVelocity: 50,
        timestep: 0.35,
        stabilization: { iterations: 150 }
      },
      interaction: {
        hover: true,
        tooltipDelay: 100,
        zoomView: true
      }
    };

    const network = new Network(containerRef.current, data, options);

    network.on('selectNode', (params) => {
      if (params.nodes.length > 0) {
        const nodeId = params.nodes[0];
        const rawNode = graphData.nodes.find(n => n.id === nodeId);
        setSelectedNode(rawNode);
      }
    });

    network.on('deselectNode', () => {
      setSelectedNode(null);
    });

    return () => {
      network.destroy();
    };
  }, [graphData]);

  return (
    <div className="glass-panel p-4 rounded-xl border border-cyan-500/30 relative">
      <div className="flex items-center justify-between mb-3 border-b border-cyan-500/20 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <NetworkIcon className="h-5 w-5 text-cyan-400" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base">Neo4j Fraud Ring Graph Explorer</h3>
            <p className="text-xs text-slate-400">
              Visualizing multi-hop financial transfers & mule account clusters across India
            </p>
          </div>
        </div>

        {/* Legend */}
        <div className="hidden lg:flex items-center space-x-4 text-xs font-mono">
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-cyan-400"></span> Victim</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded bg-amber-400"></span> Phishing UPI</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full bg-purple-400"></span> SIM Caller</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-red-500 inline-block rotate-45"></span> Mule Account</span>
          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 bg-emerald-400 inline-block"></span> Host IP</span>
        </div>
      </div>

      <div className="relative">
        <div ref={containerRef} className="h-[550px] w-full rounded-lg bg-cyber-950/80" />

        {/* Node detail inspector popup */}
        {selectedNode && (
          <div className="absolute bottom-4 left-4 z-20 glass-panel-glow p-4 rounded-xl max-w-sm border border-cyan-400/40 text-xs space-y-2">
            <div className="flex items-center justify-between border-b border-cyan-500/30 pb-1.5">
              <span className="font-mono font-bold text-cyan-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
                <Info className="h-3.5 w-3.5 text-cyan-400" /> Node Inspector
              </span>
              <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-950 text-red-400 border border-red-500/30">
                Risk Score: {selectedNode.riskScore}/100
              </span>
            </div>
            <div>
              <p className="font-bold text-white text-sm">{selectedNode.label}</p>
              <p className="text-slate-300 text-[11px] mt-1">{selectedNode.title}</p>
            </div>
            <div className="pt-2 flex gap-2">
              <button
                onClick={() => alert(`Initiated Intelligence Scan on ${selectedNode.label}`)}
                className="w-full py-1.5 rounded bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-[11px] transition-colors"
              >
                Trace Entity Connections
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
