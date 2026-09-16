import React, { useEffect } from 'react';
import { X, Mail, MessageSquarePlus, ExternalLink, MessageCircle } from 'lucide-react';

export interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const whatsappMessage = encodeURIComponent(
    'Hi Rony, I have feedback / a resource request for MechKit: '
  );
  const whatsappUrl = `https://wa.me/?text=${whatsappMessage}`;

  const missingPyqUrl =
    'mailto:ronyb70747@gmail.com?subject=Missing%20PYQ%20Request%20-%20MechKit&body=Hi%20Rony%2C%0A%0APlease%20add%20the%20following%20PYQ%20or%20resource%3A%0A%0ASubject%3A%20%0AYear%2FSemester%3A%20%0ADetails%3A%20%0A';

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop */}
      <div
        id="feedback-modal-backdrop"
        onClick={onClose}
        className="bg-black/60 backdrop-blur-sm fixed inset-0 z-50 cursor-pointer animate-in fade-in duration-200"
        aria-hidden="true"
      />

      {/* Modal Container */}
      <div
        id="feedback-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-modal-title"
        className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-md bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-t-2xl md:rounded-2xl p-5 sm:p-6 z-50 shadow-2xl space-y-4 animate-in slide-in-from-bottom duration-200"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-800">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-xl bg-orange-500/10 text-orange-500 dark:text-orange-400 border border-orange-500/20">
                <MessageSquarePlus className="w-4 h-4" />
              </span>
              <h3 id="feedback-modal-title" className="font-extrabold text-base sm:text-lg text-slate-900 dark:text-white">
                Feedback &amp; Resource Requests
              </h3>
            </div>
            <p className="text-xs text-slate-500 dark:text-neutral-400 pl-8">
              Built by Rony Biswas — Help improve MechKit for Sem 3.
            </p>
          </div>

          <button
            id="btn-close-feedback-modal"
            type="button"
            onClick={onClose}
            aria-label="Close feedback modal"
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Direct Action Buttons */}
        <div className="space-y-2.5 pt-1">
          {/* WhatsApp Direct Action */}
          <a
            id="btn-feedback-whatsapp"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageCircle className="w-4 h-4 shrink-0" />
            <span>Chat on WhatsApp</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
          </a>

          {/* Email Feedback */}
          <a
            id="btn-feedback-email"
            href="mailto:ronyb70747@gmail.com?subject=MechKit%20Feedback"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-xs"
          >
            <Mail className="w-4 h-4 text-orange-400 shrink-0" />
            <span>Email Feedback</span>
          </a>

          {/* Request a Missing PYQ */}
          <a
            id="btn-request-missing-pyq"
            href={missingPyqUrl}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-orange-500 hover:bg-orange-600 text-white transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4 shrink-0" />
            <span>Request a Missing PYQ</span>
          </a>
        </div>
      </div>
    </div>
  );
};
