'use client';

import React from 'react';
import Link from 'next/link';

export default function GovernmentFooter() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans text-xs">
      
      {/* Helpline Callout Banner */}
      <div className="bg-blue-800 text-white py-3 px-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 font-mono">
          <div className="flex items-center space-x-2">
            <span className="font-bold">National Cyber Crime Helpline:</span>
            <span className="text-amber-300 font-black text-sm">1930</span>
            <span className="text-slate-300 hidden md:inline">|(Available 24x7 Across India)</span>
          </div>

          <a
            href="tel:1930"
            className="px-4 py-1.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs rounded transition-colors"
          >
            Call 1930 Immediately
          </a>
        </div>
      </div>

      {/* Footer Links Matrix */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* About */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-1.5">
              RAKSHA-NET Directorate
            </h4>
            <p className="text-slate-400 text-xs leading-relaxed">
              National Cyber Crime Protection & Fast-Freeze Operations Portal. 
              Ministry of Home Affairs, Government of India.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-1.5">
              Quick Links
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><Link href="/" className="hover:text-blue-400">Home</Link></li>
              <li><Link href="/report" className="hover:text-blue-400">Report Cyber Fraud</Link></li>
              <li><Link href="/track" className="hover:text-blue-400">Track Complaint</Link></li>
              <li><Link href="/#dos-donts" className="hover:text-blue-400">Cyber Awareness</Link></li>
              <li><Link href="/#resources" className="hover:text-blue-400">Resources & Publications</Link></li>
            </ul>
          </div>

          {/* Helplines */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-1.5">
              Helplines & Agencies
            </h4>
            <ul className="space-y-1.5 text-slate-400 font-mono">
              <li>National Cyber Helpline: 1930</li>
              <li>Emergency Support: 112</li>
              <li>RBI Helpline: 14440</li>
              <li>National Portal: cybercrime.gov.in</li>
            </ul>
          </div>

          {/* Legal / Policy */}
          <div className="space-y-2">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-1.5">
              Legal & Terms
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li><a href="#" className="hover:text-blue-400">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">Terms of Use</a></li>
              <li><a href="#" className="hover:text-blue-400">Section 91 CrPC Directive Policy</a></li>
              <li><a href="#" className="hover:text-blue-400">Help Centre</a></li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer */}
        <div className="mt-8 pt-6 border-t border-slate-800 text-center md:flex md:justify-between md:items-center text-slate-500">
          <p>© 2026 RAKSHA-NET National Cyber Crime Directorate. Government of India.</p>
          <p className="mt-2 md:mt-0 font-mono text-[11px]">Designed for Public Safety & Law Enforcement Excellence</p>
        </div>
      </div>

    </footer>
  );
}
