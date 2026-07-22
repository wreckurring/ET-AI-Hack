'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Cpu, Network, Shield, UserCheck, CheckCircle2, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import AIScamDetectorModal from './AIScamDetectorModal';

interface ActivityDomainCard {
  id: string;
  domainNumber: string;
  title: string;
  purpose: string;
  image: string;
  description: string;
  capabilities: string[];
  exploreLabel: string;
  exploreUrl?: string;
  isModalTrigger?: boolean;
  icon: React.ElementType;
  accentColor: string;
  badgeBg: string;
}

const CAROUSEL_DOMAINS: ActivityDomainCard[] = [
  {
    id: 'domain1',
    domainNumber: 'DOMAIN 1',
    title: 'AI Threat Intelligence',
    purpose: 'Detect digital fraud before it spreads.',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80',
    description: 'Uses AI to detect phishing campaigns, fake investment schemes, QR scams, digital arrest scams, and emerging fraud trends before they become large-scale attacks.',
    capabilities: ['AI Scam Detection', 'Predictive Threat Intelligence', 'AI Investigation Copilot'],
    exploreLabel: 'Explore AI Scam Analyzer',
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
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80',
    description: 'Connects complaints, UPI IDs, bank accounts, wallets, IP addresses, mobile numbers, and devices into an intelligence graph to identify organised fraud networks.',
    capabilities: ['Fraud Graph Intelligence', 'Scam Network Analysis', 'Counterfeit Currency Intelligence'],
    exploreLabel: 'Explore Cyber Graph Engine',
    exploreUrl: '/police/network-graph',
    icon: Network,
    accentColor: 'border-l-purple-600',
    badgeBg: 'bg-purple-100 text-purple-800'
  },
  {
    id: 'domain3',
    domainNumber: 'DOMAIN 3',
    title: 'Law Enforcement & Banking Intelligence',
    purpose: 'Support secure inter-agency collaboration.',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80',
    description: 'Provides investigation dashboards, evidence management, transaction verification, fraud alerts, inter-bank coordination, and AI-assisted investigation support.',
    capabilities: ['Fast Freeze Coordination', 'Investigation Dashboard', 'Banking Coordination', 'Evidence Intelligence'],
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
    purpose: 'Empower citizens with real-time cyber defense.',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=800&q=80',
    description: 'Allows citizens to report fraud, upload evidence, track complaints, verify suspicious messages, and receive AI-powered cyber safety guidance and emergency help.',
    capabilities: ['Complaint Reporting', 'Complaint Tracking', 'AI Scam Analyzer', 'Cyber Awareness & Helpline 1930'],
    exploreLabel: 'Citizen Fraud Portal',
    exploreUrl: '/report',
    icon: UserCheck,
    accentColor: 'border-l-amber-600',
    badgeBg: 'bg-amber-100 text-amber-800'
  }
];

