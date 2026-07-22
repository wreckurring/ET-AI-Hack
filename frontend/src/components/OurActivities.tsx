'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Network, Shield, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import AIScamDetectorModal from './AIScamDetectorModal';

interface DomainCard {
  id: string;
  domainNumber: string;
  title: string;
  purpose: string;
  description: string;
  capabilities: string[];
  exploreLabel: string;
  exploreUrl?: string;
  isModalTrigger?: boolean;
  icon: React.ElementType;
  accentColor: string;
  badgeBg: string;
}

const INTELLIGENCE_DOMAINS: DomainCard[] = [
  {
    id: 'domain1',
    domainNumber: 'DOMAIN 1',
    title: 'AI Threat Intelligence',
    purpose: 'Detect digital fraud before it spreads.',
    description: 'Uses AI to detect phishing campaigns, fake investment schemes, QR scams, digital arrest scams, and emerging fraud trends before they become large-scale attacks.',
    capabilities: ['AI Scam Detection', 'Predictive Threat Intelligence', 'AI Investigation Copilot'],
    exploreLabel: 'AI Scam Analyzer',
    isModalTrigger: true,
    icon: Cpu,
    accentColor: 'border-l-blue-600',
    badgeBg: 'bg-blue-100 text-blue-800'
  },
  {
    id: 'domain2',
    domainNumber: 'DOMAIN 2',
    title: 'Fraud Network Intelligence',
    purpose: 'Identify organised fraud ecosystems.',
    description: 'Connects complaints, UPI IDs, bank accounts, wallets, IP addresses, mobile numbers, and devices into an intelligence graph to identify organised fraud networks.',
    capabilities: ['Scam Network Mapping', 'Digital Fraud Intelligence', 'Counterfeit Currency Intelligence'],
    exploreLabel: 'Explore Network Analysis',
    exploreUrl: '/police/network-graph',
    icon: Network,
    accentColor: 'border-l-purple-600',
    badgeBg: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'domain3',
    domainNumber: 'DOMAIN 3',
    title: 'Law Enforcement & Banking Intelligence',
    purpose: 'Support secure collaboration.',
    description: 'Provides investigation dashboards, evidence management, transaction verification, fraud alerts, inter-bank coordination, and AI-assisted investigation support.',
    capabilities: ['Fast Freeze Coordination', 'Bank Intelligence', 'Law Enforcement Dashboard'],
    exploreLabel: 'Police & Banking Portal',
    exploreUrl: '/police',
    icon: Shield,
    accentColor: 'border-l-emerald-600',
    badgeBg: 'bg-emerald-100 text-emerald-800'
  },
  {
    id: 'domain4',
    domainNumber: 'DOMAIN 4',
    title: 'Citizen Protection Services',
    purpose: 'Empower citizens.',
    description: 'Allows citizens to report fraud, upload evidence, track complaints, verify suspicious messages, and receive AI-powered cyber safety guidance.',
    capabilities: ['Report Fraud', 'Complaint Tracking', 'Cyber Awareness & Helpline 1930'],
    exploreLabel: 'Citizen Fraud Portal',
    exploreUrl: '/report',
    icon: UserCheck,
    accentColor: 'border-l-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800'
  }
];

export default function OurActivities() {
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  return (
    <section id="activities" className="py-16 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest block">
            NATIONAL CYBER DEFENSE FRAMEWORK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Activities
          </h2>
          <p className="text-sm font-semibold text-slate-600">
            "AI-Powered Digital Public Safety Intelligence Platform"
          </p>
        </div>

        {/* 4 Major Intelligence Domains (Large Showcase Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
          {INTELLIGENCE_DOMAINS.map((domain) => {
            const Icon = domain.icon;
            return (
              <div
                key={domain.id}
                className={`bg-slate-50 rounded-xl border border-slate-200 p-8 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 border-l-4 ${domain.accentColor}`}
              >
                <div className="space-y-4">
                  
                  {/* Domain Badge & Icon */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 rounded-xl bg-white text-slate-900 border border-slate-200 shadow-sm">
                        <Icon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded ${domain.badgeBg}`}>
                          {domain.domainNumber}
                        </span>
                        <h3 className="text-xl font-extrabold text-slate-900 mt-1">{domain.title}</h3>
                      </div>
                    </div>
                  </div>

                  {/* Purpose & Description */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-blue-800 font-mono block">PURPOSE: {domain.purpose}</span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                      {domain.description}
                    </p>
                  </div>

                  {/* Capability Bullet List */}
                  <div className="pt-2 space-y-2">
                    <span className="text-[11px] font-bold text-slate-500 font-mono block uppercase">KEY CAPABILITIES:</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {domain.capabilities.map((cap, cIdx) => (
                        <div key={cIdx} className="flex items-center space-x-1.5 p-2 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-800">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Explore Action Button */}
                <div className="pt-4 border-t border-slate-200">
                  {domain.isModalTrigger ? (
                    <button
                      onClick={() => setIsScamModalOpen(true)}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Explore → {domain.exploreLabel}</span>
                    </button>
                  ) : (
                    <Link
                      href={domain.exploreUrl || '/'}
                      className="w-full sm:w-auto px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded transition-colors inline-flex items-center justify-center space-x-2"
                    >
                      <span>{domain.exploreLabel}</span>
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>

      </div>

      {/* AI Scam Detector Modal */}
      <AIScamDetectorModal isOpen={isScamModalOpen} onClose={() => setIsScamModalOpen(false)} />
    </section>
  );
}
