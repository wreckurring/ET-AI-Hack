'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error in UI Boundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="glass-panel p-8 rounded-2xl border border-red-500/40 text-center max-w-md space-y-4 bg-cyber-950">
            <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-2xl w-fit mx-auto text-red-400">
              <ShieldAlert className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-white">Application Exception Intercepted</h3>
            <p className="text-xs text-slate-400 font-mono">
              An unexpected UI error occurred. The technical trace has been logged for security audit.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold text-xs font-mono flex items-center justify-center gap-2 mx-auto"
            >
              <RefreshCw className="h-4 w-4" /> Reload System Interface
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
