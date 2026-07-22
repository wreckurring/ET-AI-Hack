'use client';

import React from 'react';
import Link from 'next/link';
import OurActivities from '@/components/OurActivities';
import DosAndDonts from '@/components/DosAndDonts';
import ResourcesSection from '@/components/ResourcesSection';
import ImportantWebsites from '@/components/ImportantWebsites';

export default function NDMAGovernmentHomepage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* HERO SECTION: Official Government Banner with Full Width Image & Soft Overlay */}
      <section className="relative w-full bg-slate-900 text-white overflow-hidden py-20 sm:py-28 border-b border-slate-800">
        
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 mix-blend-overlay"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1600&q=80')`
          }}
        />

        {/* Light Blue Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/80 to-blue-900/85 z-10" />

        {/* Hero Content (Restrained, Official, Whitespace) */}
        <div className="relative z-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight drop-shadow-md">
            AI Powered National Cyber Fraud Protection Platform
          </h1>

          <p className="text-sm sm:text-lg text-slate-200 max-w-3xl mx-auto font-normal leading-relaxed">
            Report cyber fraud, track complaints, verify suspicious messages, receive AI-powered guidance, 
            and access emergency cyber assistance through one secure platform.
          </p>

          {/* Two CTA Buttons ONLY */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/report"
              className="w-full sm:w-auto bg-blue-700 hover:bg-blue-600 text-white font-extrabold text-sm px-8 py-3.5 rounded shadow-md transition-colors"
            >
              Report Cyber Fraud
            </Link>

            <Link
              href="/track"
              className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white font-extrabold text-sm px-8 py-3.5 rounded border border-white/30 transition-colors"
            >
              Track Complaint
            </Link>
          </div>

        </div>
      </section>

      {/* 🌟 OUR ACTIVITIES (PRIMARY HOMEPAGE SHOWCASE - 4 INTELLIGENCE DOMAINS) */}
      <OurActivities />

      {/* DO'S & DON'TS PHOTO CAROUSEL (NDMA Screenshot 2 Replica) */}
      <DosAndDonts />

      {/* OFFICIAL RESOURCES PUBLICATION GALLERY (NDMA Screenshot 3 Replica) */}
      <ResourcesSection />

      {/* IMPORTANT WEBSITES DIRECTORY (CIRCULAR LOGOS REPLICA) */}
      <ImportantWebsites />

    </div>
  );
}
