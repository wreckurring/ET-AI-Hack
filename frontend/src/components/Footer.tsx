'use client';

import React from 'react';
import Link from 'next/link';
import { Shield, PhoneCall, AlertCircle, FileText, HelpCircle, Lock, ExternalLink } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 font-sans">
      
      {/* Emergency Callout Banner */}
      <div className="bg-blue-600 text-white py-4 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3 text-center md:text-left">
            <div className="p-2.5 bg-white/10 rounded-xl">
              <PhoneCall className="h-6 w-6 text-amber-300" />
            </div>
            <div>
              <h4 className="font-bold text-base">Victim of Cyber Financial Fraud? Call Helpline 1930</h4>
              <p className="text-xs text-blue-100">National Cyber Crime Reporting Helpline is available 24/7 across India</p>
            </div>
          </div>

          <a
            href="tel:1930"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-900 font-extrabold text-sm rounded-xl shadow-md transition-all shrink-0"
          >
            Call 1930 Immediately
          </a>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Section 1: About RAKSHA-NET */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-xl bg-blue-600 text-white">
                <Shield className="h-5 w-5" />
              </div>
              <span className="text-lg font-black text-white tracking-tight">RAKSHA-NET</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              RAKSHA-NET is the National AI-Powered Cyber Fraud Intelligence & Fast-Freeze Operations Platform. 
              Designed to protect citizens, accelerate interbank account holds, and assist Law Enforcement Agencies in cybercrime investigation.
            </p>
            <span className="inline-block px-3 py-1 bg-slate-800 text-blue-400 border border-blue-500/30 rounded-full text-[11px] font-semibold">
              Official Public Safety Initiative
            </span>
          </div>

          {/* Section 2: Emergency Contacts */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Emergency Contacts
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-center justify-between text-slate-200">
                <span>National Cyber Helpline:</span>
                <span className="font-bold text-amber-400 font-mono">1930</span>
              </li>
              <li className="flex items-center justify-between">
                <span>Emergency Support System:</span>
                <span className="font-bold text-white font-mono">112</span>
              </li>
              <li className="flex items-center justify-between">
                <span>National Police Portal:</span>
                <span className="font-bold text-blue-400 font-mono">cybercrime.gov.in</span>
              </li>
              <li className="flex items-center justify-between">
                <span>RBI Cyber Cell Helpline:</span>
                <span className="font-bold text-white font-mono">14440</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Cyber Safety Tips */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Cyber Safety Tips
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Never enter UPI PIN to receive money. PIN is required only to send money.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Beware of Digital Arrest threats on Skype/WhatsApp claiming to be CBI or Police.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertCircle className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                <span>Do not download unknown .APK files from SMS links or WhatsApp messages.</span>
              </li>
            </ul>
          </div>

          {/* Section 4: Quick Links & Support */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Links & Help
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/report" className="hover:text-blue-400 transition-colors">
                  Report Cyber Fraud Complaint
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-blue-400 transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link href="/police/hotspots" className="hover:text-blue-400 transition-colors">
                  Cyber Crime Hotspots Map
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Privacy Policy & Citizen Rights
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-blue-400 transition-colors">
                  Terms & Conditions
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center md:flex md:justify-between md:items-center text-xs text-slate-500">
          <p>© 2026 RAKSHA-NET National Cyber Crime Operations. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 font-mono">Designed for Public Safety & Law Enforcement Excellence</p>
        </div>
      </div>
    </footer>
  );
}
