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
            className="pointer-events-auto flex items-center gap-3 px-5 py-3.5 rounded-2xl bg-slate-900 border-2 border-orange-500/80 shadow-2xl shadow-orange-950/40 text-xs sm:text-sm font-bold text-mech-orange backdrop-blur-md animate-in slide-in-from-bottom duration-200 transform-gpu gpu-accelerated max-w-full ring-1 ring-orange-500/30"
          >
            <span className="p-1 rounded-lg bg-orange-500/15 text-mech-orange shrink-0">
              {t.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : t.type === 'warning' ? (
                <AlertTriangle className="w-4 h-4 text-amber-400" />
              ) : (
                <Info className="w-4 h-4 text-mech-orange" />
              )}
            </span>

            <span className="leading-snug text-mech-orange font-bold flex-1">{t.text}</span>

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
