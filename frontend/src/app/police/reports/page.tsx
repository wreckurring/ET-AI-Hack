'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Filter, FileText, Lock, ShieldAlert, ArrowUpDown, Download, ArrowRight } from 'lucide-react';
import { fetchApi } from '@/lib/api';
import { FraudReport } from '@/types';

export default function ReportsDirectoryPage() {
  const [reports, setReports] = useState<FraudReport[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);

  const exportToCSV = () => {
    if (!reports || reports.length === 0) return;
    const headers = ["ACK Number", "Victim Name", "Victim Phone", "Category", "Amount Lost (INR)", "Target UPI", "Scammer Phone", "Risk Score", "Status", "Date"];
    const rows = reports.map(r => [
      r.ack_number,
      `"${r.victim_name}"`,
      r.victim_phone,
      `"${r.category}"`,
      r.amount_lost,
      r.target_upi_id || "",
      r.scammer_phone || "",
      r.risk_score,
      r.status,
      r.created_at
    ]);

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows.map(e => e.join(","))].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `UNDERTOW_REPORT_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    fetchApi<FraudReport[]>('/reports')
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.warn("Reports directory fallback:", err);
        setReports([
          { id: 1, ack_number: "RK-2026-8801", victim_name: "Ramesh Kumar", victim_phone: "+91 98102 00000", victim_state: "Jharkhand", victim_district: "Jamtara", category: "Phishing Scam", amount_lost: 4850000.0, target_upi_id: "refund.sbi@okicici", scammer_phone: "+91 98351 90211", description: "Fake bank call", status: "INVESTIGATING", risk_score: 98, is_frozen: false, created_at: "2026-07-20" },
          { id: 2, ack_number: "RK-2026-8802", victim_name: "Anita Sharma", victim_phone: "+91 97182 11029", victim_state: "Haryana", victim_district: "Mewat", category: "OLX Fake Army Officer", amount_lost: 3210000.0, target_upi_id: "army.pay@icici", scammer_phone: "+91 97182 44102", description: "OLX advance payment", status: "NEW", risk_score: 92, is_frozen: false, created_at: "2026-07-20" },
          { id: 3, ack_number: "RK-2026-8803", victim_name: "Vikram Malhotra", victim_phone: "+91 99104 88201", victim_state: "Delhi", victim_district: "Delhi NCR", category: "FedEx Digital Arrest Scam", amount_lost: 9540000.0, target_upi_id: "verify.customs@axisbank", scammer_phone: "+91 88261 00293", description: "CBI Skype threat", status: "FROZEN", risk_score: 96, is_frozen: true, created_at: "2026-07-21" }
        ]);
        setLoading(false);
      });
  }, []);

  const filteredReports = reports.filter((r) => {
    const matchesSearch =
      r.ack_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.victim_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.target_upi_id && r.target_upi_id.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.scammer_phone && r.scammer_phone.includes(searchQuery));

    const matchesStatus = statusFilter === 'ALL' || r.status === statusFilter;
    const matchesCategory = categoryFilter === 'ALL' || r.category === categoryFilter;

    return matchesSearch && matchesStatus && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 bg-slate-50 min-h-screen">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 pb-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Cyber Crime Incident Directory</h1>
          <p className="text-xs text-slate-600">
            Real-time searchable database of all reported cyber crime complaints across Indian LEAs.
          </p>
        </div>

        <button onClick={exportToCSV} className="btn-secondary py-2.5 px-4 font-mono text-xs">
          <Download className="h-4 w-4 text-emerald-600" />
          <span>Export Directory (CSV)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="light-card p-4 bg-white grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by ACK Number, Victim Name, Target UPI ID, or Scammer Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="light-input pl-10"
            />
          </div>
        </div>

        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="light-input"
          >
            <option value="ALL">All Incident Statuses</option>
            <option value="NEW">NEW</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="FROZEN">FROZEN (Account Hold)</option>
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="light-input"
          >
            <option value="ALL">All Scam Categories</option>
            <option value="Phishing Scam">Phishing Scam</option>
            <option value="FedEx Digital Arrest Scam">Digital Arrest Scam</option>
            <option value="OLX Fake Army Officer">OLX QR Fraud</option>
            <option value="Telegram Investment Scam">Telegram Investment</option>
          </select>
        </div>
      </div>

      {/* Fraud Reports Directory Table */}
      <div className="light-card bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase font-mono">
              <tr>
                <th className="py-3.5 px-4">ACK Reference</th>
                <th className="py-3.5 px-4">Complainant / Victim</th>
                <th className="py-3.5 px-4">Category</th>
                <th className="py-3.5 px-4 text-right">Amount Lost</th>
                <th className="py-3.5 px-4">Target UPI ID</th>
                <th className="py-3.5 px-4">Scammer Phone</th>
                <th className="py-3.5 px-4 text-center">Risk Score</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-blue-600">
                    {report.ack_number}
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-bold text-slate-900 block">{report.victim_name}</span>
                    <span className="text-[11px] text-slate-500 font-mono">{report.victim_district}, {report.victim_state}</span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">{report.category}</td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900">
                    ₹{report.amount_lost?.toLocaleString()}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {report.target_upi_id || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-slate-600">
                    {report.scammer_phone || 'N/A'}
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
                      report.risk_score >= 90 ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {report.risk_score}/100
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-center">
                    <span className={`px-2.5 py-1 rounded-full font-mono text-[11px] font-bold ${
                      report.status === 'FROZEN' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                    }`}>
                      {report.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <Link
                      href={`/police/reports/${report.id}`}
                      className="px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-lg font-bold transition-colors inline-flex items-center gap-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
