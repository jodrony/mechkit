import React from 'react';
import { Mail } from 'lucide-react';
import type { ActiveTab } from '../App';
import { InstagramIcon } from './CreatorModal';

interface FooterProps {
  onNavigate: (view: ActiveTab) => void;
  onOpenCreator?: () => void;
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenCreator, onOpenFeedback }) => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white dark:bg-[#0f172a] text-slate-500 dark:text-slate-400 text-xs py-4 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Brand & Creator Action */}
        <div className="flex items-center gap-2.5 flex-wrap justify-center sm:justify-start">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">MechKit [Sem 3]</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="font-mono text-[11px]">Diploma Utilities</span>
          </div>

          <button
            id="btn-footer-about-creator"
            type="button"
            onClick={onOpenCreator}
            className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:text-mech-orange dark:hover:text-mech-orange bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
          >
            <span className="w-2 h-2 rounded-full bg-mech-orange animate-pulse" />
            <span>About Creator</span>
          </button>

          {onOpenFeedback && (
            <button
              id="btn-footer-feedback"
              type="button"
              onClick={onOpenFeedback}
              className="min-h-[40px] px-3 py-1.5 rounded-xl text-xs font-semibold text-emerald-700 dark:text-emerald-400 hover:text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 transition-all cursor-pointer active:scale-95 flex items-center gap-1.5"
            >
              <span>Feedback / Request PYQ</span>
            </button>
          )}
        </div>

        {/* Quick Nav Links */}
        <div className="flex items-center gap-2.5 sm:gap-3 text-[11px] flex-wrap justify-center">
          <button
            type="button"
            onClick={() => onNavigate('dashboard')}
            className="min-h-[44px] px-2 py-1 flex items-center hover:text-mech-blue dark:hover:text-blue-400 cursor-pointer"
          >
            Dashboard
          </button>
          <button
            type="button"
            onClick={() => onNavigate('calculators')}
            className="min-h-[44px] px-2 py-1 flex items-center hover:text-mech-blue dark:hover:text-blue-400 cursor-pointer"
          >
            Calculators
          </button>
          <button
            type="button"
            onClick={() => onNavigate('utilities')}
            className="min-h-[44px] px-2 py-1 flex items-center hover:text-mech-blue dark:hover:text-blue-400 cursor-pointer"
          >
            Utilities
          </button>
          <button
            type="button"
            onClick={() => onNavigate('labs')}
            className="min-h-[44px] px-2 py-1 flex items-center hover:text-mech-blue dark:hover:text-blue-400 cursor-pointer"
          >
            Labs
          </button>
          <button
            type="button"
            onClick={() => onNavigate('resources')}
            className="min-h-[44px] px-2 py-1 flex items-center hover:text-mech-blue dark:hover:text-blue-400 cursor-pointer"
          >
            Resources Hub
          </button>
        </div>

        {/* Direct Social / Contact Links */}
        <div className="flex items-center gap-2 text-[11px]">
          <a
            id="link-footer-instagram"
            href="https://instagram.com/theonly_rony"
            target="_blank"
            rel="noopener noreferrer"
            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:text-pink-500 dark:hover:text-pink-400 hover:border-pink-500/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <InstagramIcon className="w-3.5 h-3.5" />
            <span>Instagram</span>
          </a>
          <a
            id="link-footer-email"
            href="mailto:daya.darwaja.toro@gmail.com"
            className="min-h-[44px] px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60 hover:text-mech-orange dark:hover:text-mech-orange hover:border-orange-500/40 transition-colors flex items-center gap-1.5 cursor-pointer active:scale-95"
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Email</span>
          </a>
        </div>
      </div>
    </footer>
  );
};
