'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Cpu, Network, Shield, UserCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import AIScamDetectorModal from './AIScamDetectorModal';

interface MetroActivityTile {
  id: string;
  tileTag: string;
  title: string;
  description: string;
  image: string;
  capabilities: string[];
  buttonLabel: string;
  buttonUrl?: string;
  isModalTrigger?: boolean;
  icon: React.ElementType;
  accentBorder: string;
  badgeBg: string;
}

const METRO_TILES: MetroActivityTile[] = [
  {
    id: 'ai_threat',
    tileTag: 'MODULE 01',
    title: 'AI Threat Intelligence',
    description: 'Detect, analyze, and predict cyber fraud campaigns before they become large-scale incidents.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=900&q=80',
    capabilities: ['AI Scam Detection', 'Predictive Threat Intelligence', 'AI Investigation Copilot'],
    buttonLabel: 'Explore AI Intelligence',
    isModalTrigger: true,
    icon: Cpu,
    accentBorder: 'border-l-blue-700',
    badgeBg: 'bg-blue-100 text-blue-900'
  },
  {
    id: 'fraud_network',
    tileTag: 'MODULE 02',
    title: 'Fraud Network Intelligence',
    description: 'Identify organized cybercrime by linking complaints, UPI IDs, bank accounts, devices, IP addresses, and wallets into an intelligent fraud graph.',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=900&q=80',
    capabilities: ['Fraud Graph Intelligence', 'Scam Network Analysis', 'Counterfeit Currency Intelligence'],
    buttonLabel: 'Explore Fraud Network',
    buttonUrl: '/police/network-graph',
    icon: Network,
    accentBorder: 'border-l-purple-700',
    badgeBg: 'bg-purple-100 text-purple-900'
  },
  {
    id: 'lea_banking',
    tileTag: 'MODULE 03',
    title: 'Law Enforcement & Banking Intelligence',
    description: 'Provide investigation dashboards, Fast Freeze coordination, evidence management, and secure collaboration between banks and law enforcement agencies.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=900&q=80',
    capabilities: ['Fast Freeze Operations', 'Investigation Dashboard', 'Banking Coordination', 'Digital Evidence Management'],
    buttonLabel: 'Open Command Center',
    buttonUrl: '/police',
    icon: Shield,
    accentBorder: 'border-l-emerald-700',
    badgeBg: 'bg-emerald-100 text-emerald-900'
  },
  {
    id: 'citizen_protection',
    tileTag: 'MODULE 04',
    title: 'Citizen Protection Services',
    description: 'Enable citizens to report fraud, analyze suspicious activities using AI, track complaints, and access cyber awareness resources.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=900&q=80',
    capabilities: ['Report Fraud', 'Complaint Tracking', 'AI Scam Analyzer', 'Cyber Awareness', 'Emergency Helpline 1930'],
    buttonLabel: 'Go to Citizen Portal',
    buttonUrl: '/report',
    icon: UserCheck,
    accentBorder: 'border-l-amber-700',
    badgeBg: 'bg-amber-100 text-amber-900'
  }
];

export default function OurActivities() {
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);

  return (
    <section id="activities" className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading (Government Portal Style) */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest block">
            NATIONAL DIGITAL PUBLIC SAFETY INTELLIGENCE
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Activities
          </h2>
          <p className="text-sm sm:text-base font-semibold text-slate-600">
            "AI-Powered Digital Public Safety Intelligence Platform"
          </p>
        </div>

        {/* Asymmetric Metro Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 pt-2">
          
          {METRO_TILES.map((tile, idx) => {
            const Icon = tile.icon;
            // Metro grid span logic: Top 2 tiles get span 6 (prominent), bottom 2 tiles get span 6
            const colSpanClass = "lg:col-span-6";

            return (
              <div
                key={tile.id}
                className={`bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200 flex flex-col justify-between overflow-hidden border-l-4 ${tile.accentBorder} ${colSpanClass}`}
              >
                {/* Banner Image + Gradient Overlay */}
                <div className="relative h-48 sm:h-52 w-full bg-slate-900 shrink-0">
                  <img
                    src={tile.image}
                    alt={tile.title}
                    className="w-full h-full object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />

                  {/* Module Badge */}
                  <div className="absolute top-4 left-4">
                    <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded shadow-sm ${tile.badgeBg}`}>
                      {tile.tileTag}
                    </span>
                  </div>

                  {/* Title & Icon Header */}
                  <div className="absolute bottom-4 left-5 right-5 flex items-center space-x-3">
                    <div className="p-2.5 rounded-xl bg-white/95 text-blue-900 shadow-sm shrink-0">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-wide leading-snug drop-shadow-sm">
                        {tile.title}
                      </h3>
                    </div>
                  </div>
                </div>

                {/* Metro Tile Body Content */}
                <div className="p-6 space-y-5 flex-grow flex flex-col justify-between">
                  
                  {/* Description (2-3 lines) */}
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans">
                    {tile.description}
                  </p>

                  {/* Capabilities Badges Grid */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono font-bold text-slate-500 uppercase block tracking-wider">
                      KEY CAPABILITIES:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {tile.capabilities.map((cap, cIdx) => (
                        <div
                          key={cIdx}
                          className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-slate-100 border border-slate-200 text-xs font-bold text-slate-800"
                        >
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                          <span>{cap}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Explore Button */}
                  <div className="pt-4 border-t border-slate-100">
                    {tile.isModalTrigger ? (
                      <button
                        onClick={() => setIsScamModalOpen(true)}
                        className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded transition-colors flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <span>{tile.buttonLabel}</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link
                        href={tile.buttonUrl || '/'}
                        className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs sm:text-sm rounded transition-colors inline-flex items-center justify-center space-x-2 shadow-sm"
                      >
                        <span>{tile.buttonLabel}</span>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    )}
                  </div>

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
