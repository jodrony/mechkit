import React, { useEffect } from 'react';
import { X, Mail, ExternalLink, Sparkles, Share2 } from 'lucide-react';
import { useToast } from './Toast';

export const InstagramIcon: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

interface CreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShare?: () => void;
}

export const CreatorModal: React.FC<CreatorModalProps> = ({ isOpen, onClose, onShare }) => {
  const { showToast } = useToast();

  const handleShare = async () => {
    if (onShare) {
      onShare();
      return;
    }
    const shareUrl = window.location.href;
    const shareData = {
      title: 'MechKit v0.3 — Diploma ME Sem 3 Portal',
      text: 'Access WBSCTE Sem 3 Lab Reports, Viva Prep, and 2018-2026 PYQs:',
      url: shareUrl
    };

    // Attempt native share if supported and in secure context (works automatically on production HTTPS)
    if (navigator.share && window.isSecureContext) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        if ((err as Error).name === 'AbortError') return;
      }
    }

    // Robust fallback for HTTP / Localhost preview:
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(shareUrl);
      } else {
        // Older mobile fallback using textarea
        const textArea = document.createElement('textarea');
        textArea.value = shareUrl;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
      }
      // Trigger a visible toast banner at the top or bottom of the screen
      showToast('Link copied to clipboard! Share it in your WhatsApp group.');
    } catch (err) {
      showToast('Unable to auto-copy. App URL: ' + window.location.origin);
    }
  };

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

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      {/* Backdrop: High-contrast semi-transparent overlay */}
      <div
        id="creator-modal-backdrop"
        onClick={onClose}
        className="bg-black/60 backdrop-blur-sm fixed inset-0 z-50 cursor-pointer animate-in fade-in duration-200 gpu-accelerated"
        aria-hidden="true"
      />

      {/* Container: Slide-up modal on mobile / centered dialog on desktop */}
      <div
        id="creator-modal-container"
        role="dialog"
        aria-modal="true"
        aria-labelledby="creator-modal-title"
        className="fixed bottom-0 md:bottom-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 w-full max-w-md bg-white/95 dark:bg-zinc-900/95 border border-slate-200 dark:border-white/10 rounded-t-2xl md:rounded-2xl p-6 z-50 shadow-2xl space-y-5 animate-in slide-in-from-bottom duration-200 backdrop-blur-xl transform-gpu gpu-accelerated font-sans"
      >
        {/* Top Action Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
              <Sparkles className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400">
              Developer &amp; Maintainer
            </span>
          </div>

          {/* Close Action: Prominent ✕ button with min 44x44px target */}
          <button
            id="btn-close-creator-modal"
            type="button"
            onClick={onClose}
            aria-label="Close creator modal"
            className="min-h-[40px] min-w-[40px] p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors flex items-center justify-center cursor-pointer active:scale-95"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Creator Identity & Bio */}
        <div className="space-y-2">
          <h3 id="creator-modal-title" className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
            Rony Biswas
          </h3>
          <p className="text-xs font-mono font-semibold text-slate-500 dark:text-slate-400">
            Dept. of Mechanical Engineering • Batch of &apos;25
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 font-sans">
            Crafted this kit to centralize lab reports, official WBSCTE syllabus, Viva prep, and complete 2018–2026 PYQ archives in one high-speed workspace.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          {/* Share MechKit Button */}
          <button
            id="btn-creator-share"
            type="button"
            onClick={handleShare}
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-emerald-600 hover:bg-emerald-500 text-white transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            <span>Share MechKit v0.3</span>
          </button>

          {/* Instagram Button */}
          <a
            id="btn-creator-instagram"
            href="https://instagram.com/theonly_rony"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-gradient-to-r from-pink-600 via-rose-600 to-amber-600 hover:opacity-95 text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <InstagramIcon className="w-4 h-4 shrink-0" />
            <span>Open Instagram (@theonly_rony)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80 shrink-0" />
          </a>

          {/* Email Button */}
          <a
            id="btn-creator-email"
            href="mailto:daya.darwaja.toro@gmail.com"
            className="w-full min-h-[44px] px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-100 dark:bg-white/[0.06] hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
          >
            <Mail className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Send Email (daya.darwaja.toro@gmail.com)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