export default function OurActivities() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Auto sliding every 4.5 seconds
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      handleNext();
    }, 4500);
    return () => clearInterval(interval);
  }, [currentIndex, isPaused]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % CAROUSEL_DOMAINS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + CAROUSEL_DOMAINS.length) % CAROUSEL_DOMAINS.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;
    if (diff > 50) handleNext();
    if (diff < -50) handlePrev();
    touchStartX.current = null;
  };

  // Display 2 large cards at a time on desktop
  const visibleCards = [
    CAROUSEL_DOMAINS[currentIndex],
    CAROUSEL_DOMAINS[(currentIndex + 1) % CAROUSEL_DOMAINS.length]
  ];

  return (
    <section id="activities" className="py-16 sm:py-20 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-2">
          <span className="text-xs font-mono font-bold text-blue-700 uppercase tracking-widest block">
            NATIONAL CYBER DEFENSE FRAMEWORK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Our Activities
          </h2>
          <p className="text-sm sm:text-base font-semibold text-slate-600">
            "AI-Powered Digital Public Safety Intelligence Platform"
          </p>
        </div>

        {/* Carousel Container (2 Large Cards at a Time on Desktop) */}
        <div
          className="relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {visibleCards.map((domain, idx) => {
              const Icon = domain.icon;
              return (
                <div
                  key={`${domain.id}-${idx}`}
                  className={`bg-slate-50 rounded-2xl border border-slate-200 shadow-md hover:shadow-lg transition-all duration-300 flex flex-col justify-between overflow-hidden border-l-4 ${domain.accentColor}`}
                >
                  {/* Top Image + Gradient Title Overlay */}
                  <div className="relative h-56 w-full bg-slate-900 shrink-0">
                    <img
                      src={domain.image}
                      alt={domain.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/40 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className={`text-[11px] font-mono font-bold uppercase px-3 py-1 rounded shadow-sm ${domain.badgeBg}`}>
                        {domain.domainNumber}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-6 right-6 flex items-center space-x-3">
                      <div className="p-2.5 rounded-xl bg-white/90 backdrop-blur-sm text-slate-900 shadow-sm shrink-0">
                        <Icon className="h-6 w-6 text-blue-700" />
                      </div>
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide">
                          {domain.title}
                        </h3>
                        <p className="text-xs text-slate-200 font-mono">
                          {domain.purpose}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 sm:p-8 space-y-6 flex-grow flex flex-col justify-between">
                    
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-sans font-normal">
                      {domain.description}
                    </p>

                    {/* Capabilities Badges */}
                    <div className="space-y-2">
                      <span className="text-[11px] font-bold text-slate-500 font-mono uppercase block">
                        HIGHLIGHTED CAPABILITIES:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {domain.capabilities.map((cap, cIdx) => (
                          <div
                            key={cIdx}
                            className="flex items-center space-x-2 p-2.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-800 shadow-2xs"
                          >
                            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            <span className="truncate">{cap}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Explore Action Button */}
                    <div className="pt-4 border-t border-slate-200">
                      {domain.isModalTrigger ? (
                        <button
                          onClick={() => setIsScamModalOpen(true)}
                          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-lg transition-colors flex items-center justify-center space-x-2 shadow-sm"
                        >
                          <span>{domain.exploreLabel}</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      ) : (
                        <Link
                          href={domain.exploreUrl || '/'}
                          className="w-full py-3 bg-blue-700 hover:bg-blue-800 text-white font-extrabold text-xs sm:text-sm rounded-lg transition-colors inline-flex items-center justify-center space-x-2 shadow-sm"
                        >
                          <span>{domain.exploreLabel}</span>
                          <ArrowRight className="h-4 w-4" />
                        </Link>
                      )}
                    </div>

                  </div>

                </div>
              );
            })}
          </div>

          {/* Bottom Center Circular Navigation Arrows (Do's & Don'ts Style Replica) */}
          <div className="flex items-center justify-center space-x-4 pt-8">
            <button
              onClick={handlePrev}
              className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center shadow-sm transition-colors"
              aria-label="Previous Domain"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Carousel Dot Indicators */}
            <div className="flex items-center space-x-2">
              {CAROUSEL_DOMAINS.map((_, dotIdx) => (
                <button
                  key={dotIdx}
                  onClick={() => setCurrentIndex(dotIdx)}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    currentIndex === dotIdx ? 'w-6 bg-blue-700' : 'bg-slate-300 hover:bg-slate-400'
                  }`}
                  aria-label={`Go to slide ${dotIdx + 1}`}
                />
              ))}
            </div>

            <button
              onClick={handleNext}
              className="w-11 h-11 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center shadow-sm transition-colors"
              aria-label="Next Domain"
            >
              <ChevronRight className="h-6 w-6" />
            </button>
          </div>

        </div>

      </div>

      {/* AI Scam Detector Modal */}
      <AIScamDetectorModal isOpen={isScamModalOpen} onClose={() => setIsScamModalOpen(false)} />
    </section>
  );
}
