'use client';

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { fetchApi } from '@/lib/api';
import { MapPin, AlertTriangle, Layers, ZoomIn } from 'lucide-react';

// Fix Leaflet marker icon asset URLs
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

export default function IndiaHotspotMap() {
  const [viewMode, setViewMode] = useState<'HOTSPOTS' | 'CLUSTERS'>('CLUSTERS');
  const [geoData, setGeoData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const endpoint = viewMode === 'CLUSTERS' ? '/analytics/clusters' : '/analytics/hotspots';
    fetchApi<any>(endpoint)
      .then((data) => {
        setGeoData(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [viewMode]);

  const defaultCenter: [number, number] = [22.5937, 78.9629]; // Center of India

  return (
    <div className="space-y-4 font-sans">
      <div className="flex items-center justify-between border-b border-slate-200 pb-3">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-blue-600" />
          <span className="font-bold text-slate-900 text-sm">PostGIS Spatial Analytics Map</span>
        </div>

        <div className="flex items-center space-x-2 text-xs font-mono">
          <button
            onClick={() => setViewMode('CLUSTERS')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              viewMode === 'CLUSTERS' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            DBSCAN Clusters
          </button>
          <button
            onClick={() => setViewMode('HOTSPOTS')}
            className={`px-3 py-1.5 rounded-lg border font-bold transition-all ${
              viewMode === 'HOTSPOTS' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            GeoJSON Incident Points
          </button>
        </div>
      </div>

      <div className="h-[550px] w-full rounded-2xl border border-slate-200 overflow-hidden shadow-sm relative">
        <MapContainer center={defaultCenter} zoom={5} scrollWheelZoom={true} className="h-full w-full">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {geoData?.features?.map((feat: any, idx: number) => {
            const [lng, lat] = feat.geometry.coordinates;
            const props = feat.properties;

            return (
              <CircleMarker
                key={idx}
                center={[lat, lng]}
                radius={viewMode === 'CLUSTERS' ? Math.min(12 + (props.incident_count || 1) * 3, 30) : 10}
                pathOptions={{
                  fillColor: props.risk_level === 'CRITICAL' ? '#dc2626' : '#2563eb',
                  fillOpacity: 0.8,
                  color: '#ffffff',
                  weight: 2
                }}
              >
                <Popup className="font-sans">
                  <div className="p-2 space-y-2 text-xs font-mono">
                    <div className="border-b border-slate-200 pb-1">
                      <span className="font-bold text-slate-900 block text-sm">{props.district}, {props.state}</span>
                      <span className="badge-red text-[10px]">{props.risk_level || 'HIGH RISK'}</span>
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Incident Count:</span>
                        <span className="font-bold text-slate-900">{props.incident_count || 1}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Total Loss:</span>
                        <span className="font-bold text-blue-600">₹{((props.total_amount_loss || props.amount_lost || 0) / 100000).toFixed(1)}L</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Dominant Category:</span>
                        <span className="font-bold text-slate-900">{props.dominant_scam_category || props.category || 'Cyber Fraud'}</span>
                      </div>
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
}
