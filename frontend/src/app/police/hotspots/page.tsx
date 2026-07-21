'use client';

import React, { useState, useEffect } from 'react';
import IndiaHotspotMap from '@/components/IndiaHotspotMap';
import { fetchApi } from '@/lib/api';
import { HotspotPoint } from '@/types';
import { Map, ShieldAlert, AlertTriangle } from 'lucide-react';

export default function HotspotsPage() {
  const [hotspots, setHotspots] = useState<HotspotPoint[]>([
    { district: "Jamtara", state: "Jharkhand", latitude: 23.9632, longitude: 86.8024, report_count: 142, total_amount: 4850000.0, risk_level: "CRITICAL" },
    { district: "Mewat (Nuh)", state: "Haryana", latitude: 28.1023, longitude: 77.0142, report_count: 98, total_amount: 3210000.0, risk_level: "CRITICAL" },
    { district: "Delhi NCR", state: "Delhi", latitude: 28.6139, longitude: 77.2090, report_count: 215, total_amount: 9540000.0, risk_level: "CRITICAL" },
    { district: "Cyberabad", state: "Telangana", latitude: 17.4435, longitude: 78.3772, report_count: 87, total_amount: 2900000.0, risk_level: "HIGH" },
    { district: "Bengaluru Urban", state: "Karnataka", latitude: 12.9716, longitude: 77.5946, report_count: 134, total_amount: 6200000.0, risk_level: "HIGH" },
    { district: "Mumbai Suburban", state: "Maharashtra", latitude: 19.0760, longitude: 72.8777, report_count: 164, total_amount: 7800000.0, risk_level: "CRITICAL" },
    { district: "Kolkata", state: "West Bengal", latitude: 22.5726, longitude: 88.3639, report_count: 76, total_amount: 2100000.0, risk_level: "MEDIUM" },
    { district: "Deoghar", state: "Jharkhand", latitude: 24.4826, longitude: 86.6997, report_count: 64, total_amount: 1950000.0, risk_level: "HIGH" }
  ]);

  useEffect(() => {
    fetchApi<HotspotPoint[]>('/analytics/hotspots')
      .then((data) => setHotspots(data))
      .catch(() => {});
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono text-emerald-400">
            <Map className="h-4 w-4" />
            <span>POSTGIS GEOSPATIAL INTELLIGENCE LAYER</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">National Cyber Fraud Hotspots Map</h1>
        </div>
      </div>

      <IndiaHotspotMap hotspots={hotspots} />

      {/* Hotspots Directory Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4">
        {hotspots.map((point, idx) => (
          <div key={idx} className="glass-panel p-4 rounded-xl border border-cyan-500/20 space-y-2 text-xs">
            <div className="flex justify-between items-center border-b border-cyan-500/20 pb-1.5">
              <span className="font-bold text-white text-sm">{point.district}</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                  point.risk_level === 'CRITICAL'
                    ? 'bg-red-950 text-red-400 border border-red-500/40'
                    : 'bg-amber-950 text-amber-400 border border-amber-500/40'
                }`}
              >
                {point.risk_level}
              </span>
            </div>
            <p className="text-slate-400">State: <strong className="text-white">{point.state}</strong></p>
            <p className="text-slate-400">Incidents Logged: <strong className="text-cyan-400 font-mono">{point.report_count}</strong></p>
            <p className="text-slate-400">Est. Fraud Volume: <strong className="text-emerald-400 font-mono">₹{(point.total_amount / 100000).toFixed(2)} Lakhs</strong></p>
          </div>
        ))}
      </div>
    </div>
  );
}
