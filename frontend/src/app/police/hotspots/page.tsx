'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { MapPin, Shield } from 'lucide-react';

const IndiaHotspotMap = dynamic(() => import('@/components/IndiaHotspotMap'), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-100 rounded-2xl border border-slate-200">
      <div className="text-center space-y-2 font-mono">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-slate-600">Initializing PostGIS Leaflet Spatial Map...</p>
      </div>
    </div>
  )
});

export default function HotspotsPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-50 min-h-screen">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-mono font-bold text-blue-600">
            <MapPin className="h-4 w-4" />
            <span>POSTGIS SPATIAL CLUSTER ENGINE</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">National Hotspots Map</h1>
        </div>
      </div>

      <div className="light-card p-4 bg-white">
        <IndiaHotspotMap />
      </div>
    </div>
  );
}
