'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, FileText, CheckCircle2, PhoneCall, Cpu, ArrowRight, Lock, Zap } from 'lucide-react';
import AIScamDetectorModal from '@/components/AIScamDetectorModal';
import DosAndDonts from '@/components/DosAndDonts';
import OurActivities from '@/components/OurActivities';
import ResourcesSection from '@/components/ResourcesSection';
import ImportantWebsites from '@/components/ImportantWebsites';
import { useLanguage } from '@/context/LanguageContext';

export default function NDMAInspiredLandingPage() {
  const { t } = useLanguage();
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Full-Width Government Theme Hero Section directly below navbar */}
      <section className="relative w-full bg-slate-900 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
        
        {/* Soft Blue Cyber Overlay Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/90 via-slate-900/85 to-blue-900/90 z-10" />
        
        {/* Decorative Grid Pattern SVG */}
        <div className="absolute inset-0 z-0 opacity-20 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:24px_24px]" />

        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              
              {/* Emergency Badge */}
              <div className="inline-flex items-center space-x-2.5 px-4 py-1.5 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-mono font-bold">
                <PhoneCall className="h-4 w-4 text-amber-400 animate-pulse" />
                <span>{t('badge_helpline')}</span>
              </div>

              {/* Citizen Hero Title & Subtitle */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.15]">
                {t('hero_title')}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 max-w-2xl font-normal leading-relaxed">
                {t('hero_subtitle')}
              </p>

              {/* Primary & Secondary Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/report" className="btn-primary w-full sm:w-auto text-base px-8 py-4 bg-blue-600 hover:bg-blue-500 shadow-blue-600/30">
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                  <span>{t('btn_report_fraud')}</span>
                </Link>

                <Link href="/track" className="btn-secondary w-full sm:w-auto text-base px-8 py-4 bg-white/10 text-white border-slate-700 hover:bg-white/20 hover:border-slate-500">
                  <FileText className="h-5 w-5 text-slate-300" />
                  <span>{t('btn_track_complaint')}</span>
                </Link>
              </div>

              {/* Security Safeguards */}
              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-400 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> SHA-256 Encrypted Proof
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" /> Sec 91 CrPC Directives
                </span>
              </div>
            </div>

            {/* Right Hero Quick Action Box */}
            <div className="lg:col-span-5">
              <div className="light-card p-6 bg-white/95 text-slate-900 border-2 border-blue-200 shadow-2xl space-y-5 relative rounded-2xl backdrop-blur-md">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-blue-600 text-white">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-sm">Emergency Assistance Desk</h3>
                      <span className="text-xs text-slate-500 font-mono">National Incident Protocol</span>
                    </div>
                  </div>
                  <span className="badge-emerald font-mono text-[11px]">24/7 ACTIVE</span>
                </div>

                {/* Helpline 1930 Callout Box */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">National Cyber Helpline</span>
                    <span className="text-3xl font-black text-amber-700 font-mono tracking-wider">1930</span>
                  </div>
                  <a href="tel:1930" className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-900 font-extrabold text-xs rounded-xl shadow-sm transition-colors">
                    Call Helpline
                  </a>
                </div>

                {/* AI Analyzer Quick Action */}
                <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-blue-600 animate-pulse" /> Free Instant AI Scam Analyzer
                  </span>
                  <p className="text-xs text-slate-600">Scan suspicious SMS, WhatsApp message, Email, or Call transcript for instant threat classification.</p>
                  <button
                    onClick={() => setIsScamModalOpen(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Run AI Threat Analysis</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Do's and Don'ts Section (NDMA Hazard Safety Inspired) */}
      <DosAndDonts />

      {/* 3. Our Activities Section */}
      <OurActivities />

      {/* 4. Citizen Resources Section */}
      <ResourcesSection />

      {/* 5. Important Websites Directory */}
      <ImportantWebsites />

      {/* AI Scam Analyzer Modal */}
      <AIScamDetectorModal
        isOpen={isScamModalOpen}
        onClose={() => setIsScamModalOpen(false)}
      />
    </div>
  );
}
