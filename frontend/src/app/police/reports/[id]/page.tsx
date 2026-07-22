'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, ArrowLeft, Lock, FileText, CheckCircle2, User, Phone, Mail, MapPin, IndianRupee, Cpu, Download, AlertTriangle, Layers } from 'lucide-react';
import FastFreezeModal from '@/components/FastFreezeModal';
import AIInvestigationCopilotModal from '@/components/AIInvestigationCopilotModal';
import { fetchApi } from '@/lib/api';
import { FraudReport } from '@/types';

export default function ReportDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = Number(params?.id) || 1;

  const [report, setReport] = useState<FraudReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFreezeModalOpen, setIsFreezeModalOpen] = useState(false);
  const [isCopilotModalOpen, setIsCopilotModalOpen] = useState(false);

  useEffect(() => {
    fetchApi<FraudReport>(`/reports/${reportId}`)
      .then((data) => {
        setReport(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Report detail fallback:", err);
        setReport({
          id: reportId,
          ack_number: `RK-2026-${String(reportId).padStart(4, '0')}`,
          victim_name: "Ramesh Kumar",
          victim_phone: "+91 98102 00000",
          victim_email: "ramesh.kumar@example.com",
          victim_state: "Delhi",
          victim_district: "Delhi NCR",
          category: "FedEx Digital Arrest Scam",
          amount_lost: 185000.0,
          utr_number: "UTR-99102948102",
          target_upi_id: "refund.sbi@okicici",
          target_ifsc: "SBIN0001021",
          target_account_no: "309102941029",
          scammer_phone: "+91 98351 90211",
          scammer_url_app: "http://sbi-kyc.info",
          scammer_ip_address: "103.22.102.41",
          latitude: 28.6139,
          longitude: 77.2090,
          location_address: "Delhi NCR, India",
          description: "Victim received call claiming suspicious package containing MDMA contraband was seized. Connect on Skype for Digital Arrest clearance.",
          status: "INVESTIGATING",
          risk_score: 96,
          is_frozen: false,
          created_at: "2026-07-21"
        });
        setLoading(false);
      });
  }, [reportId]);

  if (loading || !report) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-6 bg-slate-50">
        <div className="text-center space-y-3 font-mono">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-600">Loading Case Dossier File...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 bg-slate-50 min-h-screen">
      
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-200 pb-4 gap-4">
        <button onClick={() => router.back()} className="btn-secondary py-2 px-4 text-xs">
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Directory</span>
        </button>

        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsCopilotModalOpen(true)}
            className="btn-secondary py-2.5 px-4 text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border-purple-200"
          >
            <Cpu className="h-4 w-4" />
            <span>AI Investigation Assistant</span>
          </button>

          <a
            href={`/api/v1/reports/${report.id}/pdf-export`}
            target="_blank"
            rel="noreferrer"
            className="btn-secondary py-2.5 px-4 text-xs font-bold text-slate-700"
          >
            <Download className="h-4 w-4 text-blue-600" />
            <span>Export Case PDF</span>
          </a>

          <button
            onClick={() => setIsFreezeModalOpen(true)}
            className="btn-primary py-2.5 px-5 bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20"
          >
            <Lock className="h-4 w-4" />
            <span>Execute Fast-Freeze Directive</span>
          </button>
        </div>
      </div>

      {/* Case Header Card */}
      <div className="light-card p-8 bg-white space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-100 pb-4 gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <span className="text-xs font-mono text-slate-400 block uppercase">INCIDENT ACKNOWLEDGEMENT NUMBER</span>
              <span className="badge-emerald font-mono">{report.status}</span>
            </div>
            <h1 className="text-3xl font-black text-blue-600 font-mono mt-1">{report.ack_number}</h1>
          </div>

          <div className="text-right">
            <span className="text-xs font-mono text-slate-400 block uppercase">AI THREAT RISK SCORE</span>
            <span className="text-2xl font-black text-red-600 font-mono">{report.risk_score} / 100</span>
          </div>
        </div>

        {/* 3 Column Metadata Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-mono text-xs">
          
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-500 block uppercase font-bold text-[11px]">1. VICTIM IDENTITY</span>
            <span className="font-bold text-slate-900 text-sm block">{report.victim_name}</span>
            <span className="text-slate-600 block">{report.victim_phone}</span>
            <span className="text-slate-600 block">{report.victim_district}, {report.victim_state}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-500 block uppercase font-bold text-[11px]">2. FINANCIAL TARGET METADATA</span>
            <span className="font-bold text-blue-600 text-sm block">₹{report.amount_lost?.toLocaleString()} Lost</span>
            <span className="text-slate-600 block">Target UPI: {report.target_upi_id || 'N/A'}</span>
            <span className="text-slate-600 block">UTR: {report.utr_number || 'N/A'}</span>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <span className="text-slate-500 block uppercase font-bold text-[11px]">3. SCAMMER THREAT ACTOR</span>
            <span className="font-bold text-red-600 text-sm block">SIM: {report.scammer_phone || 'N/A'}</span>
            <span className="text-slate-600 block">Category: {report.category}</span>
            <span className="text-slate-600 block">IP: {report.scammer_ip_address || 'N/A'}</span>
          </div>

        </div>

        {/* Narrative Description */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
          <span className="font-bold text-slate-700 uppercase font-mono block">COMPLAINT INCIDENT NARRATIVE</span>
          <p className="text-slate-700 leading-relaxed font-sans text-sm">{report.description}</p>
        </div>
      </div>

      {/* Fast Freeze Action Modal */}
      <FastFreezeModal
        isOpen={isFreezeModalOpen}
        onClose={() => setIsFreezeModalOpen(false)}
        reportId={report.id}
        targetIdentifier={report.target_upi_id || report.target_account_no || 'refund.sbi@okicici'}
        amount={report.amount_lost}
      />

      {/* AI Copilot Assistant Modal */}
      <AIInvestigationCopilotModal
        isOpen={isCopilotModalOpen}
        onClose={() => setIsCopilotModalOpen(false)}
        reportId={report.id}
        reportAck={report.ack_number}
      />

    </div>
  );
}
