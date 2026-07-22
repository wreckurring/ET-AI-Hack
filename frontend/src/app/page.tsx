'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, AlertTriangle, FileText, CheckCircle2, Lock, ArrowRight, PhoneCall, Cpu, MapPin, Zap, Layers, Sparkles, Building2, HelpCircle } from 'lucide-react';
import AIScamDetectorModal from '@/components/AIScamDetectorModal';

export default function LandingPage() {
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      
      {/* 1. Large Hero Section */}
      <section className="relative bg-white border-b border-slate-200 overflow-hidden py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-semibold">
                <Shield className="h-4 w-4 text-blue-600" />
                <span>National Public Safety Directive • Cyber Protection</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
                AI-Powered <span className="text-blue-600">Cyber Fraud</span> Intelligence & Fast-Freeze Hold
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-2xl font-normal leading-relaxed">
                Protecting citizens against financial cybercrime, securing SHA-256 evidence chain of custody, 
                and issuing instant Fast-Freeze account holds across Indian banks in partnership with Law Enforcement Agencies.
              </p>

              {/* Primary & Secondary CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="/report" className="btn-primary w-full sm:w-auto text-base px-8 py-4">
                  <AlertTriangle className="h-5 w-5 text-amber-300" />
                  <span>Report Cyber Fraud Now</span>
                </Link>

                <Link href="/track" className="btn-secondary w-full sm:w-auto text-base px-8 py-4">
                  <FileText className="h-5 w-5 text-slate-500" />
                  <span>Track Existing Complaint</span>
                </Link>
              </div>

              <div className="pt-4 flex items-center justify-center lg:justify-start space-x-6 text-xs text-slate-500 font-mono">
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> SHA-256 Encrypted Evidence
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Section 91 CrPC Compliant
                </span>
              </div>
            </div>

            {/* Right Hero Quick Action Card */}
            <div className="lg:col-span-5">
              <div className="light-card p-6 bg-white border-2 border-blue-100 shadow-xl space-y-5 relative">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600">
                      <Shield className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm">Emergency Assistance Desk</h3>
                      <span className="text-xs text-slate-500 font-mono">Incident Action Protocol</span>
                    </div>
                  </div>
                  <span className="badge-emerald font-mono text-[11px]">24/7 ACTIVE</span>
                </div>

                {/* Helpline 1930 Callout */}
                <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-amber-900 block">Immediate Helpline</span>
                    <span className="text-2xl font-black text-amber-700 font-mono">1930</span>
                  </div>
                  <a href="tel:1930" className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-extrabold text-xs rounded-lg transition-colors">
                    Call Helpline
                  </a>
                </div>

                {/* AI Analyzer Quick Trigger */}
                <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 space-y-2">
                  <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <Cpu className="h-4 w-4 text-blue-600 animate-pulse" /> Free Instant AI Scam Analyzer
                  </span>
                  <p className="text-xs text-slate-600">Paste suspicious SMS, WhatsApp message, Email, or Call transcript for instant threat classification.</p>
                  <button
                    onClick={() => setIsScamModalOpen(true)}
                    className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
                  >
                    <span>Scan Message / Transcript</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Platform Core Capabilities Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="badge-blue">Core Capabilities</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              Enterprise Cyber Fraud Defense Architecture
            </h2>
            <p className="text-slate-600 text-sm">
              Combines cryptographic proof, PostGIS spatial clustering, and automated banking hold directives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="light-card p-6 space-y-4">
              <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit border border-blue-100">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Cryptographic SHA-256 Proof</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Calculates client-side SHA-256 Web Crypto hash digests for uploaded evidence images & PDFs, 
                guaranteeing tamper-proof court admissibility and chain of custody.
              </p>
            </div>

            {/* Card 2 */}
            <div className="light-card p-6 space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-600 w-fit border border-emerald-100">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">Interbank Fast-Freeze Directives</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generates automated Section 91 CrPC reference tokens (`FF-2026-XXXX`) to lock target beneficiary bank accounts 
                and stop stolen funds from being laundered.
              </p>
            </div>

            {/* Card 3 */}
            <div className="light-card p-6 space-y-4">
              <div className="p-3 rounded-xl bg-purple-50 text-purple-600 w-fit border border-purple-100">
                <MapPin className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">PostGIS Spatial Hotspot Clustering</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Uses PostGIS spatial queries and DBSCAN clustering to identify high-density cybercrime hubs (Jamtara, Mewat, Cyberabad) 
                and display GeoJSON hotspot maps for law enforcement.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 3. AI Multimodal Services Section */}
      <section className="py-16 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="badge-emerald">Multimodal Intelligence</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              AI Scam Classification & Multimodal Analysis
            </h2>
            <p className="text-slate-600 text-sm">
              Supports SMS, WhatsApp messages, Emails, Speech-to-Text audio recordings, and OCR screenshot reading.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="light-card p-6 space-y-3 border-l-4 border-l-blue-600">
              <span className="text-xs font-mono font-bold text-blue-600 block uppercase">1. TEXT & SMS CLASSIFIER</span>
              <h4 className="font-bold text-slate-900 text-base">Digital Arrest & Phishing Detection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Flags fake CBI/Police Skype video call threats, SBI YONO account block SMS messages, and fake electricity bill disconnect notices.
              </p>
            </div>

            <div className="light-card p-6 space-y-3 border-l-4 border-l-emerald-600">
              <span className="text-xs font-mono font-bold text-emerald-600 block uppercase">2. VOICE STT SPEECH ANALYZER</span>
              <h4 className="font-bold text-slate-900 text-base">Call Recording Threat Detection</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Transcribes call audio (.wav, .mp3, .m4a) to text and detects coercive extortion phrases, fake official impersonations, and OTP solicitations.
              </p>
            </div>

            <div className="light-card p-6 space-y-3 border-l-4 border-l-purple-600">
              <span className="text-xs font-mono font-bold text-purple-600 block uppercase">3. OCR SCREENSHOT READER</span>
              <h4 className="font-bold text-slate-900 text-base">Image Evidence OCR Parsing</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Extracts text automatically from WhatsApp chat screenshots, fake arrest warrants, and bank UPI receipt images.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. How It Works Section */}
      <section className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <span className="badge-amber">Citizen Workflow</span>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              4-Step Incident Resolution Workflow
            </h2>
            <p className="text-slate-600 text-sm">
              Simple, transparent, and actionable process for citizens to lodge and track cyber fraud complaints.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="light-card p-6 text-center space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                1
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Submit Fraud Complaint</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Provide transaction UTR number, target UPI ID, scammer phone, and upload screenshot evidence.
              </p>
            </div>

            <div className="light-card p-6 text-center space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                2
              </div>
              <h4 className="font-bold text-slate-900 text-sm">SHA-256 Evidence Hashing</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evidence files are cryptographically hashed client-side to generate verifiable cryptographic signatures.
              </p>
            </div>

            <div className="light-card p-6 text-center space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                3
              </div>
              <h4 className="font-bold text-slate-900 text-sm">AI Risk Classification</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                AI engines classify scam taxonomy, score threat risk (0-100), and link suspect entities in Neo4j graph.
              </p>
            </div>

            <div className="light-card p-6 text-center space-y-3 relative">
              <div className="w-10 h-10 rounded-full bg-blue-600 text-white font-black text-sm flex items-center justify-center mx-auto shadow-md">
                4
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Interbank Fast Freeze</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Police & banks execute Fast-Freeze account holds, locking stolen money in beneficiary accounts.
              </p>
            </div>

          </div>

          <div className="text-center pt-4">
            <Link href="/report" className="btn-primary text-base px-8 py-4 inline-flex">
              <span>Lodge a Cyber Fraud Incident Report Now</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>

        </div>
      </section>

      {/* AI Scam Detector Modal */}
      <AIScamDetectorModal
        isOpen={isScamModalOpen}
        onClose={() => setIsScamModalOpen(false)}
      />
    </div>
  );
}
