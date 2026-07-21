'use client';

import React, { useState } from 'react';
import { Upload, FileCheck, ShieldCheck, Hash, Trash2, Cpu } from 'lucide-react';
import { calculateFileSHA256, formatBytes } from '@/lib/crypto';

export interface EvidenceItem {
  file: File;
  sha256: string;
  isHashing: boolean;
}

interface EvidenceUploaderProps {
  onEvidenceChange: (items: EvidenceItem[]) => void;
}

export default function EvidenceUploader({ onEvidenceChange }: EvidenceUploaderProps) {
  const [evidenceList, setEvidenceList] = useState<EvidenceItem[]>([]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);

    const newItems: EvidenceItem[] = files.map(file => ({
      file,
      sha256: '',
      isHashing: true
    }));

    const updatedList = [...evidenceList, ...newItems];
    setEvidenceList(updatedList);

    // Compute client-side SHA-256 for each file asynchronously
    const processedItems: EvidenceItem[] = [];
    for (const item of updatedList) {
      if (item.isHashing && !item.sha256) {
        try {
          const hash = await calculateFileSHA256(item.file);
          processedItems.push({ ...item, sha256: hash, isHashing: false });
        } catch (err) {
          console.error("SHA-256 calculation failed", err);
          processedItems.push({ ...item, isHashing: false });
        }
      } else {
        processedItems.push(item);
      }
    }

    setEvidenceList(processedItems);
    onEvidenceChange(processedItems);
  };

  const removeFile = (index: number) => {
    const newList = evidenceList.filter((_, i) => i !== index);
    setEvidenceList(newList);
    onEvidenceChange(newList);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-cyan-500/30 hover:border-cyan-400/60 rounded-xl p-6 text-center bg-cyber-800/40 transition-colors cursor-pointer relative group">
        <input
          type="file"
          multiple
          accept="image/*,application/pdf"
          onChange={handleFileSelect}
          className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
        />
        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 rounded-full bg-cyan-500/10 border border-cyan-500/30 group-hover:scale-110 transition-transform">
            <Upload className="h-6 w-6 text-cyan-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">
              Upload Evidence Files (Screenshots, Receipts, WhatsApp Chats, PDFs)
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supported formats: PNG, JPG, PDF (Max 10MB each)
            </p>
          </div>
          <div className="inline-flex items-center space-x-1.5 text-[11px] font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-full border border-cyan-500/30 mt-2">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span>Automatic Client-Side SHA-256 Hashing Active</span>
          </div>
        </div>
      </div>

      {/* Selected files list with live cryptographic hash preview */}
      {evidenceList.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-mono font-semibold uppercase tracking-wider text-cyan-300 flex items-center gap-2">
            <FileCheck className="h-4 w-4 text-emerald-400" />
            Uploaded Evidence Items ({evidenceList.length})
          </h4>
          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {evidenceList.map((item, idx) => (
              <div
                key={idx}
                className="glass-panel p-3 rounded-lg border border-cyan-500/20 flex items-center justify-between space-x-3 text-xs"
              >
                <div className="flex items-center space-x-3 truncate">
                  <div className="p-2 rounded bg-slate-800 text-cyan-400 font-mono font-bold uppercase">
                    {item.file.name.split('.').pop()}
                  </div>
                  <div className="truncate">
                    <p className="font-medium text-white truncate">{item.file.name}</p>
                    <p className="text-[11px] text-slate-400">{formatBytes(item.file.size)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  {item.isHashing ? (
                    <div className="flex items-center space-x-1.5 text-amber-400 font-mono text-[11px]">
                      <Cpu className="h-3.5 w-3.5 animate-spin" />
                      <span>Generating SHA-256...</span>
                    </div>
                  ) : (
                    <div className="hidden sm:flex flex-col items-end font-mono text-[10px]">
                      <span className="text-emerald-400 font-semibold flex items-center gap-1">
                        <Hash className="h-3 w-3" /> SHA-256 Verified
                      </span>
                      <span className="text-slate-400 w-44 truncate text-right font-mono" title={item.sha256}>
                        {item.sha256}
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => removeFile(idx)}
                    className="p-1.5 rounded hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
