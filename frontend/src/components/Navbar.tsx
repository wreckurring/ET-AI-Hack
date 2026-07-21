'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Shield, AlertTriangle, FileText, Map, Network, Lock, UserCheck, LogOut, Cpu, BarChart2 } from 'lucide-react';
import AIScamDetectorModal from './AIScamDetectorModal';

export default function Navbar() {
  const pathname = usePathname();
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('raksha_token'));
      setUserName(localStorage.getItem('raksha_user') || 'Officer');
    }
  }, [pathname]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('raksha_token');
      localStorage.removeItem('raksha_user');
      window.location.href = '/login';
    }
  };

  const isPolice = pathname.startsWith('/police');

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-cyan-500/20 bg-cyber-900/90 backdrop-blur-md">
      {/* Alert ticker banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-cyber-800 to-red-950 px-4 py-1 text-xs text-cyan-300 border-b border-cyan-500/20 flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
          </span>
          <span className="font-semibold text-cyan-200">RAKSHA-NET INTELLIGENCE STREAM:</span>
          <span className="text-slate-300 truncate">High Risk Phishing Ring active in Jamtara & Mewat | NPCI Fast-Freeze v2.4 Active</span>
        </div>
        <div className="hidden md:flex items-center space-x-4 text-[11px] text-slate-400">
          <span>CYBER HELPLINE: <strong className="text-white">1930</strong></span>
          <span>SYSTEM STATUS: <strong className="text-emerald-400">ONLINE (PostGIS + Neo4j)</strong></span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/30 group-hover:border-cyan-400 transition-colors">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-wider text-white flex items-center gap-1.5">
                RAKSHA<span className="text-cyan-400">-NET</span>
              </span>
              <span className="text-[10px] block text-cyan-400/70 font-mono leading-none tracking-widest uppercase">
                National Cyber Fraud Intelligence
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            {!isPolice ? (
              <>
                <Link
                  href="/report"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/report'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <AlertTriangle className="h-4 w-4 text-amber-400" />
                  <span>Report Cyber Fraud</span>
                </Link>

                <button
                  onClick={() => setIsScamModalOpen(true)}
                  className="px-3 py-2 rounded-md text-sm font-medium transition-colors text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50 flex items-center space-x-1.5"
                >
                  <Cpu className="h-4 w-4 text-cyan-400 animate-pulse" />
                  <span>AI Scam Analyzer</span>
                </button>

                <Link
                  href="/track"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/track'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span>Track Complaint</span>
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/police"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/police'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Shield className="h-4 w-4 text-cyan-400" />
                  <span>Command Center</span>
                </Link>

                <Link
                  href="/police/analytics"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/police/analytics'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <BarChart2 className="h-4 w-4 text-emerald-400" />
                  <span>Analytics</span>
                </Link>

                <Link
                  href="/police/reports"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/police/reports'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <FileText className="h-4 w-4 text-cyan-400" />
                  <span>Case Directory</span>
                </Link>

                <Link
                  href="/police/hotspots"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/police/hotspots'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Map className="h-4 w-4 text-emerald-400" />
                  <span>Hotspot Map</span>
                </Link>

                <Link
                  href="/police/network-graph"
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-1.5 ${
                    pathname === '/police/network-graph'
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                      : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-800/50'
                  }`}
                >
                  <Network className="h-4 w-4 text-violet-400" />
                  <span>Neo4j Graph</span>
                </Link>
              </>
            )}
          </nav>

          {/* Right Portal Switcher / Auth */}
          <div className="flex items-center space-x-3">
            {isPolice ? (
              <div className="flex items-center space-x-3">
                <div className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/30 flex items-center space-x-2 text-xs font-mono text-cyan-300">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  <span>{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg bg-red-950/40 border border-red-500/30 text-red-400 hover:bg-red-900/50 hover:text-white transition-colors"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold uppercase tracking-wider flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all border border-cyan-400/30"
              >
                <Lock className="h-3.5 w-3.5" />
                <span>LEA Dashboard Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      <AIScamDetectorModal
        isOpen={isScamModalOpen}
        onClose={() => setIsScamModalOpen(false)}
      />
    </header>
  );
}
