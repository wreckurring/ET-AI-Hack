'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Network, DataSet } from 'vis-network/standalone';
import { NetworkGraphData } from '@/types';
import { Network as NetworkIcon, RefreshCw, ZoomIn, Info } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface Neo4jNetworkGraphProps {
  graphData?: NetworkGraphData;
}

export default function Neo4jNetworkGraph({ graphData }: Neo4jNetworkGraphProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [data, setData] = useState<NetworkGraphData | null>(graphData || null);

  useEffect(() => {
    if (!graphData) {
      fetchApi<NetworkGraphData>('/graph/network')
        .then((res) => setData(res))
        .catch(() => {
          setData({
            nodes: [
              { id: 'v1', label: 'Ramesh Kumar', group: 'victim', title: 'Victim', riskScore: 80 },
              { id: 'upi1', label: 'refund.sbi@okicici', group: 'upi', title: 'Target UPI', riskScore: 98 },
              { id: 'bank1', label: 'SBI Account 309102', group: 'bank', title: 'Mule Account', riskScore: 95 },
              { id: 'phone1', label: '+91 98351 90211', group: 'phone', title: 'Scammer SIM', riskScore: 99 },
              { id: 'ip1', label: '103.22.102.41', group: 'ip', title: 'VPN Proxy IP', riskScore: 90 }
            ],
            edges: [
              { from_node: 'v1', to_node: 'upi1', label: 'SENT_TO' },
              { from_node: 'upi1', to_node: 'bank1', label: 'TRANSFERRED_TO' },
              { from_node: 'phone1', to_node: 'upi1', label: 'USED_BY' },
              { from_node: 'ip1', to_node: 'upi1', label: 'LOGIN_FROM' }
            ]
          });
        });
    } else {
      setData(graphData);
    }
  }, [graphData]);

  useEffect(() => {
    if (!containerRef.current || !data) return;

    const nodesArray = data.nodes.map(n => {
      let color = '#2563eb'; // Blue default
      if (n.group === 'victim') color = '#059669'; // Emerald
      if (n.group === 'upi') color = '#dc2626'; // Red
      if (n.group === 'bank') color = '#d97706'; // Amber
      if (n.group === 'phone') color = '#7c3aed'; // Purple

      return {
        id: n.id,
        label: n.label,
        group: n.group,
        title: n.title,
        color: { background: color, border: '#ffffff' },
        font: { color: '#0f172a', face: 'Inter', size: 12 },
        size: 20
      };
    });

    const edgesArray = data.edges.map(e => ({
      from: e.from_node,
      to: e.to_node,
      label: e.label,
      font: { color: '#64748b', size: 10, align: 'middle' },
      color: { color: '#94a3b8', highlight: '#2563eb' },
      arrows: { to: { enabled: true, scaleFactor: 0.8 } }
    }));

    const network = new Network(
      containerRef.current,
      {
        nodes: new DataSet(nodesArray as any),
        edges: new DataSet(edgesArray as any)
      },
      {
        nodes: { shape: 'dot', borderWidth: 2 },
        physics: { stabilization: true, barnesHut: { gravitationalConstant: -2000 } }
      }
    );

    network.on('selectNode', (params) => {
      if (params.nodes.length > 0) {
        const node = data.nodes.find(n => n.id === params.nodes[0]);
        setSelectedNode(node);
      }
    });

    return () => network.destroy();
  }, [data]);

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <NetworkIcon className="h-5 w-5 text-purple-600" />
          <span className="font-bold text-slate-900 text-sm">Vis.js Cyber Fraud Network Graph</span>
        </div>
        <span className="badge-blue font-mono text-xs">CYPHER GRAPH VISUALIZER</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <div className="lg:col-span-9 bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden relative">
          <div ref={containerRef} className="h-[550px] w-full" />
        </div>

        <div className="lg:col-span-3 light-card p-4 space-y-4 bg-white">
          <h4 className="font-bold text-slate-900 text-xs font-mono uppercase tracking-wider border-b border-slate-100 pb-2">
            Selected Entity Inspector
          </h4>

          {selectedNode ? (
            <div className="space-y-3 font-mono text-xs">
              <div>
                <span className="text-slate-500 block text-[10px]">Entity Label:</span>
                <span className="font-bold text-slate-900">{selectedNode.label}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Node Category:</span>
                <span className="font-bold text-blue-600 uppercase">{selectedNode.group}</span>
              </div>

              <div>
                <span className="text-slate-500 block text-[10px]">Risk Score:</span>
                <span className="badge-red font-bold">{selectedNode.riskScore}/100</span>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs text-slate-400 font-mono">
              Click on any node in the graph to inspect entity relations.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
