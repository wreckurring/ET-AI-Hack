'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Search, FileText, AlertTriangle, Cpu, Lock, PhoneCall, Shield, HelpCircle, ExternalLink } from 'lucide-react';

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  url?: string;
  action?: string;
  icon: React.ElementType;
}

const SEARCH_DATABASE: SearchResultItem[] = [
  { id: '1', title: 'Report Cyber Fraud Complaint', category: 'Citizen Service', url: '/report', icon: AlertTriangle },
  { id: '2', title: 'Track Complaint Status & Fast-Freeze', category: 'Citizen Service', url: '/track', icon: FileText },
  { id: '3', title: 'AI Scam Analyzer (SMS, WhatsApp, Audio)', category: 'AI Tools', action: 'OPEN_AI_SCAM_MODAL', icon: Cpu },
  { id: '4', title: 'Fast Freeze Emergency Directive', category: 'Police & Banking', url: '/police', icon: Lock },
  { id: '5', title: 'National Cyber Crime Helpline 1930', category: 'Emergency Contact', url: 'tel:1930', icon: PhoneCall },
  { id: '6', title: 'Cyber Safety Do\'s & Don\'ts', category: 'Advisories', url: '/#dos-donts', icon: Shield },
  { id: '7', title: 'Help Centre & Frequently Asked Questions', category: 'Support', url: '/#faqs', icon: HelpCircle },
  { id: '8', title: 'Police Command Center & Intelligence', category: 'LEA Portal', url: '/police', icon: Shield },
  { id: '9', title: 'Bank Nodal Operations Portal', category: 'Banking', url: '/login?role=FINANCIAL_INSTITUTION', icon: ExternalLink },
];

interface GlobalSearchProps {
  onOpenAIScamModal?: () => void;
}

export default function GlobalSearch({ onOpenAIScamModal }: GlobalSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const filteredResults = SEARCH_DATABASE.filter(item =>
    item.title.toLowerCase().includes(query.toLowerCase()) ||
    item.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (item: SearchResultItem) => {
    setIsOpen(false);
    setQuery('');
    if (item.action === 'OPEN_AI_SCAM_MODAL' && onOpenAIScamModal) {
      onOpenAIScamModal();
    } else if (item.url) {
      if (item.url.startsWith('tel:')) {
        window.location.href = item.url;
      } else {
        router.push(item.url);
      }
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xs">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search portal services..."
          value={query}
          onFocus={() => setIsOpen(true)}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          className="w-full pl-9 pr-4 py-2 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all font-sans"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {isOpen && query.trim().length > 0 && (
        <div className="absolute left-0 right-0 top-11 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden max-h-72 overflow-y-auto animate-in fade-in duration-150 font-sans">
          {filteredResults.length > 0 ? (
            <div className="py-1">
              {filteredResults.map((item) => {
                const IconComponent = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    className="w-full px-3.5 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-center space-x-3 group border-b border-slate-100 last:border-0"
                  >
                    <div className="p-1.5 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 transition-colors">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-900 block group-hover:text-blue-700">{item.title}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{item.category}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-3 text-center text-xs text-slate-500 font-mono">
              No matching portal services found.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
