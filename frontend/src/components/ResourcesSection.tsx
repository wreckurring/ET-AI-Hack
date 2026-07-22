'use client';

import React, { useState } from 'react';
import { Download, FileText, X, ExternalLink } from 'lucide-react';

interface PublicationCover {
  id: string;
  title: string;
  coverTitle: string;
  coverSubtitle: string;
  headerColor: string;
  coverBg: string;
  dateStr: string;
}

const PUBLICATIONS: PublicationCover[] = [
  {
    id: '1',
    title: 'National Plan',
    coverTitle: 'NATIONAL CYBER SECURITY PLAN',
    coverSubtitle: 'Citizen Protection & Fast-Freeze Framework',
    headerColor: 'bg-emerald-800 text-white',
    coverBg: 'bg-emerald-50',
    dateStr: 'November 2025'
  },
  {
    id: '2',
    title: 'National Policy',
    coverTitle: 'NATIONAL POLICY ON CYBER FRAUD PREVENTION',
    coverSubtitle: 'Ministry of Home Affairs Guidelines',
    headerColor: 'bg-slate-700 text-white',
    coverBg: 'bg-stone-100',
    dateStr: '2025-2026'
  },
  {
    id: '3',
    title: 'National Guideline',
    coverTitle: 'GUIDELINES ON FAST-FREEZE & SECTION 91 CrPC',
    coverSubtitle: 'Interbank Account Hold Directives',
    headerColor: 'bg-amber-800 text-white',
    coverBg: 'bg-amber-50',
    dateStr: 'October 2025'
  },
  {
    id: '4',
    title: 'Reports & Studies',
    coverTitle: 'CYBER CRIME SYNDICATES & JAM TARA ANALYSIS',
    coverSubtitle: 'PostGIS Hotspot Density Survey',
    headerColor: 'bg-blue-900 text-white',
    coverBg: 'bg-blue-50',
    dateStr: 'Annual Study'
  },
  {
    id: '5',
    title: 'Sign Language Videos',
    coverTitle: 'ACCESSIBLE CYBER SAFETY TUTORIALS',
    coverSubtitle: 'Inclusion & Awareness for All Citizens',
    headerColor: 'bg-purple-800 text-white',
    coverBg: 'bg-purple-50',
    dateStr: 'Video Series'
  },
  {
    id: '6',
    title: 'Annual Report',
    coverTitle: 'ANNUAL REPORT 2025-2026',
    coverSubtitle: 'RAKSHA-NET Crime Directorate Telemetry',
    headerColor: 'bg-emerald-900 text-white',
    coverBg: 'bg-emerald-50',
    dateStr: 'Annual Edition'
  },
  {
    id: '7',
    title: 'Cyber Threat Atlas',
    coverTitle: 'NATIONAL CYBER FRAUD HOTSPOT ATLAS',
    coverSubtitle: 'Spatial Intelligence & Crime Vulnerability Map',
    headerColor: 'bg-red-800 text-white',
    coverBg: 'bg-orange-50',
    dateStr: '2026 Edition'
  }
];

export default function ResourcesSection() {
  const [activeCover, setActiveCover] = useState<PublicationCover | null>(null);

  return (
    <section id="resources" className="py-12 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Heading (NDMA Government Blue Heading Style - Screenshot 3 Match) */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-blue-900 tracking-tight">
          Resources
        </h2>

        {/* Publication Covers Horizontal Gallery (Screenshot 3 Exact Match) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {PUBLICATIONS.map((pub) => (
            <div
              key={pub.id}
              onClick={() => setActiveCover(pub)}
              className="group cursor-pointer flex flex-col items-center space-y-2"
            >
              {/* Realistic Document Book Cover Mockup (3:4 Aspect Ratio - Screenshot 3 Match) */}
              <div className={`w-full aspect-[3/4] rounded-lg border border-slate-300 ${pub.coverBg} shadow-sm group-hover:shadow-md group-hover:-translate-y-1 transition-all p-2 flex flex-col justify-between relative overflow-hidden`}>
                
                {/* Government Top Bar on Cover */}
                <div className={`w-full py-1 text-[8px] font-bold text-center uppercase tracking-wider rounded-t ${pub.headerColor}`}>
                  GOVERNMENT OF INDIA
                </div>

                {/* Centered Seal / Emblem Mockup */}
                <div className="my-auto text-center space-y-1">
                  <div className="w-7 h-7 rounded-full border border-slate-400 mx-auto flex items-center justify-center text-xs font-black text-slate-700">
                    🇮🇳
                  </div>
                  <h4 className="text-[10px] font-black text-slate-900 font-serif leading-tight uppercase px-1">
                    {pub.coverTitle}
                  </h4>
                  <p className="text-[8px] text-slate-600 font-sans leading-none px-1">
                    {pub.coverSubtitle}
                  </p>
                </div>

                {/* Cover Date & Bottom Footer */}
                <div className="border-t border-slate-300 pt-1 text-[7px] text-slate-500 font-mono text-center">
                  <span>{pub.dateStr}</span>
                </div>

              </div>

              {/* Publication Title Text Below Cover (Screenshot 3 Match) */}
              <span className="text-xs font-bold text-blue-950 group-hover:text-blue-700 transition-colors text-center leading-tight">
                {pub.title}
              </span>
            </div>
          ))}
        </div>

      </div>

      {/* PDF Document Preview Modal */}
      {activeCover && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white max-w-lg w-full rounded-xl border border-slate-300 p-6 shadow-2xl space-y-4 relative">
            <button
              onClick={() => setActiveCover(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1 border-b border-slate-100 pb-3">
              <span className="text-xs font-mono text-blue-700 uppercase font-bold">OFFICIAL PUBLICATION PREVIEW</span>
              <h3 className="text-lg font-bold text-slate-900 font-serif">{activeCover.coverTitle}</h3>
              <p className="text-xs text-slate-500">{activeCover.coverSubtitle}</p>
            </div>

            <div className="p-4 bg-slate-50 rounded border border-slate-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-slate-500">Document Format:</span>
                <span className="font-bold text-slate-900">PDF Document</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Publisher:</span>
                <span className="font-bold text-slate-900">Ministry of Home Affairs, GoI</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Publication Date:</span>
                <span className="font-bold text-slate-900">{activeCover.dateStr}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setActiveCover(null)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded transition-colors"
              >
                Close Window
              </button>
              <button
                onClick={() => {
                  alert(`Downloading ${activeCover.coverTitle} PDF...`);
                  setActiveCover(null);
                }}
                className="flex-1 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded transition-colors flex items-center justify-center space-x-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
