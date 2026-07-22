'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Search, ChevronDown, User, Shield, Lock, LogOut, Menu, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { language, setLanguage, t } = useLanguage();

  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setToken(localStorage.getItem('token'));
      setUserName(localStorage.getItem('user_name'));
    }
  }, [pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    setToken(null);
    setUserName(null);
    router.push('/');
  };

  const SEARCH_ITEMS = [
    { title: 'Report Cyber Fraud', url: '/report' },
    { title: 'Track Complaint Status', url: '/track' },
    { title: 'Cyber Safety Do\'s & Don\'ts', url: '/#dos-donts' },
    { title: 'Resources & Publications', url: '/#resources' },
    { title: 'Emergency Helpline 1930', url: 'tel:1930' },
    { title: 'Police LEA Command Center', url: '/police' },
    { title: 'Bank Nodal Portal', url: '/login?role=FINANCIAL_INSTITUTION' },
  ];

  const filteredSearch = SEARCH_ITEMS.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <header className="bg-white border-b-2 border-blue-700 font-sans shadow-sm">
      
      {/* BRANDING HEADER ROW (Screenshot 1 Exact Layout) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* LEFT: Government Logo & Title */}
        <Link href="/" className="flex items-center space-x-3.5 group shrink-0">
          <div className="w-12 h-12 rounded-full border-2 border-blue-700 flex items-center justify-center p-1 bg-white shadow-sm">
            {/* Official Seal Mock / Emblem */}
            <div className="w-full h-full rounded-full bg-blue-700 text-white flex items-center justify-center font-black text-lg">
              🇮🇳
            </div>
          </div>

          <div>
            <span className="text-xl sm:text-2xl font-black text-blue-900 tracking-tight block leading-tight">
              RAKSHA-NET
            </span>
            <span className="text-xs text-slate-700 font-bold block leading-snug">
              Ministry of Home Affairs
            </span>
            <span className="text-[11px] text-slate-500 font-semibold block leading-tight">
              Government of India
            </span>
          </div>
        </Link>

        {/* CENTER: Search Bar (Screenshot 1 Exact Layout) */}
        <div ref={searchRef} className="relative w-full max-w-md hidden md:block">
          <div className="flex rounded-md border border-slate-300 overflow-hidden focus-within:border-blue-700 focus-within:ring-1 focus-within:ring-blue-700">
            <input
              type="text"
              placeholder="Search by keyword or phrase..."
              value={searchQuery}
              onFocus={() => setSearchOpen(true)}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setSearchOpen(true);
              }}
              className="w-full px-3.5 py-2 text-xs text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              onClick={() => setSearchOpen(true)}
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 text-xs font-bold transition-colors shrink-0 flex items-center justify-center"
            >
              Search
            </button>
          </div>

          {/* Autocomplete Dropdown */}
          {searchOpen && searchQuery.trim().length > 0 && (
            <div className="absolute left-0 right-0 top-11 bg-white border border-slate-300 rounded-md shadow-lg z-50 overflow-hidden text-xs">
              {filteredSearch.length > 0 ? (
                <div>
                  {filteredSearch.map((item, idx) => (
                    <Link
                      key={idx}
                      href={item.url}
                      onClick={() => setSearchOpen(false)}
                      className="block px-4 py-2.5 hover:bg-blue-50 text-slate-800 border-b border-slate-100 last:border-0 font-medium"
                    >
                      {item.title}
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="p-3 text-slate-500 text-center font-mono">No matching portal pages found.</div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT: Language Switcher & Sign In Button (Screenshot 1 Exact Layout) */}
        <div className="flex items-center space-x-4 shrink-0">
          
          {/* Language Switcher */}
          <div className="flex items-center text-xs font-semibold text-slate-700">
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-1 rounded transition-all ${
                language === 'en' ? 'text-blue-800 font-extrabold underline' : 'hover:text-blue-700'
              }`}
            >
              English
            </button>
            <span className="text-slate-400">|</span>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-1 rounded transition-all ${
                language === 'hi' ? 'text-blue-800 font-extrabold underline' : 'hover:text-blue-700'
              }`}
            >
              हिन्दी
            </button>
          </div>

          {/* Sign In Button */}
          {token ? (
            <div className="flex items-center space-x-2">
              <span className="px-3 py-1.5 bg-slate-100 border border-slate-300 rounded text-xs font-bold text-slate-800">
                {userName || 'Officer'}
              </span>
              <button
                onClick={handleLogout}
                className="px-2.5 py-1.5 bg-slate-200 hover:bg-red-600 hover:text-white rounded text-xs font-bold transition-all text-slate-700"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="bg-blue-700 hover:bg-blue-800 text-white px-5 py-2 rounded text-xs font-bold transition-colors shadow-sm"
            >
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 text-slate-700 hover:bg-slate-100 rounded"
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

      </div>

      {/* BOTTOM GRAY NAVIGATION STRIP (Screenshot 1 Exact Match) */}
      <div className="bg-slate-800 text-white border-t border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="hidden md:flex items-center space-x-1 py-1 text-xs font-semibold">
            
            <Link
              href="/"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1.5 border-b-2 ${
                pathname === '/' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>🏠 Home</span>
            </Link>

            <Link
              href="/#dos-donts"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/#dos-donts' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Cyber Awareness</span>
            </Link>

            <Link
              href="/report"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/report' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Report Fraud</span>
            </Link>

            <Link
              href="/track"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/track' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Track Complaint</span>
            </Link>

            <Link
              href="/#resources"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/#resources' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Resources</span>
            </Link>

            <Link
              href="/#websites"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/#websites' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Important Websites</span>
            </Link>

            <Link
              href="/#help"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/#help' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Help</span>
            </Link>

            <Link
              href="/#contact"
              className={`px-4 py-2 hover:bg-slate-700 transition-colors flex items-center gap-1 border-b-2 ${
                pathname === '/#contact' ? 'border-amber-400 text-white font-bold bg-slate-700' : 'border-transparent text-slate-200'
              }`}
            >
              <span>Contact</span>
            </Link>

          </nav>
        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-800 text-white px-4 py-3 space-y-2 border-t border-slate-700 text-xs">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700 font-bold">Home</Link>
          <Link href="/#dos-donts" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700">Cyber Awareness</Link>
          <Link href="/report" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700">Report Fraud</Link>
          <Link href="/track" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700">Track Complaint</Link>
          <Link href="/#resources" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700">Resources</Link>
          <Link href="/#websites" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700">Important Websites</Link>
          <Link href="/#contact" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 border-b border-slate-700">Contact</Link>
        </div>
      )}

    </header>
  );
}
