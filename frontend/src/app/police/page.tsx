'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, FileText, MapPin, Network, Lock, Zap, ArrowRight, CheckCircle2, IndianRupee, Cpu, RefreshCw } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PoliceCommandCenterPage() {
  const [telemetry, setTelemetry] = useState<any>({
    total_incidents: 425,
    total_amount_loss: 38550000.0,
    active_hotspots_count: 14,
    fraud_recovered_amount: 13739220.0,
    golden_hour_freeze_success_pct: 91.3,
    avg_response_time_minutes: 14.5
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>('/analytics/telemetry')
      .then((data) => {
        setTelemetry(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Dashboard Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-blue-600">
            <Shield className="h-4 w-4" />
            <span>STATE LAW ENFORCEMENT COMMAND CENTER</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cyber Crime Action Dashboard</h1>
        </div>

        <div className="flex items-center space-x-3">
          <Link href="/police/reports" className="btn-primary py-2.5 px-5">
            <FileText className="h-4 w-4" />
            <span>View All Incident Reports</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="light-card p-6 border-l-4 border-l-blue-600 space-y-2 bg-white">
          <span className="text-xs font-mono text-slate-500 font-bold block uppercase">TOTAL INCIDENTS LODGED</span>
          <p className="text-3xl font-black text-slate-900 font-mono">{telemetry.total_incidents}</p>
          <span className="text-xs text-blue-600 font-mono font-semibold">+12.4% this week</span>
        </div>

        <div className="light-card p-6 border-l-4 border-l-red-600 space-y-2 bg-white">
          <span className="text-xs font-mono text-slate-500 font-bold block uppercase">TOTAL CLAIMED FRAUD LOSS</span>
          <p className="text-3xl font-black text-red-600 font-mono">₹{(telemetry.total_amount_loss / 10000000).toFixed(2)} Cr</p>
          <span className="text-xs text-red-500 font-mono font-semibold">Across {telemetry.active_hotspots_count} Hubs</span>
        </div>

        <div className="light-card p-6 border-l-4 border-l-emerald-600 space-y-2 bg-white">
          <span className="text-xs font-mono text-slate-500 font-bold block uppercase">FUNDS LOCKED (FAST-FREEZE)</span>
          <p className="text-3xl font-black text-emerald-600 font-mono">₹{(telemetry.fraud_recovered_amount / 10000000).toFixed(2)} Cr</p>
          <span className="text-xs text-emerald-600 font-mono font-semibold">Interbank Holds Active</span>
        </div>

        <div className="light-card p-6 border-l-4 border-l-amber-600 space-y-2 bg-white">
          <span className="text-xs font-mono text-slate-500 font-bold block uppercase">GOLDEN HOUR SUCCESS RATE</span>
          <p className="text-3xl font-black text-amber-600 font-mono">{telemetry.golden_hour_freeze_success_pct}%</p>
          <span className="text-xs text-amber-600 font-mono font-semibold">Avg Response: {telemetry.avg_response_time_minutes} min</span>
        </div>

      </div>

      {/* Primary Intelligence Module Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Module 1: Hotspot Map */}
        <div className="light-card p-6 bg-white space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl w-fit border border-blue-100">
              <MapPin className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">PostGIS Spatial Hotspot Map</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Interactive Leaflet map rendering spatial incident density clusters, centroids, and district hotspot aggregates across India.
            </p>
          </div>
          <Link href="/police/hotspots" className="btn-secondary w-full justify-between mt-4">
            <span>Explore Spatial Map</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Module 2: Vis.js Graph Engine */}
        <div className="light-card p-6 bg-white space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit border border-purple-100">
              <Network className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Neo4j Fraud Network Graph</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Vis.js multi-hop network visualization linking Victims, Target UPI Handles, Bank Accounts, Scammer SIMs, and Devices.
            </p>
          </div>
          <Link href="/police/network-graph" className="btn-secondary w-full justify-between mt-4">
            <span>Analyze Network Graph</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Module 3: Analytics & Forecasting */}
        <div className="light-card p-6 bg-white space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl w-fit border border-emerald-100">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Predictive Risk Analytics</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Command center analytics dashboard with scam distribution, trend charts, top flagged UPI handles, and repeat phone SIMs.
            </p>
          </div>
          <Link href="/police/analytics" className="btn-secondary w-full justify-between mt-4">
            <span>View Police Analytics</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>

    </div>
  );
}
