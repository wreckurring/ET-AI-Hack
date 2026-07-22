'use client';

import React from 'react';
import { ExternalLink } from 'lucide-react';

interface OrganizationWebsite {
  id: string;
  name: string;
  code: string;
  url: string;
  color: string;
}

const WEBSITES: OrganizationWebsite[] = [
  { id: '1', name: 'CERT-In', code: 'CERT-In', url: 'https://www.cert-in.org.in', color: 'bg-blue-900' },
  { id: '2', name: 'Reserve Bank of India', code: 'RBI', url: 'https://rbi.org.in', color: 'bg-blue-800' },
  { id: '3', name: 'National Payments Corporation of India', code: 'NPCI', url: 'https://npci.org.in', color: 'bg-emerald-700' },
  { id: '4', name: 'Indian Cyber Crime Coordination Centre', code: 'I4C', url: 'https://i4c.mha.gov.in', color: 'bg-amber-800' },
  { id: '5', name: 'Ministry of Home Affairs', code: 'MHA', url: 'https://mha.gov.in', color: 'bg-red-800' },
  { id: '6', name: 'National Cyber Crime Portal', code: 'CYBER PORTAL', url: 'https://cybercrime.gov.in', color: 'bg-purple-800' },
  { id: '7', name: 'Digital India Initiative', code: 'DIGITAL INDIA', url: 'https://digitalindia.gov.in', color: 'bg-blue-600' },
  { id: '8', name: 'National Informatics Centre', code: 'NIC', url: 'https://nic.in', color: 'bg-indigo-800' },
];

export default function ImportantWebsites() {
  return (
    <section id="websites" className="py-14 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading (Matching Reference Screenshot EXACTLY) */}
        <div className="text-center space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-wider uppercase">
            IMPORTANT WEBSITES
          </h2>
        </div>

        {/* Circular Logo Card Gallery (Matching Reference Screenshot EXACTLY) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
          {WEBSITES.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex flex-col items-center justify-center space-y-3 group aspect-[4/3]"
            >
              {/* Circular Official Logo Seal (Screenshot Match) */}
              <div className={`w-14 h-14 rounded-full ${site.color} text-white flex items-center justify-center p-2 shadow-inner group-hover:scale-105 transition-transform`}>
                <div className="w-full h-full rounded-full border border-white/40 flex items-center justify-center font-black text-[11px] tracking-tighter">
                  🇮🇳
                </div>
              </div>

              {/* Organization Name Below Logo (Screenshot Match) */}
              <span className="font-extrabold text-slate-900 text-xs text-center group-hover:text-blue-700 transition-colors uppercase tracking-tight">
                {site.code}
              </span>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
