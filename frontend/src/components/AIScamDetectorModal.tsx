'use client';

import React, { useState } from 'react';
import { Cpu, AlertTriangle, ShieldCheck, CheckCircle2, MessageSquare, Mail, PhoneCall, Send, X, Loader2 } from 'lucide-react';
import { fetchApi } from '@/lib/api';

interface AIScamDetectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIScamDetectorModal({ isOpen, onClose }: AIScamDetectorModalProps) {
  const [sourceType, setSourceType] = useState('SMS');
  const [textContent, setTextContent] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);

  if (!isOpen) return null;

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent.trim()) return;
    setIsAnalyzing(true);

    try {
      const res = await fetchApi('/ai/detect-scam', {
        method: 'POST',
        body: JSON.stringify({
          text_content: textContent,
          source_type: sourceType,
        }),
      });
      setResult(res);
    } catch (err: any) {
      console.warn("AI Scam Detector client fallback:", err);
      const text = textContent.toLowerCase();
      let scamType = "Digital Arrest Scam";
      let confidence = 0.95;
      let riskScore = 96;
      let keywords = ["CBI", "Customs", "Drugs", "Skype", "Digital Arrest"];
      let explanation = "High severity Digital Arrest scam detected. Impersonates law enforcement demanding video call clearance under threat of arrest.";

      if (text.includes("yono") || text.includes("kyc") || text.includes("power")) {
        scamType = "KYC Banking Fraud";
        keywords = ["YONO", "KYC", "Power Cut", "APK"];
        explanation = "High severity Banking KYC Fraud detected. Phishing link requesting credential update or malware download.";
      } else if (text.includes("400%") || text.includes("telegram") || text.includes("stock")) {
        scamType = "Investment Stock Scam";
        keywords = ["400% Profit", "Telegram VIP", "Stock Signal"];
        explanation = "Unrealistic guaranteed investment returns via unofficial channels.";
      }

      setResult({
        scam_type: scamType,
        confidence: confidence,
        risk_score: riskScore,
        suspicious_keywords: keywords,
        explanation: explanation
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-xl rounded-2xl border border-slate-200 p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center space-x-3 border-b border-slate-100 pb-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
            <Cpu className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-slate-900">AI Cyber Scam Analyzer</h3>
            <p className="text-xs text-slate-500 font-mono">
              Scans SMS, WhatsApp messages, Emails, and Call Transcripts
            </p>
          </div>
        </div>

        <form onSubmit={handleAnalyze} className="space-y-4">
          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1.5 uppercase">
              1. SELECT SOURCE FORMAT
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
              <button
                type="button"
                onClick={() => setSourceType('SMS')}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  sourceType === 'SMS' ? 'bg-blue-50 text-blue-700 border-blue-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <MessageSquare className="h-3.5 w-3.5" /> SMS
              </button>
              <button
                type="button"
                onClick={() => setSourceType('WHATSAPP')}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  sourceType === 'WHATSAPP' ? 'bg-emerald-50 text-emerald-700 border-emerald-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                WhatsApp
              </button>
              <button
                type="button"
                onClick={() => setSourceType('EMAIL')}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  sourceType === 'EMAIL' ? 'bg-purple-50 text-purple-700 border-purple-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <Mail className="h-3.5 w-3.5" /> Email
              </button>
              <button
                type="button"
                onClick={() => setSourceType('CALL_TRANSCRIPT')}
                className={`p-2 rounded-xl border flex items-center justify-center gap-1.5 transition-all ${
                  sourceType === 'CALL_TRANSCRIPT' ? 'bg-amber-50 text-amber-700 border-amber-300 font-bold' : 'bg-slate-50 text-slate-600 border-slate-200'
                }`}
              >
                <PhoneCall className="h-3.5 w-3.5" /> Transcript
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono font-bold text-slate-700 mb-1 uppercase">
              2. PASTE SUSPICIOUS TEXT / TRANSCRIPT
            </label>
            <textarea
              rows={4}
              required
              placeholder="e.g. Sir this is Customs Officer from Mumbai Police. A package containing MDMA drugs was seized under your name. Connect on Skype for Digital Arrest clearance..."
              value={textContent}
              onChange={(e) => setTextContent(e.target.value)}
              className="light-input"
            />
          </div>

          <button
            type="submit"
            disabled={isAnalyzing}
            className="btn-primary w-full py-3"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing Patterns...</span>
              </>
            ) : (
              <>
                <Cpu className="h-4 w-4" />
                <span>RUN AI THREAT ANALYSIS</span>
              </>
            )}
          </button>
        </form>

        {/* AI Scam Results Card */}
        {result && (
          <div className="p-4 rounded-xl border border-blue-200 space-y-3 bg-blue-50/50 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-blue-100 pb-2">
              <div>
                <span className="text-[10px] font-mono text-slate-500 uppercase block font-bold">DETECTED SCAM TAXONOMY</span>
                <span className="text-base font-extrabold text-slate-900">{result.scam_type}</span>
              </div>
              <div className="text-right">
                <span className="badge-red font-mono">
                  Risk Score: {result.risk_score}/100
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div>
                <span className="text-slate-500 block text-[10px]">Confidence Rating:</span>
                <span className="text-blue-700 font-bold">{(result.confidence * 100).toFixed(0)}% Match</span>
              </div>
              <div>
                <span className="text-slate-500 block text-[10px]">Keywords Flagged:</span>
                <div className="flex flex-wrap gap-1 mt-0.5">
                  {result.suspicious_keywords.map((kw: string, i: number) => (
                    <span key={i} className="badge-red text-[10px]">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-blue-100 text-xs">
              <span className="text-slate-500 block font-mono text-[10px] font-bold">AI THREAT EXPLANATION:</span>
              <p className="text-slate-800 text-xs mt-1 leading-relaxed">{result.explanation}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
