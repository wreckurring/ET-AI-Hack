'use client';

import React from 'react';
import Link from 'next/link';
import { Cpu, Lock, Shield, ArrowRight, Zap, Users, Building2, BookOpen, BarChart2 } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ActivityItem {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  url: string;
}

const ACTIVITIES: ActivityItem[] = [
  {
    id: '1',
    title: 'AI Scam Detection',
    desc: 'Real-time NLP threat classification scanning SMS, WhatsApp, and audio calls for extortion phrases.',
    icon: Cpu,
    url: '/#dos-donts'
  },
  {
    id: '2',
    title: 'Digital Evidence Collection',
    desc: 'Client-side SHA-256 Web Crypto hashing generating tamper-proof evidence for legal court admissibility.',
    icon: Shield,
    url: '/report'
  },
  {
    id: '3',
    title: 'Fast Freeze Coordination',
    desc: 'Automated Section 91 CrPC reference tokens (`FF-2026-XXXX`) locking stolen money across Indian banks.',
    icon: Lock,
    url: '/track'
  },
  {
    id: '4',
    title: 'Citizen Awareness Campaigns',
    desc: 'Nationwide public education advisories protecting citizens against Digital Arrest and APK fraud.',
    icon: Users,
    url: '/#dos-donts'
  },
  {
    id: '5',
    title: 'Police Investigation Support',
    desc: 'Neo4j multi-hop syndicate crime graph visualizer assisting Law Enforcement Agencies in suspect tracing.',
    icon: Zap,
    url: '/police'
  },
  {
    id: '6',
    title: 'Bank Fraud Coordination',
    desc: 'NPCI interbank nodal desk integration accelerating Golden Hour beneficiary account holds.',
    icon: Building2,
    url: '/login?role=FINANCIAL_INSTITUTION'
  },
  {
    id: '7',
    title: 'Cyber Safety Education',
    desc: 'Public manuals, downloadable advisories, and step-by-step guides for online financial security.',
    icon: BookOpen,
    url: '/#resources'
  },
  {
    id: '8',
    title: 'Analytics & Intelligence',
    desc: 'PostGIS spatial analytics and DBSCAN hotspot clustering identifying cybercrime hubs across India.',
    icon: BarChart2,
    url: '/police/analytics'
  }
];

export default function OurActivities() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="badge-blue font-mono">{t('activities_heading')}</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            National Cyber Safety Initiatives & Key Activities
          </h2>
          <p className="text-slate-600 text-sm">{t('activities_sub')}</p>
        </div>

        {/* 8 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {ACTIVITIES.map((act) => {
            const Icon = act.icon;
            return (
              <div key={act.id} className="light-card p-6 bg-white space-y-4 flex flex-col justify-between group border-2 border-transparent hover:border-blue-100">
                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-blue-50 text-blue-600 w-fit group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{act.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{act.desc}</p>
                </div>

                <Link
                  href={act.url}
                  className="inline-flex items-center space-x-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors pt-2 border-t border-slate-100"
                >
                  <span>Learn More</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
