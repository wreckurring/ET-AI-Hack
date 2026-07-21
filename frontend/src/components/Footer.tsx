import React from 'react';
import { Shield, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="glass-panel border-t border-cyan-500/20 bg-cyber-900/90 text-slate-400 py-8 mt-16 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center space-x-2 text-white font-bold text-lg mb-3">
            <Shield className="h-5 w-5 text-cyan-400" />
            <span>RAKSHA-NET</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            AI-Powered Cyber Fraud Intelligence & Fast-Freeze Coordination Platform for Law Enforcement Agencies and Citizens of India.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 mb-3">Emergency Contacts</h4>
          <ul className="space-y-1.5 text-xs">
            <li>National Cyber Helpline: <strong className="text-white">1930</strong></li>
            <li>Cyber Crime Portal: <span className="text-cyan-400">cybercrime.gov.in</span></li>
            <li>NPCI Fast-Freeze Cell: <span className="text-cyan-400 font-mono">1930-NPCI-LINK</span></li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 mb-3">Security Standards</h4>
          <ul className="space-y-1.5 text-xs text-slate-400">
            <li className="flex items-center space-x-1.5">
              <Lock className="h-3.5 w-3.5 text-emerald-400" />
              <span>Client-side SHA-256 Hash Verification</span>
            </li>
            <li>PostGIS Geographical Hotspot Analytics</li>
            <li>Neo4j Graph Mule Account Tracing</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 mb-3">System Architecture</h4>
          <p className="text-xs text-slate-400">
            FastAPI + PostgreSQL (PostGIS) + Neo4j Graph + Next.js + Vis.js + Leaflet.
          </p>
          <div className="mt-3 text-[11px] text-slate-500 font-mono">
            RAKSHA-NET v1.0.0 | Cyber Defense Division
          </div>
        </div>
      </div>
    </footer>
  );
}
