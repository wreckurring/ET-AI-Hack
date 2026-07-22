'use client';

import React from 'react';
import { Landmark, Shield, Building2, ExternalLink } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

interface WebsiteItem {
  id: string;
  name: string;
  domain: string;
  url: string;
  category: string;
}

const WEBSITES: WebsiteItem[] = [
  { id: '1', name: 'National Cyber Crime Reporting Portal', domain: 'cybercrime.gov.in', url: 'https://cybercrime.gov.in', category: 'Ministry of Home Affairs' },
  { id: '2', name: 'Ministry of Home Affairs (MHA)', domain: 'mha.gov.in', url: 'https://mha.gov.in', category: 'Government of India' },
  { id: '3', name: 'CERT-In Cyber Emergency Response', domain: 'cert-in.org.in', url: 'https://www.cert-in.org.in', category: 'MeitY Security Agency' },
  { id: '4', name: 'Indian Cyber Crime Coordination Centre (I4C)', domain: 'i4c.mha.gov.in', url: 'https://i4c.mha.gov.in', category: 'National Cyber Directorate' },
  { id: '5', name: 'Reserve Bank of India (RBI)', domain: 'rbi.org.in', url: 'https://rbi.org.in', category: 'Central Banking Regulator' },
  { id: '6', name: 'National Payments Corporation of India (NPCI)', domain: 'npci.org.in', url: 'https://npci.org.in', category: 'UPI & Retail Payments' },
  { id: '7', name: 'Digital India Initiative', domain: 'digitalindia.gov.in', url: 'https://digitalindia.gov.in', category: 'MeitY National Mission' },
  { id: '8', name: 'National Informatics Centre (NIC)', domain: 'nic.in', url: 'https://nic.in', category: 'Technology Partner' }
];

export default function ImportantWebsites() {
  const { t } = useLanguage();

  return (
    <section className="py-16 bg-slate-50 border-b border-slate-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="badge-amber font-mono">{t('websites_heading')}</span>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Key Government & Regulatory Partner Portals
          </h2>
          <p className="text-slate-600 text-sm">{t('websites_sub')}</p>
        </div>

        {/* 8 Card Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {WEBSITES.map((site) => (
            <a
              key={site.id}
              href={site.url}
              target="_blank"
              rel="noopener noreferrer"
              className="light-card p-5 bg-white space-y-3 border border-slate-200 hover:border-blue-500 hover:shadow-md transition-all group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-blue-600 font-bold uppercase tracking-wider block">{site.category}</span>
                  <ExternalLink className="h-3.5 w-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <h3 className="font-bold text-slate-900 text-sm group-hover:text-blue-600 transition-colors leading-snug">{site.name}</h3>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-500">
                <span>{site.domain}</span>
                <span className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Visit →</span>
              </div>
            </a>
          ))}
        </div>

      </div>
    </section>
  );
}
