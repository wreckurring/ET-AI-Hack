'use client';

import React, { useState, useEffect } from 'react';
import { Shield, TrendingUp, Lock, Zap, Clock, IndianRupee, MapPin, AlertTriangle, Layers, Phone, CreditCard, BarChart2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function PoliceAnalyticsDashboardPage() {
  const [dashboardData, setDashboardData] = useState<any>({
    kpis: {
      total_incidents: 425,
      total_amount_loss: 38550000.0,
      active_hotspots_count: 14,
      fraud_recovered_amount: 13739220.0,
      golden_hour_freeze_success_pct: 91.3,
      avg_response_time_minutes: 14.5
    },
    scam_distribution: [
      { category: "Phishing Scam", count: 154, total_loss: 12400000.0 },
      { category: "Telegram Investment Scam", count: 98, total_loss: 14200000.0 },
      { category: "FedEx Digital Arrest Scam", count: 64, total_loss: 5800000.0 },
      { category: "OLX Fake Army Officer", count: 52, total_loss: 3400000.0 },
      { category: "UPI QR Fraud", count: 45, total_loss: 2150000.0 }
    ],
    daily_trend: [
      { date: "15 Jul", incidents: 18, loss: 1250000.0 },
      { date: "16 Jul", incidents: 24, loss: 1980000.0 },
      { date: "17 Jul", incidents: 21, loss: 1450000.0 },
      { date: "18 Jul", incidents: 29, loss: 2350000.0 },
      { date: "19 Jul", incidents: 34, loss: 3100000.0 },
      { date: "20 Jul", incidents: 41, loss: 3850000.0 },
      { date: "21 Jul", incidents: 38, loss: 3400000.0 }
    ],
    top_fraud_upis: [
      { upi_id: "refund.sbi@okicici", report_count: 28, total_stolen: 5180000.0, risk_score: 98 },
      { upi_id: "elect.bill.pay@ybl", report_count: 19, total_stolen: 3420000.0, risk_score: 94 },
      { upi_id: "task.reward99@paytm", report_count: 14, total_stolen: 7850000.0, risk_score: 99 },
      { upi_id: "verify.customs@axisbank", report_count: 11, total_stolen: 2450000.0, risk_score: 90 },
      { upi_id: "army.cisf.pay@icici", report_count: 9, total_stolen: 1680000.0, risk_score: 88 }
    ],
    top_scammer_phones: [
      { phone: "+91 98351 90211", call_count: 42, hub_origin: "Jamtara, Jharkhand", risk_score: 99 },
      { phone: "+91 97182 44102", call_count: 31, hub_origin: "Mewat, Haryana", risk_score: 96 },
      { phone: "+91 88261 00293", call_count: 22, hub_origin: "Delhi NCR", risk_score: 94 },
      { phone: "+91 79901 88402", call_count: 18, hub_origin: "Deoghar, Jharkhand", risk_score: 92 },
      { phone: "+91 99104 55192", call_count: 15, hub_origin: "Alwar, Rajasthan", risk_score: 90 }
    ]
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApi<any>('/analytics/dashboard')
      .then((data) => {
        setDashboardData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const kpis = dashboardData.kpis;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Title */}
      <div className="flex items-center justify-between border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
            <BarChart2 className="h-4 w-4" />
            <span>POSTGIS SPATIAL INTELLIGENCE & TELEMETRY ENGINE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Police Cyber Intelligence Dashboard</h1>
        </div>
      </div>

      {/* Live KPI Cards (6 Cards) */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Incidents</span>
          <p className="text-xl font-extrabold text-white font-mono">{kpis.total_incidents}</p>
          <span className="text-[10px] text-cyan-400 font-mono">+12.4% this week</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-red-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Total Loss Volume</span>
          <p className="text-xl font-extrabold text-red-400 font-mono">₹{(kpis.total_amount_loss / 10000000).toFixed(2)} Cr</p>
          <span className="text-[10px] text-red-400 font-mono">Claimed Fraud</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-amber-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Active Hotspots</span>
          <p className="text-xl font-extrabold text-amber-400 font-mono">{kpis.active_hotspots_count} Hubs</p>
          <span className="text-[10px] text-amber-400 font-mono">Jamtara & Mewat</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-emerald-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Fraud Recovered</span>
          <p className="text-xl font-extrabold text-emerald-400 font-mono">₹{(kpis.fraud_recovered_amount / 10000000).toFixed(2)} Cr</p>
          <span className="text-[10px] text-emerald-400 font-mono">Locked via Fast-Freeze</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-cyan-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Golden Hour Success</span>
          <p className="text-xl font-extrabold text-cyan-300 font-mono">{kpis.golden_hour_freeze_success_pct}%</p>
          <span className="text-[10px] text-cyan-400 font-mono">Interbank Hold Rate</span>
        </div>

        <div className="glass-panel p-4 rounded-2xl border border-purple-500/30 space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Avg Response Time</span>
          <p className="text-xl font-extrabold text-purple-400 font-mono">{kpis.avg_response_time_minutes} Mins</p>
          <span className="text-[10px] text-purple-300 font-mono">LE Action Window</span>
        </div>
      </div>

      {/* Visual Charts Row 1: Scam Type Distribution + Daily Incident Trend */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Scam Type Distribution Bar Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" /> Scam Category Volume Distribution
          </h3>

          <div className="space-y-3">
            {dashboardData.scam_distribution.map((item: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-200">{item.category}</span>
                  <span className="text-cyan-400 font-bold">{item.count} cases (₹{(item.total_loss / 100000).toFixed(1)}L)</span>
                </div>
                <div className="w-full h-2 rounded-full bg-cyber-950 overflow-hidden border border-cyan-500/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-400"
                    style={{ width: `${Math.min((item.count / 160) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Incident Trend Chart */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-emerald-400" /> Daily Incident Trend & Volume
          </h3>

          <div className="flex items-end justify-between h-48 pt-6 border-b border-cyan-500/20">
            {dashboardData.daily_trend.map((day: any, idx: number) => (
              <div key={idx} className="flex flex-col items-center gap-2 group flex-1">
                <span className="text-[10px] font-mono text-cyan-300 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {day.incidents}
                </span>
                <div
                  className="w-8 rounded-t bg-gradient-to-t from-cyan-600 to-teal-400 hover:from-cyan-400 hover:to-emerald-300 transition-all cursor-pointer"
                  style={{ height: `${(day.incidents / 45) * 100}%` }}
                />
                <span className="text-[10px] font-mono text-slate-400">{day.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Threat Intelligence Tables Row 2: Top Fraud UPIs + Top Scammer SIM Phones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top Fraud UPI Handles */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-amber-400" /> Top Flagged Fraud UPI Handles
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-cyan-300 border-b border-cyan-500/20 text-[11px]">
                <tr>
                  <th className="pb-2">Target UPI Handle</th>
                  <th className="pb-2">Reports</th>
                  <th className="pb-2">Total Stolen</th>
                  <th className="pb-2 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {dashboardData.top_fraud_upis.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-cyber-800/40">
                    <td className="py-2.5 font-bold text-white">{item.upi_id}</td>
                    <td className="py-2.5 text-cyan-400">{item.report_count}</td>
                    <td className="py-2.5 text-emerald-400 font-bold">₹{(item.total_stolen / 100000).toFixed(1)} Lakhs</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-500/40">
                        {item.risk_score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Scammer Phone Numbers */}
        <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
          <h3 className="font-bold text-white text-sm font-mono uppercase tracking-wider flex items-center gap-2">
            <Phone className="h-4 w-4 text-purple-400" /> Top Monitored Scammer SIM Phone Numbers
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-cyan-300 border-b border-cyan-500/20 text-[11px]">
                <tr>
                  <th className="pb-2">Phone Number</th>
                  <th className="pb-2">Calls Flagged</th>
                  <th className="pb-2">Hub Origin</th>
                  <th className="pb-2 text-right">Risk Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cyan-500/10">
                {dashboardData.top_scammer_phones.map((item: any, idx: number) => (
                  <tr key={idx} className="hover:bg-cyber-800/40">
                    <td className="py-2.5 font-bold text-white">{item.phone}</td>
                    <td className="py-2.5 text-cyan-400">{item.call_count}</td>
                    <td className="py-2.5 text-slate-300">{item.hub_origin}</td>
                    <td className="py-2.5 text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] bg-red-950 text-red-400 border border-red-500/40">
                        {item.risk_score}/100
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
