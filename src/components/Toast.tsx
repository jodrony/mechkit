import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, Info, X } from 'lucide-react';

interface ToastMessage {
  id: number;
  text: string;
  type?: 'info' | 'success' | 'warning';
}

interface ToastContextType {
  showToast: (text: string, type?: 'info' | 'success' | 'warning') => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    // Graceful fallback if invoked outside provider
    return {
      showToast: (text: string) => {
        if (typeof window !== 'undefined') {
          console.log('[Toast]', text);
        }
      },
    };
  }
  return context;
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = useCallback((text: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, text, type }]);

    // Auto-dismiss after strictly 3 seconds
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Floating Toast Notification Container */}
      <div
        aria-live="polite"
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none px-4 w-full max-w-md"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-2xl bg-zinc-900/95 backdrop-blur-xl border border-white/10 shadow-2xl text-xs sm:text-sm text-slate-100 animate-in slide-in-from-bottom duration-200 transform-gpu gpu-accelerated max-w-full font-sans"
          >
            <span className="p-1 rounded-lg shrink-0">
              {t.type === 'success' ? (
                <div className="p-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              ) : t.type === 'warning' ? (
                <div className="p-1 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30">
                  <AlertTriangle className="w-4 h-4" />
                </div>
              ) : (
                <div className="p-1 rounded-lg bg-cyan-500/15 text-cyan-400 border border-cyan-500/30">
                  <Info className="w-4 h-4" />
                </div>
              )}
            </span>

            <span className="leading-snug font-medium flex-1 text-slate-200">{t.text}</span>

            <button
              type="button"
              onClick={() => removeToast(t.id)}
              aria-label="Dismiss notification"
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer active:scale-95 shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};
