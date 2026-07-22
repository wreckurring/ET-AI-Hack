'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Shield, AlertTriangle, FileText, Map, BarChart2, Cpu, PhoneCall, UserCheck, LogOut, ChevronDown, Menu, X, Building2, User, Landmark, Lock, HelpCircle } from 'lucide-react';
import AIScamDetectorModal from './AIScamDetectorModal';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [token, setToken] = useState<string | null>(null);
  const [userName, setUserName] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [isScamModalOpen, setIsScamModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedToken = localStorage.getItem('token');
      const storedName = localStorage.getItem('user_name');
      const storedRole = localStorage.getItem('user_role');
      setToken(storedToken);
      setUserName(storedName);
      setUserRole(storedRole);
    }
  }, [pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_name');
    localStorage.removeItem('user_role');
    setToken(null);
    setUserName(null);
    setUserRole(null);
    router.push('/');
  };

  const handleCategorySelect = (rolePath: string) => {
    setIsAuthModalOpen(false);
    router.push(`/login?role=${rolePath}`);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm">
      {/* Official Government Top Bar */}
      <div className="bg-slate-900 text-white py-1.5 px-4 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <span className="flex items-center gap-1.5 font-semibold text-blue-300">
              <Shield className="h-3.5 w-3.5 text-blue-400" />
              RAKSHA-NET • National Cyber Fraud Operations Portal
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:inline text-slate-300">Ministry of Home Affairs & I4C Cyber Directorate</span>
          </div>

          <div className="flex items-center space-x-4">
            <a href="tel:1930" className="flex items-center gap-1.5 text-amber-300 hover:text-amber-200 font-bold">
              <PhoneCall className="h-3.5 w-3.5" />
              <span>National Helpline: 1930</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Platform Title */}
          <Link href="/" className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/20">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 flex items-center gap-1.5">
                RAKSHA<span className="text-blue-600">-NET</span>
              </span>
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest block -mt-1 font-semibold">
                Cyber Crime Intelligence
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                pathname === '/' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              Home
            </Link>

            <Link
              href="/report"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/report' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
              <span>Report Cyber Fraud</span>
            </Link>

            <Link
              href="/track"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/track' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <FileText className="h-3.5 w-3.5 text-slate-500" />
              <span>Track Complaint</span>
            </Link>

            <Link
              href="/police/hotspots"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/police/hotspots' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <Map className="h-3.5 w-3.5 text-blue-600" />
              <span>Hotspot Map</span>
            </Link>

            <Link
              href="/police/analytics"
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                pathname === '/police/analytics' ? 'bg-blue-50 text-blue-700' : 'text-slate-600 hover:text-blue-600 hover:bg-slate-50'
              }`}
            >
              <BarChart2 className="h-3.5 w-3.5 text-emerald-600" />
              <span>Analytics</span>
            </Link>

            <button
              onClick={() => setIsScamModalOpen(true)}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-all flex items-center gap-1.5"
            >
              <Cpu className="h-3.5 w-3.5 text-blue-600 animate-pulse" />
              <span>AI Scam Analyzer</span>
            </button>

            {token && (
              <Link
                href="/police"
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  pathname === '/police' ? 'bg-blue-600 text-white shadow-sm' : 'text-blue-700 bg-blue-50 hover:bg-blue-100'
                }`}
              >
                <Shield className="h-3.5 w-3.5" />
                <span>Command Center</span>
              </Link>
            )}
          </nav>

          {/* Top-Right Action / Category Login Modal Launcher */}
          <div className="hidden lg:flex items-center space-x-3">
            {token ? (
              <div className="flex items-center space-x-2">
                <span className="px-3 py-1.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <UserCheck className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{userName || 'Officer'}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsAuthModalOpen(true)}
                className="btn-primary"
              >
                <Lock className="h-4 w-4" />
                <span>Sign In / Portal Access</span>
              </button>
            )}
          </div>

          {/* Mobile Hamburger Menu Button */}
          <div className="lg:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-slate-700 hover:bg-slate-100 rounded-xl transition-all"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          <Link
            href="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Home
          </Link>
          <Link
            href="/report"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Report Cyber Fraud
          </Link>
          <Link
            href="/track"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Track Complaint
          </Link>
          <Link
            href="/police/hotspots"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Hotspot Map
          </Link>
          <Link
            href="/police/analytics"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block px-3 py-2.5 rounded-xl text-sm font-bold text-slate-800 hover:bg-slate-50"
          >
            Analytics
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              setIsScamModalOpen(true);
            }}
            className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-bold text-blue-600 hover:bg-blue-50"
          >
            AI Scam Analyzer
          </button>
          {!token && (
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className="w-full btn-primary justify-center mt-2"
            >
              Sign In / Portal Access
            </button>
          )}
        </div>
      )}

      {/* Category Sign In Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl border border-slate-200 p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setIsAuthModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-1">
              <div className="p-3 rounded-2xl bg-blue-50 text-blue-600 w-fit mx-auto border border-blue-100">
                <Shield className="h-7 w-7" />
              </div>
              <h3 className="text-xl font-extrabold text-slate-900">Select Portal Access Category</h3>
              <p className="text-xs text-slate-500">
                Choose your official user category to proceed to authentication
              </p>
            </div>

            <div className="space-y-2.5">
              <button
                onClick={() => handleCategorySelect('CITIZEN')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-center space-x-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-blue-100 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                  <User className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Citizen Portal</h4>
                  <p className="text-xs text-slate-500">Public complaint submission & incident tracking</p>
                </div>
              </button>

              <button
                onClick={() => handleCategorySelect('POLICE_OFFICER')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-center space-x-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-indigo-100 text-indigo-700 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                  <Shield className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Police Officer</h4>
                  <p className="text-xs text-slate-500">Law enforcement command center & Fast-Freeze hold</p>
                </div>
              </button>

              <button
                onClick={() => handleCategorySelect('FINANCIAL_INSTITUTION')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-center space-x-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-emerald-100 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <Landmark className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Financial Institution</h4>
                  <p className="text-xs text-slate-500">NPCI nodal bank desk & interbank account holds</p>
                </div>
              </button>

              <button
                onClick={() => handleCategorySelect('CYBER_CELL')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-center space-x-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Cyber Crime Cell</h4>
                  <p className="text-xs text-slate-500">State & National Cyber Crime Coordination Centre</p>
                </div>
              </button>

              <button
                onClick={() => handleCategorySelect('ADMIN')}
                className="w-full p-3.5 rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition-all text-left flex items-center space-x-3.5 group"
              >
                <div className="p-2.5 rounded-lg bg-slate-100 text-slate-700 group-hover:bg-slate-800 group-hover:text-white transition-colors">
                  <Lock className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Administrator</h4>
                  <p className="text-xs text-slate-500">System infrastructure & security policy control</p>
                </div>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI Scam Analyzer Modal */}
      <AIScamDetectorModal
        isOpen={isScamModalOpen}
        onClose={() => setIsScamModalOpen(false)}
      />
    </header>
  );
}
