'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Shield, PhoneCall, AlertCircle, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Footer() {
  const { t } = useLanguage();
  const [supportMessage, setSupportMessage] = useState('');
  const [senderEmail, setSenderEmail] = useState('');
  const [messageSent, setMessageSent] = useState(false);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim() || !senderEmail.trim()) return;
    setMessageSent(true);
    setTimeout(() => {
      setSupportMessage('');
      setSenderEmail('');
      setMessageSent(false);
    }, 4000);
  };

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

      {/* Main Footer Content */}
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
              RAKSHA-NET is the National AI-Powered Cyber Fraud Protection & Fast-Freeze Operations Portal. 
              Designed to protect citizens, accelerate interbank account holds, and assist Law Enforcement Agencies across India.
            </p>
            <span className="inline-block px-3 py-1 bg-slate-800 text-blue-400 border border-blue-500/30 rounded-full text-[11px] font-semibold">
              Official Citizen Safety Initiative
            </span>
          </div>

          {/* Section 2: Emergency Helplines */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Emergency Helplines
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-center justify-between text-slate-200">
                <span>Cyber Crime Helpline:</span>
                <span className="font-bold text-amber-400 font-mono text-sm">1930</span>
              </li>
              <li className="flex items-center justify-between">
                <span>National Emergency:</span>
                <span className="font-bold text-white font-mono text-sm">112</span>
              </li>
              <li className="flex items-center justify-between">
                <span>National Cyber Portal:</span>
                <span className="font-bold text-blue-400 font-mono text-xs">cybercrime.gov.in</span>
              </li>
              <li className="flex items-center justify-between">
                <span>RBI Cyber Helpline:</span>
                <span className="font-bold text-white font-mono text-xs">14440</span>
              </li>
            </ul>
          </div>

          {/* Section 3: Quick Citizen Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2">
              Quick Help & Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li>
                <Link href="/report" className="hover:text-blue-400 transition-colors">
                  Report Cyber Fraud Incident
                </Link>
              </li>
              <li>
                <Link href="/track" className="hover:text-blue-400 transition-colors">
                  Track Complaint Status
                </Link>
              </li>
              <li>
                <Link href="/#dos-donts" className="hover:text-blue-400 transition-colors">
                  Cyber Safety Do's & Don'ts
                </Link>
              </li>
              <li>
                <Link href="/#resources" className="hover:text-blue-400 transition-colors">
                  Download Awareness Posters
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

          {/* Section 4: Send Message Support Form */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-sm uppercase tracking-wider border-b border-slate-800 pb-2 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-blue-400" /> Send Message to Support
            </h4>

            {messageSent ? (
              <div className="p-3 bg-emerald-950/80 border border-emerald-500/40 rounded-xl text-xs text-emerald-300 flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Message received! Support team will respond shortly.</span>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-2 text-xs">
                <input
                  type="email"
                  required
                  placeholder="Your Email Address"
                  value={senderEmail}
                  onChange={(e) => setSenderEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
                <textarea
                  rows={2}
                  required
                  placeholder="Type your message or feedback..."
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 text-xs focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Disclaimer & Copyright */}
        <div className="mt-12 pt-6 border-t border-slate-800 text-center md:flex md:justify-between md:items-center text-xs text-slate-500">
          <p>© 2026 RAKSHA-NET National Cyber Crime Operations Portal. All Rights Reserved.</p>
          <p className="mt-2 md:mt-0 font-mono">Designed for Public Safety & Law Enforcement Excellence</p>
        </div>
      </div>
    </footer>
  );
}
