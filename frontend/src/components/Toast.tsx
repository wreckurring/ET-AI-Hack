'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastProps {
  id?: string;
  type?: 'success' | 'error' | 'info';
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ type = 'info', message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const styles = {
    success: 'bg-emerald-950/90 text-emerald-300 border-emerald-500/50',
    error: 'bg-red-950/90 text-red-300 border-red-500/50',
    info: 'bg-cyan-950/90 text-cyan-300 border-cyan-500/50'
  };

  const icons = {
    success: <CheckCircle2 className="h-5 w-5 text-emerald-400" />,
    error: <AlertCircle className="h-5 w-5 text-red-400" />,
    info: <Info className="h-5 w-5 text-cyan-400" />
  };

  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center space-x-3 px-4 py-3 rounded-xl border backdrop-blur-md shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-w-md ${styles[type]}`}>
      {icons[type]}
      <p className="text-xs font-mono font-medium flex-1">{message}</p>
      <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
