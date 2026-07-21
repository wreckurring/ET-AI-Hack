'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, FileText, Map, Network, Lock, AlertTriangle, ArrowUpRight, Activity, TrendingUp, IndianRupee, ShieldAlert, Cpu } from 'lucide-react';
import IndiaHotspotMap from '@/components/IndiaHotspotMap';
import Neo4jNetworkGraph from '@/components/Neo4jNetworkGraph';
import { fetchApi } from '@/lib/api';
import { HotspotPoint, NetworkGraphData, FraudReport } from '@/types';

export default function PoliceCommandCenterPage() {
  const [telemetry, setTelemetry] = useState<any>({
    total_reports: 425,
    total_amount_loss: 38550000.0,
    active_hotspots_count: 14,
    fast_freezes_executed: 68,
    mule_accounts_flagged: 89,
    high_risk_upis: 42
  });

  const [hotspots, setHotspots] = useState<HotspotPoint[]>([
    { district: "Jamtara", state: "Jharkhand", latitude: 23.9632, longitude: 86.8024, report_count: 142, total_amount: 4850000.0, risk_level: "CRITICAL" },
    { district: "Mewat (Nuh)", state: "Haryana", latitude: 28.1023, longitude: 77.0142, report_count: 98, total_amount: 3210000.0, risk_level: "CRITICAL" },
    { district: "Delhi NCR", state: "Delhi", latitude: 28.6139, longitude: 77.2090, report_count: 215, total_amount: 9540000.0, risk_level: "CRITICAL" },
    { district: "Cyberabad", state: "Telangana", latitude: 17.4435, longitude: 78.3772, report_count: 87, total_amount: 2900000.0, risk_level: "HIGH" },
    { district: "Bengaluru Urban", state: "Karnataka", latitude: 12.9716, longitude: 77.5946, report_count: 134, total_amount: 6200000.0, risk_level: "HIGH" },
    { district: "Mumbai Suburban", state: "Maharashtra", latitude: 19.0760, longitude: 72.8777, report_count: 164, total_amount: 7800000.0, risk_level: "CRITICAL" }
  ]);

  const [graphData, setGraphData] = useState<NetworkGraphData>({
    nodes: [
      { id: "v1", label: "Ramesh Kumar", group: "victim", title: "Loss: ₹1.85L", riskScore: 10 },
      { id: "v2", label: "Priya Sharma", group: "victim", title: "Loss: ₹3.40L", riskScore: 10 },
      { id: "u1", label: "refund.sbi@okicici", group: "upi", title: "High Velocity Phishing UPI", riskScore: 95 },
      { id: "m1", label: "SBI Mule: 30489912041", group: "mule_account", title: "Branch: Deoghar", riskScore: 96 },
      { id: "p1", label: "+91 98351 90211 (Jamtara)", group: "phone", title: "SIM Hub", riskScore: 99 },
      { id: "ip1", label: "103.145.72.19", group: "ip", title: "VPN Host", riskScore: 85 }
    ],
    edges: [
      { from_node: "v1", to_node: "u1", label: "TRANSFERRED ₹1.85L" },
      { from_node: "v2", to_node: "u1", label: "TRANSFERRED ₹3.40L" },
      { from_node: "u1", to_node: "m1", label: "AUTO-SWEEP" },
      { from_node: "p1", to_node: "u1", label: "REGISTERED_BY" },
      { from_node: "p1", to_node: "ip1", label: "HOSTED_ON" }
    ]
  });

  const [recentReports, setRecentReports] = useState<FraudReport[]>([]);

  useEffect(() => {
    // Fetch live backend analytics
    fetchApi('/analytics/telemetry').then((res: any) => setTelemetry(res)).catch(() => {});
    fetchApi('/analytics/hotspots').then((res: any) => setHotspots(res)).catch(() => {});
    fetchApi('/graph/network').then((res: any) => setGraphData(res)).catch(() => {});
    fetchApi<FraudReport[]>('/reports').then((res) => setRecentReports(res)).catch(() => {
      setRecentReports([
        {
          id: 1,
          ack_number: "RK-2026-8801",
          victim_name: "Ramesh Kumar",
          victim_phone: "+91 98102 33419",
          victim_state: "Delhi",
          victim_district: "South East Delhi",
          category: "Phishing Scam",
          amount_lost: 185000,
          utr_number: "402918471092",
          target_upi_id: "refund.sbi@okicici",
          status: "INVESTIGATING",
          risk_score: 92,
          is_frozen: false,
          description: "Received SMS claiming SBI YONO account block...",
          created_at: new Date().toISOString()
        },
        {
          id: 2,
          ack_number: "RK-2026-8802",
          victim_name: "Priya Sharma",
          victim_phone: "+91 97110 55412",
          victim_state: "Haryana",
          victim_district: "Gurugram",
          category: "OLX Fake Army Officer",
          amount_lost: 340000,
          utr_number: "402919882310",
          target_upi_id: "elect.bill.pay@ybl",
          status: "NEW",
          risk_score: 88,
          is_frozen: false,
          description: "Buyer posing as CISF officer on OLX sent QR code...",
          created_at: new Date().toISOString()
        },
        {
          id: 3,
          ack_number: "RK-2026-8803",
          victim_name: "Dr. Anish Varma",
          victim_phone: "+91 99304 88102",
          victim_state: "Maharashtra",
          victim_district: "Mumbai City",
          category: "Telegram Investment Scam",
          amount_lost: 750000,
          utr_number: "403011029481",
          target_upi_id: "task.reward99@paytm",
          status: "FROZEN",
          risk_score: 98,
          is_frozen: true,
          description: "Promised 400% return on institutional stock trading app...",
          created_at: new Date().toISOString()
        }
      ]);
    });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <Shield className="h-4 w-4" />
            <span>SPECIAL CYBER CRIME CELL • NORTHERN RANGE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Law Enforcement Command Center</h1>
        </div>

        <div className="flex gap-3">
          <Link
            href="/police/reports"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition-colors"
          >
            <FileText className="h-4 w-4" />
            <span>Open Case Directory</span>
          </Link>
        </div>
      </div>

      {/* Top Telemetry Widgets */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-panel p-5 rounded-2xl border border-cyan-500/30 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Total Reported Losses</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-white font-mono">
            ₹{(telemetry.total_amount_loss / 10000000).toFixed(2)} Cr
          </p>
          <div className="text-[11px] text-cyan-400 flex items-center gap-1 font-mono">
            <TrendingUp className="h-3.5 w-3.5" /> +14.2% from last week
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-emerald-500/30 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Fast-Freezes Executed</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
            {telemetry.fast_freezes_executed} Accounts
          </p>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-mono">
            <Lock className="h-3.5 w-3.5" /> 100% Interbank ACK
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-amber-500/30 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Mule Accounts Flagged</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">
            {telemetry.mule_accounts_flagged} Nodes
          </p>
          <div className="text-[11px] text-amber-400 flex items-center gap-1 font-mono">
            <Network className="h-3.5 w-3.5" /> Deoghar & Alwar Hubs
          </div>
        </div>

        <div className="glass-panel p-5 rounded-2xl border border-red-500/30 space-y-2">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">Active Cyber Hotspots</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-red-400 font-mono">
            {telemetry.active_hotspots_count} Districts
          </p>
          <div className="text-[11px] text-red-400 flex items-center gap-1 font-mono">
            <ShieldAlert className="h-3.5 w-3.5" /> Jamtara & Mewat Red Alert
          </div>
        </div>
      </div>

      {/* Main Dual Grid: Hotspot Map + Neo4j Graph Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Hotspot Map Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Map className="h-5 w-5 text-emerald-400" /> India Spatial Hotspots (PostGIS)
            </h3>
            <Link href="/police/hotspots" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Full Map <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <IndiaHotspotMap hotspots={hotspots} />
        </div>

        {/* Neo4j Fraud Graph Card */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-white text-lg flex items-center gap-2">
              <Network className="h-5 w-5 text-violet-400" /> Fraud Network Intelligence (Neo4j)
            </h3>
            <Link href="/police/network-graph" className="text-xs text-cyan-400 hover:underline flex items-center gap-1">
              Full Graph <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <Neo4jNetworkGraph graphData={graphData} />
        </div>
      </div>

      {/* Recent Fraud Complaints Directory Preview */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-white text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-cyan-400" /> High-Priority Active Cyber Reports
          </h3>
          <Link href="/police/reports" className="text-xs text-cyan-400 hover:underline font-mono">
            View All Reports ({recentReports.length})
          </Link>
        </div>

        <div className="glass-panel rounded-2xl border border-cyan-500/20 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cyber-950/80 text-cyan-300 font-mono uppercase text-[11px] border-b border-cyan-500/20">
              <tr>
                <th className="p-3.5">ACK Ref</th>
                <th className="p-3.5">Victim</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Loss (INR)</th>
                <th className="p-3.5">Target UPI / Account</th>
                <th className="p-3.5">Risk Score</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-500/10 font-sans">
              {recentReports.map((report) => (
                <tr key={report.id} className="hover:bg-cyber-800/40 transition-colors">
                  <td className="p-3.5 font-mono font-bold text-cyan-300">{report.ack_number}</td>
                  <td className="p-3.5 font-medium text-white">{report.victim_name}</td>
                  <td className="p-3.5 text-slate-300">{report.category}</td>
                  <td className="p-3.5 font-mono font-bold text-emerald-400">
                    ₹{report.amount_lost?.toLocaleString('en-IN')}
                  </td>
                  <td className="p-3.5 font-mono text-slate-300">{report.target_upi_id || report.utr_number || 'N/A'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded font-mono font-bold text-[10px] bg-red-950 text-red-400 border border-red-500/30">
                      {report.risk_score}/100
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border ${
                        report.status === 'FROZEN'
                          ? 'bg-emerald-950 text-emerald-400 border-emerald-500/30'
                          : 'bg-amber-950 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td className="p-3.5 text-right">
                    <Link
                      href={`/police/reports/${report.id}`}
                      className="px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-[11px] transition-colors"
                    >
                      Inspect Case
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
