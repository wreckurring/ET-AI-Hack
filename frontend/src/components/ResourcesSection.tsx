'use client';

import React from 'react';
import Link from 'next/link';
import { FileText, Download, HelpCircle, Video, AlertCircle, Megaphone, FileCheck, BookOpen, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface ResourceTile {
  id: string;
  title: string;
  desc: string;
  icon: React.ElementType;
  url: string;
}

const RESOURCES: ResourceTile[] = [
  { id: '1', title: 'Cyber Safety Guidelines', desc: 'Standard operating procedures for secure net-banking & UPI usage.', icon: BookOpen, url: '/#dos-donts' },
  { id: '2', title: 'Download Awareness Posters', desc: 'Printable safety posters in English and Hindi for public institutions.', icon: Download, url: '#' },
  { id: '3', title: 'User Manuals & Guides', desc: 'Step-by-step citizen portal guide for lodging complaints.', icon: FileText, url: '/report' },
  { id: '4', title: 'Frequently Asked Questions', desc: 'Instant answers to common cyber fraud and Fast-Freeze questions.', icon: HelpCircle, url: '/#faqs' },
  { id: '5', title: 'Video Tutorials', desc: 'Instructional video walkthroughs demonstrating scam prevention.', icon: Video, url: '#' },
  { id: '6', title: 'Latest Advisories', desc: 'Official cyber threat warnings on Digital Arrest and SBI YONO APKs.', icon: AlertCircle, url: '#' },
  { id: '7', title: 'Public Awareness Campaigns', desc: 'National cyber safety awareness drives in partnership with I4C.', icon: Megaphone, url: '#' },
  { id: '8', title: 'Download Official Forms', desc: 'Standardized Section 91 CrPC reference notice templates for LEAs.', icon: FileCheck, url: '#' }
];

export default function ResourcesSection() {
  const { t } = useLanguage();

  return (
    <section id="resources" className="py-16 bg-white border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="badge-emerald font-mono">{t('resources_heading')}</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Official Guidelines, Posters & Media Downloads
          </h2>
          <p className="text-slate-600 text-sm">{t('resources_sub')}</p>
        </div>

        {/* 8 Tile Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {RESOURCES.map((res) => {
            const Icon = res.icon;
            return (
              <Link
                key={res.id}
                href={res.url}
                className="light-card p-6 bg-white space-y-3 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group block"
              >
                <div className="flex items-center justify-between">
                  <div className="p-2.5 rounded-xl bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-700 transition-colors">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ExternalLink className="h-4 w-4 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors">{res.title}</h3>
                <p className="text-xs text-slate-500 leading-relaxed">{res.desc}</p>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}
