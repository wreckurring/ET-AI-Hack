'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, Search, Lock, Zap, FileText, CheckCircle2, ArrowRight, Activity, MapPin, Layers } from 'lucide-react';

export default function CitizenHomePage() {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center space-y-6 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full glass-panel border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <Shield className="h-3.5 w-3.5 text-cyan-400" />
            <span>INDIAN NATIONAL CYBER CRIME INTELLIGENCE GRID</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold text-white tracking-tight leading-tight">
            Report Cyber Fraud. <br />
            <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
              Freeze Fraudulent Funds Instantly.
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
            RAKSHA-NET empowers citizens across India to file tamper-proof cyber crime reports with client-side SHA-256 evidence hashing, tracking mule account networks in real-time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/report"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center space-x-3 shadow-xl shadow-red-600/25 border border-red-400/30 transition-all transform hover:-translate-y-0.5"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>Report Cyber Fraud Now</span>
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel hover:bg-cyber-800/80 text-cyan-300 font-semibold text-sm flex items-center justify-center space-x-2 border border-cyan-500/30 transition-all"
            >
              <Search className="h-5 w-5 text-cyan-400" />
              <span>Track Complaint Status</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Live Telemetry Highlights Bar */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Total Fraud Reported</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">₹3.85 Cr+</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Fast-Freezes Executed</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">68 Accounts</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Fraud Hotspots</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">14 Districts</p>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-mono text-slate-400 uppercase tracking-wider">Evidence Integrity</p>
            <p className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">100% SHA-256</p>
          </div>
        </div>
      </section>

      {/* Platform Core Capabilities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-white">How RAKSHA-NET Cyber Defense Works</h2>
          <p className="text-slate-400 text-sm">Automated end-to-end intelligence for victim protection & rapid law enforcement action.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-colors space-y-3">
            <div className="p-3 w-fit rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
              <Lock className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-white">1. Cryptographic Evidence Protection</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Uploaded bank receipts, chats, and screenshots are hashed using browser Web Crypto SHA-256 before leaving your device, maintaining legal chain of custody.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-colors space-y-3">
            <div className="p-3 w-fit rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Layers className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-white">2. Neo4j Mule Ring Graph Tracing</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              AI automatically maps transaction UTRs, target UPI handles, and scammer phone numbers into Neo4j graph nodes to pinpoint organized mule syndicates.
            </p>
          </div>

          <div className="glass-panel p-6 rounded-xl border border-cyan-500/20 hover:border-cyan-400/50 transition-colors space-y-3">
            <div className="p-3 w-fit rounded-lg bg-red-500/10 border border-red-500/30 text-red-400">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg text-white">3. NPCI Fast-Freeze Execution</h3>
            <p className="text-slate-300 text-xs leading-relaxed">
              Police officers receive instant automated directives to trigger NPCI & Interbank Fast-Freeze holds on beneficiary accounts within minutes of reporting.
            </p>
          </div>
        </div>
      </section>

      {/* Emergency Call-Out */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-panel-glow p-8 rounded-2xl border border-amber-500/40 bg-gradient-to-r from-red-950/60 via-cyber-900 to-cyber-900 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="px-3 py-1 rounded font-mono text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
              Golden Hour Response Window
            </span>
            <h3 className="text-2xl font-bold text-white">Victim of a Cyber Scam right now?</h3>
            <p className="text-slate-300 text-xs max-w-xl">
              File your complaint on RAKSHA-NET immediately or dial National Cyber Helpline <strong>1930</strong>. Reporting within 1 hour significantly increases fund recovery probability.
            </p>
          </div>

          <Link
            href="/report"
            className="shrink-0 px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <span>File Emergency Complaint</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}
