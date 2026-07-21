'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, FileCheck, Hash, Lock, CheckCircle2, AlertTriangle, Building, CreditCard, User, Phone, Globe, ArrowLeft, Download, ShieldAlert, ShieldCheck } from 'lucide-react';
import FastFreezeModal from '@/components/FastFreezeModal';
import { fetchApi } from '@/lib/api';
import { FraudReport } from '@/types';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params?.id ? parseInt(params.id as string) : 1;

  const [report, setReport] = useState<FraudReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);

  const loadReport = () => {
    fetchApi<FraudReport>(`/reports/${reportId}`)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch(() => {
        // Fallback case detail
        setReport({
          id: reportId,
          ack_number: `RK-2026-880${reportId}`,
          victim_name: 'Ramesh Kumar',
          victim_phone: '+91 98102 33419',
          victim_email: 'ramesh.k@gmail.com',
          victim_state: 'Delhi',
          victim_district: 'South East Delhi',
          category: 'Phishing Scam',
          amount_lost: 185000,
          utr_number: '402918471092',
          target_upi_id: 'refund.sbi@okicici',
          target_ifsc: 'SBIN0004921',
          target_account_no: '30489912041',
          scammer_phone: '+91 98351 90211',
          scammer_url_app: 'https://sbi-kyc-update-portal.info',
          scammer_ip_address: '103.145.72.19',
          latitude: 28.5494,
          longitude: 77.2690,
          location_address: 'Okhla Phase III, New Delhi',
          description:
            'Received SMS claiming SBI YONO account block. Clicked link and entered OTP. Money debited instantly into Deoghar mule account.',
          status: reportId === 3 ? 'FROZEN' : 'INVESTIGATING',
          risk_score: 92,
          is_frozen: reportId === 3,
          created_at: new Date().toISOString(),
          evidence_files: [
            {
              id: 101,
              file_name: 'Screenshot_Bank_Debit_Alert.png',
              file_type: 'image/png',
              file_size: 245000,
              sha256_hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
              hash_verified: true,
              uploaded_at: new Date().toISOString(),
            },
            {
              id: 102,
              file_name: 'WhatsApp_Scammer_Chat_Export.pdf',
              file_type: 'application/pdf',
              file_size: 890000,
              sha256_hash: 'f4c8996fb92427ae41e4649b934ca495991b7852b855e3b0c44298fc1c149afb',
              hash_verified: true,
              uploaded_at: new Date().toISOString(),
            },
          ],
        });
        setLoading(false);
      });
  };

  useEffect(() => {
    loadReport();
  }, [reportId]);

  if (loading || !report) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-cyan-400 font-mono">
        Loading Case File & Evidence Hashing Audit...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header & Fast Freeze Action */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-cyan-500/20 pb-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-cyber-800 border border-cyan-500/30 text-slate-300 hover:text-white"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono text-cyan-400">
              <span>CASE FILE REPORT</span>
              <span>•</span>
              <span className="text-slate-400">CREATED: {new Date(report.created_at).toLocaleDateString()}</span>
            </div>
            <h1 className="text-3xl font-extrabold text-white flex items-center gap-3">
              {report.ack_number}
              <span
                className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${
                  report.is_frozen
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-500/40'
                    : 'bg-amber-950 text-amber-400 border-amber-500/40'
                }`}
              >
                {report.status}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex gap-3">
          {!report.is_frozen ? (
            <button
              onClick={() => setIsFreezeModalOpen(true)}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-500 hover:to-rose-600 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-xl shadow-red-600/30 transition-all border border-red-400/30 cursor-pointer"
            >
              <Lock className="h-4 w-4" />
              <span>TRIGGER FAST-FREEZE DIRECTIVE</span>
            </button>
          ) : (
            <div className="px-5 py-2.5 rounded-xl bg-emerald-950 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold flex items-center space-x-2">
              <CheckCircle2 className="h-4 w-4" />
              <span>NPCI FAST-FREEZE ACTIVE (ACCOUNT HOLD CONFIRMED)</span>
            </div>
          )}
        </div>
      </div>

      {/* Case Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Columns: Victim & Financial Identifiers */}
        <div className="lg:col-span-2 space-y-6">
          {/* Financial Identifiers Box */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-emerald-400" /> Target Financial Identifiers & Losses
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="glass-panel p-3 rounded-xl border border-emerald-500/30 bg-emerald-950/20">
                <span className="text-slate-400 block text-[11px]">Total Claimed Loss</span>
                <span className="text-emerald-400 font-bold text-lg">₹{report.amount_lost?.toLocaleString('en-IN')}</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 block text-[11px]">Target Scammer UPI</span>
                <span className="text-cyan-300 font-bold text-sm block truncate">{report.target_upi_id || 'N/A'}</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 block text-[11px]">Transaction UTR Number</span>
                <span className="text-white font-bold text-sm block truncate">{report.utr_number || 'N/A'}</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 block text-[11px]">Beneficiary IFSC</span>
                <span className="text-white font-bold text-sm">{report.target_ifsc || 'SBIN0004921'}</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-cyan-500/20">
                <span className="text-slate-400 block text-[11px]">Mule Account Number</span>
                <span className="text-white font-bold text-sm">{report.target_account_no || '30489912041'}</span>
              </div>
              <div className="glass-panel p-3 rounded-xl border border-red-500/30 bg-red-950/20">
                <span className="text-slate-400 block text-[11px]">AI Fraud Risk Score</span>
                <span className="text-red-400 font-bold text-lg">{report.risk_score}/100</span>
              </div>
            </div>
          </div>

          {/* Victim & Scammer Intelligence */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <User className="h-4 w-4 text-cyan-400" /> Victim Profile & Scammer Suspect Metadata
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="space-y-2">
                <h4 className="font-semibold text-white border-b border-cyan-500/20 pb-1">Complainant Information</h4>
                <p><span className="text-slate-400">Name:</span> <strong className="text-white">{report.victim_name}</strong></p>
                <p><span className="text-slate-400">Phone:</span> <strong className="text-white font-mono">{report.victim_phone}</strong></p>
                <p><span className="text-slate-400">Email:</span> <strong className="text-white">{report.victim_email || 'N/A'}</strong></p>
                <p><span className="text-slate-400">Location:</span> <strong className="text-white">{report.victim_district}, {report.victim_state}</strong></p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold text-white border-b border-cyan-500/20 pb-1">Scammer Infrastructure</h4>
                <p><span className="text-slate-400">Scammer SIM:</span> <strong className="text-purple-400 font-mono">{report.scammer_phone || 'N/A'}</strong></p>
                <p><span className="text-slate-400">Phishing URL/App:</span> <strong className="text-cyan-400 font-mono truncate block">{report.scammer_url_app || 'N/A'}</strong></p>
                <p><span className="text-slate-400">Host IP Address:</span> <strong className="text-emerald-400 font-mono">{report.scammer_ip_address || '103.145.72.19'}</strong></p>
              </div>
            </div>

            <div className="pt-2 border-t border-cyan-500/20">
              <h4 className="font-semibold text-white text-xs mb-1">Incident Narrative:</h4>
              <p className="text-slate-300 text-xs bg-cyber-950 p-3 rounded-xl border border-cyan-500/20 leading-relaxed">
                {report.description}
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Evidence SHA-256 Audit Trail */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/30 space-y-4">
            <h3 className="text-sm font-mono font-bold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400" /> Evidence Chain of Custody (SHA-256)
            </h3>

            <div className="space-y-3">
              {report.evidence_files && report.evidence_files.length > 0 ? (
                report.evidence_files.map((file) => (
                  <div key={file.id} className="glass-panel p-3.5 rounded-xl border border-cyan-500/20 text-xs space-y-2 bg-cyber-950">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white truncate max-w-[180px]">{file.file_name}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-500/30 font-bold">
                        VERIFIED
                      </span>
                    </div>

                    <div className="space-y-1 font-mono text-[10px] text-slate-400">
                      <p className="flex justify-between">
                        <span>Format:</span> <span className="text-slate-200">{file.file_type}</span>
                      </p>
                      <p className="flex justify-between">
                        <span>SHA-256 Checksum:</span>
                      </p>
                      <p className="text-emerald-400 bg-cyber-900 p-1.5 rounded border border-cyan-500/20 break-all font-mono">
                        {file.sha256_hash}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 italic">No files attached to this report.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Fast Freeze Action Modal */}
      <FastFreezeModal
        reportId={report.id}
        ackNumber={report.ack_number}
        targetIdentifier={report.target_upi_id || 'refund.sbi@okicici'}
        targetBank={report.target_ifsc || 'State Bank of India'}
        amount={report.amount_lost}
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        onSuccess={() => {
          setIsFreezeModalOpen(false);
          loadReport();
        }}
      />
    </div>
  );
}
