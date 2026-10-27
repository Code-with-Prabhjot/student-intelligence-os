import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, RotateCcw, X } from 'lucide-react';
import { useStudentContext } from '../context/StudentContext';

export default function Toast() {
  const { toast, hideToast } = useStudentContext();

  useEffect(() => {
    if (!toast) return;

    // Toast auto dismisses after 5 seconds
    const timer = setTimeout(() => {
      hideToast();
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast, hideToast]);

  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-rose-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getBorderColor = () => {
    switch (toast.type) {
      case 'success':
        return 'border-emerald-500/40 bg-emerald-950/80 shadow-glow-emerald';
      case 'error':
        return 'border-rose-500/40 bg-rose-950/80 shadow-glow-rose';
      case 'warning':
        return 'border-amber-500/40 bg-amber-950/80';
      default:
        return 'border-blue-500/40 bg-slate-900/90 shadow-glow-blue';
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-300">
      <div className={`p-4 rounded-2xl glass-panel border ${getBorderColor()} shadow-2xl flex items-center gap-3.5 max-w-md`}>
        <div className="flex-shrink-0">{getIcon()}</div>
        
        <p className="text-xs sm:text-sm font-semibold text-white flex-1">
          {toast.message}
        </p>

        {toast.undoCallback && (
          <button
            type="button"
            onClick={() => {
              toast.undoCallback();
              hideToast();
            }}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-emerald-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Undo</span>
          </button>
        )}

        <button
          type="button"
          onClick={hideToast}
          className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
